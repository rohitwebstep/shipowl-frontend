/** @type {import('next').NextConfig} */
const nextConfig = {
    trailingSlash: true, // Ensures static HTML file creation

    images: {
        unoptimized: true, // ✅ Disable Next.js image optimization
    },

   
};

module.exports = nextConfig; // ✅ Correct way to export config
