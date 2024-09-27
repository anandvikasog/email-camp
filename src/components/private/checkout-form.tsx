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
    <div className="w-screen">
      {/* Navigation */}
      <div className="p-5">
        <button
          className="flex items-center gap-2 text-indigo-600 hover:underline"
          onClick={onBack}
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path d="M7.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L4.414 9H17a1 1 0 110 2H4.414l3.293 3.293a1 1 0 010 1.414z" />
          </svg>
          Change Plan
        </button>
      </div>

      <div className="flex justify-between mt-10 p-10">
        {/* Plan Summary */}
        <div className="w-1/3 bg-white shadow-md rounded-lg p-5">
          <h3 className="text-lg font-semibold mb-4">Order Summary</h3>
          <div className="flex justify-between mb-6">
            <span>Subtotal</span>
            <span>${plan.amount}</span>
          </div>
          <div className="flex justify-between mb-6">
            <span>Charges</span>
            <span>$0</span>
          </div>

          <div className="border-b mt-16"></div>
          <div className="flex justify-between font-semibold text-lg mt-2">
            <span>Total</span>
            <span className="text-red-700">${plan.amount}</span>
          </div>
        </div>

        {/* Payment Form */}
        <div className="w-1/2 bg-white shadow-md rounded-lg p-5">
          <div className="flex gap-3 items-center mb-4">
            <Image
              src="/images/credit-card.png"
              alt="Credit Card"
              width={40}
              height={40}
            />
            <h3 className="text-lg font-semibold">Credit Card Details</h3>
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
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium">
          Card Number
          <CardNumberElement
            className="block w-full p-2 border rounded-lg mt-1"
            options={{
              style: {
                base: {
                  fontSize: '16px',
                  color: '#424770',
                  '::placeholder': { color: '#aab7c4' },
                },
                invalid: { color: '#9e2146' },
              },
            }}
            onChange={handleCardNumberChange}
          />
        </label>
      </div>

      <div className="flex gap-4">
        <label className="block text-sm font-medium flex-1">
          Expiry Date
          <CardExpiryElement
            className="block w-full p-2 border rounded-lg mt-1"
            options={{
              style: {
                base: {
                  fontSize: '16px',
                  color: '#424770',
                  '::placeholder': { color: '#aab7c4' },
                },
                invalid: { color: '#9e2146' },
              },
            }}
            onChange={handleExpiryChange}
          />
        </label>

        <label className="block text-sm font-medium flex-1">
          CVC
          <CardCvcElement
            className="block w-full p-2 border rounded-lg mt-1"
            options={{
              style: {
                base: {
                  fontSize: '16px',
                  color: '#424770',
                  '::placeholder': { color: '#aab7c4' },
                },
                invalid: { color: '#9e2146' },
              },
            }}
            onChange={handleCvcChange}
          />
        </label>
      </div>

      <button
        type="submit"
        className={`w-full py-2 px-4 text-white rounded ${isFormValid ? 'bg-indigo-600' : 'bg-indigo-300'}`}
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
