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
    changePassword: '/change-password',
    connectedEmails: '/connect-email',
    editConnectedEmail: (id: string) => `/connect-email/${id}`,
    connectNewEmails: '/connect-email/new',
    campaign: '/campaign',
    newCampaign: '/campaign/new',
    editCampaign: (id: string) => `/campaign/${id}`,
  },
  common: {
    home: '/',
    tnc: '/tnc',
    error: '/500-error',
    emailVerify: '/email-verified',
    awsEmailVerifySuccess: 'connected-email-verification/success',
    awsEmailVerifyFail: 'connected-email-verification/fail',
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
    changePassword: '/user/change-password',
  },
  plan: {
    planList: '/plan',
    subscribe: '/subscribe',
  },
  email: {
    connectEmail: '/connect-email',
    connectGoogle: '/connect-email/google',
    connectMicrosoft: '/connect-email/microsoft',
    connectCustom: '/connect-email/custom',
  },
  campaign: {
    create: '/campaign',
  },
} as const;
