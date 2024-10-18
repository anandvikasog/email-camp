/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      'res.cloudinary.com',
      'mirrorapp.s3.eu-north-1.amazonaws.com',
      'mirrorapp.s3.amazonaws.com',
    ], // Add the domain of your image source here
  },
};

export default nextConfig;
