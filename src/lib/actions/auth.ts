'use server';

import { cookies } from 'next/headers';
import axiosInstance from '../axiosInstance';
import { apiPaths } from '@/paths';
import { getSessionCookieName } from '~/utils/helper';

export const verifyEmail = async ({ code }: { code: string }) => {
  try {
    const res = await axiosInstance.post(apiPaths.user.verifyEmail, {
      token: code,
    });
    return JSON.stringify(res.data);
  } catch (error) {
    return JSON.stringify({ status: false });
  }
};

export const verifySession = async () => {
  try {
    const sessionCookie: any = cookies().get(getSessionCookieName());

    const res = await axiosInstance.post(apiPaths.user.verifySession, {
      sessionToken: sessionCookie.value,
    });
    return JSON.stringify(res.data);
  } catch (error: any) {
    return JSON.stringify({
      ...(error?.response?.data || {}),
    });
  }
};

export const verifyForgetPassword = async ({ code }: { code: string }) => {
  try {
    const res = await axiosInstance.post(apiPaths.user.verifyForgetPassword, {
      token: code,
    });
    return JSON.stringify(res.data);
  } catch (error) {
    return JSON.stringify({ status: false });
  }
};

export const socialLoginUser = async ({
  email,
  provider,
}: {
  email: string;
  provider: string;
}) => {
  try {
    const res = await axiosInstance.post(apiPaths.user.socialLogin, {
      email,
      provider,
    });
    return JSON.stringify(res.data);
  } catch (error) {
    return JSON.stringify({ status: false });
  }
};

export const getPlans = async () => {
  try {
    const res = await axiosInstance.get(apiPaths.plan.planList);
    return JSON.stringify(res.data);
  } catch (error) {
    return JSON.stringify({ status: false });
  }
};
