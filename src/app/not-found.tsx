import Link from 'next/link';
import { ShieldAlert, ArrowLeft, Terminal, Server, Activity, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function NotFound() {
  return (
    <div className="min-h-[100dvh] bg-[#F8F9FA] flex flex-col items-center justify-center p-6 font-sans select-none">
      <div className="w-full max-w-lg text-center space-y-8 animate-in fade-in zoom-in duration-500">
        {/* Command Center Icon */}
        <div className="relative inline-block">
          <div className="size-24 bg-[var(--primary-muted)] rounded-[var(--radius-md)] flex items-center justify-center shadow-[0_20px_50px_rgb(0_0_0/0.05)]">
            <ShieldAlert className="size-10 text-[var(--primary)]" />
          </div>
          <div className="absolute -bottom-2 -right-2 size-8 bg-[var(--surface)] rounded-[var(--radius-sm)] border-4 border-[#F8F9FA] flex items-center justify-center shadow-sm">
            <span className="text-xs font-black text-[var(--text-primary)]">404</span>
          </div>
        </div>

        <div className="space-y-4">
          <h1 className="text-4xl font-black text-[var(--text-primary)] tracking-tighter leading-none">
            Infrastructure <br />Gap Detected
          </h1>
          <p className="text-sm font-bold text-[var(--text-secondary)] max-w-xs mx-auto leading-relaxed">
            The requested surface is outside the Wyshkit Operational Perimeter.
            Redirecting to Bangalore Control is recommended.
          </p>
        </div>

        {/* Diagnostic Box - Terminal Grade (Light Refined) */}
        <div className="bg-[var(--surface-muted)] rounded-[var(--radius-md)] p-6 text-left font-mono space-y-3 border border-[var(--border)] shadow-sm relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
            <Server className="size-20 text-[var(--text-inverse)]" />
          </div>

          <div className="flex items-center justify-between border-b border-[var(--text-secondary)]/20 pb-3 mb-1">
            <div className="flex items-center gap-2">
              <Terminal className="size-3.5 text-[var(--primary)]" />
              <span className="text-xs text-[var(--primary)] font-black tracking-tight">Diagnostic Report</span>
            </div>
            <div className="flex gap-1.5">
              <div className="size-1.5 rounded-full bg-[var(--border)]" />
              <div className="size-1.5 rounded-full bg-[var(--border)]" />
              <div className="size-1.5 rounded-full bg-[var(--border)]" />
            </div>
          </div>

          <div className="space-y-1.5 relative z-10">
            <div className="flex items-center gap-3">
              <span className="text-xs text-[var(--text-secondary)] w-16 font-bold">Status</span>
              <span className="text-xs text-[var(--primary)] font-black tracking-tight bg-[var(--primary-muted)] px-1.5 py-0.5 rounded">Unreachable</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs text-[var(--text-secondary)] w-16 font-bold">Node</span>
              <span className="text-xs text-[var(--text-tertiary)] font-black tracking-tight">Bangalore_Hub_01</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs text-[var(--text-secondary)] w-16 font-bold">Code</span>
              <span className="text-xs text-[var(--primary)] font-black tracking-tight">ERR_SURFACE_UNMAPPED</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs text-[var(--text-secondary)] w-16 font-bold">Latency</span>
              <span className="text-xs text-[var(--text-tertiary)] font-black tracking-tight">0.00ms</span>
            </div>
          </div>

          <div className="pt-2 flex items-center gap-4 border-t border-[var(--text-primary)] mt-2">
            <div className="flex items-center gap-1.5">
              <Activity className="size-3 text-[var(--primary)]" />
              <span className="text-xs text-[var(--primary)]/70 font-bold tracking-tight">Network Active</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Globe className="size-3 text-[var(--text-secondary)]" />
              <span className="text-xs text-[var(--text-secondary)] font-bold tracking-tight">Global CDN Ready</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <Link href="/" className="w-full sm:w-auto">
            <Button className="w-full h-12 bg-[var(--text-primary)] text-[var(--text-inverse)] px-10 rounded-[var(--radius-md)] font-black text-xs tracking-tight flex items-center gap-3 shadow-sm hover:bg-[var(--text-primary)] transition-all active:scale-95">
              <ArrowLeft className="size-4" /> Return to Command
            </Button>
          </Link>
          <Button variant="outline" className="w-full sm:w-auto h-12 border-[var(--border)] rounded-[var(--radius-md)] px-10 font-black text-xs tracking-tight text-[var(--text-tertiary)] hover:bg-[var(--surface-muted)] transition-all">
            Contact Ops
          </Button>
        </div>
      </div>

      {/* Footer Branding */}
      <div className="fixed bottom-8 flex items-center gap-3">
        <div className="size-1 bg-[var(--success)] rounded-full animate-pulse" />
        <span className="text-xs font-black text-[var(--text-tertiary)] tracking-[0.3em]">Wyshkit Infrastructure 2026 • Alpha Build</span>
      </div>
    </div>
  );
}
