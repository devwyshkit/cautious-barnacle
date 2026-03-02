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
    <div className="min-h-[100dvh] bg-[#F8F9FA] flex flex-col items-center justify-center p-6 font-sans">
      <div className="w-full max-w-lg text-center space-y-8">
        {/* Command Center Icon */}
        <div className="relative inline-block">
          <div className="size-24 bg-[#D91B24] rounded-xl flex items-center justify-center shadow-sm shadow-red-100 animate-pulse">
            <AlertTriangle className="size-10 text-white" />
          </div>
          <div className="absolute -bottom-2 -right-2 size-8 bg-[var(--surface)] rounded-lg border-4 border-[#F8F9FA] flex items-center justify-center">
            <span className="text-xs font-black text-[#D91B24]">ERR</span>
          </div>
        </div>

        <div className="space-y-4">
          <h1 className="text-4xl font-black text-[var(--text-primary)] tracking-tight">System Exception</h1>
          <p className="text-sm font-bold text-[var(--text-secondary)] max-w-xs mx-auto leading-relaxed">
            The Wyshkit Infrastructure encountered a critical runtime exception. Operational continuity is compromised.
          </p>
        </div>

        {/* Diagnostic Box */}
        <div className="bg-[var(--text-primary)] rounded-xl p-6 text-left font-mono space-y-2 border border-[var(--text-secondary)]/20 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <Terminal className="size-3 text-red-500" />
            <span className="text-xs text-red-500 font-bold tracking-tight">Stack Trace / Diagnostics</span>
          </div>
          <p className="text-xs text-[var(--text-tertiary)] truncate"><span className="text-[var(--text-secondary)]">$</span> error: <span className="text-red-400">{error.message || 'Unknown Runtime Exception'}</span></p>
          <p className="text-xs text-[var(--text-tertiary)]"><span className="text-[var(--text-secondary)]">$</span> digest: <span className="text-red-400">{error.digest || 'N/A'}</span></p>
          <p className="text-xs text-[var(--text-tertiary)]"><span className="text-[var(--text-secondary)]">$</span> state: <span className="text-red-400">HALTED</span></p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <button
            onClick={() => reset()}
            className="px-8 h-12 bg-[var(--primary)] text-white font-black text-xs tracking-tight rounded-xl active:scale-95 transition-all w-full md:w-auto"
          >
            <RefreshCcw className="size-4" /> Attempt Recovery
          </button>
          <Button
            variant="outline"
            onClick={() => router.push('/')}
            className="h-12 border-[var(--border)] rounded-lg px-8 font-black text-xs tracking-tight text-[var(--text-tertiary)]"
          >
            Abort to Home
          </Button>
        </div>
      </div>

      {/* Footer Branding */}
      <div className="fixed bottom-8 flex items-center gap-2">
        <span className="text-xs font-black text-[var(--text-tertiary)] tracking-tight">Wyshkit Infrastructure 2026</span>
      </div>
    </div>
  );
}
