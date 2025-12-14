// المسار: src/components/ProviderDashboard.tsx
'use client';

import { useState, useEffect } from 'react';
import { useAccount, useReadContract } from 'wagmi';
import { formatUnits } from 'viem';
import { COMPUTE_STREAM_ABI } from '../abis/ComputeStreamABI';
import { toast } from 'sonner';
import { Share2, Wallet, Users, DollarSign, TrendingUp, ChevronLeft, ChevronRight } from 'lucide-react';
import { useSearchParams } from 'next/navigation';

// ⚠️ عنوان العقد V3
const CONTRACT_ADDRESS = "0x8AB7Ec66e306333Cba8855301FA448ba085114F1"; 

const ITEMS_PER_PAGE = 5; // عدد العناصر في الجدول

export function ProviderDashboard() {
  const { address } = useAccount();
  const searchParams = useSearchParams();

  const [rateInput, setRateInput] = useState(searchParams.get('rate') || '0.0001');
  const [globalEarnings, setGlobalEarnings] = useState(0);
  const [globalRunRate, setGlobalRunRate] = useState(0);
  const [now, setNow] = useState(Math.floor(Date.now() / 1000));
  const [currentPage, setCurrentPage] = useState(1); // ✅ حالة الصفحة

  const { data: myProviderStreams, refetch } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: COMPUTE_STREAM_ABI,
    functionName: 'getMyStreamsAsProvider',
    args: [address as `0x${string}`],
    query: { enabled: !!address, refetchInterval: 3000 }
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setNow(Math.floor(Date.now() / 1000));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (myProviderStreams) {
      let totalAccrued = 0;
      let currentRate = 0;

      myProviderStreams.forEach((stream) => {
          const rateVal = Number(formatUnits(stream.ratePerSecond, 6));
          if (stream.isActive) {
              const start = Number(stream.startTime);
              const depositVal = Number(formatUnits(stream.depositAmount, 6));
              const elapsed = Math.max(0, now - start);
              const cost = elapsed * rateVal;
              if (cost < depositVal) {
                  totalAccrued += cost;
                  currentRate += rateVal;
              } else {
                  totalAccrued += depositVal; 
              }
          } else {
              totalAccrued += Number(formatUnits(stream.amountPaid, 6));
          }
      });
      setGlobalEarnings(totalAccrued);
      setGlobalRunRate(currentRate);
    }
  }, [now, myProviderStreams]);

  const copyPaymentLink = () => {
    const url = `${window.location.origin}?provider=${address}&rate=${rateInput}`;
    navigator.clipboard.writeText(url);
    toast.success("Link Copied!");
  };

  const getStreamMetrics = (stream: any) => {
    const rateVal = Number(formatUnits(stream.ratePerSecond, 6));
    const start = Number(stream.startTime);
    let earned = 0;
    let duration = 0;
    let statusLabel = "Active";
    let statusColor = "text-emerald-400 bg-emerald-900/30";

    if (stream.isActive) {
        const depositVal = Number(formatUnits(stream.depositAmount, 6));
        const elapsed = Math.max(0, now - start);
        const cost = elapsed * rateVal;

        if (cost >= depositVal) {
            earned = depositVal;
            duration = depositVal / rateVal;
            statusLabel = "Depleted";
            statusColor = "text-orange-400 bg-orange-900/20";
        } else {
            earned = cost;
            duration = elapsed;
        }
    } else {
        earned = Number(formatUnits(stream.amountPaid, 6));
        duration = rateVal > 0 ? earned / rateVal : 0;
        statusLabel = "Closed";
        statusColor = "text-red-500 bg-red-900/20";
    }

    return { earned, duration, statusLabel, statusColor, rateVal };
  };

  const formatDuration = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = Math.floor(seconds % 60);
    return `${h}h ${m}m ${s}s`;
  };

  // ✅ Pagination Logic
  const reversedStreams = myProviderStreams ? [...myProviderStreams].reverse() : [];
  const totalPages = Math.ceil(reversedStreams.length / ITEMS_PER_PAGE);
  const paginatedStreams = reversedStreams.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <div className="space-y-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition"><DollarSign className="w-16 h-16 text-emerald-400" /></div>
                <label className="text-xs text-slate-500 uppercase font-bold">LIFETIME EARNINGS</label>
                <div className="text-3xl font-mono font-bold text-emerald-400 mt-2">
                    {globalEarnings.toFixed(4)} <span className="text-sm text-slate-500">USDC</span>
                </div>
            </div>

            <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition"><TrendingUp className="w-16 h-16 text-blue-400" /></div>
                <label className="text-xs text-slate-500 uppercase font-bold">CURRENT RUN RATE</label>
                <div className="text-3xl font-mono font-bold text-blue-400 mt-2">
                    {globalRunRate.toFixed(4)} <span className="text-sm text-slate-500">USDC/s</span>
                </div>
            </div>

            <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition"><Users className="w-16 h-16 text-purple-400" /></div>
                <label className="text-xs text-slate-500 uppercase font-bold">PAYING CLIENTS</label>
                <div className="text-3xl font-mono font-bold text-purple-400 mt-2">
                    {myProviderStreams ? myProviderStreams.filter(s => getStreamMetrics(s).statusLabel === "Active").length : 0}
                </div>
            </div>
        </div>

        {/* Tools & Table */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1 bg-slate-900 border border-slate-800 p-6 rounded-2xl h-fit">
                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2"><Wallet className="w-5 h-5 text-purple-400"/> Get Paid</h3>
                <div className="mb-4">
                    <label className="text-xs text-slate-500 uppercase font-bold">Set Rate (USDC/sec)</label>
                    <input type="number" value={rateInput} onChange={(e) => setRateInput(e.target.value)} 
                        className="w-full mt-1 bg-slate-950 border border-slate-700 p-2 rounded text-white" />
                </div>
                <button onClick={copyPaymentLink} className="w-full bg-purple-600 hover:bg-purple-500 text-white py-3 rounded-lg font-bold transition flex justify-center items-center gap-2">
                    <Share2 className="w-4 h-4" /> Copy Link
                </button>
            </div>

            {/* Detailed Streams Table with Pagination */}
            <div className="lg:col-span-2 bg-slate-900 border border-slate-800 p-6 rounded-2xl flex flex-col justify-between">
                <div>
                    <div className="flex justify-between items-center mb-4">
                        <div className="flex items-baseline gap-2">
                            <h3 className="text-lg font-bold text-white">Incoming Streams</h3>
                            <span className="text-xs text-slate-500">({reversedStreams.length} Total)</span>
                        </div>
                        <button onClick={() => refetch()} className="text-xs bg-slate-800 px-3 py-1 rounded hover:bg-slate-700">Refresh</button>
                    </div>
                    
                    <div className="overflow-x-auto min-h-[300px]">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="text-xs text-slate-500 border-b border-slate-800">
                                    <th className="pb-2 pl-2">ID</th>
                                    <th className="pb-2">CLIENT</th>
                                    <th className="pb-2 text-center">DURATION</th>
                                    <th className="pb-2 text-right">EARNED</th>
                                    <th className="pb-2 text-right">RATE</th>
                                    <th className="pb-2 text-center">STATUS</th>
                                </tr>
                            </thead>
                            <tbody className="text-sm">
                                {paginatedStreams.length > 0 ? (
                                    paginatedStreams.map((stream) => {
                                        const metrics = getStreamMetrics(stream);
                                        return (
                                        <tr key={stream.id.toString()} className="border-b border-slate-800/50 hover:bg-slate-800/30 transition">
                                            <td className="py-3 pl-2 font-mono text-slate-400">#{stream.id.toString()}</td>
                                            <td className="py-3 font-mono text-xs text-slate-500 truncate max-w-[80px]" title={stream.consumer}>
                                                {stream.consumer.substring(0, 6)}...
                                            </td>
                                            <td className="py-3 text-center font-mono text-slate-300">
                                                {formatDuration(metrics.duration)}
                                            </td>
                                            <td className="py-3 text-right font-bold text-emerald-400 font-mono">
                                                {metrics.earned.toFixed(4)}
                                            </td>
                                            <td className="py-3 text-right text-slate-400 text-xs">
                                                {metrics.rateVal}
                                            </td>
                                            <td className="py-3 text-center">
                                                <span className={`px-2 py-1 rounded text-[10px] font-bold border border-transparent ${metrics.statusColor}`}>
                                                    {metrics.statusLabel}
                                                </span>
                                            </td>
                                        </tr>
                                    )})
                                ) : (
                                    <tr>
                                        <td colSpan={6} className="py-8 text-center text-slate-500">No streams yet.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* ✅ Pagination Controls */}
                {totalPages > 1 && (
                  <div className="flex justify-between items-center mt-4 pt-4 border-t border-slate-800/50">
                    <button 
                      onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                      className="p-2 rounded hover:bg-slate-800 disabled:opacity-30 disabled:hover:bg-transparent"
                    >
                      <ChevronLeft className="w-4 h-4 text-slate-400" />
                    </button>
                    
                    <span className="text-xs text-slate-500">
                      Page {currentPage} of {totalPages}
                    </span>

                    <button 
                      onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                      disabled={currentPage === totalPages}
                      className="p-2 rounded hover:bg-slate-800 disabled:opacity-30 disabled:hover:bg-transparent"
                    >
                      <ChevronRight className="w-4 h-4 text-slate-400" />
                    </button>
                  </div>
                )}
            </div>
        </div>
    </div>
  );
}