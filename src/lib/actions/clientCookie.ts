import { cookies } from 'next/headers';

export const getClientCookies = () => {
  // Get all client cookies
  const cookieStore = cookies();
  const allCookies = cookieStore.getAll();

  // Format cookies as a single string for the "Cookie" header
  const cookieHeader = allCookies
    .map((cookie) => `${cookie.name}=${cookie.value}`)
    .join('; ');

  return cookieHeader;
};
