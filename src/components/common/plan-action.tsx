'use client';

import { paths } from '@/paths';
import { useRouter } from 'next/navigation';
import React from 'react';
import { PlanType } from '~/models/plan';

export const PublicPlanAction = ({ plan }: { plan: PlanType }) => {
  const router = useRouter();
  const handlePlanClicked = () => {
    sessionStorage.setItem('selectedPlan', JSON.stringify(plan));
    router.push(paths.public.signUp);
  };
  return (
    <button
      onClick={handlePlanClicked}
      aria-describedby={plan.id}
      className="bg-indigo-600 text-white shadow-sm hover:bg-indigo-500 mt-6 block rounded-md px-3 py-2 text-center text-sm font-semibold leading-6 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
    >
      Sign Up
    </button>
  );
};

export const PrivatePlanAction = ({
  plan,
  handler,
}: {
  plan: PlanType;
  handler?: (p: PlanType) => void;
}) => {
  const router = useRouter();
  const handlePlanClicked = () => {
    handler && handler(plan);
  };
  return (
    <button
      onClick={handlePlanClicked}
      aria-describedby={plan.id}
      className="bg-indigo-600 text-white shadow-sm hover:bg-indigo-500 mt-6 block rounded-md px-3 py-2 text-center text-sm font-semibold leading-6 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
    >
      Continue
    </button>
  );
};
