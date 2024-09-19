'use client';

import { useState } from 'react';
import { FiSettings, FiUser, FiLock } from 'react-icons/fi';
import { MdDeleteOutline } from 'react-icons/md';
import { RiMoneyDollarCircleLine } from 'react-icons/ri';

const Sidebar = () => {
  const [activeTab, setActiveTab] = useState('basic-info');

  const menuItems = [
    { name: 'Basic Information', icon: <FiUser />, id: 'basic-info' },
    { name: 'Preferences', icon: <FiSettings />, id: 'preferences' },
    { name: 'Password', icon: <FiLock />, id: 'password' },
    { name: 'Billing', icon: <RiMoneyDollarCircleLine />, id: 'billing' },
    { name: 'Delete your account', icon: <MdDeleteOutline />, id: 'delete' },
  ];

  return (
    <aside className="w-full md:w-1/5 bg-white py-4 shadow-xl rounded-2xl">
      <ul className="space-y-2">
        {menuItems.map((item) => (
          <li
            key={item.id}
            className={`flex items-center p-4  cursor-pointer hover:bg-gray-100 hover:border-l-4 hover:text-[#6950e9] hover:border-[#6950e9] ${
              activeTab === item.id
                ? 'bg-gray-100 text-[#6950e9] border-l-4 border-[#6950e9]'
                : ''
            }`}
            onClick={() => setActiveTab(item.id)}
          >
            <span className="mr-2 text-lg">{item.icon}</span>
            {item.name}
          </li>
        ))}
      </ul>
    </aside>
  );
};

export default Sidebar;
