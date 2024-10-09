'use client';
import Sidebar from '../../../../components/account/sidebar';
import Header from '../../../../components/account/header';
import ProfileForm from '../../../../components/account/profileForm';
import { useGetUserQuery } from '@/store/Features/auth/authApiSlice';
import { useSelector } from 'react-redux';
import SpinnerLoader from '../../../../components/common/spinner-loader';
import { ChangePasswordForm } from '@/components/auth/change-password-form';
import FullscreenLoader from '@/components/common/fullscreen-loader';
import { useState } from 'react';
import { ToggleButton } from '../../../../components/common/toggle-button';
import { useDarkMode } from '../../../../contexts/DarkModeContext';

export default function Home() {
  const [activeTab, setActiveTab] = useState('basic-info');
  const { isDarkMode, toggleDarkMode } = useDarkMode();

  return (
    <div
      className={`min-h-screen max-sm:p-1 p-4 pt-0 ${
        isDarkMode ? 'bg-[#111828] text-white' : 'bg-white text-black'
      }`}
    >
      <div className="flex flex-col md:flex-row">
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

        <main className="w-full max-sm:px-1 px-2 lg:px-4">
          {/* Conditionally render the forms based on activeTab */}
          {activeTab === 'basic-info' ? (
            <>
              <Header />
              <div
                className={`mt-6 p-6 rounded-lg shadow-lg ${
                  isDarkMode ? 'bg-[#202938] text-white' : 'bg-white text-black'
                }`}
              >
                <ProfileForm />
              </div>
            </>
          ) : activeTab === 'password' ? (
            <div
              className={`p-6 rounded-lg shadow-lg  ${
                isDarkMode ? 'bg-[#202938] text-white' : 'bg-white text-black'
              }`}
            >
              <ChangePasswordForm />
            </div>
          ) : null}
        </main>
      </div>
    </div>
  );
}
