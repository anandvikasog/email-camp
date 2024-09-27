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

export default function Home() {
  const [activeTab, setActiveTab] = useState('basic-info');

  return (
    <div className="min-h-screen p-4">
      <div className="flex flex-col md:flex-row">
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

        <main className="w-full px-2 lg:px-4">
          {/* Conditionally render the forms based on activeTab */}
          {activeTab === 'basic-info' ? (
            <>
              <Header />
              <div className="mt-6 bg-white p-6 rounded-lg shadow-lg">
                <ProfileForm />
              </div>
            </>
          ) : activeTab === 'password' ? (
            <div className=" bg-white p-6 rounded-lg shadow-lg">
              <ChangePasswordForm />
            </div>
          ) : null}
        </main>
      </div>
    </div>
  );
}
