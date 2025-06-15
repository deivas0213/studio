
import type {NextConfig} from 'next';
import pwa from 'next-pwa';

const nextConfigValues: NextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
    ],
  },
  experimental: {
    // This is the new configuration to allow specific development origins.
    // The origin comes from the warning log.
    allowedDevOrigins: [
      'https://6000-firebase-studio-1749947351721.cluster-axf5tvtfjjfekvhwxwkkkzsk2y.cloudworkstations.dev',
    ],
  },
};

let finalConfig: NextConfig = nextConfigValues;

// Only apply PWA configuration for production builds
if (process.env.NODE_ENV === 'production') {
  const withPWAConfigured = pwa({
    dest: 'public',
    register: true,
    skipWaiting: true,
    // The 'disable' option is not strictly needed here since this code path is only for production,
    // but next-pwa defaults to disabled in dev anyway if not explicitly enabled.
    // disable: process.env.NODE_ENV === 'development', 
  });
  finalConfig = withPWAConfigured(nextConfigValues);
} else {
  // In development (especially with Turbopack), we don't wrap with PWA
  // to avoid Webpack-specific configurations that Turbopack might warn about.
}

export default finalConfig;
