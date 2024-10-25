'use client';
import { paths } from '@/paths';
import { useGetCampaignQuery } from '@/store/Features/auth/authApiSlice';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import SpinnerLoader from '../../../../components/common/spinner-loader';
import moment from 'moment';
import { ToggleButton } from '../../../../components/common/toggle-button';
import { useDarkMode } from '../../../../contexts/DarkModeContext';
import Image from 'next/image';
import Chip from '@/components/common/chip';
import Button from '@/components/common/button';
import { calculateStat } from '@/lib/calculateStat';

interface ICampaign {
  _id: string;
  name: string;

  fromEmail: string;
  status: string;
  createdAt: string;
  mails: any;
  savedAsDraft: Boolean;
}

const Page = () => {
  const { data, isLoading, error } = useGetCampaignQuery<any>({});
  const { isDarkMode, toggleDarkMode } = useDarkMode();

  return (
    <div
      className={`pt-10 min-h-screen ${isDarkMode ? 'bg-[#202938] border-[#121929] text-white' : 'bg-white text-gray-900'}`}
    >
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="w-[100%] flex justify-between mb-5">
          <div className="flex gap-2 items-center">
            <div className="bg-['rgba(10, 7, 22, 0.1)'] p-3 rounded">
              <Image src="/images/doc.svg" height={20} width={20} alt="users" />
            </div>
            Campaigns
          </div>
          <div className="flex gap-2 items-center">
            <Button
              as={Link}
              href={paths.private.newCampaign}
              startIcon={
                <Image src="/images/add.svg" height={18} width={18} alt="add" />
              }
            >
              Create New
            </Button>
          </div>
        </div>
        <div className={`mt-8 flow-root shadow-lg p-5 rounded-lg`}>
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
                  className={`min-w-full divide-y ${isDarkMode ? 'divide-[#374151]' : 'divide-[#E5E7EB]'}`}
                >
                  <thead>
                    <tr>
                      <th
                        scope="col"
                        className={`py-3.5 pl-4 pr-3 text-left text-sm font-semibold sm:pl-0 ${isDarkMode ? 'text-[#9CA3AF]' : 'text-[#6B7280]'}`}
                      >
                        Name
                      </th>
                      <th
                        scope="col"
                        className={`px-3 py-3.5 text-left text-sm font-semibold ${isDarkMode ? 'text-[#9CA3AF]' : 'text-[#6B7280]'}`}
                      >
                        Sender Email
                      </th>
                      <th
                        scope="col"
                        className={`px-3 py-3.5 text-left text-sm font-semibold ${isDarkMode ? 'text-[#9CA3AF]' : 'text-[#6B7280]'}`}
                      >
                        Status
                      </th>
                      <th
                        scope="col"
                        className={`px-3 py-3.5 text-left text-sm font-semibold ${isDarkMode ? 'text-[#9CA3AF]' : 'text-[#6B7280]'}`}
                      >
                        Delivery Status
                      </th>
                      <th
                        scope="col"
                        className={`px-3 py-3.5 text-left text-sm font-semibold ${isDarkMode ? 'text-[#9CA3AF]' : 'text-[#6B7280]'}`}
                      >
                        Created At
                      </th>
                      <th
                        scope="col"
                        className={`px-3 py-3.5 text-left text-sm font-semibold ${isDarkMode ? 'text-[#9CA3AF]' : 'text-[#6B7280]'}`}
                      >
                        Action
                      </th>
                    </tr>
                  </thead>

                  <tbody
                    className={`divide-y ${isDarkMode ? 'divide-[#374151]' : 'divide-[#E5E7EB]'}`}
                  >
                    {data.data.map((elem: ICampaign) => (
                      <tr key={elem._id}>
                        <td
                          className={`whitespace-nowrap px-3 py-5 text-sm ${isDarkMode ? 'text-[#FFF]' : 'text-[#111827]'}`}
                        >
                          <div>{elem.name}</div>
                        </td>
                        <td
                          className={`whitespace-nowrap px-3 py-5 text-sm ${isDarkMode ? 'text-[#9CA3AF]' : 'text-[#6B7280]'}`}
                        >
                          <div>{elem.fromEmail}</div>
                        </td>
                        <td className="whitespace-nowrap px-3 py-5 text-sm">
                          {elem.savedAsDraft === true ? (
                            <Chip label="In Draft" color="secondary" />
                          ) : elem.status === 'Pending' ? (
                            <Chip label="Pending" color="warning" />
                          ) : elem.status === 'Running' ? (
                            <Chip label="Running" color="info" />
                          ) : elem.status === 'Completed' ? (
                            <Chip label="Completed" color="success" />
                          ) : (
                            ''
                          )}
                        </td>
                        <td
                          className={`whitespace-nowrap px-3 py-5 text-sm ${isDarkMode ? 'text-[#9CA3AF]' : 'text-[#6B7280]'}`}
                        >
                          {(() => {
                            let stat = calculateStat(elem.mails);
                            return (
                              <div className="text-[12px]">
                                <div>Total: {stat?.total}</div>
                                <div>Delivered: {stat?.delivered}</div>
                                <div>Rejected: {stat?.rejected}</div>
                                <div>Bounced: {stat?.bounced}</div>
                              </div>
                            );
                          })()}
                        </td>
                        <td
                          className={`whitespace-nowrap px-3 py-5 text-sm ${isDarkMode ? 'text-[#9CA3AF]' : 'text-[#6B7280]'}`}
                        >
                          <div className="">
                            {elem?.createdAt
                              ? moment(elem.createdAt).format('DD/MM/YYYY')
                              : ''}
                          </div>
                        </td>
                        <td className="whitespace-nowrap px-3 py-5 text-sm ">
                          {/* {elem.savedAsDraft === true ? ( */}
                          <Link
                            href={paths.private.editCampaign(elem._id)}
                            className="text-indigo-600 hover:text-indigo-900"
                          >
                            <Image
                              src="/images/pencil.svg"
                              height={18}
                              width={18}
                              alt="edit"
                            />
                          </Link>
                          {/* ) : null} */}
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
