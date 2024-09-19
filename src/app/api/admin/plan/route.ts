import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '~/db/db';
import Plan from '~/models/plan';
import stripe from '~/utils/stripe';

export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    const data = await req.json();
    const {
      title,
      description,
      amount,
      stripePriceId,
      interval,
      pros,
      cons,
      adminAccessKey,
    } = data;

    // validating ADMIN access key
    if (adminAccessKey !== process.env.ADMIN_ACCESS_KEY) {
      return NextResponse.json(
        { status: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }

    // validating data
    if (
      !title ||
      !description ||
      isNaN(amount) ||
      !interval ||
      !pros ||
      !cons ||
      !stripePriceId
    ) {
      return NextResponse.json(
        {
          status: false,
          message:
            'Please provide title, description, amount, interval, pros, cons, stripePriceId',
        },
        { status: 400 }
      );
    }

    // checking stripePriceId valid or not
    try {
      const priceData = await stripe.prices.retrieve(stripePriceId);
      if (!priceData) {
        throw new Error('Invalid price ID.');
      }
    } catch (error) {
      return NextResponse.json(
        { status: false, message: 'Invalid price ID.' },
        { status: 400 }
      );
    }

    // checking plan already exixts or not
    const alreadyExists = await Plan.findOne({ stripePriceId });
    if (alreadyExists) {
      return NextResponse.json(
        { status: false, message: 'Plan already exists with same price ID.' },
        { status: 409 }
      );
    }

    const newPlan = new Plan({
      title,
      description,
      amount,
      interval,
      pros,
      cons,
      stripePriceId,
    });

    await newPlan.save();

    //  Success
    return NextResponse.json(
      {
        status: true,
        message: 'Plan created successfully.',
        data: newPlan,
      },
      { status: 200 }
    );
  } catch (e) {
    console.log('error', e);
    return NextResponse.json(
      { status: false, message: 'Something went wrong.' },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    await dbConnect();
    const data = await req.json();
    const {
      title,
      description,
      amount,
      stripePriceId,
      interval,
      pros,
      cons,
      adminAccessKey,
    } = data;

    // validating ADMIN access key
    if (adminAccessKey !== process.env.ADMIN_ACCESS_KEY) {
      return NextResponse.json(
        { status: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }

    // validating data
    if (
      !title ||
      !description ||
      isNaN(amount) ||
      !interval ||
      !pros ||
      !cons ||
      !stripePriceId
    ) {
      return NextResponse.json(
        {
          status: false,
          message:
            'Please provide title, description, amount, interval, pros, cons, stripePriceId',
        },
        { status: 400 }
      );
    }

    const updatedPlan = await Plan.findOneAndUpdate(
      { stripePriceId },
      {
        title,
        description,
        amount,
        interval,
        pros,
        cons,
      },
      {
        new: true,
      }
    );

    //  Success
    return NextResponse.json(
      {
        status: true,
        message: 'Plan updated successfully.',
        data: updatedPlan,
      },
      { status: 200 }
    );
  } catch (e) {
    return NextResponse.json(
      { status: false, message: 'Something went wrong.' },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    await dbConnect();
    const data = await req.json();
    const { stripePriceId, adminAccessKey } = data;

    // validating ADMIN access key
    if (adminAccessKey !== process.env.ADMIN_ACCESS_KEY) {
      return NextResponse.json(
        { status: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }

    // validating data
    if (!stripePriceId) {
      return NextResponse.json(
        {
          status: false,
          message: 'Please provide stripePriceId',
        },
        { status: 400 }
      );
    }

    await Plan.findOneAndDelete({ stripePriceId });

    //  Success
    return NextResponse.json(
      {
        status: true,
        message: 'Plan deleted.',
      },
      { status: 200 }
    );
  } catch (e) {
    return NextResponse.json(
      { status: false, message: 'Something went wrong.' },
      { status: 500 }
    );
  }
}
