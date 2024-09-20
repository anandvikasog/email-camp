'use client';

import { paths } from '@/paths';
import { useSubscribeMutation } from '@/store/Features/auth/authApiSlice';
import { logOut, updateData } from '@/store/Features/auth/authSlice';
import { RootState } from '@/store/store';
import { ArrowLeftIcon } from '@heroicons/react/20/solid';
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
import PlanCard from '../common/plan-card';
import Image from 'next/image';
import SpinnerLoader from '../common/spinner-loader';

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY || ''
);

const CheckoutForm = ({
  plan,
  onBack,
}: {
  plan: PlanType;
  onBack: () => void;
}) => {
  return (
    <div>
      <div className="p-10 flex">
        <span
          className="text-black flex gap-3 cursor-pointer hover:text-indigo-600"
          onClick={onBack}
        >
          <ArrowLeftIcon aria-hidden="true" className="h-6 w-5  " /> Change Plan
        </span>
      </div>

      <div className="flex">
        <div className="flex-1 px-20">
          <PlanCard plan={plan} />
        </div>
        <div className="flex-1 px-20">
          <div className="p-2">
            <div className="flex justify-between pb-2">
              <span>Amount</span>
              <span>${plan.amount}</span>
            </div>
            <div className="flex justify-between pb-2">
              <span>Charges</span>
              <span>${0}</span>
            </div>
            <div className="border mb-2" />
            <div className="flex justify-between">
              <span className="font-bold">Total</span>
              <span>${plan.amount}</span>
            </div>
            <div className="flex gap-5 items-center mt-8">
              <Image
                src="/images/credit-card.png"
                alt="card image"
                height={40}
                width={40}
              />
              <div>
                Fill your <span className="font-bold">Credit Card</span> details
                below to continue.
              </div>
            </div>
          </div>
          <Elements stripe={stripePromise}>
            <PaymentForm plan={plan} />
          </Elements>
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
  const [formComplete, setFormComplete] = useState({
    card: false,
    expiry: false,
    cvc: false,
  });
  const [subscribe, { data, isLoading }] = useSubscribeMutation<any>();

  const handleCardNumberChange = (event: any) => {
    setCardBrand(event.brand);
    setFormComplete((prevState) => ({
      ...prevState,
      card: event.complete, // Update card completeness
    }));
  };

  const handleExpiryChange = (event: any) => {
    setFormComplete((prevState) => ({
      ...prevState,
      expiry: event.complete, // Update expiry completeness
    }));
  };

  const handleCvcChange = (event: any) => {
    setFormComplete((prevState) => ({
      ...prevState,
      cvc: event.complete, // Update CVC completeness
    }));
  };

  const isFormValid =
    formComplete.card && formComplete.expiry && formComplete.cvc;

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
        'Payment method creation failed! Please fill all the data before submitting.'
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

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col justify-center gap-y-4 bg-white p-2 rounded mt-8"
    >
      <div className="flex flex-col gap-y-2">
        <label className="relative">
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
          <div className="absolute top-0 right-0 text-[#6950e9] font-bold">
            {cardBrand !== 'unknown' && cardBrand}
          </div>
        </label>
        <div className="flex justify-between gap-4">
          <label className="flex-1">
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
              onChange={handleExpiryChange}
            />
          </label>
          <label className="flex-1">
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
              onChange={handleCvcChange}
            />
          </label>
        </div>
      </div>

      <button
        type="submit"
        className={`mt-4 py-2 px-4 text-white rounded ${isFormValid ? 'bg-[#6950e9]' : 'bg-[#9b8de0]'}`}
        disabled={!stripe || loading || isLoading || !isFormValid}
      >
        {loading || isLoading ? (
          <div className="flex justify-center gap-3">
            <SpinnerLoader /> Processing...
          </div>
        ) : (
          `Pay $${plan.amount}`
        )}
      </button>
    </form>
  );
};
