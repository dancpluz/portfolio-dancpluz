/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'hub.ruadebaixo.com.br',
        port: '1002',
        pathname: '/api/files/**',
      },
    ],
  },
};

export default nextConfig;
