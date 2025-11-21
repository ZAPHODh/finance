import type { NextConfig } from "next";

// const cspHeader = `
//   default-src 'self';
//   script-src 'self';
//   style-src 'self';
//   img-src 'self' data: blob: https://lh3.googleusercontent.com https://graph.facebook.com;
//   font-src 'self';
//   connect-src 'self' https://api.stripe.com https://checkout.stripe.com https://app.posthog.com https://us.i.posthog.com https://openidconnect.googleapis.com https://accounts.google.com https://www.facebook.com https://graph.facebook.com;
//   frame-src https://checkout.stripe.com https://js.stripe.com;
//   frame-ancestors 'none';
//   object-src 'none';
//   base-uri 'self';
//   form-action 'self';
//   upgrade-insecure-requests;
// `;

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  // async headers() {
  // return [
  //   {
  //     source: '/:path*',
  //     headers: [
  //       {
  //         key: 'Content-Security-Policy',
  //         value: cspHeader.replace(/\n/g, ''),
  //       },
  //       {
  //         key: 'X-Frame-Options',
  //         value: 'SAMEORIGIN',
  //       },
  //       {
  //         key: 'X-Content-Type-Options',
  //         value: 'nosniff',
  //       },
  //       {
  //         key: 'Referrer-Policy',
  //         value: 'strict-origin-when-cross-origin',
  //       },
  //       {
  //         key: 'Permissions-Policy',
  //         value: 'camera=(), microphone=(), geolocation=()',
  //       },
  //     ],
  //   },
  // ];
  // },
};

export default nextConfig;
