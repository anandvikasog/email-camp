import React from 'react';
import Image from 'next/image';
import { SlCalender } from 'react-icons/sl';
import { RiMapPin2Line } from 'react-icons/ri';
import { HiArchive } from 'react-icons/hi';

const menuItems = [

  { name: 'Joined March 17', icon: <SlCalender />, id: 'date' },
];
interface HeaderProps {
  userData: {
    profilePicture?: string;
    firstName?: string;
    lastName?: string;
  };
}

const Header: React.FC<HeaderProps> = ({ userData }) => {
  const profilePicture = userData?.profilePicture || '/images/defaultImage.png';

  const fullName = `${userData?.firstName || ''} ${userData?.lastName || ''}`;
  return (
    <div className="bg-white rounded-lg shadow-lg flex flex-col items-center pb-4 max-md:hidden">
      <div className="relative w-full h-32 md:h-32 rounded-lg overflow-hidden bg-[url('/images/accountBackground.jpg')] bg-cover bg-center" />

      <div className="relative flex flex-col items-center mt-[-50px] md:mt-[-70px] px-4 w-full">
        <div className="relative rounded-full  w-16 h-16 md:w-24 md:h-24 overflow-hidden">
          <Image
            src={profilePicture}
            alt="Profile picture"
            layout="fill"
            objectFit="cover"
            className="cursor-pointer"
          />
        </div>

        <h1 className="text-2xl font-semibold">{fullName || 'Anonymous'}</h1>

        <div className="flex items-center space-x-2 text-gray-500 mt-1 gap-x-6">
          {menuItems.map((item) => (
            <p className="flex gap-x-2" key={item.id}>
              <span className="flex items-center">{item.icon}</span>
              <span>{item.name}</span>
            </p>
          ))}
        </div>

    
      </div>
    </div>
  );
};

export default Header;
