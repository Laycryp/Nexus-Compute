// المسار: src/app/layout.tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import '@rainbow-me/rainbowkit/styles.css';
import { Providers } from './providers';
import { Toaster } from 'sonner';
import { Navbar } from '../components/Navbar'; // 👈 استيراد
import { Footer } from '../components/Footer'; // 👈 استيراد

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Nexus Compute | Decentralized Spot Market",
  description: "Rent GPU power by the second on Codex Chain.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} bg-slate-950 text-slate-50 min-h-screen flex flex-col`}>
        <Providers>
          <Navbar /> {/* 👈 الهيدر */}
          
          <main className="flex-grow flex flex-col items-center justify-center p-4">
            {children}
          </main>

          <Footer /> {/* 👈 الفوتر */}
          
          <Toaster position="bottom-right" theme="dark" />
        </Providers>
      </body>
    </html>
  );
}