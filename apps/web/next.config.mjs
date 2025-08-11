/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'via.placeholder.com' }
    ]
  },
  headers: async () => [
    { source: '/manifest.json', headers: [{ key: 'content-type', value: 'application/manifest+json' }] }
  ],
};

export default nextConfig;