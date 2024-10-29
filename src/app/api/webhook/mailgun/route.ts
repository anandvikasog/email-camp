import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '~/db/db';

export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    const eventData = await req.json();

    console.log('eventData', eventData);

    if (eventData['event-data']) {
      const eventType = eventData['event-data'].event;
      const emailId = eventData['event-data'].message.headers['message-id'];

      console.log(`MAILGUN WEBHOOK EVENT :: ${eventType}`);

      switch (eventType) {
        case 'delivered':
          console.log(`Email ${emailId} was delivered.`);
          break;
        case 'opened':
          console.log(`Email ${emailId} was opened.`);
          break;
        case 'bounced':
          console.log(`Email ${emailId} bounced.`);
          break;
        case 'rejected':
          console.log(`Email ${emailId} bounced.`);
          break;
        default:
          console.log(`UN-MANAGED MAILGUN EVENT 🚫 :: ${eventType}`);
      }
    }

    console.log('MAILGUN WEBHOOK MANAGED SUCCESSFULLY ✅');

    return NextResponse.json({ received: true }, { status: 200 });
  } catch (e) {
    console.log('MAILGUN WEBHOOK ERROR 🚫 :: Unhandled error', e);
    return NextResponse.json(
      { status: false, message: 'Something went wrong.' },
      { status: 500 }
    );
  }
}
