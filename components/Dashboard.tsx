'use client';
import { useState } from 'react';
import { ClientDashboard } from './ClientDashboard';
import { ProviderDashboard } from './ProviderDashboard';
import { Zap, TrendingUp } from 'lucide-react';

export function Dashboard() {
  const [activeTab, setActiveTab] = useState<'client' | 'provider'>('client');

  return (
    <div className="w-full max-w-5xl mt-8">
      <div className="flex gap-4 mb-6 border-b border-slate-800 pb-2">
        <button onClick={() => setActiveTab('client')} className={`pb-2 px-4 font-bold flex items-center gap-2 transition ${activeTab === 'client' ? 'text-blue-400 border-b-2 border-blue-400' : 'text-slate-500'}`}>
          <Zap className="w-4 h-4" /> Client View
        </button>
        <button onClick={() => setActiveTab('provider')} className={`pb-2 px-4 font-bold flex items-center gap-2 transition ${activeTab === 'provider' ? 'text-purple-400 border-b-2 border-purple-400' : 'text-slate-500'}`}>
          <TrendingUp className="w-4 h-4" /> Provider Dashboard
        </button>
      </div>
      {activeTab === 'client' ? <ClientDashboard /> : <ProviderDashboard />}
    </div>
  );
}