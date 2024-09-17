// 'use client';
// import React, { useState } from 'react';
// import { signIn } from 'next-auth/react';
// import { useRouter } from 'next/navigation';
// import axios from 'axios';
// import Image from 'next/image';
// import Link from 'next/link';
// import { useDarkMode } from '../../contexts/DarkModeContext'; // Adjust path as needed

// interface AuthFormProps {
//   type: 'signIn' | 'signUp';
//   title: string;
//   redirectTo: string;
//   apiEndpoint: string;
//   buttonText: string;
// }

// const AuthForm: React.FC<AuthFormProps> = ({
//   type,
//   title,
//   redirectTo,
//   apiEndpoint,
//   buttonText,
// }) => {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');

//   const { isDarkMode, toggleDarkMode } = useDarkMode();
//   const router = useRouter();

//   const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
//     event.preventDefault();

//     try {
//       const user = { email, password };
//       await axios.post(apiEndpoint, user);
//       router.push(redirectTo);
//     } catch (error) {
//       console.error('Error during authentication:', error);
//     }
//   };

//   return (
//     <div
//       className={`w-[50vw] relative flex items-center justify-center ${
//         isDarkMode ? 'bg-[#111828] text-white' : 'bg-white text-black'
//       }`}
//     >
//       <div className="w-3/5">
//         <label
//           htmlFor="darkModeToggle"
//           className="flex items-center cursor-pointer absolute top-2 right-2"
//         >
//           <span
//             className={`w-12 h-6 flex items-center bg-gray-300 rounded-full p-1 ${
//               isDarkMode ? 'bg-[#6950e9]' : ''
//             }`}
//           >
//             <span
//               className={`w-5 h-5 bg-white rounded-full shadow-md transform transition-transform ${
//                 isDarkMode ? 'translate-x-5' : 'translate-x-0'
//               }`}
//             />
//           </span>
//           <input
//             type="checkbox"
//             id="darkModeToggle"
//             className="sr-only"
//             checked={isDarkMode}
//             onChange={toggleDarkMode}
//           />
//         </label>

//         <div className="py-4">
//           <h3 className="text-2xl font-semibold py-2">{title}</h3>
//           <span className="text-xs text-gray-500">
//             {type === 'signUp' ? 'Already have an account?' : 'New user?'}
//           </span>
//           <span
//             className="text-[#6950e9] cursor-pointer text-xs"
//             onClick={() =>
//               router.push(type === 'signUp' ? '/login' : '/signup')
//             }
//           >
//             {type === 'signUp' ? 'Sign In' : 'Create an Account'}
//           </span>
//         </div>
//         <form onSubmit={handleSubmit} className="flex flex-col gap-y-4">
//           <h2 className="font-bold">
//             {type === 'signUp'
//               ? 'Register with your email id'
//               : 'Sign In with your email id'}
//           </h2>
//           <input
//             id="email"
//             type="email"
//             value={email}
//             onChange={(e) => setEmail(e.target.value)}
//             placeholder="Enter your email"
//             className={`w-full p-2 border rounded ${
//               isDarkMode ? 'bg-[#202938]' : 'bg-white'
//             }`}
//             required
//           />
//           <input
//             id="password"
//             type="password"
//             value={password}
//             onChange={(e) => setPassword(e.target.value)}
//             placeholder="Enter your password"
//             className={`w-full p-2 border rounded ${
//               isDarkMode ? 'bg-[#202938]' : 'bg-white'
//             }`}
//             required
//           />

//           {type === 'signIn' && (
//             <div className="flex items-center justify-between mb-6">
//               <label className="flex items-center ">
//                 <input type="checkbox" className="bg-black" />
//                 <span className="ml-2 text-sm text-gray-600">Remember Me?</span>
//               </label>
//               <a href="#" className="text-sm text-[#f26387] hover:underline">
//                 Forget Password?
//               </a>
//             </div>
//           )}
//           <button
//             type="submit"
//             className="w-full py-2 px-4 bg-[#6950e9] text-white rounded"
//           >
//             {buttonText}
//           </button>
//           {type === 'signUp' && (
//             <p className="text-gray-500 text-xs">
//               <span>By signing up, you agree </span>{' '}
//               <Link href="/" className="text-[#6950e9] hover:underline">
//                 Terms of Service
//               </Link>{' '}
//               <span>
//                 & your consent to receiving email communications from sales
//                 handy.
//               </span>
//             </p>
//           )}
//         </form>
//         <div className="mt-6 flex items-center justify-between">
//           <hr className="w-full" />
//           <span className="p-2 text-gray-400 text-xs">OR</span>
//           <hr className="w-full" />
//         </div>
//         <div className="flex justify-center mt-6 gap-x-4">
//           <button
//             aria-label="Sign in with Google"
//             className=""
//             onClick={() => signIn('google')}
//           >
//             <Image
//               src="/images/google-icon.svg"
//               alt="Google"
//               width={25}
//               height={25}
//             />
//           </button>
//           <button aria-label="Sign in with Facebook" className="">
//             <Image
//               src="/images/facebook-icon.svg"
//               alt="Facebook"
//               width={25}
//               height={25}
//             />
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AuthForm;

export const DividerCardList = [
  {
    title: '250K+',
    description: 'Verified Users',
    offerImageName: 'register.svg',
    ImageHeight: '54',
    ImageWidth: '54',
  },
];
