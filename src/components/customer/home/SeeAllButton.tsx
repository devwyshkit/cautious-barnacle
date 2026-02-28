'use client';

import { useRouter } from 'next/navigation';
import { ChevronRight } from 'lucide-react';

/**
 * WYSHKIT 2026: Intent-Based Navigation - Uses routes instead of Zustand
 */
export function SeeAllButton() {
  const router = useRouter();
  
  return (
    <button 
      onClick={() => router.push('/search')}
      className="size-10 rounded-full bg-zinc-50 border border-zinc-100 flex items-center justify-center text-zinc-900 hover:bg-zinc-100 transition-colors"
    >
      <ChevronRight className="size-5" />
    </button>
  );
}
