'use client';

import React, { useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { profileUpdateSchema } from '@/lib/validationSchema';
import { toast } from 'react-toastify';
import {
  useGetUserQuery,
  useUpdateUserMutation,
} from '@/store/Features/auth/authApiSlice';
import { useSelector } from 'react-redux'; // Import useSelector to access Redux store
import { z as zod } from 'zod';
import countryList from '../../../utils/data/country.json';

type Values = zod.infer<typeof profileUpdateSchema>;

const defaultValues = {
  firstName: '',
  lastName: '',
  email: '',
  password: '',
  mobile: '',
  about: '',
  gender: '',
  companyName: '',
  countryCode: '+91_IN',
  // profilePicture: null as unknown as File,
} satisfies Values;

interface ProfileFormProps {
  userData: {
    firstName?: string;
    lastName?: string;

    mobile?: string;
    gender?: string;
    companyName?: string;
    about?: string;
  };
}
const ProfileForm: React.FC = () => {
  const [updateUser, { isLoading: isUpdating }] = useUpdateUserMutation();
  const userId = useSelector((state: any) => state.auth._id); // Get the userId from Redux store

  // Get user data from Redux store
  const userData = useSelector((state: any) => state.auth);

  const {
    control,
    handleSubmit,
    register,
    setValue,
    trigger,
    formState: { errors },
  } = useForm<Values>({
    defaultValues,
    mode: 'onTouched',
    resolver: zodResolver(profileUpdateSchema),
  });

  useEffect(() => {
    // Populate form with fetched user data
    if (userData) {
      setValue('firstName', userData.firstName || '');
      setValue('lastName', userData.lastName || '');
      setValue('countryCode', userData.countryCode || '');
      setValue('mobile', userData.mobile || '');
      setValue('gender', userData.gender || '');
      setValue('companyName', userData.companyName || '');
      setValue('about', userData.about || '');
    }
  }, [userData, setValue]);

  const onSubmit = async (data: Values) => {
    // Debugging print to see if it's being called
    const formData = new FormData();
    formData.append('userId', userId); // Pass userId
    formData.append('firstName', data.firstName);
    formData.append('gender', data.gender);
    formData.append('companyName', data.companyName);
    if (data.countryCode) {
      formData.append('countryCode', data.countryCode);
    }
    if (data.about) {
      formData.append('about', data.about);
    }
    if (data.lastName) {
      formData.append('lastName', data.lastName);
    }
    if (data.mobile) {
      formData.append('mobile', data.mobile);
    }

    try {
      await updateUser(formData).unwrap();
      toast.success('Updated successfully');
      // Handle success (e.g., show a success message)
    } catch (error) {
      // console.error('Error updating user:', error);
      // Handle error (e.g., show an error message)
    }
  };

  const accountInfo = [
    {
      id: 'firstName',
      type: 'text',
      placeholder: 'First Name',
      required: true,
    },
    { id: 'lastName', type: 'text', placeholder: 'Last Name', required: false },
    {
      id: 'countryCode',
      type: 'select',
      options: countryList.map((country) => ({
        value: `${country.dialCode}_${country.alpha2Code}`,
        label: `${country.dialCode} (${country.alpha2Code})`,
      })),
      placeholder: 'Select Country Code',
      required: true,
    },
    {
      id: 'mobile',
      type: 'number',
      placeholder: 'Mobile Number',
      required: true,
    },
    {
      id: 'gender',
      type: 'select', // Change type to 'select'
      options: [
        { value: '', label: 'Select Gender' }, // Default option
        { value: 'male', label: 'Male' },
        { value: 'female', label: 'Female' },
      ],
      required: true,
    },
    {
      id: 'companyName',
      type: 'text',
      placeholder: 'Company Name',
      required: false,
    },
    {
      id: 'about',
      type: 'textarea',
      placeholder: 'about',
      required: false,
    },
  ];

  return (
    <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
      <h2 className="text-xl font-semibold mb-4">
        Edit your account information
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {accountInfo.map((field) => (
          <div
            key={field.id}
            className={field.type === 'textarea' ? 'md:col-span-2' : ''}
          >
            {field.type === 'select' ? (
              <select
                id={field.id}
                {...register(field.id as keyof Values)}
                className="w-full p-2 border border-gray-300 rounded-md"
              >
                {field.options?.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            ) : field.type === 'textarea' ? (
              <textarea
                id={field.id}
                rows={4}
                className="w-full p-2 border border-gray-300 rounded-md"
                placeholder={field.placeholder}
                {...register(field.id as keyof Values)}
                // defaultValue={
                //   userData ? [field.id as keyof typeof userData] : ''
                // }
              />
            ) : (
              <input
                id={field.id}
                type={field.type}
                {...register(field.id as keyof Values)}
                className="w-full p-2 border border-gray-300 rounded-md"
                placeholder={field.placeholder}
                // defaultValue={
                //   userData ? [field.id as keyof typeof userData] : ''
                // } // Set default value
              />
            )}
            {errors[field.id as keyof Values] && (
              <span className="text-xs text-red-600">
                {errors[field.id as keyof Values]?.message}
              </span>
            )}
          </div>
        ))}
      </div>

      <button
        type="submit"
        className="w-20 p-2 bg-[#6950e9] text-white rounded-md hover:bg-[#6950e9df] transition-colors"
      >
        {isUpdating ? 'Saving...' : 'Save'}
      </button>
    </form>
  );
};

export default ProfileForm;
