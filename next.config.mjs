/** @type {import('next').NextConfig} */
const nextConfig = {
  // Ensure clean builds by disabling build cache if needed
  experimental: {
    // Enable if needed for debugging
    // forceSwcTransforms: true,
  },
  // Ensure proper route handling
  trailingSlash: false,
  // Clean build output
  distDir: '.next',
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
}

export default nextConfig
