import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '~/db/db';
import Subscription from '~/models/subscription';
import Transaction from '~/models/transaction';
import User from '~/models/user';
import stripe from '~/utils/stripe';

export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    const event = await req.json();

    console.log('event -------- ', event);

    switch (event.type) {
      case 'invoice.payment_succeeded': {
        const invoice = event.data.object;

        const stripeCustomerId = invoice.customer;
        const paymentIntentId = invoice.payment_intent;
        const amountPaid = invoice.amount_paid;
        const currency = invoice.currency;

        const user = await User.findOne({ stripeCustomerId });
        if (user) {
          const newTransaction = new Transaction({
            userId: user._id,
            stripePaymentIntentId: paymentIntentId,
            amount: amountPaid / 100,
            currency,
            status: 'succeeded',
            createdAt: new Date(),
          });
          await newTransaction.save();

          const subscription = await stripe.subscriptions.retrieve(
            // @ts-ignore
            invoice.subscription
          );
          await Subscription.updateOne(
            { userId: user._id },
            {
              $set: {
                currentPeriodStart: new Date(
                  subscription.current_period_start * 1000
                ),
                currentPeriodEnd: new Date(
                  subscription.current_period_end * 1000
                ),
                status: subscription.status,
                updatedAt: new Date(),
              },
            }
          );
        }
        break;
      }
      case 'invoice.payment_failed': {
        const invoice = event.data.object;

        const stripeCustomerId = invoice.customer;
        const paymentIntentId = invoice.payment_intent;

        const user = await User.findOne({ stripeCustomerId });
        if (user) {
          await Transaction.updateOne(
            { stripePaymentIntentId: paymentIntentId },
            { $set: { status: 'failed' } }
          );
        }
        break;
      }
      case 'customer.subscription.deleted': {
        const subscription = event.data.object;

        const stripeCustomerId = subscription.customer;

        const user = await User.findOne({ stripeCustomerId });
        if (user) {
          await Subscription.updateOne(
            { userId: user._id },
            { $set: { status: 'canceled', updatedAt: new Date() } }
          );
        }
        break;
      }
      default:
        console.warn(`Unhandled event type ${event.type}`);
    }

    console.log('wobhook success 🙂');

    // Login Success
    return NextResponse.json({ received: true }, { status: 200 });
  } catch (e) {
    console.log('error ----', e);
    return NextResponse.json(
      { status: false, message: 'Something went wrong.' },
      { status: 500 }
    );
  }
}
