import Link from 'next/link';
import { ShieldAlert, ArrowLeft, Terminal, Server, Activity, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#F8F9FA] flex flex-col items-center justify-center p-6 font-sans select-none">
      <div className="w-full max-w-lg text-center space-y-8 animate-in fade-in zoom-in duration-500">
        {/* Command Center Icon */}
        <div className="relative inline-block">
          <div className="size-24 bg-zinc-900 rounded-xl flex items-center justify-center shadow-[0_20px_50px_rgb(0_0_0/0.1)]">
            <ShieldAlert className="size-10 text-white" />
          </div>
          <div className="absolute -bottom-2 -right-2 size-8 bg-white rounded-lg border-4 border-[#F8F9FA] flex items-center justify-center shadow-sm">
            <span className="text-xs font-black text-zinc-900">404</span>
          </div>
        </div>

        <div className="space-y-4">
          <h1 className="text-4xl font-black text-zinc-900 tracking-tighter leading-none">
            Infrastructure <br/>Gap Detected
          </h1>
          <p className="text-[13px] font-bold text-zinc-500 max-w-xs mx-auto leading-relaxed">
            The requested surface is outside the Wyshkit Operational Perimeter. 
            Redirecting to Bangalore Control is recommended.
          </p>
        </div>

        {/* Diagnostic Box - Terminal Grade */}
        <div className="bg-zinc-950 rounded-xl p-6 text-left font-mono space-y-3 border border-zinc-800 shadow-sm relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
            <Server className="size-20 text-white" />
          </div>
          
          <div className="flex items-center justify-between border-b border-zinc-800 pb-3 mb-1">
            <div className="flex items-center gap-2">
              <Terminal className="size-3.5 text-emerald-500" />
              <span className="text-xs text-emerald-500 font-black tracking-tight">Diagnostic Report</span>
            </div>
            <div className="flex gap-1.5">
              <div className="size-1.5 rounded-full bg-red-500/50" />
              <div className="size-1.5 rounded-full bg-amber-500/50" />
              <div className="size-1.5 rounded-full bg-emerald-500/50" />
            </div>
          </div>
          
          <div className="space-y-1.5 relative z-10">
            <div className="flex items-center gap-3">
              <span className="text-xs text-zinc-600 w-16 font-bold">Status</span>
              <span className="text-xs text-red-500 font-black tracking-tight bg-red-500/10 px-1.5 py-0.5 rounded">Unreachable</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs text-zinc-600 w-16 font-bold">Node</span>
              <span className="text-xs text-zinc-300 font-black tracking-tight">Bangalore_Hub_01</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs text-zinc-600 w-16 font-bold">Code</span>
              <span className="text-xs text-emerald-500 font-black tracking-tight">ERR_SURFACE_UNMAPPED</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs text-zinc-600 w-16 font-bold">Latency</span>
              <span className="text-xs text-zinc-300 font-black tracking-tight">0.00ms</span>
            </div>
          </div>

          <div className="pt-2 flex items-center gap-4 border-t border-zinc-900 mt-2">
            <div className="flex items-center gap-1.5">
              <Activity className="size-3 text-emerald-500" />
              <span className="text-[11px] text-emerald-500/70 font-bold tracking-tight">Network Active</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Globe className="size-3 text-zinc-500" />
              <span className="text-[11px] text-zinc-500 font-bold tracking-tight">Global CDN Ready</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <Link href="/" className="w-full sm:w-auto">
            <Button className="w-full h-12 bg-zinc-900 text-white px-10 rounded-xl font-black text-[11px] tracking-tight flex items-center gap-3 shadow-sm hover:bg-zinc-800 transition-all active:scale-95">
              <ArrowLeft className="size-4" /> Return to Command
            </Button>
          </Link>
          <Button variant="outline" className="w-full sm:w-auto h-12 border-zinc-200 rounded-xl px-10 font-black text-[11px] tracking-tight text-zinc-400 hover:bg-zinc-50 transition-all">
            Contact Ops
          </Button>
        </div>
      </div>
      
      {/* Footer Branding */}
      <div className="fixed bottom-8 flex items-center gap-3">
        <div className="size-1 bg-emerald-500 rounded-full animate-pulse" />
        <span className="text-xs font-black text-zinc-300 tracking-[0.3em]">Wyshkit Infrastructure 2026 • Alpha Build</span>
      </div>
    </div>
  );
}
