"use client";

import { ResponsiveSurface } from "@/components/ui/ResponsiveSurface";
import { FulfilmentBlock } from "./blocks/FulfilmentBlock";
import { Address } from "@/lib/types/address";
import { useAuth } from "@/hooks/useAuth";
import { MapPin, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface AddressSelectionSheetProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    initialAddresses?: Address[];
    selectedAddressId?: string | null;
    onSelect: (address: Address | null) => void;
}

export function AddressSelectionSheet({
    isOpen,
    onOpenChange,
    initialAddresses,
    selectedAddressId,
    onSelect,
}: AddressSelectionSheetProps) {
    const { user } = useAuth();

    return (
        <ResponsiveSurface
            open={isOpen}
            onOpenChange={onOpenChange}
            title="Select Address"
            description="Choose where to deliver your order"
            className="md:max-w-lg"
        >
            <div className="pb-10 overflow-y-auto max-h-[60dvh]">
                <FulfilmentBlock
                    addressState={{ address: null, committed: false }}
                    onCommit={(addr) => {
                        onSelect(addr);
                        onOpenChange(false);
                    }}
                    userId={user?.id || null}
                    initialAddresses={initialAddresses}
                    initialSelectedAddressId={selectedAddressId}
                />
            </div>
        </ResponsiveSurface>
    );
}
