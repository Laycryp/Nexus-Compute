// المسار: src/components/ClientDashboard.tsx
'use client';

import { useState, useEffect } from 'react';
import { useWriteContract, useAccount, useReadContract } from 'wagmi';
import { parseUnits, formatUnits } from 'viem';
import { COMPUTE_STREAM_ABI, ERC20_ABI } from '../abis/ComputeStreamABI';
import { toast } from 'sonner';
import { Timer, Zap, AlertTriangle, RefreshCw, ChevronLeft, ChevronRight } from 'lucide-react';
import { useSearchParams } from 'next/navigation';

// ⚠️ عنوان العقد V3
const CONTRACT_ADDRESS = "0x8AB7Ec66e306333Cba8855301FA448ba085114F1"; 
const USDC_ADDRESS = "0x6d7f141b6819C2c9CC2f818e6ad549E7Ca090F8f";

const ITEMS_PER_PAGE = 5; // عدد العناصر في الصفحة الواحدة

export function ClientDashboard() {
  const { address } = useAccount();
  const searchParams = useSearchParams();
  const { writeContractAsync } = useWriteContract();

  // Inputs
  const [provider, setProvider] = useState(searchParams.get('provider') || '');
  const [rate, setRate] = useState(searchParams.get('rate') || '0.0001');
  const [deposit, setDeposit] = useState('10');
  
  // Monitor & Pagination State
  const [streamIdToMonitor, setStreamIdToMonitor] = useState<string>(''); 
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [currentCost, setCurrentCost] = useState(0);
  const [isDepleted, setIsDepleted] = useState(false);
  const [currentPage, setCurrentPage] = useState(1); // ✅ حالة الصفحة الحالية

  // Blockchain Reads
  const { data: myStreams, refetch: refetchList } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: COMPUTE_STREAM_ABI,
    functionName: 'getMyStreamsAsConsumer',
    args: [address as `0x${string}`],
    query: { enabled: !!address, refetchInterval: 3000 }
  });

  const { data: streamData, refetch: refetchStream } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: COMPUTE_STREAM_ABI,
    functionName: 'streams',
    args: streamIdToMonitor ? [BigInt(streamIdToMonitor)] : undefined,
    query: { enabled: !!streamIdToMonitor, refetchInterval: 1000 }
  });

  // Helpers
  const checkIsDepleted = (startTime: bigint, rate: bigint, deposit: bigint) => {
    const now = Math.floor(Date.now() / 1000);
    const elapsed = Math.max(0, now - Number(startTime));
    const cost = elapsed * Number(formatUnits(rate, 6));
    return cost >= Number(formatUnits(deposit, 6));
  };

  // ✅ Pagination Logic
  const reversedStreams = myStreams ? [...myStreams].reverse() : [];
  const totalPages = Math.ceil(reversedStreams.length / ITEMS_PER_PAGE);
  const paginatedStreams = reversedStreams.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  // Auto Select Latest (Only on first load or new stream)
  useEffect(() => {
    if (reversedStreams.length > 0) {
      const latest = reversedStreams[0];
      if (latest.id.toString() !== streamIdToMonitor && !streamIdToMonitor) {
          setStreamIdToMonitor(latest.id.toString());
      }
    }
  }, [myStreams]);

  // Live Timer
  useEffect(() => {
    if (!streamData) return;
    const [_, __, ___, ratePerSec, depositAmt, startTime, paidAmt, isActive] = streamData;
    
    if (isActive) {
      const start = Number(startTime);
      const interval = setInterval(() => {
        const now = Math.floor(Date.now() / 1000);
        const elapsed = now - start;
        setElapsedSeconds(elapsed > 0 ? elapsed : 0);
        const cost = elapsed * Number(formatUnits(ratePerSec, 6));
        setCurrentCost(cost);
        setIsDepleted(cost >= Number(formatUnits(depositAmt, 6)));
      }, 1000);
      return () => clearInterval(interval);
    } else {
      setIsDepleted(true);
      setCurrentCost(Number(formatUnits(paidAmt, 6))); 
    }
  }, [streamData]);

  // Handlers
  const handleApprove = async () => {
    try {
      toast.loading("Approving...");
      await writeContractAsync({ address: USDC_ADDRESS, abi: ERC20_ABI, functionName: 'approve', args: [CONTRACT_ADDRESS, parseUnits(deposit, 6)] });
      toast.dismiss(); toast.success("Approved!");
    } catch { toast.dismiss(); toast.error("Failed"); }
  };

  const handleCreateStream = async () => {
    try {
      toast.loading("Starting...");
      await writeContractAsync({ address: CONTRACT_ADDRESS, abi: COMPUTE_STREAM_ABI, functionName: 'createStream', args: [provider as `0x`, parseUnits(rate, 6), parseUnits(deposit, 6)] });
      toast.dismiss(); toast.success("Sent!");
      setCurrentPage(1); // العودة للصفحة الأولى عند إنشاء جديد
    } catch { toast.dismiss(); toast.error("Failed"); }
  };

  const handleStopStream = async () => {
    if (!streamIdToMonitor) return;
    try {
      toast.loading("Stopping...");
      await writeContractAsync({ address: CONTRACT_ADDRESS, abi: COMPUTE_STREAM_ABI, functionName: 'stopStream', args: [BigInt(streamIdToMonitor)] });
      toast.dismiss(); toast.success("Stopped!");
      refetchStream(); refetchList();
    } catch { toast.dismiss(); toast.error("Failed"); }
  };

  const depositVal = streamData ? Number(formatUnits(streamData[4], 6)) : 1;
  const progressPercent = (currentCost / depositVal) * 100;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Start Box */}
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl h-fit">
        <h2 className="text-xl font-bold text-blue-400 mb-6 flex items-center gap-2"><Zap className="w-5 h-5" /> Start New Stream</h2>
        <div className="space-y-4">
            <div>
                <label className="text-xs text-slate-500 font-bold">PROVIDER ADDRESS</label>
                <input type="text" value={provider} onChange={(e) => setProvider(e.target.value)} className="w-full bg-slate-950 border border-slate-700 p-3 rounded-lg text-sm text-white" />
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div><label className="text-xs text-slate-500 font-bold">RATE (USDC/S)</label><input type="number" value={rate} onChange={(e) => setRate(e.target.value)} className="w-full bg-slate-950 border border-slate-700 p-3 rounded-lg text-sm text-white" /></div>
                <div><label className="text-xs text-slate-500 font-bold">DEPOSIT (USDC)</label><input type="number" value={deposit} onChange={(e) => setDeposit(e.target.value)} className="w-full bg-slate-950 border border-slate-700 p-3 rounded-lg text-sm text-white" /></div>
            </div>

            <div className="bg-slate-800/50 p-3 rounded-lg text-xs text-slate-400 flex justify-between items-center border border-slate-700/50">
                <span className="font-bold flex items-center gap-2">⏱️ Estimated Runway:</span>
                <span className="text-emerald-400 font-mono font-bold text-sm">
                  {Number(rate) > 0 ? (Number(deposit) / Number(rate) / 3600).toFixed(2) + " Hours" : "Infinity"}
                </span>
            </div>

            <div className="flex gap-3 pt-2">
                <button onClick={handleApprove} className="flex-1 bg-slate-800 hover:bg-slate-700 text-white py-3 rounded-lg font-bold">1. Approve</button>
                <button onClick={handleCreateStream} className="flex-1 bg-blue-600 hover:bg-blue-500 text-white py-3 rounded-lg font-bold">2. Start</button>
            </div>
        </div>

        {/* History List with Pagination */}
        {myStreams && myStreams.length > 0 && (
            <div className="mt-6 border-t border-slate-800 pt-4">
                <div className="flex justify-between items-center mb-2">
                    <h3 className="text-sm font-bold text-slate-400">My Recent Streams</h3>
                    <span className="text-xs text-slate-600">Total: {myStreams.length}</span>
                </div>
                
                {/* List Container */}
                <div className="space-y-2 min-h-[300px]"> 
                    {paginatedStreams.map((s) => {
                        const dep = Number(formatUnits(s.depositAmount, 6));
                        const paid = Number(formatUnits(s.amountPaid, 6));
                        const refunded = dep - paid;
                        const isRunOut = s.isActive && checkIsDepleted(s.startTime, s.ratePerSecond, s.depositAmount);

                        return (
                        <div key={s.id.toString()} onClick={() => setStreamIdToMonitor(s.id.toString())}
                             className={`p-3 rounded-lg cursor-pointer flex flex-col gap-1 text-xs transition border ${streamIdToMonitor === s.id.toString() ? 'bg-blue-900/20 border-blue-500/50' : 'bg-slate-950 border-transparent hover:bg-slate-800'}`}>
                            
                            <div className="flex justify-between items-center">
                                <span className="font-mono text-slate-300 font-bold">#{s.id.toString()}</span>
                                {s.isActive ? (
                                    isRunOut ? <span className="text-orange-400 font-bold">● Depleted (Unsettled)</span> : <span className="text-emerald-400 font-bold">● Running</span>
                                ) : (
                                    <span className="text-red-400 font-bold">○ Stopped</span>
                                )}
                            </div>

                            {!s.isActive && (
                                <div className="flex justify-between text-[10px] bg-slate-900/50 p-1 rounded mt-1">
                                    <span className="text-red-300">Spent: {paid.toFixed(4)} $</span>
                                    <span className="text-emerald-300">Refund: {refunded.toFixed(4)} $</span>
                                </div>
                            )}
                        </div>
                    )})}
                </div>

                {/* ✅ Pagination Controls */}
                {totalPages > 1 && (
                  <div className="flex justify-between items-center mt-4 pt-2 border-t border-slate-800/50">
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
        )}
      </div>

      {/* Monitor (Right Side) */}
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl h-fit">
        <h2 className="text-xl font-bold text-emerald-400 mb-6 flex items-center gap-2"><Timer className="w-5 h-5" /> Live Monitor</h2>
        <div className="flex justify-between items-end mb-6">
             <div><label className="text-xs text-slate-500 font-bold">STREAM ID</label><div className="text-2xl font-mono text-white font-bold">{streamIdToMonitor || "--"}</div></div>
             <button onClick={() => { refetchStream(); refetchList(); }} className="p-2 bg-slate-800 rounded hover:bg-slate-700"><RefreshCw className="w-4 h-4 text-slate-400" /></button>
        </div>

        <div className="bg-black/40 rounded-xl p-6 flex flex-col items-center justify-center relative overflow-hidden border border-slate-800 min-h-[250px]">
           <div className="text-5xl font-mono font-bold text-white mb-2 tabular-nums">{new Date(elapsedSeconds * 1000).toISOString().substr(11, 8)}</div>
           <div className="text-sm text-slate-400 mb-6">Running Time</div>
           <div className="w-full space-y-4">
             <div className="flex justify-between text-sm"><span className="text-slate-400">Total Cost</span><span className="text-emerald-400 font-mono font-bold">{currentCost.toFixed(4)} USDC</span></div>
             <div className="relative w-full h-3 bg-slate-800 rounded-full overflow-hidden"><div className={`absolute top-0 left-0 h-full transition-all duration-1000 ${progressPercent > 90 ? 'bg-red-500' : 'bg-blue-500'}`} style={{ width: `${Math.min(progressPercent, 100)}%` }} /></div>
           </div>
           {/* Depletion Overlay */}
           {isDepleted && (
                <div className="absolute inset-0 bg-red-900/40 flex items-center justify-center backdrop-blur-sm">
                   <div className="bg-red-900 text-white px-4 py-2 rounded-full font-bold flex items-center gap-2 animate-pulse"><AlertTriangle className="w-4 h-4" /> Limit Reached</div>
                </div>
           )}
        </div>

        <button onClick={handleStopStream} disabled={!streamIdToMonitor} className="w-full mt-6 bg-red-900/50 hover:bg-red-600 border border-red-800 text-red-100 py-4 rounded-xl font-bold transition disabled:opacity-50">Stop & Settle</button>
      </div>
    </div>
  );
}