'use client';

import { paths } from '@/paths';
import { useSubscribeMutation } from '@/store/Features/auth/authApiSlice';
import { logOut, updateData } from '@/store/Features/auth/authSlice';
import { RootState } from '@/store/store';
import {
  CardCvcElement,
  CardExpiryElement,
  CardNumberElement,
  Elements,
  useElements,
  useStripe,
} from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { PlanType } from '~/models/plan';

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY || ''
);

const CheckoutForm = ({ plan }: { plan: PlanType }) => {
  return (
    <div className="bg-white py-5 sm:py-5 flex justify-center min-h-[100vh]">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          {plan ? (
            <>
              <h2 className="text-base font-semibold leading-7 text-indigo-600 pt-10 text-center">
                Payment
              </h2>
              <h2 className="text-base font-semibold leading-7 text-black pt-5 text-center">
                {plan.title} of ${plan.amount}/{plan.interval}
              </h2>
              <Elements stripe={stripePromise}>
                <PaymentForm plan={plan} />
              </Elements>
            </>
          ) : (
            <h2 className="text-base font-semibold leading-7 text-indigo-600 pt-10">
              Plan not selected
            </h2>
          )}
        </div>
      </div>
    </div>
  );
};

export default CheckoutForm;

const PaymentForm = ({ plan }: { plan: PlanType }) => {
  const { auth } = useSelector((store: RootState) => store);
  const router = useRouter();
  const dispatch = useDispatch();
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [cardBrand, setCardBrand] = useState<string | null>(null);
  const [subscribe, { data, isLoading }] = useSubscribeMutation<any>();

  // Handler to update card brand based on input
  const handleCardNumberChange = (event: any) => {
    if (event.brand) {
      setCardBrand(event.brand);
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!stripe || !elements || !plan) return;
    const cardElement = elements.getElement(CardNumberElement);
    if (!cardElement) return;
    setLoading(true);
    const { paymentMethod, error } = await stripe.createPaymentMethod({
      type: 'card',
      card: cardElement,
    });
    setLoading(false);
    if (error) {
      toast.error(
        'Payment method creation failed! Please fill all the data before submiting.'
      );
      return;
    }
    subscribe({
      email: auth.email,
      paymentMethodId: paymentMethod.id,
      userId: auth._id,
      priceId: plan.stripePriceId,
    });
  };

  useEffect(() => {
    if (data) {
      toast.success(data.message);
      dispatch(updateData({ subscription: data.data }));
      router.push(paths.private.dashboard);
    }
  }, [data, dispatch, router]);

  const handleSignOut = async () => {
    dispatch(logOut());
    await signOut({ redirect: true, callbackUrl: paths.public.signIn });
  };
  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col justify-center mt-5 gap-y-4 bg-white p-4 border rounded w-[500px]"
    >
      <div className="flex flex-col gap-y-2">
        <label>
          Card Number
          <CardNumberElement
            className="p-2 border rounded"
            options={{
              style: {
                base: {
                  fontSize: '16px',
                  color: '#424770',
                  '::placeholder': {
                    color: '#aab7c4',
                  },
                },
                invalid: {
                  color: '#9e2146',
                },
              },
            }}
            onChange={handleCardNumberChange}
          />
        </label>

        <label>
          Expiry Date
          <CardExpiryElement
            className="p-2 border rounded"
            options={{
              style: {
                base: {
                  fontSize: '16px',
                  color: '#424770',
                  '::placeholder': {
                    color: '#aab7c4',
                  },
                },
                invalid: {
                  color: '#9e2146',
                },
              },
            }}
          />
        </label>

        <label>
          CVC
          <CardCvcElement
            className="p-2 border rounded"
            options={{
              style: {
                base: {
                  fontSize: '16px',
                  color: '#424770',
                  '::placeholder': {
                    color: '#aab7c4',
                  },
                },
                invalid: {
                  color: '#9e2146',
                },
              },
            }}
          />
        </label>
      </div>

      <div className="mt-4 text-black">
        {cardBrand !== 'unknown' && cardBrand}
      </div>

      <button
        type="submit"
        className="mt-4 py-2 px-4 bg-blue-500 text-white rounded"
        disabled={!stripe || loading || isLoading}
      >
        {loading || isLoading ? 'Processing...' : 'Submit'}
      </button>
      <button
        type="button"
        className="max-w-[100px] py-2 px-4 bg-[#6950e9] text-white rounded"
        onClick={handleSignOut}
      >
        Logout
      </button>
    </form>
  );
};
