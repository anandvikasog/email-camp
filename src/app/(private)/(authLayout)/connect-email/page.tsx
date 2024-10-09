'use client';
import { paths } from '@/paths';
import { useGetConnectedEmailMutation } from '@/store/Features/auth/authApiSlice';
import Link from 'next/link';
import React, { useEffect } from 'react';
import SpinnerLoader from '../../../../components/common/spinner-loader';
import { ToggleButton } from '../../../../components/common/toggle-button';
import { useDarkMode } from '../../../../contexts/DarkModeContext';
import { FaRegEdit } from 'react-icons/fa';
import Image from 'next/image';
import Chip from '@/components/common/chip';
import Button from '@/components/common/button';

export interface ConnectedEmailType {
  _id: string;
  emailId: string;
  verified: boolean;
  domain: string;
  userId: string;
  signature: string;
}

const Page = () => {
  const [getEmailIds, { data, isLoading }] =
    useGetConnectedEmailMutation<any>();
  const { isDarkMode } = useDarkMode();
  useEffect(() => {
    getEmailIds({});
  }, [getEmailIds]);
  return (
    <div
      className={`p-5 rounded-lg overflow-auto ${isDarkMode ? 'bg-[#202938] border-[#121929] text-white' : 'bg-white text-gray-900'}`}
    >
      <div className="w-[100%] flex justify-between mb-5">
        <div className="flex gap-2 items-center">
          <div className="bg-['rgba(10, 7, 22, 0.1)'] p-3 rounded">
            <Image src="/images/doc.svg" height={20} width={20} alt="users" />
          </div>
          Connected Emails
        </div>
        <div className="flex gap-2 items-center">
          <Button
            as={Link}
            href={paths.private.connectNewEmails}
            startIcon={
              <Image src="/images/add.svg" height={18} width={18} alt="add" />
            }
          >
            Connect New
          </Button>
        </div>
      </div>
      {data && data?.data.length > 0 ? (
        <table
          className={`min-w-full divide-y ${isDarkMode ? 'divide-[#374151]' : 'divide-[#E5E7EB]'}`}
        >
          <thead>
            <tr>
              <th
                scope="col"
                className={`py-3.5 pl-4 pr-3 ${isDarkMode ? 'text-[#9CA3AF]' : 'text-[#6B7280]'}  text-left text-sm  sm:pl-0`}
              >
                Email ID
              </th>
              <th
                scope="col"
                className={`py-3.5 pl-4 pr-3 ${isDarkMode ? 'text-[#9CA3AF]' : 'text-[#6B7280]'}  text-left text-sm  sm:pl-0`}
              >
                Domain
              </th>
              <th
                scope="col"
                className={`py-3.5 pl-4 pr-3 ${isDarkMode ? 'text-[#9CA3AF]' : 'text-[#6B7280]'}  text-left text-sm  sm:pl-0`}
              >
                Status
              </th>
              <th
                scope="col"
                className={`py-3.5 pl-4 pr-3 ${isDarkMode ? 'text-[#9CA3AF]' : 'text-[#6B7280]'}  text-left text-sm  sm:pl-0`}
              >
                Signature
              </th>
            </tr>
          </thead>

          <tbody
            className={`divide-y ${isDarkMode ? 'divide-[#374151]' : 'divide-[#E5E7EB]'}`}
          >
            {data.data.map((elem: ConnectedEmailType) => (
              <tr key={elem._id}>
                <td
                  className={`whitespace-nowrap px-3 py-5 ${isDarkMode ? 'text-[#FFF]' : 'text-[#111827]'}`}
                >
                  <div className="">{elem.emailId}</div>
                </td>
                <td
                  className={`whitespace-nowrap px-3 py-5 ${isDarkMode ? 'text-[#9CA3AF]' : 'text-[#6B7280]'} text-sm`}
                >
                  <div className="">{elem.domain}</div>
                </td>
                <td>
                  <Chip
                    label={elem.verified ? 'Verified' : 'Not Verified'}
                    color={elem.verified ? 'success' : 'danger'}
                  />
                </td>
                <td className="whitespace-nowrap px-6 py-5 text-sm text-gray-500">
                  <span
                    className={`inline-flex items-center rounded-md  px-2 py-1 text-xs font-medium`}
                  >
                    <Link
                      href={{
                        pathname: paths.private.editConnectedEmail(elem._id),
                        query: { signature: elem.signature },
                      }}
                    >
                      <Image
                        src="/images/pencil.svg"
                        height={18}
                        width={18}
                        alt="edit"
                      />
                    </Link>
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
  );
};

export default Page;
