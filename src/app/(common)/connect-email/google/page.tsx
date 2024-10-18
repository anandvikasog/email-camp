'use client';

import FullscreenLoader from '@/components/common/fullscreen-loader';
import { useEffect } from 'react';

const GoogleOAuthCallback = () => {
  useEffect(() => {
    const hash = window.location.hash;
    if (hash) {
      const params = new URLSearchParams(hash.substring(1));
      const accessToken = params.get('access_token');
      if (accessToken) {
        localStorage.setItem('google', JSON.stringify({ token: accessToken }));
        window.close();
      }
    }
  }, []);

  return <FullscreenLoader />;
};

export default GoogleOAuthCallback;
