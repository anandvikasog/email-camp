import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '~/db/db';
import Plan from '~/models/plan';

export async function GET(req: NextRequest) {
  try {
    await dbConnect();
    const plans = await Plan.find();
    return NextResponse.json({ status: true, data: plans }, { status: 200 });
  } catch (e) {
    return NextResponse.json(
      { message: 'Something went wrong.' },
      { status: 500 }
    );
  }
}
