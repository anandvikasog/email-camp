import { IMail } from '@/components/private/campaign-form';
import { apiPaths } from '@/paths';
import apiSlice from '@/store/apiSlice';

export const authApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder: any) => ({
    createUser: builder.mutation({
      query: (payload: {
        fullName: string;
        email: string;
        password: string;
      }) => ({
        url: apiPaths.user.signup,
        method: 'POST',
        body: payload,
      }),
    }),
    resendVerifyEmail: builder.mutation({
      query: (payload: { userId: string }) => ({
        url: apiPaths.user.resendVerifyEmail,
        method: 'POST',
        body: payload,
      }),
    }),
    loginUser: builder.mutation({
      query: (payload: { email: string; password: string }) => ({
        url: apiPaths.user.login,
        method: 'POST',
        body: payload,
      }),
    }),
    socialLoginUser: builder.mutation({
      query: (payload: { email: string; password: string }) => ({
        url: apiPaths.user.socialLogin,
        method: 'POST',
        body: payload,
      }),
    }),
    forgetPassword: builder.mutation({
      query: (payload: { email: string }) => ({
        url: apiPaths.user.forgetPassword,
        method: 'POST',
        body: payload,
      }),
    }),
    resetPassword: builder.mutation({
      query: (payload: { password: string; token: string }) => ({
        url: apiPaths.user.resetPassword,
        method: 'POST',
        body: payload,
      }),
    }),
    getPlan: builder.query({
      query: () => apiPaths.plan.planList,
    }),
    subscribe: builder.mutation({
      query: (payload: {
        email: string;
        paymentMethodId: string;
        userId: string;
        priceId: string;
      }) => ({
        url: apiPaths.plan.subscribe,
        method: 'POST',
        body: payload,
      }),
    }),
    // New getUser query to fetch a user by userId
    getUser: builder.query({
      query: (userId: string) => ({
        url: `${apiPaths.user.signup}?userId=${userId}`,
        method: 'GET',
      }),
    }),
    // New updateUser mutation to update a user's profile
    updateUser: builder.mutation({
      query: (payload: FormData) => ({
        url: `${apiPaths.user.signup}`, // Replace with your actual update endpoint
        method: 'PUT',
        body: payload,
      }),
    }),
    changePassword: builder.mutation({
      query: (payload: { oldPassword: string; newPassword: string }) => ({
        url: apiPaths.user.changePassword,
        method: 'POST',
        body: payload,
      }),
    }),
    getConnectedEmail: builder.mutation({
      query: () => ({
        url: `${apiPaths.email.connectEmail}`,
        method: 'GET',
      }),
    }),
    queryConnectedEmail: builder.query({
      query: () => ({
        url: `${apiPaths.email.connectEmail}`,
        method: 'GET',
      }),
    }),
    connectEmail: builder.mutation({
      query: (payload: {
        email: string;
        signature: string;
        domain: string;
      }) => ({
        url: apiPaths.email.connectEmail,
        method: 'POST',
        body: payload,
      }),
    }),
    // New sendOtp mutation to request OTP
    sendOtp: builder.mutation({
      query: (payload: { email: string }) => ({
        url: apiPaths.email.connectCustomSendOtp, // Assuming sendOtp endpoint exists in apiPaths
        method: 'POST',
        body: payload,
      }),
    }),

    // New verifyOtp mutation to verify the OTP
    verifyOtp: builder.mutation({
      query: (payload: { email: string; otp: string }) => ({
        url: apiPaths.email.connectCustomVerifyOtp, // Assuming verifyOtp endpoint exists in apiPaths
        method: 'POST',
        body: payload,
      }),
    }),

    // PUT request for updating signature
    updateConnectedEmail: builder.mutation({
      query: (payload: { id: string; signature: string }) => ({
        url: `${apiPaths.email.connectEmail}`,
        method: 'PUT',
        body: { id: payload.id, signature: payload.signature },
      }),
    }),
    createCampaign: builder.mutation({
      query: (payload: {
        name: string;
        fromEmail: string;
        mails: IMail[];
      }) => ({
        url: apiPaths.campaign.create,
        method: 'POST',
        body: payload,
      }),
    }),
    getCampaign: builder.query({
      query: () => ({
        url: `${apiPaths.campaign.create}`,
        method: 'GET',
      }),
    }),
    getCampaignById: builder.query({
      query: (id: string) => ({
        url: `${apiPaths.campaign.create}/${id}`,
        method: 'GET',
      }),
    }),
    updateCampaign: builder.mutation({
      query: ({
        id,
        ...payload
      }: {
        id: string;
        name: string;
        fromEmail: string;
        mails: IMail[];
      }) => ({
        url: `${apiPaths.campaign.create}/${id}`,
        method: 'PUT',
        body: payload,
      }),
    }),
    connectGoogle: builder.mutation({
      query: (payload: { token: string }) => ({
        url: apiPaths.email.connectGoogle,
        method: 'POST',
        body: payload,
      }),
    }),
    connectMicrosoft: builder.mutation({
      query: (payload: { token: string }) => ({
        url: apiPaths.email.connectMicrosoft,
        method: 'POST',
        body: payload,
      }),
    }),
    connectCustom: builder.mutation({
      query: (payload: {
        email: string;
        smtpHost: string;
        smtpPort: string;
        smtpUsername: string;
        imapHost: string;
        imapPort: string;
        imapUsername: string;
        smtpPassword: string;
        imapPassword: string;
      }) => ({
        url: apiPaths.email.connectCustom,
        method: 'POST',
        body: payload,
      }),
    }),
  }),
});

export const {
  useCreateUserMutation,
  useResendVerifyEmailMutation,
  useLoginUserMutation,
  useSocialLoginUserMutation,
  useForgetPasswordMutation,
  useResetPasswordMutation,
  useGetPlanQuery,
  useSubscribeMutation,
  useGetUserQuery,
  useUpdateUserMutation,
  useChangePasswordMutation,
  useGetConnectedEmailMutation,
  useQueryConnectedEmailQuery,
  useConnectEmailMutation,
  useCreateCampaignMutation,
  useGetCampaignQuery,
  useGetCampaignByIdQuery,
  useUpdateCampaignMutation,
  useUpdateConnectedEmailMutation,
  useConnectGoogleMutation,
  useConnectMicrosoftMutation,
  useConnectCustomMutation,
  useSendOtpMutation, // Added for sending OTP
  useVerifyOtpMutation,
} = authApiSlice;
