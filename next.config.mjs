/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites(){
    return [
      {
        source: '/api/:path*',
        destination: `http://localhost:3001/api/:path*` // Proxy to Backend
      }
    ]
  },
  transpilePackages: ['framer-motion'],
    images: {
    domains: ['res.cloudinary.com'],
  },
  eslint: {
    ignoreDuringBuilds: true
  },
  
};

export default nextConfig;
