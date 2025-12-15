// المسار: src/components/Footer.tsx
'use client';

// حذفنا Twitter من هنا لأننا لن نستخدمه
import { Disc, Send, Youtube } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export function Footer() {
  return (
    <footer className="w-full border-t border-slate-800 bg-slate-950 pt-12 pb-8 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-start gap-8">
          
          {/* Brand & Description */}
          <div className="max-w-sm">
            <Link href="/" className="flex items-center gap-2 mb-4 group">
              {/* اللوقو */}
              <div className="relative w-20 h-20">
                 <Image 
                   src="/logo.png" 
                   alt="Nexus Compute Logo" 
                   fill 
                   className="object-contain" 
                 />
              </div>
              <span className="font-bold text-xl text-white group-hover:text-blue-200 transition">Nexus Compute</span>
            </Link>
            <p className="text-slate-400 text-sm leading-relaxed">
              Nexus Compute is a decentralized spot compute market on Codex Chain. 
              We empower AI developers to rent GPU power by the second, creating a permissionless infrastructure layer for the future.
            </p>
          </div>

          {/* Social Icons */}
          <div className="flex gap-4">
            {/* X (Twitter سابقا) - Active with your link */}
            <a 
                href="https://x.com/NexCompute"  // ✅ الرابط صحيح
                target="_blank" 
                rel="noopener noreferrer" 
                className="w-10 h-10 bg-slate-900 rounded-full flex items-center justify-center text-blue-400 hover:bg-blue-900/20 hover:text-blue-300 transition border border-slate-800">
              
              {/* أيقونة X الرسمية (SVG) */}
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z" />
              </svg>

            </a>

            {/* Discord (Inactive) */}
            <div className="w-10 h-10 bg-slate-900/50 rounded-full flex items-center justify-center text-slate-600 cursor-not-allowed border border-slate-800/50" title="Coming Soon">
              <Disc className="w-5 h-5" />
            </div>

            {/* Telegram (Inactive) */}
            <div className="w-10 h-10 bg-slate-900/50 rounded-full flex items-center justify-center text-slate-600 cursor-not-allowed border border-slate-800/50" title="Coming Soon">
              <Send className="w-5 h-5" />
            </div>

            {/* Youtube (Inactive) */}
            <div className="w-10 h-10 bg-slate-900/50 rounded-full flex items-center justify-center text-slate-600 cursor-not-allowed border border-slate-800/50" title="Coming Soon">
              <Youtube className="w-5 h-5" />
            </div>
          </div>

        </div>

        <div className="border-t border-slate-800 mt-12 pt-8 text-center">
          <p className="text-xs text-slate-600">
            © 2025 Nexus Compute. Built on Codex Chain.
          </p>
        </div>
      </div>
    </footer>
  );
}