'use client';

import { useState, useEffect } from 'react';
import {
  CardNumberElement,
  CardExpiryElement,
  CardCvcElement,
  useStripe,
  useElements,
  Elements,
} from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { useDispatch, useSelector } from 'react-redux';
import { logOut } from '@/store/Features/auth/authSlice';
import { signOut } from 'next-auth/react';
import { paths } from '@/paths';
import { RootState } from '@/store/store';

// Load Stripe
const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY || ''
);

export default function App() {
  return (
    <Elements stripe={stripePromise}>
      <CheckoutForm />
    </Elements>
  );
}

const CheckoutForm = () => {
  const { auth } = useSelector((store: RootState) => store);

  const dispatch = useDispatch();
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(''); // Store selected plan's price ID
  const [cardBrand, setCardBrand] = useState<string | null>(null);

  // Handler to update card brand based on input
  const handleCardNumberChange = (event: any) => {
    if (event.brand) {
      setCardBrand(event.brand);
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);

    if (!stripe || !elements || !selectedPlan) return;

    const cardElement = elements.getElement(CardNumberElement);
    if (!cardElement) return;

    const { paymentMethod, error } = await stripe.createPaymentMethod({
      type: 'card',
      card: cardElement,
    });

    if (error) {
      console.error('Payment method creation failed:', error);
      setLoading(false);
      return;
    }

    const response = await fetch('/api/subscribe', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: auth.email,
        paymentMethodId: paymentMethod.id,
        userId: auth._id,
        priceId: selectedPlan,
      }),
    });

    const subscription = await response.json();
    if (subscription.error) {
      console.error(subscription.error);
      setLoading(false);
    } else {
      console.log('Subscription successful:', subscription);
    }

    setLoading(false);
  };

  const handleSignOut = async () => {
    dispatch(logOut());
    await signOut({ redirect: true, callbackUrl: paths.public.signIn });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col justify-center mt-5 gap-y-4 bg-white p-4 border rounded w-[500px]"
    >
      {/* Plan selection dropdown */}
      <select
        value={selectedPlan}
        onChange={(e) => setSelectedPlan(e.target.value)}
        className="mb-4 p-2 border rounded"
      >
        <option value="">Select a Plan</option>
        <option value="prod_Qs13dHtpYqMRQm">Pro Plan</option>
        <option value="prod_Qs0x75usumiOsN">Free Plan</option>
      </select>

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
            onChange={handleCardNumberChange} // Update card brand on change
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

      {/* Display card brand image */}
      <div className="mt-4 text-black">
        {cardBrand !== 'unknown' && cardBrand}
      </div>

      <button
        type="submit"
        className="mt-4 py-2 px-4 bg-blue-500 text-white rounded"
        disabled={!stripe || loading}
      >
        {loading ? 'Processing...' : 'Subscribe'}
      </button>
      <button
        type="submit"
        className="max-w-[100px] py-2 px-4 bg-[#6950e9] text-white rounded"
        onClick={handleSignOut}
      >
        Logout
      </button>
    </form>
  );
};
