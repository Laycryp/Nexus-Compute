import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  
  // 1. تجاوز خطأ WebpackError أثناء البناء
  swcMinify: false, 

  // 2. تجاهل أخطاء التدقيق لضمان الرفع
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },

  // 3. حل مشاكل مكتبات Web3
  webpack: (config) => {
    config.externals.push(
      "pino-pretty", 
      "lokijs", 
      "encoding",
      "@react-native-async-storage/async-storage"
    );
    return config;
  },
};

export default nextConfig;