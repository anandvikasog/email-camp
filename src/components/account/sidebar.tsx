'use client';

import { useState } from 'react';
import { FiSettings, FiUser, FiLock } from 'react-icons/fi';
import { MdDeleteOutline } from 'react-icons/md';
import { RiMoneyDollarCircleLine } from 'react-icons/ri';
import { useDispatch } from 'react-redux';
import { useRouter } from 'next/navigation';
import { logOut } from '@/store/Features/auth/authSlice';
import { signOut } from 'next-auth/react';
import { paths } from '@/paths';
import FullscreenLoader from '@/components/common/fullscreen-loader';

import { useDarkMode } from '../../contexts/DarkModeContext';
import Image from 'next/image';

const Sidebar = ({
  activeTab,
  setActiveTab,
}: {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}) => {
  const dispatch = useDispatch();
  const router = useRouter();
  const [loading, setLoading] = useState(false); // State for loading
  const { isDarkMode } = useDarkMode();
  const handleSignOut = async () => {
    setLoading(true); // Show loader
    dispatch(logOut());
    await signOut({ redirect: true, callbackUrl: paths.public.signIn });
    setLoading(false); // Hide loader once logout is done
  };

  if (loading) {
    return <FullscreenLoader />;
  }

  const menuItems = [
    { name: 'Basic Information', icon: '/images/user.svg', id: 'basic-info' },

    { name: 'Password', icon: '/images/password.svg', id: 'password' },
    // { name: 'Billing', icon: <RiMoneyDollarCircleLine />, id: 'billing' },
    // {
    //   name: 'Log out',
    //   icon: <MdDeleteOutline />,
    //   id: 'delete',
    //   handler: handleSignOut,
    // },
  ];

  return (
    <aside
      className={`w-full md:w-1/5 py-4 shadow-xl rounded-2xl max-md:hidden ${
        isDarkMode ? 'bg-[#202938] text-gray-500' : 'bg-white text-gray-500'
      }`}
    >
      <ul className="space-y-2">
        {menuItems.map((item) => (
          <li
            key={item.id}
            className={`flex items-center p-4  cursor-pointer hover:border-l-4 hover:text-[#6950e9] hover:border-[#6950e9] ${
              activeTab === item.id
                ? ' text-[#6950e9] border-l-4 border-[#6950e9]'
                : ''
            }`}
            onClick={() => {
              setActiveTab(item.id);

              // if (item.handler) {
              //   item.handler();
              // }
            }}
          >
            <Image
              src={item.icon}
              width={16}
              height={16}
              alt={`${item.name} icon`}
              className="h-4 w-4 shrink-0 mr-2"
            />
            {item.name}
          </li>
        ))}
      </ul>
    </aside>
  );
};

export default Sidebar;
