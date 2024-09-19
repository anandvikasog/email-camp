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
  }),
});

export const {
  useCreateUserMutation,
  useLoginUserMutation,
  useSocialLoginUserMutation,
  useForgetPasswordMutation,
  useResetPasswordMutation,
  useGetPlanQuery,
  useSubscribeMutation,
} = authApiSlice;
