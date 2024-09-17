import React from 'react';

interface AuthPanelProps {
  head?: string;
  title: string;
  description: string;
  product: string;
  logos: string[];
}
export function AuthSidePanel({
  head,
  title,
  description,
  product,
  logos,
}: AuthPanelProps): JSX.Element {
  return (
    <div className="h-screen bg-[#6950e9] w-[50vw] flex justify-center items-center">
      <div className="w-3/5 text-white flex flex-col gap-y-6">
        {head && <h1 className="font-bold text-3xl">Onion</h1>}
        <h2 className="text-3xl font-bold">{title}</h2>
        <div className="flex flex-col gap-y-4">
          <h1 className="font-bold text-xl">{description}</h1>
          <p className="text-xs">{product}</p>
          <div className="grid grid-cols-3 gap-x-8 gap-y-4 mb-6">
            {logos.map((logo) => (
              <div key={logo} className="py-2 text-sm">
                {logo}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
