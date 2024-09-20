'use client';

import { CheckIcon, XMarkIcon } from '@heroicons/react/20/solid';
import { PlanType } from '~/models/plan';
import { PrivatePlanAction } from '../common/plan-action';
import { useGetPlanQuery } from '@/store/Features/auth/authApiSlice';
import PlanCard from '../common/plan-card';
import { ArrowLeftIcon } from '@heroicons/react/20/solid';
import SpinnerLoader from '../common/spinner-loader';

const PaymentPlansProtected = ({
  handler,
  onBack,
}: {
  handler?: (p: PlanType) => void;
  onBack?: (p: PlanType) => void;
}) => {
  const { data, isLoading } = useGetPlanQuery(null);
  // @ts-ignore
  const list: PlanType[] = data?.data || [];
  return (
    <div>
      <div className="p-8 flex">
        <span
          className="text-black flex gap-3 cursor-pointer hover:text-indigo-600"
          onClick={onBack}
        >
          <ArrowLeftIcon aria-hidden="true" className="h-6 w-5  " /> Logout
        </span>
      </div>
      <div className="bg-white flex justify-center min-h-[100vh]">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          {list && list.length > 0 ? (
            <>
              <div className="mx-auto max-w-4xl text-center">
                <h2 className="text-base font-semibold leading-7 text-indigo-600">
                  Select a plan
                </h2>
              </div>

              <div className="isolate mx-auto mt-10 grid max-w-md grid-cols-1 gap-16 lg:mx-0 lg:max-w-[50vw] lg:grid-cols-2">
                {list.map((plan: PlanType) => (
                  <PlanCard key={plan._id} plan={plan}>
                    <PrivatePlanAction plan={plan} handler={handler} />
                  </PlanCard>
                ))}
              </div>
            </>
          ) : (
            <div className="mx-auto max-w-4xl text-center">
              <h2 className="text-base font-semibold leading-7 text-indigo-600 pt-10">
                {isLoading ? (
                  <div className="flex justify-center gap-3">
                    <SpinnerLoader color="#6950e9" /> Loading plans...
                  </div>
                ) : (
                  'No plan found !'
                )}
              </h2>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PaymentPlansProtected;
