'use client';

import Link from 'next/link';
import Image from 'next/image';
import { User, Bell, Search } from 'lucide-react';

interface DashboardHeaderProps {
  type: 'admin' | 'partner';
}

export function DashboardHeader({ type }: DashboardHeaderProps) {
  return (
    <header className="sticky top-0 z-50 bg-white border-b border-zinc-100 shadow-sm">
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
            <span className="text-xs font-black tracking-wider text-primary block -mt-1">
                {type === 'admin' ? 'Control Center' : 'Partner Manager'}
              </span>
          </Link>
        </div>

        <div className="flex items-center gap-3 sm:gap-6">
          <button className="p-2 hover:bg-zinc-50 rounded-full transition-opacity">
            <Search className="w-5 h-5 text-zinc-600" />
          </button>
          
          <button className="relative p-2 hover:bg-zinc-50 rounded-full transition-opacity group">
            <Bell className="w-5 h-5 text-zinc-600 group-hover:text-primary" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-primary rounded-full border-2 border-white" />
          </button>

          <Link 
            href={`/${type}/profile`}
            className="flex items-center gap-2 text-sm font-bold hover:text-primary transition-opacity"
          >
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
              <User className="w-4 h-4 text-primary" />
            </div>
            <span className="hidden sm:inline capitalize">{type}</span>
          </Link>
        </div>
      </div>
    </header>
  );
}
