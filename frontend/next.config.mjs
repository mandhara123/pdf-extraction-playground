// frontend/next.config.mjs

/** @type {import('next').NextConfig} */
const nextConfig = {
  // This is the key setting for CSS module resolution issues with external packages
  experimental: {
    // Tells Next.js to bypass the default CSS compilation for files outside of the source directory.
    // This is often needed for libraries like react-pdf that ship their own required CSS.
    allowExternalCms: true,
  },
};

export default nextConfig;