// المسار: src/app/page.tsx
'use client'; // مهم جداً لأننا نستخدم hooks

import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount } from 'wagmi';
import { Dashboard } from '../components/Dashboard';

export default function Home() {
  const { isConnected } = useAccount();

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6 bg-slate-950 text-white">
      <div className="z-10 max-w-6xl w-full items-center flex flex-col gap-8">
        
        {/* Header */}
        <div className="flex flex-col items-center gap-2">
          <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">
            Codex Compute Market
          </h1>
          <p className="text-slate-500">Decentralized Spot Compute on Layer 2</p>
        </div>

        {/* Wallet Button */}
        <div className="border border-slate-800 p-4 rounded-2xl bg-slate-900/50 backdrop-blur">
          <ConnectButton />
        </div>

        {/* Show Dashboard ONLY if connected */}
        {isConnected && <Dashboard />}

      </div>
    </main>
  );
}
