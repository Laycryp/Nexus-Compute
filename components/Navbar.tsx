// المسار: src/components/Navbar.tsx
'use client';

import Link from 'next/link';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import Image from 'next/image';

export function Navbar() {
  return (
    <nav className="w-full border-b border-slate-800 bg-slate-950/80 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20"> {/* زدنا الارتفاع هنا قليلاً */}
          
          {/* Logo & Name */}
          <Link href="/" className="flex items-center gap-4 group">
            {/* ✅ تكبير اللوقو هنا (w-12 h-12) */}
            <div className="relative w-12 h-12 rounded-xl overflow-hidden shadow-lg shadow-blue-900/20 group-hover:scale-105 transition duration-300">
              <Image 
                src="/logo.png" 
                alt="Nexus Compute Logo"
                fill
                className="object-cover"
              />
            </div>
            <span className="font-bold text-2xl text-white tracking-tight group-hover:text-blue-400 transition">
              Nexus Compute
            </span>
          </Link>

          {/* Wallet Button */}
          {/* ✅ زر المحفظة: تأكدنا من وجوده في الجانب الأيمن */}
          <div className="flex items-center">
            <ConnectButton 
              showBalance={{
                smallScreen: false,
                largeScreen: true,
              }}
              accountStatus={{
                smallScreen: 'avatar',
                largeScreen: 'full',
              }}
            />
          </div>

        </div>
      </div>
    </nav>
  );
}