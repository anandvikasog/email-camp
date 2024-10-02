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

interface Params {
  id: string; // Define the type for params
}

// Define the Prospect interface
export interface Prospect {
  prospectData: any;
  isDelivered?: boolean;
  isBounced?: boolean;
  isRejected?: boolean;
}

// Define the CampaignMail interface
interface CampaignMail {
  campaignId?: Types.ObjectId;
  sendAt: Date;
  timezone?: string;
  subject: string;
  body: string;
  prospects: Prospect[];
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

export async function GET(req: NextRequest, { params }: { params: Params }) {
  try {
    // Validate the user authentication
    const user = await validateUser();
    if (!user) {
      return NextResponse.json(
        { status: false, message: 'User not authenticated.' },
        { status: 401 }
      );
    }

    const campaignId = params.id; // Get campaignId from the route params

    // Validate the presence of campaignId
    if (!campaignId) {
      return NextResponse.json(
        { status: false, message: 'Campaign ID is required.' },
        { status: 400 }
      );
    }

    // Connect to the database
    await dbConnect();

    // Common aggregation pipeline
    const campaignAggregation = (matchCondition: object) => [
      { $match: matchCondition },
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
      {
        $lookup: {
          from: 'campaignmails',
          localField: 'mails',
          foreignField: '_id',
          as: 'mails',
        },
      },
      {
        $addFields: {
          mails: {
            $map: {
              input: '$mails',
              as: 'mail',
              in: {
                sendAt: '$$mail.sendAt',
                subject: '$$mail.subject',
                body: '$$mail.body',
                prospects: '$$mail.prospects',
                timezone: '$$mail.timezone',
              },
            },
          },
        },
      },
    ];

    // Fetch the specific campaign
    const campaign = await Campaign.aggregate(
      campaignAggregation({
        _id: new Types.ObjectId(campaignId),
        userId: new Types.ObjectId(user._id),
      })
    );

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
  } catch (error: any) {
    console.error('Error fetching campaign:', error);
    return NextResponse.json(
      {
        status: false,
        message: 'Error fetching campaign',
        error: error.message,
      },
      { status: 500 }
    );
  }
}

// Function to update a campaign
export async function PUT(req: NextRequest, { params }: { params: Params }) {
  console.log('hii');
  try {
    const body = await req.json();
    const { name, fromEmail, mails, savedAsDraft } = body;

    // Connect to the database
    await dbConnect();

    console.log(JSON.stringify(body));

    // Validate user authentication
    const user = await validateUser();
    if (!user) {
      return NextResponse.json(
        { status: false, message: 'User not authenticated.' },
        { status: 401 }
      );
    }

    const userId = user._id;
    const campaignId = params.id; // Get campaignId from the route params

    // Validate that each sendAt time is in the future if not a draft
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

    // Find the existing campaign
    const existingCampaign = await Campaign.findOne({
      _id: campaignId,
      userId: userId,
    });

    if (!existingCampaign) {
      return NextResponse.json(
        { status: false, message: 'Campaign not found.' },
        { status: 404 }
      );
    }

    // Update campaign fields
    existingCampaign.name = name;
    existingCampaign.fromEmail = fromEmail;
    existingCampaign.savedAsDraft = savedAsDraft;

    // Remove existing campaign mails
    await CampaignMail.deleteMany({ campaignId: existingCampaign._id });

    // Create and save new campaign mails
    const campaignMailsArray = [];
    for (let i = 0; i < mails.length; i++) {
      const newCampaignMail = new CampaignMail({
        ...mails[i],
        campaignId: existingCampaign._id,
      });
      campaignMailsArray.push(newCampaignMail.toObject());
      try {
        await newCampaignMail.save();
      } catch (e) {
        campaignMailsArray.pop();
      }
    }

    existingCampaign.mails = campaignMailsArray.map((c) => c._id);

    // Save the updated campaign
    await existingCampaign.save();

    // If the campaign is not a draft, schedule follow-ups
    if (!savedAsDraft) {
      // Schedule each follow-up mail based on its sendAt date
      scheduleFollowUps({
        ...existingCampaign.toObject(),
        mails: campaignMailsArray,
      });
    }

    return NextResponse.json(
      {
        status: true,
        message: savedAsDraft
          ? 'Campaign updated and saved as draft successfully'
          : 'Campaign updated and scheduled successfully',
        campaign: existingCampaign,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Error updating campaign:', error);
    return NextResponse.json(
      {
        status: false,
        message: 'Error updating campaign',
        error: error.message,
      },
      { status: 500 }
    );
  }
}

// Function to schedule follow-up emails
const scheduleFollowUps = async (campaign: CampaignDocument): Promise<void> => {
  let sentCount = 0; // Counter for sent emails

  // Extract the email address from connecteamails db
  const emailDoc = await ConnectedEmail.findById(campaign.fromEmail);

  // Check if the email was found
  if (!emailDoc || !emailDoc?.emailId) {
    console.error(`Email not found for user ID: ${campaign.fromEmail}`);
    return; // Exit the function or handle as needed
  }

  for (const mail of campaign.mails) {
    // If a timezone is provided, convert the sendAt time to the specified timezone
    const sendTime = mail.timezone
      ? moment.tz(mail.sendAt, mail.timezone).toDate() // Convert to Date object using moment-timezone
      : new Date(mail.sendAt); // Default to the sendAt time as is if no timezone is specified

    // Schedule job for each follow-up email
    scheduleJob(sendTime, async function () {
      try {
        await sendCampaignEmails(
          emailDoc.emailId,
          mail.prospects,
          mail.subject,
          mail.body,
          campaign._id as Types.ObjectId, // Pass campaignId
          mail._id as Types.ObjectId
        );

        sentCount++; // Increment sent email count

        // If this is the last email sent, update status to 'Completed'
        if (sentCount === campaign.mails.length) {
          await Campaign.findByIdAndUpdate(campaign._id, {
            status: 'Completed',
          });
        }
      } catch (error) {
        console.error(`Error sending follow-up ${campaign.name}:`, error);
      }
    });
  }
};
