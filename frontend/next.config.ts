import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  async redirects() {
    return [
      {
        source: '/teacher/validate',
        destination: '/teacher/submit',
        permanent: true,
      },
      {
        source: '/admin',
        destination: '/admin/courses',
        permanent: true,
      }
    ]
  }
};

export default nextConfig;
