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

// POST API to create a campaign and schedule follow-up emails
export async function POST(req: NextRequest, res: NextResponse) {
  try {
    const body = await req.json(); // Parse the request body
    const {
      name,
      fromEmail,
      mails, // Array of follow-up mails
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

    // Validate that each sendAt time is in the future
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

    // creating campaign
    const newCampaign = new Campaign({
      name,
      userId,
      fromEmail,
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

    // Schedule each follow-up mail based on its sendAt date
    scheduleFollowUps({ ...newCampaign.toObject(), mails: campaignMailsArray });

    return NextResponse.json(
      {
        status: true,
        message: 'Campaign created successfully',
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

// Define the GET API to fetch campaign lists based on userId
export async function GET(req: NextRequest) {
  try {
    let user = await validateUser();

    if (!user) {
      return NextResponse.json(
        { status: false, message: 'User not authenticated.' },
        { status: 401 }
      );
    }

    const userId = user._id;
    // Connect to the database
    await dbConnect();

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
