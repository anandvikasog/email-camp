'use client';

import { CheckIcon, XMarkIcon } from '@heroicons/react/20/solid';
import { PlanType } from '~/models/plan';
import { PrivatePlanAction } from '../common/plan-action';
import { useGetPlanQuery } from '@/store/Features/auth/authApiSlice';

const PaymentPlansProtected = ({
  handler,
}: {
  handler?: (p: PlanType) => void;
}) => {
  const { data, isLoading } = useGetPlanQuery(null);
  // @ts-ignore
  const list: PlanType[] = data?.data || [];
  return (
    <div className="bg-white py-5 sm:py-5 flex justify-center min-h-[100vh]">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {list && list.length > 0 ? (
          <>
            <div className="mx-auto max-w-4xl text-center">
              <p className="mt-2 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
                Select Plan
              </p>
            </div>

            <div className="isolate mx-auto mt-10 grid max-w-md grid-cols-1 gap-16 lg:mx-0 lg:max-w-[50vw] lg:grid-cols-2">
              {list.map((plan: PlanType) => (
                <div
                  key={plan._id}
                  className="rounded-3xl p-8 xl:p-10 ring-2 ring-indigo-600"
                >
                  <div className="flex items-center justify-between gap-x-4">
                    <h3
                      id={plan.id}
                      className="text-indigo-600 text-lg font-semibold leading-8"
                    >
                      {plan.title}
                    </h3>
                  </div>
                  <p className="mt-4 text-sm leading-6 text-gray-600">
                    {plan.description}
                  </p>
                  <p className="mt-6 flex items-baseline gap-x-1">
                    <span className="text-4xl font-bold tracking-tight text-gray-900">
                      ${plan.amount}/
                    </span>
                    <span className="text-sm font-semibold leading-6 text-gray-600">
                      {plan.interval}
                    </span>
                  </p>
                  <PrivatePlanAction plan={plan} handler={handler} />
                  <ul
                    role="list"
                    className="mt-8 space-y-3 text-sm leading-6 text-gray-600 xl:mt-10"
                  >
                    {plan.pros.map((pro: string, ind: number) => (
                      <li key={ind} className="flex gap-x-3">
                        <CheckIcon
                          aria-hidden="true"
                          className="h-6 w-5 flex-none text-indigo-600"
                        />
                        {pro}
                      </li>
                    ))}
                  </ul>
                  <ul
                    role="list"
                    className="mt-5 space-y-3 text-sm leading-6 text-gray-600 xl:mt-5"
                  >
                    {plan.cons.map((con: string, ind: number) => (
                      <li key={ind} className="flex gap-x-3">
                        <XMarkIcon
                          aria-hidden="true"
                          className="h-6 w-5 flex-none text-red-500"
                        />
                        {con}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="mx-auto max-w-4xl text-center">
            <h2 className="text-base font-semibold leading-7 text-indigo-600 pt-10">
              {isLoading ? 'Loading...' : 'No plan found !'}
            </h2>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentPlansProtected;
