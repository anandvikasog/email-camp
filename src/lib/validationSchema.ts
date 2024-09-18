import { z as zod } from 'zod';

// Define file size
const MAX_FILE_SIZE = 1024 * 1024 * 2; // 2 MB in bytes
const MIN_FILE_SIZE = 10 * 1024; // 10 KB in bytes

const emailValidation = zod
  .string()
  .min(1, { message: 'Email is required' })
  .email();
const passwordValidation = zod
  .string()
  .min(6, { message: 'Password should be at least 6 characters' });
const fullNameValidation = zod.string().min(1, { message: 'Name is required' });
const phoneValidation = zod.string().min(6, { message: 'Phone is required' });

export const forgetPasswordSchema = zod.object({
  email: emailValidation,
});

export const resetPasswordSchema = zod.object({
  password: passwordValidation,
});

export const signInSchema = zod.object({
  email: emailValidation,
  password: passwordValidation,
});

export const signUpSchema = zod.object({
  firstName: zod.string().min(1, 'First name is required'),
  lastName: zod
    .string()
    .min(2, 'Last name must be at least 2 characters')
    .max(20, 'Last name must be at most 20 characters')
    .optional()
    .or(zod.literal('')), // Allow empty string as optional
  email: emailValidation,
  password: passwordValidation,
  mobile: zod
    .string()
    .optional()
    .refine((value) => value === undefined || /^[0-9]{10}$/.test(value), {
      message: 'Mobile number must be exactly 10 digits',
    }),
  profilePicture: zod
    .instanceof(File, { message: 'Profile picture is required' }) // Ensure the profile picture is a file object
    .refine(
      (file) => file.size >= MIN_FILE_SIZE && file.size <= MAX_FILE_SIZE,
      `Profile picture must be between 10 KB and 2 MB`
    ),
});
