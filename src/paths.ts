export const paths = {
  public: {
    signIn: '/login',
    signUp: '/register',
    emailVerify: '/email-verified',
    forgetPassword: '/forgot-password',
    resetPassword: '/reset-password',
  },
  private: {
    dashboard: '/dashboard',
    payment: '/payment',
  },
  common: {
    home: '/',
    tnc: '/tnc',
    error: '/500-error',
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
    verifySession: '/user/verify-session',
    verifyForgetPassword: '/user/forget-password/verify',
    buyPlan: '/user/buy-plan',
  },
} as const;
