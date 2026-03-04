'use client';

import { ChevronRight } from 'lucide-react';
import { useUI } from '@/providers/UIProvider';
import { triggerHaptic, HapticPattern } from '@/lib/utils/haptic';

/**
 * WYSHKIT 2026: Intent-Based Navigation
 */
export function SeeAllButton() {
  const { openSearchSheet } = useUI();

  return (
    <button
      onClick={() => {
        triggerHaptic(HapticPattern.ACTION);
        openSearchSheet();
      }}
      className="size-10 rounded-full bg-[var(--surface-muted)] border border-[var(--border)] flex items-center justify-center text-[var(--text-primary)] hover:bg-[var(--surface-muted)] transition-colors active:scale-95"
    >
      <ChevronRight className="size-5" />
    </button>
  );
}
