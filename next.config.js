/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  webpack(config) {
    return config;
  },
  async rewrites() {
    return [
      {
        source: '/api/video',
        destination: 'http://localhost:8000/video' // Direct URL to your API
      }
    ];
  }
};

module.exports = nextConfig;