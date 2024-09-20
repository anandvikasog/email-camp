'use client';

import { useState, useEffect } from 'react';
import { PlanType } from '~/models/plan';
import PaymentPlansProtected from '@/components/private/payment-plan-protected';
import FullscreenLoader from '@/components/common/fullscreen-loader';
import CheckoutForm from '@/components/private/checkout-form';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/store/store';
import { redirect } from 'next/navigation';
import { paths } from '@/paths';
import { logOut } from '@/store/Features/auth/authSlice';
import { signOut } from 'next-auth/react';

const getSelectedPlan = () => {
  const selectedPlan = sessionStorage.getItem('selectedPlan');
  if (selectedPlan) {
    return JSON.parse(selectedPlan);
  }
  return null;
};

export default function Payment() {
  const { auth } = useSelector((store: RootState) => store);
  const dispatch = useDispatch();
  const [selectedPlan, setSelectedPlan] = useState<undefined | null | PlanType>(
    undefined
  );

  useEffect(() => {
    if (auth?.subscription) {
      redirect(paths.private.dashboard);
    }
    setSelectedPlan(getSelectedPlan());
  }, [auth]);

  const handleSignOut = async () => {
    dispatch(logOut());
    await signOut({ redirect: true, callbackUrl: paths.public.signIn });
  };

  if (selectedPlan === undefined) {
    return <FullscreenLoader />;
  }

  return selectedPlan === null ? (
    <PaymentPlansProtected
      handler={(plan) => setSelectedPlan(plan)}
      onBack={handleSignOut}
    />
  ) : (
    <CheckoutForm plan={selectedPlan} onBack={() => setSelectedPlan(null)} />
  );
}
