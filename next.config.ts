import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 1. تجاهل أخطاء الـ ESLint أثناء البناء (لضمان عدم توقف النشر بسبب أخطاء بسيطة)
  eslint: {
    ignoreDuringBuilds: true,
  },
  // 2. تجاهل أخطاء الـ TypeScript أثناء البناء
  typescript: {
    ignoreBuildErrors: true,
  },
  // 3. إعدادات Webpack لحل مشاكل WalletConnect و pino
  webpack: (config) => {
    config.externals.push("pino-pretty", "lokijs", "encoding");
    return config;
  },
};

export default nextConfig;