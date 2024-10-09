'use client';
import { paths } from '@/paths';
import { useGetCampaignQuery } from '@/store/Features/auth/authApiSlice';
import Link from 'next/link';
import React, { useEffect } from 'react';
import SpinnerLoader from '../../../../components/common/spinner-loader';
import moment from 'moment';
import { ToggleButton } from '../../../../components/common/toggle-button';
import { useDarkMode } from '../../../../contexts/DarkModeContext';

interface ICampaign {
  _id: string;
  name: string;

  fromEmail: string;
  status: string;
  createdAt: string;

  savedAsDraft: Boolean;
}

const Page = () => {
  const { data, isLoading, error } = useGetCampaignQuery<any>({});
  const { isDarkMode, toggleDarkMode } = useDarkMode();

  return (
    <div
      className={`pt-10 min-h-screen ${
        isDarkMode ? 'text-white' : 'bg-white text-gray-900'
      }`}
    >
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="sm:flex sm:items-center">
          <div className="sm:flex-auto">
            <h1 className="text-base font-semibold leading-6">Campaigns</h1>
          </div>
          <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
            <Link
              href={paths.private.newCampaign}
              className="block rounded-md bg-[#6950e9] px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#6950e9]"
            >
              Create New
            </Link>
          </div>
        </div>
        <div
          className={`mt-8 flow-root shadow-lg p-5 rounded-lg ${
            isDarkMode ? 'bg-[#202938] text-white' : 'bg-white text-gray-900'
          }`}
        >
          <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
              {isLoading ? (
                <div className="text-center pt-10 w-[100%]">
                  <SpinnerLoader color="blue" />
                  <p>Loading campaigns...</p>
                </div>
              ) : error ? (
                <div className="text-center pt-10 w-[100%]">
                  <p className="text-red-500">Failed to load campaigns.</p>
                </div>
              ) : data && data?.data.length > 0 ? (
                <table
                  className={`min-w-full divide-y divide-gray-300  ${
                    isDarkMode
                      ? 'bg-[#202938] text-white'
                      : 'bg-white text-gray-900'
                  }`}
                >
                  <thead>
                    <tr>
                      <th
                        scope="col"
                        className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold sm:pl-0"
                      >
                        Name
                      </th>
                      <th
                        scope="col"
                        className="px-3 py-3.5 text-left text-sm font-semibold"
                      >
                        Sender Email
                      </th>
                      <th
                        scope="col"
                        className="px-3 py-3.5 text-left text-sm font-semibold"
                      >
                        Status
                      </th>
                      <th
                        scope="col"
                        className="px-3 py-3.5 text-left text-sm font-semibold"
                      >
                        Created At
                      </th>
                      <th
                        scope="col"
                        className="px-3 py-3.5 text-left text-sm font-semibold"
                      >
                        Action
                      </th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-gray-200">
                    {data.data.map((elem: ICampaign) => (
                      <tr key={elem._id}>
                        <td className="whitespace-nowrap px-3 py-5 text-sm">
                          <div>{elem.name}</div>
                        </td>
                        <td className="whitespace-nowrap px-3 py-5 text-sm">
                          <div>{elem.fromEmail}</div>
                        </td>
                        <td className="whitespace-nowrap px-3 py-5 text-sm">
                          {elem.status === 'Pending' ? (
                            <span
                              className={`inline-flex items-center rounded-md bg-red-50  px-2 py-1 text-xs font-medium text-red-700 ring-1 ring-inset  ring-red-600/20`}
                            >
                              {elem.status}
                            </span>
                          ) : elem.status === 'Running' ? (
                            <span
                              className={`inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-600/20`}
                            >
                              {elem.status}
                            </span>
                          ) : elem.status === 'Completed' ? (
                            <span
                              className={`inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20`}
                            >
                              {elem.status}
                            </span>
                          ) : (
                            ''
                          )}
                        </td>
                        <td className="whitespace-nowrap px-3 py-5 text-sm">
                          <div className="">
                            {elem?.createdAt
                              ? moment(elem.createdAt).format('DD/MM/YYYY')
                              : ''}
                          </div>
                        </td>
                        <td className="whitespace-nowrap px-3 py-5 text-sm ">
                          {elem.savedAsDraft === true ? (
                            <Link
                              href={paths.private.editCampaign(elem._id)}
                              className="text-indigo-600 hover:text-indigo-900"
                            >
                              Continue Draft
                            </Link>
                          ) : null}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="text-center pt-10 w-[100%]">
                  <p>No campaigns found!</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
