import Sidebar from '../../../components/account/sidebar';
import Header from '../../../components/account/header';
import ProfileForm from '../../../components/account/profileForm';

export default function Home() {
  return (
    <div className="min-h-screen p-4">
      <div className="flex flex-col md:flex-row">
        <Sidebar />
        <main className="w-full px-2 lg:px-4">
          <Header />
          <div className="mt-6 bg-white p-6 rounded-lg shadow-lg">
            <ProfileForm />
          </div>
        </main>
      </div>
    </div>
  );
}
