import stripe from '~/utils/stripe';
import User from '~/models/user';
import Subscription from '~/models/subscription';
import dbConnect from '~/db/db';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();

    console.log('data', data);
    const { email, paymentMethodId, userId, priceId } = data;

    await dbConnect();
    const user = await User.findOne({ _id: userId });

    console.log('user', user);

    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    let stripeCustomerId = user.stripeCustomerId;

    console.log('stripeCustomerId', stripeCustomerId);
    if (!stripeCustomerId) {
      const customer = await stripe.customers.create({
        email,
        payment_method: paymentMethodId,
        invoice_settings: {
          default_payment_method: paymentMethodId,
        },
      });

      console.log('customer', customer);

      stripeCustomerId = customer.id;

      await User.updateOne({ _id: userId }, { $set: { stripeCustomerId } });
    }

    // Step 3: Create the subscription with the selected plan (priceId)
    const subscription = await stripe.subscriptions.create({
      customer: stripeCustomerId,
      items: [{ price: priceId }], // Use the selected plan's price ID
      expand: ['latest_invoice.payment_intent'],
    });

    console.log('subscription', subscription);

    const newSubscription = new Subscription({
      userId: userId,
      stripeSubscriptionId: subscription.id,
      stripePriceId: priceId, // Store the plan's price ID
      status: subscription.status,
      currentPeriodStart: new Date(subscription.current_period_start * 1000),
      currentPeriodEnd: new Date(subscription.current_period_end * 1000),
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    console.log('newSubscription', newSubscription);

    await newSubscription.save();

    return NextResponse.json({ subscription }, { status: 200 });
  } catch (e) {
    console.log('error == ', e);
    return NextResponse.json(
      { status: false, message: 'Something went wrong.' },
      { status: 500 }
    );
  }
}
