'use client';
import { useEffect, useState } from 'react';
import { CheckIcon, XMarkIcon } from '@heroicons/react/20/solid';
import { getPlans } from '@/lib/actions/auth';
import { PlanType } from '~/models/plan';
import { PrivatePlanAction, PublicPlanAction } from './plan-action';
import PlanCard from './plan-card';
import { useDarkMode } from '../../contexts/DarkModeContext';
import { ToggleButton } from '../common/toggle-button';

const PaymentPlans = () => {
  const [plans, setPlans] = useState<PlanType[]>([]);
  const [loading, setLoading] = useState(true);
  const { isDarkMode, toggleDarkMode } = useDarkMode();

  useEffect(() => {
    const fetchPlans = async () => {
      const data: string = await getPlans();
      const parsedData: { status: boolean; data: PlanType[] } =
        JSON.parse(data);

      if (parsedData?.status) {
        setPlans(parsedData.data);
      }
      setLoading(false);
    };

    fetchPlans();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!plans.length) {
    return null;
  }

  return (
    <div
      className={`py-24 sm:py-32 flex justify-center ${
        isDarkMode ? 'bg-[#111828] text-white' : 'bg-white text-black'
      }`}
    >
      <ToggleButton isChecked={isDarkMode} onChange={toggleDarkMode} />
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="text-base font-semibold leading-7 text-indigo-600">
            Pricing
          </h2>
          <p className="mt-2 text-4xl font-bold tracking-tight  sm:text-5xl">
            Pricing plans for teams of&nbsp;all&nbsp;sizes
          </p>
        </div>
        <p className="mx-auto mt-6 max-w-2xl text-center text-lg leading-8 ">
          Choose an affordable plan that’s packed with the best features for
          engaging your audience, creating customer loyalty, and driving sales.
        </p>

        <div
          className={`isolate mx-auto mt-10 grid max-w-md grid-cols-1 gap-16 lg:mx-0 lg:max-w-[50vw] lg:grid-cols-2`}
        >
          {plans.map((plan) => (
            <PlanCard key={plan._id} plan={plan}>
              <PublicPlanAction plan={plan} />
            </PlanCard>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PaymentPlans;
