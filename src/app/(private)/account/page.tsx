'use client';
import Sidebar from '../../../components/account/sidebar';
import Header from '../../../components/account/header';
import ProfileForm from '../../../components/account/profileForm';
import { useGetUserQuery } from '@/store/Features/auth/authApiSlice';
import { useSelector } from 'react-redux';
import SpinnerLoader from '../../../components/common/spinner-loader';

export default function Home() {
  const userId = useSelector((state: any) => state.auth._id); // Get the userId from Redux store
  const { data: userData, isLoading } = useGetUserQuery<any>(userId, {
    skip: !userId,
  }); // Fetch user data by userId

  if (isLoading) {
    return <SpinnerLoader />;
  }

  return (
    <div className="min-h-screen p-4">
      <div className="flex flex-col md:flex-row">
        <Sidebar />
        <main className="w-full px-2 lg:px-4">
          <Header userData={userData?.data} />
          <div className="mt-6 bg-white p-6 rounded-lg shadow-lg">
            <ProfileForm userData={userData?.data} />
          </div>
        </main>
      </div>
    </div>
  );
}
