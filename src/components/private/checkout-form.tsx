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
    <div className="w-screen overflow-hidden">
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

      <div className="flex sm:justify-between mt-10 p-3 sm:p-12 max-sm:flex-col max-sm:space-y-4">
        {/* Payment Form */}
        <div className="sm:w-1/2 shadow-md rounded-lg p-4">
          <Image
            src="/images/stripe.svg"
            alt="Stripe Logo"
            height={70}
            width={150}
            className="bg-white"
          />
          <div className="flex justify-between items-center mb-6 pt-4">
            <h3 className="font-sans text-sm font-medium leading-6">
              Credit Card
            </h3>
            <Image
              src="/images/cards.svg"
              alt="Credit Card"
              width={110}
              height={40}
            />
          </div>

          <Elements stripe={stripePromise}>
            <PaymentForm plan={plan} />
          </Elements>
        </div>
        {/* Plan Summary */}
        <div className="sm:w-1/3 bg-white shadow-md rounded-lg p-5">
          <h3 className="text-lg font-semibold mb-4">Order Summary</h3>
          <div className="flex justify-between mb-6">
            <span>Subtotal:</span>
            <span className="font-medium leading-6">${plan.amount}</span>
          </div>
          <div className="flex justify-between mb-6">
            <span>Vat 0%:</span>
            <span>-</span>
          </div>
          <div className="flex justify-between mb-2">
            <span>Sub total:</span>
            <span
              className="font-medium leading-6
"
            >
              ${plan.amount}
            </span>
          </div>

          <div className="border-b mt-16"></div>
          <div className="flex justify-between font-semibold text-lg mt-2">
            <span>Total</span>
            <span className="text-[#EF4770]">${plan.amount}</span>
          </div>
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
    <form onSubmit={handleSubmit} className="">
      <div>
        <CardNumberElement
          className="block w-full px-6 py-4 border rounded-lg mt-1"
          options={{
            style: {
              base: {
                fontSize: '16px',
                color: '#6b7280',

                // color: '#424770',
                '::placeholder': { color: '#6B7280' },
              },
              invalid: { color: '#9e2146' },
            },
            placeholder: 'Card Number',
          }}
          onChange={handleCardNumberChange}
        />
      </div>

      <div className="flex gap-4 mb-4 mt-4">
        <CardExpiryElement
          className="block w-full px-6 py-4 border rounded-lg mt-1"
          options={{
            style: {
              base: {
                fontSize: '16px',
                color: '#6b7280',
                '::placeholder': { color: '#aab7c4' },
              },
              invalid: { color: '#9e2146' },
            },
            placeholder: 'Exp Date',
          }}
          onChange={handleExpiryChange}
        />

        <CardCvcElement
          className="block w-full px-6 py-4 border rounded-lg mt-1"
          options={{
            style: {
              base: {
                fontSize: '16px',
                color: '#6b7280',
                '::placeholder': { color: '#aab7c4' },
              },
              invalid: { color: '#9e2146' },
            },

            placeholder: 'CVC',
          }}
          onChange={handleCvcChange}
        />
      </div>

      <button
        type="submit"
        className={`w-full py-2 px-4 text-white mt-8 rounded bg-[#6950e9] ${isFormValid ? '' : 'cursor-not-allowed'}`}
        disabled={!stripe || loading || isLoading || !isFormValid}
      >
        {loading || isLoading ? (
          <div className="flex justify-center gap-3">
            <SpinnerLoader /> Processing...
          </div>
        ) : (
          // `Pay $${plan.amount}`
          <div className="flex justify-center items-center gap-2">
            {/* SVG logo inserted here */}
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M3.604 2.40001H14.65C14.8433 2.40001 15 2.55671 15 2.75001V3.10001C14.9949 3.68092 14.8381 4.25042 14.545 4.75201L12.9 7.64301C12.544 8.28278 11.875 8.68528 11.143 8.70001H6.782C6.6307 8.69675 6.48032 8.67561 6.334 8.63701L5.634 10.1H13.25C13.4433 10.1 13.6 10.2567 13.6 10.45V11.15C13.6 11.3433 13.4433 11.5 13.25 11.5H4.5C4.30843 11.5044 4.12928 11.4055 4.031 11.241L3.877 10.975C3.79606 10.8192 3.79606 10.6338 3.877 10.478L5.179 7.88801C5.10789 7.81292 5.04457 7.73084 4.99 7.64301L1.994 2.40001H1.35C1.1567 2.40001 1 2.24331 1 2.05001V1.35001C1 1.15671 1.1567 1.00001 1.35 1.00001H1.994C2.49616 0.998017 2.96092 1.26512 3.212 1.70001L3.604 2.40001ZM11.171 7.3C11.3916 7.2733 11.5865 7.1434 11.696 6.95L13.348 4.05901C13.3746 4.00581 13.3956 3.9498 13.4163 3.89455L13.4163 3.89454L13.4163 3.89453L13.4163 3.89451C13.4283 3.86253 13.4402 3.8308 13.453 3.80001H4.409L6.208 6.95C6.33229 7.16529 6.56143 7.2985 6.81 7.3H11.171ZM12.2 12.2C11.4268 12.2 10.8 12.8268 10.8 13.6C10.8 14.3732 11.4268 15 12.2 15C12.9732 15 13.6 14.3732 13.6 13.6C13.6 12.8268 12.9732 12.2 12.2 12.2ZM3.8 13.6C3.8 12.8268 4.4268 12.2 5.2 12.2C5.9732 12.2 6.6 12.8268 6.6 13.6C6.6 14.3732 5.9732 15 5.2 15C4.4268 15 3.8 14.3732 3.8 13.6Z"
                fill="white"
              />
            </svg>
            <span className="font-inter text-sm font-semibold leading-6">
              Check Out Now
            </span>
          </div>
        )}
      </button>
    </form>
  );
};
