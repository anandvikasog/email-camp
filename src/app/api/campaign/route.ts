import { NextRequest, NextResponse } from 'next/server';
import { Types } from 'mongoose';
import dbConnect from '~/db/db';
import Campaign from '~/models/campaign';
import { validateUser } from '~/utils/helper';
import CampaignMail from '~/models/campaignMail';
import { scheduleFollowUps } from '~/utils/campaign';

export async function POST(req: NextRequest, res: NextResponse) {
  try {
    const body = await req.json();
    const { name, fromEmail, mails, savedAsDraft } = body;

    await dbConnect();

    let user = await validateUser();

    if (!user) {
      return NextResponse.json(
        { status: false, message: 'User not authenticated.' },
        { status: 401 }
      );
    }

    const userId = user._id;

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
      {
        $lookup: {
          from: 'campaignmails',
          localField: 'mails',
          foreignField: '_id',
          as: 'mails',
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
