import { IMail } from '@/app/(private)/(authLayout)/campaign/new/page';
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
    // New query to fetch a campaign by ID (draft)
    getCampaignById: builder.query({
      query: (id: string) => ({
        url: `${apiPaths.campaign.create}/${id}`, // Assuming this is the correct path
        method: 'GET',
      }),
    }),

    // Mutation to update a campaign
    // Mutation to update a campaign
    updateCampaign: builder.mutation({
      query: ({
        id,
        ...payload // Spread the rest of the payload
      }: {
        id: string;
        name: string;
        fromEmail: string;
        mails: IMail[];
      }) => ({
        url: `${apiPaths.campaign.create}/${id}`, // Use the campaign ID in the URL
        method: 'PUT',
        body: payload, // Send the remaining fields as the body
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
} = authApiSlice;
