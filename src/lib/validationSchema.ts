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

const isValidFutureDate = (dateString: string | undefined): boolean => {
  if (!dateString) return false;
  const date = new Date(dateString);
  return !isNaN(date.getTime()) && date > new Date(); // Ensure it's a valid date and in the future
};

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
  countryCode: zod.string().min(1, 'Country code is required'),
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
  companyName: zod.string().min(1, 'Company name is required'),
});

// For profile update (password optional)
export const profileUpdateSchema = signUpSchema.extend({
  password: zod.string().optional().or(zod.literal('')), // Password not required here
  email: zod.string().optional().or(zod.literal('')), // Password not required here
  profilePicture: zod
    .instanceof(File, { message: 'Profile picture is required' }) // Ensure the profile picture is a file object
    .refine(
      (file) => file.size >= MIN_FILE_SIZE && file.size <= MAX_FILE_SIZE,
      `Profile picture must be between 10 KB and 2 MB`
    )
    .optional()
    .or(zod.literal('')),
  gender: zod.string().min(1, 'Gender is required'),
  about: zod
    .string()

    .optional()
    .or(zod.literal('')), // Allow empty string as optional
});

// Define the schema for form validation
export const changePasswordSchema = zod
  .object({
    oldPassword: zod
      .string()
      .min(6, 'Old Password must be at least 6 characters'),
    newPassword: zod
      .string()
      .min(6, 'New Password must be at least 6 characters'),
    confirmPassword: zod
      .string()
      .min(6, 'Confirm Password must be at least 6 characters'),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    path: ['confirmPassword'],
    message: 'Passwords do not match',
  });

export const connectEmailSchema = zod.object({
  email: emailValidation,
  smtpHost: zod.string().min(1, 'SMTP host is required'),
  smtpPort: zod.string().min(1, 'SMTP port is required'),
  smtpUsername: zod.string().min(1, 'SMTP username is required'),
  smtpPassword: zod.string().min(1, 'SMTP password is required'),
  imapHost: zod.string().min(1, 'IMAP host is required'),
  imapPort: zod.string().min(1, 'IMAP port is required'),
  imapUsername: zod.string().min(1, 'IMAP username is required'),
  imapPassword: zod.string().min(1, 'IMAP password is required'),
});

// export const connectEmailSchema = zod
//   .object({
//     email: emailValidation,
//     smtpServer: zod.string().optional(),
//     smtpPort: zod.string().optional(),
//     smtpPassword: zod.string().optional(),
//     imapServer: zod.string().optional(),
//     imapPort: zod.string().optional(),
//     imapPassword: zod.string().optional(),
//     domainType: zod.enum(['gmail', 'outlook', 'custom'], {
//       errorMap: () => ({ message: 'Please provide a valid domain.' }),
//     }),
//   })
//   .superRefine((data, ctx) => {
//     // Only perform additional checks if the domainType is 'custom'
//     if (data.domainType === 'custom') {
//       // Check if the custom SMTP/IMAP fields are filled
//       if (!data.smtpServer || data.smtpServer.trim() === '') {
//         ctx.addIssue({
//           code: zod.ZodIssueCode.custom,
//           message: 'SMTP Server is required for custom email providers.',
//           path: ['smtpServer'],
//         });
//       }
//       if (!data.smtpPort) {
//         ctx.addIssue({
//           code: zod.ZodIssueCode.custom,
//           message: 'SMTP Port is required for custom email providers.',
//           path: ['smtpPort'],
//         });
//       }
//       if (!data.smtpPassword) {
//         ctx.addIssue({
//           code: zod.ZodIssueCode.custom,
//           message: 'SMTP Password is required for custom email providers.',
//           path: ['smtpPassword'],
//         });
//       }
//       if (!data.imapServer) {
//         ctx.addIssue({
//           code: zod.ZodIssueCode.custom,
//           message: 'IMAP Server is required for custom email providers.',
//           path: ['imapServer'],
//         });
//       }
//       if (!data.imapPort) {
//         ctx.addIssue({
//           code: zod.ZodIssueCode.custom,
//           message: 'IMAP Port is required for custom email providers.',
//           path: ['imapPort'],
//         });
//       }
//       if (!data.imapPassword) {
//         ctx.addIssue({
//           code: zod.ZodIssueCode.custom,
//           message: 'IMAP Password is required for custom email providers.',
//           path: ['imapPassword'],
//         });
//       }
//     }
//   });

// Conditional validations for SMTP/IMAP settings if domainType is 'custom'

export const updateEmailSchema = zod.object({
  signature: zod
    .string()
    .min(10, { message: 'Body is required.' })
    .max(500, { message: 'Body must not exceed 500 characters.' }),
});

const timeIntervalSchema = zod
  .object({
    start: zod
      .string()
      .regex(/^\d{2}:\d{2}$/, 'Start time must be in HH:MM format.'),
    end: zod
      .string()
      .regex(/^\d{2}:\d{2}$/, 'End time must be in HH:MM format.'),
  })
  .refine(
    (data) => {
      const { start, end } = data;
      return start < end; // Check if start time is less than end time
    },
    {
      message: 'Start time must be before End time.',
      path: ['start'], // Path to place the error
    }
  );
const dayTimingSchema = zod.object({
  checked: zod.boolean(),
  intervals: zod
    .array(timeIntervalSchema)
    .min(1, 'At least one interval is required if checked is true.'),
});

const timingSchema = zod.object({
  mon: dayTimingSchema,
  tue: dayTimingSchema,
  wed: dayTimingSchema,
  thu: dayTimingSchema,
  fri: dayTimingSchema,
  sat: dayTimingSchema,
  sun: dayTimingSchema,
});

export const createCampeignSchema = zod.object({
  name: zod.string().min(2, 'Name should have at least 2 characters.'),
  fromEmail: zod.string(),
  timezone: zod.string(),
  mails: zod
    .array(
      zod.object({
        subject: zod
          .string()
          .min(10, 'Subject should have at least 10 characters.'),

        body: zod.string().min(50, 'Body should have at least 50 characters.'),

        sendAt: zod
          .string()
          .optional()
          .refine((val) => (val ? isValidFutureDate(val) : true), {
            message: 'Start At must be a valid future date.',
          }),

        gapType: zod.string().optional(),
        gapCount: zod.string().optional(),
        timing: timingSchema, // Include timing validation
      })
    )
    .min(1, 'Mails array must have at least one mail.')
    .refine((mails) => !!mails[0]?.sendAt, {
      message: 'Start At is required for the first mail.',
      path: [0, 'sendAt'], // Error in the first mail's `sendAt` field
    })
    .superRefine((mails, ctx) => {
      // Check mails after the first (index > 0)
      mails.slice(1).forEach((mail, index) => {
        if (!mail.gapType || !mail.gapCount) {
          // Add error to `gapType` if missing
          if (!mail.gapType) {
            ctx.addIssue({
              code: zod.ZodIssueCode.custom,
              message: 'Gap Type is required for mails after the first.',
              path: [index + 1, 'gapType'], // Offset by 1 since we're slicing
            });
          }
          // Add error to `gapCount` if missing
          if (!mail.gapCount) {
            ctx.addIssue({
              code: zod.ZodIssueCode.custom,
              message: 'Gap Count is required for mails after the first.',
              path: [index + 1, 'gapCount'], // Offset by 1 since we're slicing
            });
          }
        }
      });
    }),
});
