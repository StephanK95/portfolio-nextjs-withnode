import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
    images: {
        formats: ['image/avif', 'image/webp'],
        unoptimized: true,
    },
    // Ensure JSON data files are included in the Vercel serverless function bundle
    outputFileTracingIncludes: {
        '/api/expenses': ['./src/data/*.json'],
        '/api/expenses/external': ['./src/data/*.json'],
        '/api/expenses/stream': ['./src/data/*.json'],
        '/api/auth': ['./src/data/*.json'],
    },
};

export default nextConfig;
