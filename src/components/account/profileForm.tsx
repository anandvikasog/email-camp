import React from 'react';
import { FaFacebook, FaTwitterSquare, FaInstagram } from 'react-icons/fa';

const ProfileForm = () => {
  const accountInfo = [
    {
      id: 'firstName',
      type: 'text',
      placeholder: 'First Name',
      required: true,
    },
    { id: 'lastName', type: 'text', placeholder: 'Last Name', required: false },
    {
      id: 'jobTitle',
      type: 'text',
      placeholder: 'Job Title',
      required: true,
    },
    {
      id: 'location',
      type: 'text',
      placeholder: 'Location',
      required: true,
    },
    {
      id: 'about',
      type: 'textarea',
      placeholder: 'About',
      required: true,
    },
  ];

  const professionalInfo = [
    {
      id: 'firstName',
      type: 'text',
      placeholder: 'First Name',
      required: true,
    },
    {
      id: 'firstJob',
      type: 'text',
      placeholder: 'Is this your first job?',
      required: false,
    },
    {
      id: 'flexible',
      type: 'text',
      placeholder: 'Are you flexible?',
      required: true,
    },
    {
      id: 'remote',
      type: 'text',
      placeholder: 'Do you work remotely?',
      required: true,
    },
  ];

  const socialProfiles = [
    {
      id: 'facebook',
      type: 'url',
      placeholder: 'Facebook URL',
      required: true,
      icon: <FaFacebook />,
    },
    {
      id: 'twitter',
      type: 'url',
      placeholder: 'Twitter URL',
      required: true,
      icon: <FaTwitterSquare className="rounded-full" />,
    },
    {
      id: 'instagram',
      type: 'url',
      placeholder: 'Instagram URL',
      required: true,
      icon: <FaInstagram />,
    },
  ];

  return (
    <form className="space-y-6">
      <h2 className="text-xl font-semibold mb-4">
        Edit your account information
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {accountInfo.map((field) => (
          <div
            key={field.id}
            className={field.type === 'textarea' ? 'md:col-span-2' : ''}
          >
            {field.type === 'textarea' ? (
              <textarea
                id={field.id}
                rows={4}
                className="w-full p-2 border border-gray-300 rounded-md"
                placeholder={field.placeholder}
                required={field.required}
              />
            ) : (
              <input
                id={field.id}
                type={field.type}
                className="w-full p-2 border border-gray-300 rounded-md"
                placeholder={field.placeholder}
                required={field.required}
              />
            )}
          </div>
        ))}
      </div>

      <h2 className="text-xl font-semibold mb-4">Professional Information</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {professionalInfo.map((field) => (
          <div key={field.id}>
            <input
              id={field.id}
              type={field.type}
              className="w-full p-2 border border-gray-300 rounded-md"
              placeholder={field.placeholder}
              required={field.required}
            />
          </div>
        ))}
      </div>

      <h2 className="text-xl font-semibold mb-4">Social Profiles</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {socialProfiles.map((field) => (
          <div key={field.id} className="relative flex items-center">
            <span className="absolute left-4 text-gray-500">{field.icon}</span>
            <input
              id={field.id}
              type={field.type}
              className="w-full p-2 pl-10 border border-gray-300 rounded-md"
              placeholder={field.placeholder}
              required={field.required}
            />
          </div>
        ))}
      </div>

      <button
        type="submit"
        className="w-16 p-2 bg-[#6950e9] text-white rounded-md hover:bg-[#6950e9df] transition-colors"
      >
        Save
      </button>
      <button className="w-20 p-2 mx-4   border border-gray-300 rounded-md hover:bg-gray-200">
        Cancel
      </button>
    </form>
  );
};

export default ProfileForm;
