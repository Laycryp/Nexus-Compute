// المسار: src/app/layout.tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import '@rainbow-me/rainbowkit/styles.css';
import { Providers } from './providers';
import { Toaster } from 'sonner'; // 👈 استيراد جديد

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Codex Compute Market",
  description: "Spot compute market on Codex chain",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          {children}
          <Toaster position="bottom-right" theme="dark" /> {/* 👈 إضافة المكون هنا */}
        </Providers>
      </body>
    </html>
  );
}
