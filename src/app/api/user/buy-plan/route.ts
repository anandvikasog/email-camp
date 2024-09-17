import dbConnect from '~/db/db';
import User from '~/models/user';
import { NextResponse, NextRequest } from 'next/server';
import { validateUser } from '~/utils/helper';

export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    // Validation
    let user = await validateUser();

    user = await User.findByIdAndUpdate(user._id, { planPurchased: true });

    return NextResponse.json(
      {
        message: 'Purchased successfully.',
        status: true,
        data: {
          planPurchased: true,
        },
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
