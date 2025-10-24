/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    reactCompiler: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'hub.ruadebaixo.com.br',
        port: '1002',
        pathname: '/api/files/**',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '3000',
        pathname: '/api/files/**',
      },
      {
        protocol: 'https',
        hostname: 'lumentosh.com',
        port: '',
        pathname: '/api/files/**',
      },
      {
        protocol: 'http',
        hostname: '192.168.15.8',
        port: '3000',
        pathname: '/api/files/**',
      },
    ],
  },
};

export default nextConfig;
