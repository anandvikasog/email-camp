import { NextRequest, NextResponse } from 'next/server';
import mongoose, { Types } from 'mongoose'; // Import ObjectId type and Mongoose
import dbConnect from '~/db/db'; // MongoDB connection file
import Campaign from '~/models/campaign';
import ConnectedEmail from '~/models/connectedEmail';
import { sendBulkEmails, sendCampaignEmails } from '~/utils/aws';
import { scheduleJob } from 'node-schedule'; // Node-schedule for scheduling follow-ups
import moment from 'moment-timezone';
import { validateUser } from '~/utils/helper';
import CampaignMail from '~/models/campaignMail';
import User from '~/models/user';

// Define the Prospect interface
export interface Prospect {
  prospectData: any;
  isDelivered?: boolean;
  isBounced?: boolean;
  isRejected?: boolean;
}

interface TimeInterval {
  start: string; // Start time in "HH:mm" format
  end: string; // End time in "HH:mm" format
}

// Define a type for the days of the week
type WeekDays = 'sun' | 'mon' | 'tue' | 'wed' | 'thu' | 'fri' | 'sat';

interface DaySchedule {
  checked: boolean; // Whether this day is enabled
  intervals: TimeInterval[]; // Array of start and end times
}
// Define the CampaignMail interface
interface CampaignMail {
  campaignId?: Types.ObjectId;
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

// Define the CampaignDocument interface for Mongoose
interface CampaignDocument extends mongoose.Document {
  name: string;
  userId: Types.ObjectId;
  fromEmail: Types.ObjectId;
  status: 'Pending' | 'Running' | 'Completed';
  mails: Types.DocumentArray<CampaignMail>; // Use DocumentArray for subdocuments
  createdAt?: Date;
  updatedAt?: Date;
  emailId?: string;
}

// POST API to create a campaign and schedule follow-up emails
export async function POST(req: NextRequest, res: NextResponse) {
  try {
    const body = await req.json(); // Parse the request body
    const {
      name,
      fromEmail,
      mails, // Array of follow-up mails
      savedAsDraft,
    } = body;

    // Connect to the database
    await dbConnect();

    let user = await validateUser();

    if (!user) {
      return NextResponse.json(
        { status: false, message: 'User not authenticated.' },
        { status: 401 }
      );
    }

    const userId = user._id;

    // Validate that each sendAt time is in the future only if not a draft
    if (!savedAsDraft) {
      const currentUTCDate = new Date();
      for (const mail of mails) {
        const sendAt = new Date(mail.sendAt);
        if (sendAt <= currentUTCDate) {
          return NextResponse.json(
            {
              status: false,
              message: 'The sendAt date must be in the future for each mail.',
            },
            { status: 400 }
          );
        }
      }
    }

    // creating campaign
    const newCampaign = new Campaign({
      name,
      userId,
      fromEmail,
      savedAsDraft,
    });

    // creating and saving campaign mail
    const campaignMailsArray = [];
    for (let i = 0; i < mails.length; i++) {
      const newCampaignMail = new CampaignMail({
        ...mails[i],
        campaignId: newCampaign._id,
      });
      campaignMailsArray.push(newCampaignMail.toObject());
      try {
        await newCampaignMail.save();
      } catch (e) {
        campaignMailsArray.pop();
      }
    }

    // updating and saving campaign
    newCampaign.mails = campaignMailsArray.map((c) => c._id);
    await newCampaign.save();

    // If the campaign is not a draft, schedule follow-ups
    if (!savedAsDraft) {
      // Schedule each follow-up mail based on its sendAt date
      scheduleFollowUps({
        ...newCampaign.toObject(),
        mails: campaignMailsArray,
      });
    }

    return NextResponse.json(
      {
        status: true,
        message: savedAsDraft
          ? 'Campaign saved as draft successfully'
          : 'Campaign created successfully',
        campaign: newCampaign,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Error creating campaign:', error);

    return NextResponse.json(
      {
        status: false,
        message: 'Error creating campaign',
        error: error.message,
      },
      { status: 500 }
    );
  }
}

// Function to map weekday index to WeekDays type
const getWeekDayFromIndex = (index: number): WeekDays => {
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

// Define the GET API to fetch campaign lists based on userId

const scheduleFollowUps = async (campaign: CampaignDocument): Promise<void> => {
  let sentCount = 0;

  // Fetch the connected email from the database
  const emailDoc = await ConnectedEmail.findById(campaign.fromEmail);
  if (!emailDoc || !emailDoc.emailId) {
    console.error(`Email not found for user ID: ${campaign.fromEmail}`);
    return;
  }

  // Loop through the mails in the campaign
  for (const mail of campaign.mails) {
    const { sendAt, timezone, timing } = mail;

    // Convert sendAt to the user's timezone
    const userSendTime = moment.tz(sendAt, timezone);
    const weekday = userSendTime.day(); // Get weekday from sendAt time
    const currentDay: WeekDays = getWeekDayFromIndex(weekday);
    const daySchedule = timing[currentDay];

    let scheduledTime: moment.Moment | null = null;

    // Function to check the schedule and find the next available time
    const findNextAvailableTime = (startDay: number): moment.Moment | null => {
      for (let i = 0; i < 7; i++) {
        // console.log('i1 ' + i);
        const nextDayIndex = (startDay + i) % 7; // Calculate the index for the next day
        const nextDay = getWeekDayFromIndex(nextDayIndex); // Map index to day
        const nextDaySchedule = timing[nextDay];
        // console.log('nch');
        // console.log(nextDaySchedule);

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

          const startInterval = moment.tz(
            `${intervalDate.format('YYYY-MM-DD')} ${interval.start}`,
            timezone
          );

          const endInterval = moment.tz(
            `${intervalDate.format('YYYY-MM-DD')} ${interval.end}`,
            timezone
          );

          // Check if the send time is outside today's interval or looking for a future day
          if (
            (i === 0 && userSendTime.isBefore(startInterval)) || // Case 1: SendAt is before the interval on the same day
            i > 0 // Case 2: Looking for the next available day
          ) {
            // console.log('i ' + i);
            // console.log('sstartINt');
            // console.log(startInterval.format()); // Ensure you're printing the correct time
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
      const firstIntervalStart = moment.tz(
        `${userSendTime.format('YYYY-MM-DD')} ${daySchedule.intervals[0].start}`,
        timezone
      );
      const lastIntervalEnd = moment.tz(
        `${userSendTime.format('YYYY-MM-DD')} ${daySchedule.intervals[daySchedule.intervals.length - 1].end}`,
        timezone
      );

      // If sendAt is before today's first interval, shift it to the start of today's interval
      if (userSendTime.isBefore(firstIntervalStart)) {
        scheduledTime = firstIntervalStart;
        // console.log('st');
        // console.log(scheduledTime);
      }
      // If sendAt is within any of today's intervals, keep the current time
      else if (userSendTime.isBetween(firstIntervalStart, lastIntervalEnd)) {
        scheduledTime = userSendTime;
      }
      // If sendAt is after today's last interval, find the next available time
      else {
        scheduledTime = findNextAvailableTime(weekday);
        // console.log('usersendtime');
        // console.log(userSendTime);
        // console.log('sch');
        // console.log(scheduledTime);
      }
    } else {
      // If today's schedule is not checked, find the next available day
      scheduledTime = findNextAvailableTime(weekday);
      // console.log('sch1');
      // console.log(scheduledTime);
    }

    // If a scheduled time was found, proceed with scheduling
    if (scheduledTime) {
      let delay = 0; // Start with no delay

      for (const prospect of mail.prospects) {
        delay += 60000; // 60 seconds interval

        // Schedule email sending for each prospect
        scheduleJob(
          scheduledTime.clone().add(delay, 'ms').toDate(),
          async () => {
            try {
              await sendCampaignEmails(
                emailDoc.emailId,
                [prospect], // Only send to one prospect at a time
                mail.subject,
                mail.body,
                campaign._id as Types.ObjectId, // Pass campaignId
                mail._id as Types.ObjectId
              );

              sentCount++;

              // Mark the campaign as completed when all emails are sent
              if (sentCount === campaign.mails.length) {
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
      }
    }
  }
};

export async function GET(req: NextRequest) {
  try {
    let user = await validateUser();

    if (!user) {
      return NextResponse.json(
        { status: false, message: 'User not authenticated.' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(req.url);
    const campaignId = searchParams.get('id'); // Check if there's an `id` query parameter

    const userId = user._id;
    // Connect to the database
    await dbConnect();

    // If campaignId exists, fetch a specific campaign by ID
    if (campaignId) {
      const campaign = await Campaign.aggregate([
        {
          $match: {
            _id: new Types.ObjectId(campaignId),
            userId: new Types.ObjectId(user._id),
          },
        },
        {
          $lookup: {
            from: 'connectedemails',
            localField: 'fromEmail',
            foreignField: '_id',
            as: 'fromEmail',
          },
        },
        {
          $unwind: {
            path: '$fromEmail',
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $addFields: {
            fromEmail: '$fromEmail.emailId',
          },
        },
      ]);

      if (!campaign || campaign.length === 0) {
        return NextResponse.json(
          { status: false, message: 'Campaign not found.' },
          { status: 404 }
        );
      }

      // Return the specific campaign data
      return NextResponse.json(
        {
          status: true,
          message: 'Campaign retrieved successfully',
          data: campaign[0], // Return the first item from the aggregation result
        },
        { status: 200 }
      );
    }

    const campaigns = await Campaign.aggregate([
      {
        $match: {
          userId: new Types.ObjectId(userId),
        },
      },
      {
        $lookup: {
          from: 'connectedemails',
          localField: 'fromEmail',
          foreignField: '_id',
          as: 'fromEmail',
        },
      },
      {
        $unwind: {
          path: '$fromEmail',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $addFields: {
          fromEmail: '$fromEmail.emailId',
        },
      },
    ]);

    // Return the response with the campaigns list
    return NextResponse.json(
      {
        status: true,
        message: 'Campaigns retrieved successfully',
        data: campaigns,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Error fetching campaigns:', error);

    return NextResponse.json(
      {
        status: false,
        message: 'Error fetching campaigns',
        error: error.message,
      },
      { status: 500 }
    );
  }
}
