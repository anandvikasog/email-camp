export const paths = {
  public: {
    signIn: '/login',
    signUp: '/register',
    forgetPassword: '/forgot-password',
    resetPassword: '/reset-password',
  },
  private: {
    dashboard: '/dashboard',
    payment: '/payment',
    account: '/account',
  },
  common: {
    home: '/',
    tnc: '/tnc',
    error: '/500-error',
    emailVerify: '/email-verified',
  },
} as const;

export const apiPaths = {
  user: {
    signup: '/user',
    login: '/user/login',
    socialLogin: '/user/login/social',
    forgetPassword: '/user/forget-password',
    resetPassword: '/user/reset-password',
    verifyEmail: '/user/verify-email',
    resendVerifyEmail: '/user/verify-email/resend',
    verifySession: '/user/verify-session',
    verifyForgetPassword: '/user/forget-password/verify',
  },
  plan: {
    planList: '/plan',
    subscribe: '/subscribe',
  },
} as const;
