'use client';

import React, { useEffect, useState } from 'react';
import { ItemDetailView } from '@/components/customer/item/ItemDetailView';
import { getItemWithFullSpec } from '@/lib/actions/discovery/items';
import { WyshkitItem } from '@/lib/types/item';
import { Loader2 } from 'lucide-react';
import { ResponsiveSurface } from '@/components/ui/ResponsiveSurface';
import { triggerHaptic, HapticPattern } from '@/lib/utils/haptic';

interface QuickItemSheetProps {
    itemId: string | null;
    open: boolean;
    onClose: () => void;
}

/**
 * WYSHKIT 2026: Quick Look Immersive Sheet
 * 
 * Swiggy 2026 Pattern: Maintain Context
 * - Clicking search results opens this sheet instead of navigating away.
 * - Handles data fetching for the full item spec internally.
 */
export function QuickItemSheet({ itemId, open, onClose }: QuickItemSheetProps) {
    const [item, setItem] = useState<WyshkitItem | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!itemId || !open) {
            if (!open) setItem(null); // Reset when closed
            return;
        }

        async function fetchItem() {
            setLoading(true);
            setError(null);
            try {
                const { data, error } = await getItemWithFullSpec(itemId!);
                if (error) {
                    setError('Failed to load item details');
                } else if (data) {
                    setItem(data as unknown as WyshkitItem);
                    triggerHaptic(HapticPattern.SUCCESS);
                }
            } catch (err) {
                setError('Something went wrong');
            } finally {
                setLoading(false);
            }
        }

        fetchItem();
    }, [itemId, open]);

    return (
        <ResponsiveSurface
            open={open}
            onOpenChange={(isOpen) => !isOpen && onClose()}
            title={item?.name || 'Quick Look'}
            description={item?.description || 'Loading item details...'}
            className="p-0 sm:max-w-xl"
        >
            <div className="bg-white min-h-[400px]">
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-32 gap-4">
                        <Loader2 className="size-8 animate-spin text-[var(--primary)]" />
                        <p className="text-xs font-black uppercase tracking-widest text-zinc-400">Enriching Details...</p>
                    </div>
                ) : error ? (
                    <div className="flex flex-col items-center justify-center py-20 px-8 text-center gap-4">
                        <div className="size-16 rounded-full bg-rose-50 flex items-center justify-center mb-2">
                            <span className="text-2xl">⚠️</span>
                        </div>
                        <p className="text-sm font-black text-zinc-900 uppercase tracking-tight">{error}</p>
                        <button
                            onClick={onClose}
                            className="text-xs font-black uppercase tracking-widest text-[var(--primary)]"
                        >
                            Close
                        </button>
                    </div>
                ) : item ? (
                    <div className="max-h-[85vh] overflow-y-auto">
                        <ItemDetailView
                            item={item}
                            onBack={onClose}
                        />
                    </div>
                ) : null}
            </div>
        </ResponsiveSurface>
    );
}
