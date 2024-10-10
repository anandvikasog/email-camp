import { CheckIcon, XMarkIcon } from '@heroicons/react/20/solid';
import React, { ReactNode } from 'react';
import { PlanType } from '~/models/plan';
import { useDarkMode } from '../../contexts/DarkModeContext';

const PlanCard = ({
  plan,
  children = <></>,
}: {
  plan: PlanType;
  children?: ReactNode;
}) => {
  const { isDarkMode } = useDarkMode();
  return (
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
      <p className="mt-4 text-sm leading-6 text-gray-600">{plan.description}</p>
      <p className="mt-6 flex items-baseline gap-x-1">
        <span
          className={`text-4xl font-bold tracking-tight text-gray-900 ${
            isDarkMode ? ' text-white' : 'text-gray-900'
          }`}
        >
          ${plan.amount}/
        </span>
        <span className="text-sm font-semibold leading-6 text-gray-600">
          {plan.interval}
        </span>
      </p>
      {children}
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
  );
};

export default PlanCard;
