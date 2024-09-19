import stripe from '~/utils/stripe';
import User from '~/models/user';
import Subscription from '~/models/subscription';
import dbConnect from '~/db/db';
import { NextRequest, NextResponse } from 'next/server';
import {
  createNewSubscription,
  generateStripeCustomerId,
  upgradeToPremium,
} from '~/utils/subscription';

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();

    console.log('data', data);
    const { email, paymentMethodId, userId, priceId } = data;

    await dbConnect();
    const user = await User.findOne({ _id: userId });

    console.log('user', user);

    // checking user exists or not
    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    let stripeCustomerId = user.stripeCustomerId;

    if (!stripeCustomerId) {
      stripeCustomerId = await generateStripeCustomerId(email, paymentMethodId);
      await User.updateOne({ _id: userId }, { $set: { stripeCustomerId } });
    }
    console.log('stripeCustomerId', stripeCustomerId);

    let subscriptionData: null | object = null;

    if (user.subscription) {
      // If user already subscribed to some plan
      // getting data of plan for which user is subscribed to
      const currentSubscription = await Subscription.findById(
        user.subscription
      );
      const priceData = await stripe.prices.retrieve(
        currentSubscription.stripePriceId
      );
      if (priceData.unit_amount === 0) {
        // If subscribed to free plan
        subscriptionData = await upgradeToPremium(
          user,
          stripeCustomerId,
          priceId
        );
      } else {
        // If subscribed to paid plan
        return NextResponse.json(
          { message: 'You already have an active premium subscription.' },
          { status: 400 }
        );
      }
    } else {
      // If user not subscribed to some plan
      const priceData = await stripe.prices.retrieve(priceId);
      subscriptionData = await createNewSubscription(
        user,
        stripeCustomerId,
        priceId,
        priceData.unit_amount === 0
      );
    }

    return NextResponse.json({ subscriptionData }, { status: 200 });
  } catch (e) {
    console.log('error == ', e);
    return NextResponse.json(
      { status: false, message: 'Something went wrong.' },
      { status: 500 }
    );
  }
}
