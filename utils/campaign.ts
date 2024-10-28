import mongoose, { Types } from 'mongoose';
import { scheduleJob } from 'node-schedule';
import Campaign from '~/models/campaign';
import CampaignMail from '~/models/campaignMail';
import ConnectedEmail, { ConnectedEmailType } from '~/models/connectedEmail';
import {
  sendEmailUsingCustomSmtp,
  sendEmailUsingGmail,
  sendEmailUsingOutlook,
} from './helper';
const moment = require('moment-timezone');
import schedule from 'node-schedule';

export type WeekDays = 'sun' | 'mon' | 'tue' | 'wed' | 'thu' | 'fri' | 'sat';

export interface Prospect {
  prospectData: any;
  isDelivered?: boolean;
  isBounced?: boolean;
  isRejected?: boolean;
  _id: string;
}

export interface TimeInterval {
  start: string;
  end: string;
}

export interface DaySchedule {
  checked: boolean;
  intervals: TimeInterval[];
}

export interface CampaignMail {
  campaignId: Types.ObjectId;
  sendAt: Date;
  timezone: string;
  subject: string;
  body: string;
  prospects: Prospect[];
  timing: {
    mon: DaySchedule;
    tue: DaySchedule;
    wed: DaySchedule;
    thu: DaySchedule;
    fri: DaySchedule;
    sat: DaySchedule;
    sun: DaySchedule;
  };
}

export interface CampaignDocument extends mongoose.Document {
  name: string;
  userId: Types.ObjectId;
  fromEmail: Types.ObjectId;
  status: 'Pending' | 'Running' | 'Completed';
  mails: Types.DocumentArray<CampaignMail>; // Use DocumentArray for subdocuments
  createdAt?: Date;
  updatedAt?: Date;
  emailId?: string;
}

export const getWeekDayFromIndex = (index: number): WeekDays => {
  const weekdayMapping: WeekDays[] = [
    'sun',
    'mon',
    'tue',
    'wed',
    'thu',
    'fri',
    'sat',
  ];
  return weekdayMapping[index];
};

const gapInSecond = 60;

interface TimezoneOffset {
  offset: number;
  polarity: string;
}

export const getTimezoneOffset = (tz: string): TimezoneOffset => {
  const currentTimeInTimezone = moment.tz(tz);

  const offsetInMinutes = currentTimeInTimezone.utcOffset();
  const offsetInSeconds = offsetInMinutes * 60;
  const polarity = offsetInSeconds >= 0 ? 'positive' : 'negative';
  return {
    offset: Math.abs(offsetInSeconds),
    polarity: polarity,
  };
};

export const getStartTimeAsPerTimezone = (time: string | Date, tz: string) => {
  // return time;

  // // FOR PRODUCTION ---
  // const off = getTimezoneOffset(tz);
  // if (off.polarity === 'positive') {
  //   return moment(time).add(off.offset, 'seconds');
  // } else {
  //   return moment(time).subtract(off.offset, 'seconds');
  // }
  // Directly convert time to the specified timezone using moment.tz
  return moment.tz(time, tz);
};

// export const scheduleFollowUps = async (campaign: CampaignDocument) => {
//   console.log('campaign', JSON.stringify(campaign));
//   // Fetch the connected email from the database
//   const emailDoc = await ConnectedEmail.findById(campaign.fromEmail);
//   if (!emailDoc || !emailDoc.emailId) {
//     console.error(`Email not found for user ID: ${campaign.fromEmail}`);
//     return;
//   }

//   for (let i = 0; i < campaign.mails.length; i++) {
//     const mail = campaign.mails[i];
//     const prospectCount = mail.prospects.length;
//     const startTime = getStartTimeAsPerTimezone(mail.sendAt, mail.timezone);

//     const timeSlots = [];

//     await sendCampaignEmails(
//       emailDoc,
//       mail.prospects,
//       mail.subject,
//       mail.body,
//       mail.campaignId,
//       mail._id
//     );
//   }
// };

export const scheduleFollowUps = async (
  campaign: CampaignDocument
): Promise<void> => {
  let sentCount = 0;
  let totalProspects = 0;

  // Fetch the connected email from the database
  const emailDoc = await ConnectedEmail.findById(campaign.fromEmail);
  if (!emailDoc || !emailDoc.emailId) {
    return;
  }

  // Calculate total number of prospects across all mails
  for (const mail of campaign.mails) {
    totalProspects += mail.prospects.length;
  }

  // Loop through the mails in the campaign
  for (const mail of campaign.mails) {
    const { sendAt, timezone, timing } = mail;

    // Convert sendAt to the user's timezone
    const userSendTime = getStartTimeAsPerTimezone(sendAt, timezone);
    const weekday = userSendTime.day(); // Get weekday from sendAt time
    const currentDay: WeekDays = getWeekDayFromIndex(weekday);
    const daySchedule = timing[currentDay];

    let scheduledTime: moment.Moment | null = null;

    // Function to check the schedule and find the next available time
    const findNextAvailableTime = (startDay: number): moment.Moment | null => {
      for (let i = 0; i < 7; i++) {
        const nextDayIndex = (startDay + i) % 7; // Calculate the index for the next day
        const nextDay = getWeekDayFromIndex(nextDayIndex); // Map index to day
        const nextDaySchedule = timing[nextDay];

        // Skip if the next day is not checked
        if (!nextDaySchedule || !nextDaySchedule.checked) {
          continue;
        }

        // Loop through the intervals for the next day
        for (const interval of nextDaySchedule.intervals) {
          // Create a date object for the current interval using the correct date
          const intervalDate = moment
            .tz(userSendTime, timezone)
            .startOf('day')
            .add(i, 'days');

          const startInterval = getStartTimeAsPerTimezone(
            `${intervalDate.format('YYYY-MM-DD')} ${interval.start}`,
            timezone
          );

          const endInterval = getStartTimeAsPerTimezone(
            `${intervalDate.format('YYYY-MM-DD')} ${interval.end}`,
            timezone
          );

          // Check if the send time is outside today's interval or looking for a future day
          if (
            (i === 0 && userSendTime.isBefore(startInterval)) || // Case 1: SendAt is before the interval on the same day
            i > 0 // Case 2: Looking for the next available day
          ) {
            return startInterval; // Return the start time for the next available slot
          }

          // Check if userSendTime falls within the current interval
          if (i === 0 && userSendTime.isBetween(startInterval, endInterval)) {
            console.log(
              'SendAt is within the interval, returning the same time:',
              userSendTime.format()
            );
            return userSendTime; // Return the user's send time if it's within the interval
          }
        }
      }
      return null; // No valid time found
    };

    // Check the current day's schedule
    if (daySchedule && daySchedule.checked) {
      const firstIntervalStart = getStartTimeAsPerTimezone(
        `${userSendTime.format('YYYY-MM-DD')} ${daySchedule.intervals[0].start}`,
        timezone
      );
      const lastIntervalEnd = getStartTimeAsPerTimezone(
        `${userSendTime.format('YYYY-MM-DD')} ${daySchedule.intervals[daySchedule.intervals.length - 1].end}`,
        timezone
      );

      // If sendAt is before today's first interval, shift it to the start of today's interval
      if (userSendTime.isBefore(firstIntervalStart)) {
        scheduledTime = firstIntervalStart;
      }
      // If sendAt is within any of today's intervals, keep the current time
      else if (userSendTime.isBetween(firstIntervalStart, lastIntervalEnd)) {
        scheduledTime = userSendTime;
      }
      // If sendAt is after today's last interval, find the next available time
      else {
        scheduledTime = findNextAvailableTime(weekday);
      }
    } else {
      // If today's schedule is not checked, find the next available day
      scheduledTime = findNextAvailableTime(weekday);
    }

    // If a scheduled time was found, proceed with scheduling
    if (scheduledTime) {
      let delay = 0; // Start with no delay

      // Update status to 'In Progress' when scheduling follow-ups
      await Campaign.findByIdAndUpdate(campaign._id, {
        status: 'Pending',
      });

      for (const prospect of mail.prospects) {
        delay += 60000; // 60 seconds interval

        // console.log('Current time', moment().format('DD/MM/YYYY hh:mm:ss a z'));
        // console.log(
        //   'Scheduled time',
        //   moment(scheduledTime.clone().add(delay, 'ms').toDate()).format(
        //     'DD/MM/YYYY hh:mm:ss a z'
        //   )
        // );
        // const jobName = `${campaign._id}`; // Simplified to just the campaign ID
        const jobName = `${campaign._id}-${mail._id}-${prospect._id}`;

        // Check if the job already exists
        const existingJob = schedule.scheduledJobs[jobName];
        if (existingJob) {
          existingJob.cancel(); // Cancel the existing job before scheduling a new one
        }
        // Schedule email sending for each prospect

        scheduleJob(
          jobName,
          scheduledTime.clone().add(delay, 'ms').toDate(),
          async () => {
            try {
              await sendCampaignEmails(
                emailDoc,
                [prospect], // Only send to one prospect at a time
                mail.subject,
                mail.body,
                campaign._id as Types.ObjectId, // Pass campaignId
                mail._id as Types.ObjectId
              );

              sentCount++;

              // Mark the campaign as completed when all emails are sent
              if (sentCount === totalProspects) {
                await Campaign.findByIdAndUpdate(campaign._id, {
                  status: 'Completed',
                });
              }
            } catch (error) {
              console.error(
                `Error sending follow-up for ${campaign.name}:`,
                error
              );
            }
          }
        );
        console.log('Scheduling job:', jobName, 'at', scheduledTime.format());
      }
    }
  }
};

export const sendCampaignEmails = async (
  emailDoc: ConnectedEmailType,
  prospects: Prospect[],
  subject: string,
  bodyTemplate: string,
  campaignId: Types.ObjectId,
  mailId: Types.ObjectId
) => {
  try {
    const mailDeliveryStatus = [];
    const updatedProspects: Prospect[] = [];
    for (let i = 0; i < prospects.length; i++) {
      const prospect = prospects[i];
      const recipantData = prospect.prospectData;

      let personalizedBody = bodyTemplate;
      Object.keys(recipantData).forEach((key) => {
        personalizedBody = personalizedBody.replace(
          new RegExp(`{{${key}}}`, 'g'),
          recipantData[key]
        );
      });
      let status = false;
      let resData = null;
      try {
        if (emailDoc.type === 'gmail') {
          const res = await sendEmailUsingGmail(
            emailDoc.gmailToken,
            recipantData.EMAIL,
            subject,
            personalizedBody
          );
          status = res.status;
          resData = res.data;
        } else if (emailDoc.type === 'outlook') {
          const res = await sendEmailUsingOutlook(
            emailDoc.outlookToken,
            recipantData.EMAIL,
            subject,
            personalizedBody
          );
          status = res.status;
          resData = res.data;
        } else {
          const res = await sendEmailUsingCustomSmtp(
            emailDoc,
            recipantData.EMAIL,
            subject,
            personalizedBody
          );
          status = res.status;
          resData = res.data;
        }

        if (status) {
          console.log(`Mail sent at: ${recipantData.EMAIL} ---`);
          console.log('mail response', resData);
          mailDeliveryStatus.push({ EMAIL: recipantData.EMAIL, status: true });
          updatedProspects.push({
            ...prospect,
            isBounced: false,
            isDelivered: true,
            isRejected: false,
          });
        }
      } catch (error) {
        console.log(`Error in sending mail at: ${recipantData.EMAIL} ---`);

        mailDeliveryStatus.push({ EMAIL: recipantData.EMAIL, status: false });
        updatedProspects.push({
          ...prospect,
          isBounced: false,
          isDelivered: false,
          isRejected: true,
        });
      }
    }

    // Update campaign status after sending emails
    await Campaign.findByIdAndUpdate(campaignId, { status: 'Running' });

    // Update campaignMail status after sending emails
    await CampaignMail.findByIdAndUpdate(mailId, {
      prospects: updatedProspects,
    });
  } catch (error) {
    console.error('Error sending emails', error);
    throw error;
  }
};

export async function cancelExistingSchedules(
  campaignId: string
): Promise<void> {
  const job = schedule.scheduledJobs[campaignId];

  if (job) {
    job.cancel();
    console.log(`Canceled job: ${campaignId}`);
  } else {
    console.log(`No job found for campaign ${campaignId}`);
  }
}
