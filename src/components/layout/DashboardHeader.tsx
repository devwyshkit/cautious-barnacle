'use client';

import Link from 'next/link';
import Image from 'next/image';
import { User, Bell, Search } from 'lucide-react';

interface DashboardHeaderProps {
  type: 'admin' | 'vendor';
}

export function DashboardHeader({ type }: DashboardHeaderProps) {
  return (
    <header className="sticky top-0 z-[var(--z-nav)] bg-[var(--surface)] border-b border-[var(--border)] shadow-sm">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
        <div className="flex items-center gap-6">
          <Link href={`/${type}`} className="shrink-0 active:opacity-70 transition-opacity">
            <Image
              src="/images/logo-horizontal.png"
              alt="Wyshkit"
              width={120}
              height={30}
              className="h-8 w-auto"
              priority
            />
            <span className="text-[10px] uppercase font-black tracking-[0.05em] text-[var(--primary)] block -mt-1 opacity-80">
              {type === 'admin' ? 'Control Center' : 'Vendor Manager'}
            </span>
          </Link>
        </div>

        <div className="flex items-center gap-3 sm:gap-6">
          <button className="p-2 hover:bg-[var(--surface-muted)] rounded-full transition-all active:scale-95">
            <Search className="w-5 h-5 text-[var(--text-tertiary)] hover:text-[var(--text-primary)]" />
          </button>

          <button className="relative p-2 hover:bg-[var(--surface-muted)] rounded-full transition-all active:scale-95 group">
            <Bell className="w-5 h-5 text-[var(--text-tertiary)] group-hover:text-[var(--primary)]" />
            <span className="absolute top-2.5 right-2.5 w-1.5 h-1.5 bg-[var(--primary)] rounded-full border border-[var(--surface)] shadow-[0_0_8px_var(--primary)]" />
          </button>

          <Link
            href={`/${type}/profile`}
            className="flex items-center gap-2 text-sm font-bold text-[var(--text-secondary)] hover:text-[var(--primary)] transition-all group"
          >
            <div className="w-8 h-8 rounded-full bg-[var(--primary-muted)] flex items-center justify-center group-hover:bg-[var(--primary-ring)] transition-colors">
              <User className="w-4 h-4 text-[var(--primary)]" />
            </div>
            <span className="hidden sm:inline capitalize font-black tracking-tight">{type}</span>
          </Link>
        </div>
      </div>
    </header>
  );
}
