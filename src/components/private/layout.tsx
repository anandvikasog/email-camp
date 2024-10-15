'use client';
import { useState } from 'react';
import FullscreenLoader from '@/components/common/fullscreen-loader';

import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
  TransitionChild,
} from '@headlessui/react';
import {
  Bars3Icon,
  BellIcon,
  CalendarIcon,
  ChartPieIcon,
  Cog6ToothIcon,
  DocumentDuplicateIcon,
  FolderIcon,
  HomeIcon,
  UsersIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';
import { logOut } from '@/store/Features/auth/authSlice';
import { signOut } from 'next-auth/react';
import { useDispatch } from 'react-redux';

import {
  ChevronDownIcon,
  MagnifyingGlassIcon,
} from '@heroicons/react/20/solid';
import Link from 'next/link';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { paths } from '@/paths';
import { ToggleButton } from '../common/toggle-button';
import { useDarkMode } from '../../contexts/DarkModeContext';
import Image from 'next/image';

const navigation = [
  {
    name: 'Dashboard',
    id: 'dashboard',
    href: paths.private.dashboard,
    icon: '/images/dashboard.svg',
    current: true,
  },
  {
    name: 'Connected Emails',
    id: 'connectedEmails',
    href: paths.private.connectedEmails,
    icon: '/images/campaign.svg',
    current: false,
  },
  {
    name: 'Campaign',
    id: 'campaign',
    href: paths.private.campaign,
    icon: '/images/calender.svg',
    current: false,
  },
];

function classNames(...classes: (string | false | undefined)[]): string {
  return classes.filter(Boolean).join(' ');
}

const Layout = ({ children }: { children: React.ReactNode }) => {
  const dispatch = useDispatch();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(false); // State for loading
  const [activeTab, setActiveTab] = useState('dashboard');
  const { profilePicture } = useSelector((store: RootState) => store.auth);
  const { isDarkMode, toggleDarkMode } = useDarkMode();
  const handleSignOut = async () => {
    setLoading(true); // Show loader
    dispatch(logOut());
    await signOut({ redirect: true, callbackUrl: paths.public.signIn });
    setLoading(false); // Hide loader once logout is done
  };
  const userNavigation = [
    { name: 'Your profile', href: paths.private.account },
    { name: 'Sign out', href: paths.public.signIn, handler: handleSignOut },
  ];

  if (loading) {
    return <FullscreenLoader />;
  }
  return (
    <>
      <div>
        <Dialog
          open={sidebarOpen}
          onClose={setSidebarOpen}
          className="relative z-50 lg:hidden"
        >
          <DialogBackdrop
            transition
            className="fixed inset-0 bg-white transition-opacity duration-300 ease-linear data-[closed]:opacity-0"
          />

          <div className="fixed inset-0 flex">
            <DialogPanel
              transition
              className="relative mr-16 flex w-full max-w-xs flex-1 transform transition duration-300 ease-in-out data-[closed]:-translate-x-full"
            >
              <TransitionChild>
                <div className="absolute left-full top-0 flex w-16 justify-center pt-5 duration-300 ease-in-out data-[closed]:opacity-0">
                  <button
                    type="button"
                    onClick={() => setSidebarOpen(false)}
                    className="-m-2.5 p-2.5"
                  >
                    <span className="sr-only">Close sidebar</span>
                    <XMarkIcon
                      aria-hidden="true"
                      className="h-6 w-6 text-white"
                    />
                  </button>
                </div>
              </TransitionChild>
              {/* Sidebar component, swap this element with another sidebar if you like */}
              <div
                className={`flex grow flex-col gap-y-5 overflow-y-auto  px-6 pb-4 ring-1 ring-white/10  border-r-2 border-gray-200 ${
                  isDarkMode ? 'bg-[#111828] text-white' : 'bg-white text-black'
                }`}
              >
                <div className="flex h-16 shrink-0 items-center justify-center relative">
                  <Image
                    alt="Your Company"
                    src="/images/mirror-logos.png"
                    height={150}
                    width={150}
                    className="cursor-pointer absolute left-[-28px]"
                  />
                </div>
                <nav className="flex flex-1 flex-col">
                  <ul role="list" className="flex flex-1 flex-col gap-y-7">
                    <li>
                      <ul role="list" className="-mx-2 space-y-1">
                        {navigation.map((item) => (
                          <li key={item.name}>
                            <Link
                              href={item.href}
                              className={classNames(
                                activeTab === item.id
                                  ? 'text-[#6950e9]'
                                  : 'text-gray-500',
                                'group flex gap-x-3 rounded-md p-2 text-sm font-medium leading-6 hover:text-[#6950e9] items-center'
                              )}
                              onClick={() => {
                                setActiveTab(item.id);
                              }}
                            >
                              <img
                                src={item.icon}
                                alt={`${item.name} icon`}
                                className="h-4 w-4 shrink-0"
                              />

                              {item.name}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </li>
                  </ul>
                </nav>
              </div>
            </DialogPanel>
          </div>
        </Dialog>

        {/* Static sidebar for desktop */}
        <div
          className={`hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col ${
            isDarkMode ? 'bg-[#111828] text-white' : 'bg-white text-black'
          }`}
        >
          {/* Sidebar component, swap this element with another sidebar if you like */}
          <div className="flex grow flex-col gap-y-5 overflow-y-auto px-6 pb-4 border-r-2 border-gray-200">
            <div className="flex h-16 shrink-0 items-center justify-center relative">
              <Image
                alt="Your Company"
                src="/images/mirror-logos.png"
                height={150}
                width={150}
                className="cursor-pointer absolute left-[-28px]"
              />
            </div>
            <nav className="flex flex-1 flex-col">
              <ul role="list" className="flex flex-1 flex-col gap-y-7">
                <li>
                  <ul role="list" className="-mx-2 space-y-1">
                    {navigation.map((item) => (
                      <li key={item.name}>
                        <Link
                          href={item.href}
                          className={classNames(
                            activeTab === item.id
                              ? ' text-[#6950e9]'
                              : 'text-gray-500',
                            'group flex gap-x-3 rounded-md p-2 text-sm font-medium leading-6 hover:text-[#6950e9] items-center'
                          )}
                          onClick={() => {
                            setActiveTab(item.id);
                          }}
                        >
                          <img
                            src={item.icon}
                            alt={`${item.name} icon`}
                            className="h-4 w-4 shrink-0"
                          />

                          {item.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </li>
              </ul>
            </nav>
          </div>
        </div>

        <div className="lg:pl-72">
          <div
            className={`sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4  px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8 ${
              isDarkMode ? 'bg-[#111828] text-white' : 'bg-white text-black'
            }`}
          >
            <button
              type="button"
              onClick={() => setSidebarOpen(true)}
              className="-m-2.5 p-2.5 text-gray-500 lg:hidden"
            >
              <span className="sr-only">Open sidebar</span>
              <Bars3Icon aria-hidden="true" className="h-6 w-6" />
            </button>

            {/* Separator */}
            <div aria-hidden="true" className="h-6  lg:hidden" />

            <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6 relative items-center justify-center">
              <div className="absolute right-24 bottom-6">
                <Link href={paths.private.dashboard}>
                  <Image
                    width={16}
                    height={16}
                    src={'/images/dashboard.svg'}
                    alt={`Dashboard icon`}
                    className="h-4 w-4 shrink-0"
                  />
                </Link>
              </div>
              <div className="absolute right-32 bottom-14 ">
                <ToggleButton
                  isChecked={isDarkMode}
                  onChange={toggleDarkMode}
                />
              </div>

              <div className="flex items-center gap-x-4 lg:gap-x-6 absolute right-1 bottom-3">
                {/* Profile dropdown */}
                <Menu as="div" className="relative">
                  <MenuButton className="-m-1.5 flex items-center p-1.5">
                    <span className="sr-only">Open user menu</span>
                    <Image
                      alt=""
                      src={profilePicture}
                      className="rounded-full bg-gray-50"
                      height={40}
                      width={40}
                    />
                    <span className="hidden lg:flex lg:items-center">
                      <ChevronDownIcon
                        aria-hidden="true"
                        className="ml-2 h-5 w-5 text-gray-400"
                      />
                    </span>
                  </MenuButton>
                  <MenuItems
                    transition
                    className="absolute right-0 z-10 mt-2.5 w-32 origin-top-right rounded-md py-2 shadow-lg ring-1 ring-gray-900/5 transition focus:outline-none data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-100 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in"
                  >
                    {userNavigation.map((item) => (
                      <MenuItem key={item.name}>
                        <Link
                          href={item.href}
                          className={`block px-3 py-1 text-sm leading-6 ${
                            isDarkMode
                              ? 'bg-[#111828] text-white data-[focus]:bg-gray-500'
                              : 'bg-white text-black data-[focus]:bg-gray-50 '
                          }`}
                          onClick={() => {
                            if (item.handler) {
                              item.handler();
                            }
                          }}
                        >
                          {item.name}
                        </Link>
                      </MenuItem>
                    ))}
                  </MenuItems>
                </Menu>
              </div>
            </div>
          </div>

          <main
            className={`pb-5 ${
              isDarkMode ? 'bg-[#111828] text-white' : 'bg-white text-black'
            }`}
          >
            <div className="max-[400px]:px-1 px-4 sm:px-3 lg:px-4">
              {children}
            </div>
          </main>
        </div>
      </div>
    </>
  );
};

export default Layout;
