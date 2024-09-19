import React from 'react';
import Image from 'next/image';
import { SlCalender } from 'react-icons/sl';
import { RiMapPin2Line } from 'react-icons/ri';
import { HiArchive } from 'react-icons/hi';

const menuItems = [
  { name: 'Developer', icon: <HiArchive />, id: 'basic-info' },
  { name: 'New York', icon: <RiMapPin2Line />, id: 'preferences' },
  { name: 'Joined March 17', icon: <SlCalender />, id: 'date' },
];

const Header = () => {
  return (
    <div className="bg-white rounded-lg shadow-lg flex flex-col items-center pb-4 max-md:hidden">
      <div className="relative w-full h-32 md:h-32 rounded-lg overflow-hidden bg-[url('/images/accountBackground.jpg')] bg-cover bg-center" />

      <div className="relative flex flex-col items-center mt-[-50px] md:mt-[-70px] px-4 w-full">
        <div className="relative rounded-full  w-16 h-16 md:w-24 md:h-24 overflow-hidden">
          <Image
            src="/images/defaultImage.png"
            alt="Profile picture"
            layout="fill"
            objectFit="cover"
            className="cursor-pointer"
          />
        </div>

        <h1 className="text-2xl font-semibold">Pixy Krovasky</h1>

        <div className="flex items-center space-x-2 text-gray-500 mt-1 gap-x-6">
          {menuItems.map((item) => (
            <p className="flex gap-x-2" key={item.id}>
              <span className="flex items-center">{item.icon}</span>
              <span>{item.name}</span>
            </p>
          ))}
        </div>

        <div className="relative w-full">
          <span className="text-gray-500">Profile Completion</span>
          <div className="mt-1 w-1/5 flex items-center">
            <div className="w-2/3 bg-gray-200 rounded-full h-2">
              <div
                className="bg-green-500 h-2 rounded-full"
                style={{ width: '50%' }}
              ></div>
            </div>
            <span className="ml-2 text-gray-500 text-sm">50%</span>
          </div>

          <div className="mt-4 flex space-x-4 ml-0 md:ml-auto absolute bottom-1 right-2">
            <button className="bg-gray-100 px-4 py-2 rounded-lg text-gray-700 hover:bg-gray-200">
              Follow
            </button>
            <button className="bg-[#6950e9] px-4 py-2 rounded-lg text-white">
              Hire Me
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
