import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Next.js dev config untuk akses jaringan lokal
  allowedDevOrigins: ['192.168.1.7', '192.168.18.43', 'localhost'],

  // Izinkan gambar dari domain Google (untuk foto profil akun Google)
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
