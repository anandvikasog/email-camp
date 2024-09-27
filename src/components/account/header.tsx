import React, { useState } from 'react';
import Image from 'next/image';
import { SlCalender } from 'react-icons/sl';
import { FiEdit } from 'react-icons/fi';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z as zod } from 'zod';
import { signUpSchema } from '@/lib/validationSchema';
import { useUpdateUserMutation } from '@/store/Features/auth/authApiSlice';
import SpinnerLoader from '../common/spinner-loader';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';

type Values = zod.infer<typeof signUpSchema>;

interface HeaderProps {
  userData: {
    profilePicture?: string;
    firstName?: string;
    lastName?: string;
    createdAt?: string;
  };
}

interface UpdateUserResponse {
  data?: {
    profilePicture?: string; // Adjust this type if the field might be null/undefined
  };
}

const Header: React.FC = () => {
  const [updateUser, { isLoading: isUpdating }] = useUpdateUserMutation();
  const {
    control,
    handleSubmit,
    setValue,
    trigger,
    formState: { errors },
  } = useForm<Values>({
    mode: 'onTouched',
    resolver: zodResolver(signUpSchema),
  });
  const defaultImage = '/images/defaultImage.png';

  const { firstName, lastName, profilePicture, createdAt } = useSelector(
    (store: RootState) => store.auth
  );

  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false); // Loading state
  const [imgSrc, setImgSrc] = useState(profilePicture || defaultImage);

  const fullName = `${firstName || ''} ${lastName || ''}`;

  // Format the date to "17 March 2024" if createdAt exists
  const formattedDate = createdAt
    ? new Date(createdAt).toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      })
    : 'Date not available';

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setValue('profilePicture', file);
        trigger('profilePicture');
      };
      reader.readAsDataURL(file);

      // Create FormData to send the file to the server
      const formData = new FormData();
      formData.append('profilePicture', file);
      setIsLoading(true);
      try {
        // Call the API to update the profile picture
        const response = (await updateUser(
          formData
        ).unwrap()) as UpdateUserResponse;

        // Update the local image source to reflect the new profile picture URL
        if (response.data?.profilePicture) {
          setImgSrc(response.data.profilePicture); // Assuming response contains the new image URL
        }
      } catch (error) {
        console.error('Error updating profile picture:', error);
      } finally {
        setIsLoading(false); // Reset loading state
      }
    }
  };

  const handleError = () => {
    setImgSrc(defaultImage); // Set fallback image if there's an error
  };
  return (
    <div className="bg-white rounded-lg shadow-lg flex flex-col items-center pb-4 max-md:hidden">
      <div className="relative w-full h-32 md:h-32 rounded-lg overflow-hidden bg-[url('/images/accountBackground.jpg')] bg-cover bg-center" />

      <div className="relative flex flex-col items-center mt-[-50px] md:mt-[-70px] px-4 w-full">
        <div className="relative rounded-full w-16 h-16 md:w-24 md:h-24 overflow-hidden">
          <Controller
            name="profilePicture"
            control={control}
            render={({ field }) => (
              <div className="">
                {isLoading ? (
                  <div className="flex items-center justify-center w-16 h-16 md:w-24 md:h-24">
                    <SpinnerLoader />
                  </div>
                ) : (
                  <label htmlFor="profileImageInput" className="cursor-pointer">
                    <Image
                      src={imgSrc}
                      alt="Profile picture"
                      layout="fill"
                      objectFit="cover"
                      className="cursor-pointer"
                      onError={handleError} // Fallback on error
                      onLoadingComplete={(result) => {
                        if (result.naturalWidth === 0) {
                          handleError(); // Handle case where image has a loading failure
                        }
                      }}
                    />

                    <div
                      className="absolute bottom-1 right-1 p-1 bg-white rounded-full shadow cursor-pointer"
                      onClick={() => setIsEditing(true)}
                    >
                      <FiEdit size={16} className="text-gray-700" />
                    </div>
                  </label>
                )}
                {isEditing && (
                  <input
                    id="profileImageInput"
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                )}
              </div>
            )}
          />
        </div>

        <h1 className="text-2xl font-semibold">{fullName || 'Anonymous'}</h1>
        <div className="flex items-center space-x-2 text-gray-500 mt-1 gap-x-6">
          <p className="flex gap-x-2 items-center">
            <SlCalender className="mr-1" />
            <span>Joined {formattedDate}</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Header;
