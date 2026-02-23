'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { MappedPartner } from '@/lib/types/partner';
import { BlocksEngine } from '@/components/ui/BlocksEngine';
import { useRouter } from 'next/navigation';
import { useCartValidation } from '@/hooks/useCartValidation';
import { AlertCircle } from 'lucide-react';
import { triggerHaptic, HapticPattern } from '@/lib/utils/haptic';

const FALLBACK_IMAGE = '/images/logo.png';

interface PartnerStorePageProps {
  partnerId: string;
  initialData?: MappedPartner;
  blocks: any[];
}

export function PartnerStorePage({ partnerId, initialData, blocks }: PartnerStorePageProps) {
  const router = useRouter();

  // WYSHKIT 2026: Proactive Cart Validation
  const { isMismatch } = useCartValidation(partnerId);

  if (!initialData || !blocks) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] p-6 text-center bg-background">
        <p className="text-sm font-medium text-zinc-900">Partner data not available</p>
        <p className="text-xs text-zinc-500 mt-1">Try again in a moment</p>
        <Button onClick={() => router.refresh()} variant="link" className="text-xs mt-2">Try Again</Button>
      </div>
    );
  }

  return (
    <div className="animate-in fade-in duration-500 min-h-screen bg-white pb-24">
      {/* WYSHKIT 2026: Proactive Mismatch Nudge */}
      {isMismatch && (
        <div className="px-4 py-3 bg-amber-50 border-b border-amber-100 flex items-center justify-between gap-3 sticky top-0 z-[60]">
          <div className="flex items-center gap-2">
            <AlertCircle className="size-3.5 text-amber-600" />
            <p className="text-[10px] font-black text-amber-900 tracking-widest">Active cart at another store</p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              triggerHaptic(HapticPattern.ACTION);
              router.push('/checkout');
            }}
            className="h-7 px-3 text-[9px] font-black tracking-widest border-amber-200 bg-white text-amber-900"
          >
            View cart
          </Button>
        </div>
      )}

      {/* SDUI ENGINE RENDERING */}
      <BlocksEngine
        blocks={blocks}
        context={{
          partner_id: partnerId
        }}
      />
    </div>
  );
}
