import React from 'react';
import Image from 'next/image';

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
    <div className="sm:min-h-screen bg-[#6950e9] flex-1 flex justify-center items-center py-2 max-sm:py-10">
      <div className=" w-4/5 sm:w-3/5 text-white flex flex-col gap-y-6">
        {head && (
          // <div className="flex items-center gap-x-1">
          //   <Image
          //     src="/images/mirror-logos.png"
          //     alt="Logo"
          //     width={32}
          //     height={44}
          //     className="w-8 h-8"
          //   />
          //   <h1 className="font-semibold text-3xl">Onion</h1>
          // </div>
          <div className="relative max-sm:p-4">
            <Image
              src="/images/mirror-logos.png"
              alt="Logo"
              width={150}
              height={150}
              className="absolute bottom-[-25px] left-[-28px]"
            />
          </div>
        )}

        <h1 className="font-sans text-lg sm:text-4xl font-semibold leading-normal">
          {title}
        </h1>
        <div className="flex flex-col gap-y-4">
          <h1 className="font-sans text-lg font-semibold leading-normal">
            {description}
          </h1>
          <p className="font-sans text-sm font-normal leading-6">{product}</p>
          <div className="grid grid-cols-3 gap-x-8 gap-y-4 mb-6">
            {logos.map((logoSrc, index) => (
              <Image
                key={index}
                src={logoSrc}
                alt={`Logo ${index + 1}`}
                width={75}
                height={75}
                className="cursor-pointer py-2"
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
