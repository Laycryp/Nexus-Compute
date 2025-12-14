import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  webpack: (config) => {
    // نخبر webpack بتجاهل هذه المكتبات لأنها غير ضرورية للمتصفح
    config.externals.push(
      "pino-pretty", 
      "lokijs", 
      "encoding",
      "@react-native-async-storage/async-storage" // 👈 هذا هو السطر الجديد الذي يحل المشكلة
    );
    return config;
  },
};

export default nextConfig;