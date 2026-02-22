"use client";

import { useState, useActionState } from "react";
import { useCheckoutAddress } from "@/components/customer/checkout/CheckoutAddressContext";
import { useAuth } from "@/hooks/useAuth";
import { MapPin, Check, Home, Briefcase, ChevronRight, Loader2 } from "lucide-react";
import { AddressSelectionSheet } from "../AddressSelectionSheet";
import { setSelectedAddressAction } from "@/lib/actions/checkout/checkout";

import type { Address } from "@/lib/types/address";

interface AddressSlotProps {
  initialAddresses?: Address[];
  currentAddress?: Address;
}

export function AddressSlot({ initialAddresses, currentAddress }: AddressSlotProps) {
  const { user } = useAuth();
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  const [state, selectAction, isPending] = useActionState(async (prevState: any, addressId: string | null) => {
    if (!addressId) return { success: false };
    const result = await setSelectedAddressAction(addressId);
    if (result.success) {
      setIsSheetOpen(false);
      return { success: true };
    }
    return { success: false };
  }, null);

  const handleSelect = (addr: Address | null) => {
    if (addr) {
      selectAction(addr.id);
    }
  };

  const addr = currentAddress;
  const Icon = addr?.type === 'home' ? Home : addr?.type === 'work' ? Briefcase : MapPin;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-xs font-bold tracking-wider text-zinc-400">
          Delivery Address
        </label>
        <button
          onClick={() => setIsSheetOpen(true)}
          className="text-[11px] font-black text-zinc-900 tracking-wider active:opacity-50 flex items-center gap-1"
        >
          {currentAddress ? 'Change' : 'Select'}
          <ChevronRight className="size-3" />
        </button>
      </div>

      <button
        onClick={() => setIsSheetOpen(true)}
        disabled={isPending}
        className="w-full text-left p-4 bg-zinc-50 rounded-2xl flex items-start gap-4 border border-zinc-100 active:scale-[0.98] transition-all hover:bg-zinc-100/50"
      >
        <div className="size-10 rounded-xl bg-white border border-zinc-100 flex items-center justify-center shrink-0 shadow-sm">
          {isPending ? <Loader2 className="size-5 animate-spin text-zinc-400" /> : <Icon className="size-5 text-zinc-600" />}
        </div>
        <div className="flex-1 min-w-0">
          {currentAddress ? (
            <>
              <div className="flex items-center gap-2">
                <p className="text-[15px] font-bold text-zinc-900 truncate">
                  {currentAddress.name || currentAddress.type || 'Address'}
                </p>
                <Check className="size-4 text-emerald-500 shrink-0" />
              </div>
              <p className="text-xs text-zinc-500 leading-relaxed mt-1 line-clamp-2 font-medium">
                {currentAddress.address_line1}{currentAddress.city ? `, ${currentAddress.city}` : ''}
              </p>
            </>
          ) : (
            <>
              <p className="text-[15px] font-bold text-zinc-400 italic">No address selected</p>
              <p className="text-xs text-zinc-400 mt-1 font-medium">Tap to choose a delivery location</p>
            </>
          )}
        </div>
      </button>

      <AddressSelectionSheet
        isOpen={isSheetOpen}
        onOpenChange={setIsSheetOpen}
        initialAddresses={initialAddresses}
        selectedAddressId={addr?.id}
        onSelect={handleSelect}
      />
    </div>
  );
}

