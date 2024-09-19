import User, { UserType } from '~/models/user';
import stripe from './stripe';
import Subscription from '~/models/subscription';

export const generateStripeCustomerId = async (
  email: string,
  paymentMethodId: string
) => {
  const customer = await stripe.customers.create({
    email,
    payment_method: paymentMethodId,
    invoice_settings: {
      default_payment_method: paymentMethodId,
    },
  });

  return customer.id;
};

export const upgradeToPremium = async (
  user: UserType,
  stripeCustomerId: string,
  priceId: string
) => {
  const subscription = await stripe.subscriptions.create({
    customer: stripeCustomerId,
    items: [{ price: priceId }],
    expand: ['latest_invoice.payment_intent'],
  });

  const updatedSubscription = await Subscription.findByIdAndUpdate(
    user.subscription,
    {
      $set: {
        stripeSubscriptionId: subscription.id,
        stripePriceId: priceId,
      },
    },
    { new: true }
  );

  return updatedSubscription;
};

export const createNewSubscription = async (
  user: UserType,
  stripeCustomerId: string,
  priceId: string,
  isFree: boolean = true
) => {
  let subscriptionCreated;
  if (isFree) {
    // creating free plan
    const newSubscription = new Subscription({
      userId: user._id,
      stripePriceId: priceId,
      status: 'active',
    });
    subscriptionCreated = await newSubscription.save();
  } else {
    // creating paid plan
    const subscription = await stripe.subscriptions.create({
      customer: stripeCustomerId,
      items: [{ price: priceId }],
      expand: ['latest_invoice.payment_intent'],
    });

    const newSubscription = new Subscription({
      userId: user._id,
      stripeSubscriptionId: subscription.id,
      stripePriceId: priceId,
    });
    subscriptionCreated = await newSubscription.save();
  }

  await User.findByIdAndUpdate(user._id, {
    $set: { subscription: subscriptionCreated._id },
  });

  return subscriptionCreated;
};
