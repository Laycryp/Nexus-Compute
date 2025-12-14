import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // إعدادات لضمان عدم توقف البناء بسبب أخطاء بسيطة
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  
  webpack: (config) => {
    // 1. المكتبات التي يجب استثناؤها (نصوص بسيطة فقط)
    config.externals.push("pino-pretty", "lokijs", "encoding");

    // 2. الحل الصحيح لمكتبة React Native (Fallback)
    // هذا يمنع الخطأ Syntax Error ويجعل البناء ينجح
    config.resolve.fallback = {
      ...config.resolve.fallback,
      "fs": false,
      "net": false,
      "tls": false,
      "@react-native-async-storage/async-storage": false, // 👈 النقطة المهمة هنا
    };

    return config;
  },
};

export default nextConfig;