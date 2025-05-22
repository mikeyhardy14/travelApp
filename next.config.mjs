// next.config.mjs
/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
  
    // Subdomain configuration for app subdomain
    async rewrites() {
      const isDev = process.env.NODE_ENV === 'development';
      const baseUrl = isDev ? 'localhost:3000' : 'yourdomain.com'; // Replace with actual domain in production
      
      return [
        // For app subdomain, map /dashboard to /app/dashboard internally
        {
          source: '/dashboard',
          has: [
            {
              type: 'host',
              value: `app.${baseUrl}`,
            },
          ],
          destination: '/app/dashboard',
        },
        // For app subdomain, map /chat to /app/chat internally
        {
          source: '/chat',
          has: [
            {
              type: 'host',
              value: `app.${baseUrl}`,
            },
          ],
          destination: '/app/chat',
        },
        // For app subdomain, map /explore to /app/explore internally
        {
          source: '/explore',
          has: [
            {
              type: 'host',
              value: `app.${baseUrl}`,
            },
          ],
          destination: '/app/explore',
        },
        // Handle any nested paths within these sections
        {
          source: '/:section/:path*',
          has: [
            {
              type: 'host',
              value: `app.${baseUrl}`,
            },
          ],
          destination: '/app/:section/:path*',
        }
      ];
    },
  
    // Root path for app subdomain redirects to dashboard
    async redirects() {
      const isDev = process.env.NODE_ENV === 'development';
      const baseUrl = isDev ? 'localhost:3000' : 'yourdomain.com';
      
      return [
        {
          source: '/',
          has: [
            {
              type: 'host',
              value: `app.${baseUrl}`,
            },
          ],
          destination: '/dashboard',
          permanent: false,
        }
      ];
    },
  
    // Optimize output for production
    output: 'standalone',
  
    // Configure image domains if using next/image
    images: {
      domains: ['randomuser.me', 'example.com', 'img.icons8.com'],
    },
  
    // Enable SWC minification for faster builds
    swcMinify: true,
  };
  
  export default nextConfig;
  