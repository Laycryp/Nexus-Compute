// المسار: src/app/page.tsx
'use client';

import { useAccount } from 'wagmi';
import { useState } from 'react';
import { ClientDashboard } from '../components/ClientDashboard';
import { ProviderDashboard } from '../components/ProviderDashboard';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { Rocket, Server, ShieldCheck } from 'lucide-react'; // أيقونات جمالية

export default function Home() {
  const { isConnected } = useAccount();
  const [view, setView] = useState<'client' | 'provider'>('client');

  // 1. حالة الزائر (غير متصل): عرض صفحة الهبوط الترحيبية
  if (!isConnected) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] text-center space-y-12 animate-fade-in-up">
        
        {/* Hero Section */}
        <div className="space-y-6 max-w-3xl">
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-white drop-shadow-2xl">
            Nexus <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600">Compute</span>
          </h1>
          <p className="text-slate-400 text-lg md:text-2xl leading-relaxed">
            The decentralized spot compute market on <span className="text-white font-semibold">Codex Chain</span>.
            <br />
            Rent high-performance GPUs by the second, fully permissionless.
          </p>
        </div>

        {/* Call to Action: Connect Button - (تم إزالة الرمز هنا) */}
        <div className="transform scale-125 transition hover:scale-130">
          <ConnectButton label="Launch App" />
        </div>

        {/* Features Grid (Optional: Adds professional look) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16 w-full max-w-5xl px-4">
          <div className="bg-slate-900/50 p-6 rounded-2xl border border-slate-800 backdrop-blur-sm">
            <Rocket className="w-10 h-10 text-blue-500 mb-4 mx-auto" />
            <h3 className="text-white font-bold mb-2">Instant Access</h3>
            <p className="text-slate-500 text-sm">No approvals, no contracts. Just connect and compute immediately.</p>
          </div>
          <div className="bg-slate-900/50 p-6 rounded-2xl border border-slate-800 backdrop-blur-sm">
            <Server className="w-10 h-10 text-purple-500 mb-4 mx-auto" />
            <h3 className="text-white font-bold mb-2">Provider Rewards</h3>
            <p className="text-slate-500 text-sm">Monetize your idle hardware. Earn USDC for every second of runtime.</p>
          </div>
          <div className="bg-slate-900/50 p-6 rounded-2xl border border-slate-800 backdrop-blur-sm">
            <ShieldCheck className="w-10 h-10 text-emerald-500 mb-4 mx-auto" />
            <h3 className="text-white font-bold mb-2">Trustless Payments</h3>
            <p className="text-slate-500 text-sm">Funds are streamed on-chain. Stop anytime and get refunded instantly.</p>
          </div>
        </div>

      </div>
    );
  }

  // 2. حالة المستخدم (متصل): عرض لوحة التحكم (التطبيق الفعلي)
  return (
    <div className="w-full max-w-6xl space-y-8 animate-fade-in">
      {/* View Switcher */}
      <div className="flex border-b border-slate-800 mb-8">
        <button
          onClick={() => setView('client')}
          className={`pb-4 px-6 text-sm font-bold transition ${
            view === 'client'
              ? 'text-white border-b-2 border-blue-500'
              : 'text-slate-500 hover:text-slate-300'
          }`}
        >
          ⚡ Client View
        </button>
        <button
          onClick={() => setView('provider')}
          className={`pb-4 px-6 text-sm font-bold transition ${
            view === 'provider'
              ? 'text-white border-b-2 border-purple-500'
              : 'text-slate-500 hover:text-slate-300'
          }`}
        >
          📈 Provider Dashboard
        </button>
      </div>

      {/* Main Content */}
      {view === 'client' ? <ClientDashboard /> : <ProviderDashboard />}
    </div>
  );
}