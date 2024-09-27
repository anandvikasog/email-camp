'use client';
import { paths } from '@/paths';
import { useGetConnectedEmailMutation } from '@/store/Features/auth/authApiSlice';
import Link from 'next/link';
import React, { useEffect } from 'react';
import SpinnerLoader from '../../../../components/common/spinner-loader';

export interface ConnectedEmailType {
  _id: string;
  emailId: string;
  verified: boolean;
  domain: string;
  userId: string;
}

const Page = () => {
  const [getEmailIds, { data, isLoading }] =
    useGetConnectedEmailMutation<any>();

  useEffect(() => {
    getEmailIds({});
  }, [getEmailIds]);
  return (
    <div className="pt-10">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="sm:flex sm:items-center">
          <div className="sm:flex-auto">
            <h1 className="text-base font-semibold leading-6 text-gray-900">
              Connected Email IDs
            </h1>
          </div>
          <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
            <Link
              href={paths.private.connectNewEmails}
              className="block rounded-md bg-[#6950e9] px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#6950e9]"
            >
              Connect New
            </Link>
          </div>
        </div>
        <div className="mt-8 flow-root shadow-lg p-5 rounded-lg">
          <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
              {data && data?.data.length > 0 ? (
                <table className="min-w-full divide-y divide-gray-300">
                  <thead>
                    <tr>
                      <th
                        scope="col"
                        className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0"
                      >
                        Email ID
                      </th>
                      <th
                        scope="col"
                        className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                      >
                        Domain
                      </th>
                      <th
                        scope="col"
                        className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                      >
                        Status
                      </th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-gray-200 bg-white">
                    {data.data.map((elem: ConnectedEmailType) => (
                      <tr key={elem._id}>
                        <td className="whitespace-nowrap px-3 py-5 text-sm text-gray-500">
                          <div className="text-gray-900">{elem.emailId}</div>
                        </td>
                        <td className="whitespace-nowrap px-3 py-5 text-sm text-gray-500">
                          <div className="text-gray-900">{elem.domain}</div>
                        </td>
                        <td className="whitespace-nowrap px-3 py-5 text-sm text-gray-500">
                          <span
                            className={`inline-flex items-center rounded-md ${elem.verified ? 'bg-green-50' : 'bg-red-50'}  px-2 py-1 text-xs font-medium ${elem.verified ? 'text-green-700' : 'text-red-700'} ring-1 ring-inset  ${elem.verified ? 'ring-green-600/20' : 'ring-red-600/20'}`}
                          >
                            {elem.verified ? 'Verified' : 'Not Verified'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="text-center pt-10 w-[100%]">
                  {isLoading ? (
                    <div>
                      <SpinnerLoader color="blue" />
                      <p>Loading existing ...</p>
                    </div>
                  ) : (
                    'No data found!'
                  )}
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
