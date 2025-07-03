/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites(){
    return [
      {
        source: '/api/:path*',
        destination: `${process.env.NEXT_PUBLIC_BASE_URL}/api/:path*` // Proxy to Backend
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
