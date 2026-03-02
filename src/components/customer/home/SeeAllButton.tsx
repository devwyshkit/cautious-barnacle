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
      className="size-10 rounded-full bg-[var(--surface-muted)] border border-[var(--border)] flex items-center justify-center text-[var(--text-primary)] hover:bg-[var(--surface-muted)] transition-colors"
    >
      <ChevronRight className="size-5" />
    </button>
  );
}
