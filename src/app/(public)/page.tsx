import { config } from '@/config';
import { paths } from '@/paths';
import { Metadata } from 'next';
import Link from 'next/link';
import { redirect } from 'next/navigation';

export const metadata = {
  title: `${config.site.name}`,
} satisfies Metadata;

interface Plan {
  name: string;
  price: string;
  features: string[];
  buttonText: string;
}

const plans: Plan[] = [
  {
    name: 'Basic Plan',
    price: '$99/month',
    features: ['..........', '..........', '..........'],
    buttonText: 'Choose Basic',
  },
  {
    name: 'Professional Plan',
    price: '$499/month',
    features: ['..........', '..........', '..........'],
    buttonText: 'Choose Pro',
  },
  {
    name: 'Enterprise Plan',
    price: '$999/month',
    features: ['..........', '..........', '..........'],
    buttonText: 'Choose Enterprise',
  },
];

export default function Page() {
  return (
    <div className="bg-[#111828] min-h-screen flex justify-center items-center">
      <div className="container mx-auto px-4">
        <h1 className="text-[#ffffff] text-4xl font-bold text-center mb-12">
          Our Pricing Plans
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <div key={index} className="bg-[#ffffff] rounded-lg shadow-lg p-6">
              <h2 className="text-[#6950e9] text-2xl font-bold mb-4">
                {plan.name}
              </h2>
              <p className="text-[#111828] text-xl font-semibold mb-6">
                {plan.price}
              </p>
              <ul className="mb-6">
                {plan.features.map((feature, idx) => (
                  <li key={idx} className="text-[#111828] text-base mb-2">
                    ✔ {feature}
                  </li>
                ))}
              </ul>
              <Link
                href={paths.public.signUp}
                className="w-full bg-[#6950e9] text-[#ffffff] py-2 px-4 rounded-md hover:bg-opacity-90 transition duration-300"
              >
                Sing Up
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
