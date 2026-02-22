'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ShieldAlert, RefreshCcw, Terminal, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { logger } from '@/lib/logging/logger';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const router = useRouter();
  useEffect(() => {
    logger.error('Global Error Boundary caught error', error);
  }, [error]);

  return (
    <div className="min-h-screen bg-[#F8F9FA] flex flex-col items-center justify-center p-6 font-sans">
      <div className="w-full max-w-lg text-center space-y-8">
        {/* Command Center Icon */}
        <div className="relative inline-block">
          <div className="size-24 bg-[#D91B24] rounded-[2rem] flex items-center justify-center shadow-sm shadow-red-100 animate-pulse">
            <AlertTriangle className="size-10 text-white" />
          </div>
          <div className="absolute -bottom-2 -right-2 size-8 bg-white rounded-lg border-4 border-[#F8F9FA] flex items-center justify-center">
            <span className="text-xs font-black text-[#D91B24]">ERR</span>
          </div>
        </div>

        <div className="space-y-4">
          <h1 className="text-4xl font-black text-zinc-900 tracking-tight">System Exception</h1>
          <p className="text-sm font-bold text-zinc-500 max-w-xs mx-auto leading-relaxed">
            The Wyshkit Infrastructure encountered a critical runtime exception. Operational continuity is compromised.
          </p>
        </div>

        {/* Diagnostic Box */}
        <div className="bg-zinc-900 rounded-xl p-6 text-left font-mono space-y-2 border border-zinc-800 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <Terminal className="size-3 text-red-500" />
            <span className="text-xs text-red-500 font-bold tracking-wider">Stack Trace / Diagnostics</span>
          </div>
          <p className="text-[11px] text-zinc-400 truncate"><span className="text-zinc-600">$</span> error: <span className="text-red-400">{error.message || 'Unknown Runtime Exception'}</span></p>
          <p className="text-[11px] text-zinc-400"><span className="text-zinc-600">$</span> digest: <span className="text-red-400">{error.digest || 'N/A'}</span></p>
          <p className="text-[11px] text-zinc-400"><span className="text-zinc-600">$</span> state: <span className="text-red-400">HALTED</span></p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <button
            onClick={() => reset()}
            className="px-8 h-12 bg-[var(--primary)] text-white font-black text-xs tracking-wider rounded-2xl active:scale-95 transition-all w-full md:w-auto"
          >
            <RefreshCcw className="size-4" /> Attempt Recovery
          </button>
          <Button
            variant="outline"
            onClick={() => router.push('/')}
            className="h-12 border-zinc-200 rounded-lg px-8 font-black text-[11px] tracking-wider text-zinc-400"
          >
            Abort to Home
          </Button>
        </div>
      </div>

      {/* Footer Branding */}
      <div className="fixed bottom-8 flex items-center gap-2">
        <span className="text-xs font-black text-zinc-300 tracking-[0.2em]">Wyshkit Infrastructure 2026</span>
      </div>
    </div>
  );
}
