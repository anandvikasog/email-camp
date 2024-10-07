'use server';

import axiosInstance from '../axiosInstance';
import { apiPaths } from '@/paths';
import { getClientCookies } from './clientCookie';

export const getOneCampaign = async (id: string) => {
  try {
    const res = await axiosInstance.get(`${apiPaths.campaign.create}/${id}`, {
      headers: {
        Cookie: getClientCookies(),
      },
    });

    return JSON.stringify(res.data);
  } catch (error) {
    return JSON.stringify({ status: false });
  }
};
export const getConnectedEmailS = async () => {
  try {
    const res = await axiosInstance.get(apiPaths.email.connectEmail, {
      headers: {
        Cookie: getClientCookies(),
      },
    });

    return JSON.stringify(res.data);
  } catch (error) {
    return JSON.stringify({ status: false });
  }
};
