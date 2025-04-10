/** @type {import('next').NextConfig} */
const nextConfig = {
    trailingSlash: true, // Ensures static HTML file creation

    images: {
        unoptimized: true, // ✅ Disable Next.js image optimization
        domains: ['sleeping-owl-we0m.onrender.com'], // ✅ Allow external image domain
    },

    reactStrictMode: false,
};

module.exports = nextConfig; // ✅ Correct way to export config
