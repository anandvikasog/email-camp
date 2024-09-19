'use client';

import { useState, useEffect } from 'react';
import { PlanType } from '~/models/plan';
import PaymentPlansProtected from '@/components/private/payment-plan-protected';
import FullscreenLoader from '@/components/common/fullscreen-loader';
import CheckoutForm from '@/components/private/checkout-form';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { redirect } from 'next/navigation';
import { paths } from '@/paths';

const getSelectedPlan = () => {
  const selectedPlan = sessionStorage.getItem('selectedPlan');
  if (selectedPlan) {
    return JSON.parse(selectedPlan);
  }
  return null;
};

export default function Payment() {
  const { auth } = useSelector((store: RootState) => store);

  const [selectedPlan, setSelectedPlan] = useState<undefined | null | PlanType>(
    undefined
  );

  useEffect(() => {
    if (auth?.subscription) {
      redirect(paths.private.dashboard);
    }
    setSelectedPlan(getSelectedPlan());
  }, [auth]);

  if (selectedPlan === undefined) {
    return <FullscreenLoader title="Loading" />;
  }

  return selectedPlan === null ? (
    <PaymentPlansProtected handler={(plan) => setSelectedPlan(plan)} />
  ) : (
    <CheckoutForm plan={selectedPlan} />
  );
}
