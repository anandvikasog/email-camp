// import { NextApiRequest, NextApiResponse } from 'next';
// import stripe from '~/utils/stripe';
// import User from '~/models/user';
// import Transaction from '~/models/transaction';
// import Subscription from '~/models/subscription';
// import dbConnect from '~/db/db';

// export const config = {
//   api: {
//     bodyParser: false,
//   },
// };

// async function buffer(readable: any) {
//   const chunks = [];
//   for await (const chunk of readable) {
//     chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk);
//   }
//   return Buffer.concat(chunks);
// }

// export default async function handler(
//   req: NextApiRequest,
//   res: NextApiResponse
// ) {
//   const sig = req.headers['stripe-signature'];
//   const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
//   const buf = await buffer(req);

//   let event;
//   try {
//     event = stripe.webhooks.constructEvent(buf, sig!, webhookSecret!);
//   } catch (err) {
//     console.error('Webhook signature verification failed:', err);
//     return res.status(400).json(err);
//   }

//   console.log('event -------- ', event);

//   await dbConnect();

//   switch (event.type) {
//     case 'invoice.payment_succeeded': {
//       const invoice = event.data.object;

//       const stripeCustomerId = invoice.customer;
//       const paymentIntentId = invoice.payment_intent;
//       const amountPaid = invoice.amount_paid;
//       const currency = invoice.currency;

//       const user = await User.findOne({ stripeCustomerId });
//       if (user) {
//         const newTransaction = new Transaction({
//           userId: user._id,
//           stripePaymentIntentId: paymentIntentId,
//           amount: amountPaid / 100,
//           currency,
//           status: 'succeeded',
//           createdAt: new Date(),
//         });
//         await newTransaction.save();

//         const subscription = await stripe.subscriptions.retrieve(
//           // @ts-ignore
//           invoice.subscription
//         );
//         await Subscription.updateOne(
//           { userId: user._id },
//           {
//             $set: {
//               currentPeriodStart: new Date(
//                 subscription.current_period_start * 1000
//               ),
//               currentPeriodEnd: new Date(
//                 subscription.current_period_end * 1000
//               ),
//               status: subscription.status,
//               updatedAt: new Date(),
//             },
//           }
//         );
//       }
//       break;
//     }
//     case 'invoice.payment_failed': {
//       const invoice = event.data.object;

//       const stripeCustomerId = invoice.customer;
//       const paymentIntentId = invoice.payment_intent;

//       const user = await User.findOne({ stripeCustomerId });
//       if (user) {
//         await Transaction.updateOne(
//           { stripePaymentIntentId: paymentIntentId },
//           { $set: { status: 'failed' } }
//         );
//       }
//       break;
//     }
//     case 'customer.subscription.deleted': {
//       const subscription = event.data.object;

//       const stripeCustomerId = subscription.customer;

//       const user = await User.findOne({ stripeCustomerId });
//       if (user) {
//         await Subscription.updateOne(
//           { userId: user._id },
//           { $set: { status: 'canceled', updatedAt: new Date() } }
//         );
//       }
//       break;
//     }
//     default:
//       console.warn(`Unhandled event type ${event.type}`);
//   }

//   res.json({ received: true });
// }

import { NextRequest, NextResponse } from 'next/server';
// import dbConnect from '~/db/db';

export async function POST(req: NextRequest) {
  try {
    // await dbConnect();
    const data = await req.json();
    console.log('event data ----', data);

    // Login Success
    return NextResponse.json(
      {
        status: true,
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
