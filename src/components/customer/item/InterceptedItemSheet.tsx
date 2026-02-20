'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import React from "react";
import { Drawer, DrawerContent, DrawerTitle, DrawerDescription } from "@/components/ui/drawer";
import { ItemDetailView } from '@/components/customer/item/ItemDetailView';
import { WyshkitItem } from '@/lib/types/item';
interface InterceptedItemSheetProps {
    item: WyshkitItem;
    onCloseOverride?: string;
}

export function InterceptedItemSheet({ item, onCloseOverride }: InterceptedItemSheetProps) {
    const router = useRouter();
    const [open, setOpen] = React.useState(true);
    const searchParams = useSearchParams();
    const isFromSearch = searchParams.get('context') === 'search';

    const handleClose = React.useCallback(() => {
        setOpen(false);
        const partnerPath = `/partner/${item.partner_id || searchParams.get('id')}`;

        setTimeout(() => {
            if (onCloseOverride) {
                router.push(onCloseOverride);
            } else if (window.history.length <= 1) {
                // Dead end case: Push to partner store
                router.push(partnerPath);
            } else {
                router.back();
            }
        }, 100);
    }, [item.partner_id, onCloseOverride, router, searchParams]);

    const isEditMode = searchParams.get('edit') === 'true';
    const cartItemId = searchParams.get('cartItemId');
    const variantId = searchParams.get('variantId');
    const quantity = parseInt(searchParams.get('quantity') || '1');
    const addonIds = searchParams.get('addons')?.split(',').filter(Boolean) || [];

    const initialState = isEditMode && cartItemId ? {
        cartItemId,
        variantId: variantId || null,
        quantity,
        addonIds
    } : undefined;

    return (
        <Drawer
            open={open}
            onOpenChange={(v) => {
                if (!v) handleClose();
            }}
        >
            <DrawerContent
                className="h-[92dvh] max-h-[92dvh] rounded-t-[32px] border-x border-t border-zinc-100 overflow-hidden p-0 gap-0 md:max-w-[520px] md:left-1/2 md:right-auto md:-translate-x-1/2 flex flex-col bg-white"
            >
                <DrawerTitle className="sr-only">{item.name || 'Product Details'}</DrawerTitle>
                <DrawerDescription className="sr-only">
                    View details and add {item.name || 'this item'} to your cart.
                </DrawerDescription>

                <div className="flex-1 overflow-hidden relative min-h-0">
                    <ItemDetailView
                        item={item}
                        onBack={handleClose}
                        initialState={initialState}
                    />
                </div>
            </DrawerContent>
        </Drawer>
    );
}
