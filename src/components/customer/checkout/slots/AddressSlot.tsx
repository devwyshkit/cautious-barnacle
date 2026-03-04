"use client";

import { useState, useActionState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/providers/AuthProvider";
import { cn } from "@/lib/utils";
import { MapPin, Check, Home, Briefcase, ChevronRight, Loader2, Plus, Clock } from "lucide-react";

import { useUI } from "@/providers/UIProvider";
import { setSelectedAddressAction } from "@/lib/actions/checkout/checkout";
import type { Address } from "@/lib/types/address";

interface AddressSlotProps {
  initialAddresses?: Address[];
  currentAddress?: Address;
  disabled?: boolean;
  etaMinutes?: number | null;
}

export function AddressSlot({ initialAddresses = [], currentAddress, disabled, etaMinutes }: AddressSlotProps) {
  const router = useRouter();
  const { user } = useAuth();
  const { openOTPSheet, openProfileSheet } = useUI();
  const [isChanging, setIsChanging] = useState(false);

  const [state, selectAction, isPending] = useActionState(async (prevState: any, addressId: string | null) => {
    if (!addressId) return { success: false };
    const result = await setSelectedAddressAction(addressId);
    if (result.success) {
      setIsChanging(false);
      return { success: true };
    }
    return { success: false };
  }, null);

  const addr = currentAddress;
  const Icon = addr?.type === 'home' ? Home : addr?.type === 'work' ? Briefcase : MapPin;

  if (isChanging) {
    return (
      <div className="space-y-3 animate-in fade-in slide-in-from-top-2 duration-300">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold tracking-widest text-[var(--text-tertiary)] uppercase">
            Select Address
          </label>
          <button
            onClick={() => setIsChanging(false)}
            className="text-xs font-bold text-[var(--text-secondary)] uppercase tracking-widest active:opacity-50"
          >
            Cancel
          </button>
        </div>

        <div className="grid gap-2">
          {initialAddresses.map((a) => (
            <button
              key={a.id}
              onClick={() => selectAction(a.id)}
              disabled={isPending || disabled}
              className={cn(
                "w-full text-left p-3 rounded-[var(--radius-md)] border transition-all flex items-center justify-between",
                a.id === currentAddress?.id
                  ? "bg-[var(--surface-muted)] border-[var(--border)]"
                  : "bg-[var(--surface)] border-[var(--border)] hover:bg-[var(--surface-muted)]",
                disabled && "opacity-50 pointer-events-none"
              )}
            >
              <div className="flex items-center gap-3">
                <div className="size-8 rounded-full bg-[var(--surface-muted)] flex items-center justify-center">
                  {a.type === 'home' ? <Home className="size-4" /> : a.type === 'work' ? <Briefcase className="size-4" /> : <MapPin className="size-4" />}
                </div>
                <div>
                  <p className="text-sm font-bold text-[var(--text-primary)]">{a.name || a.type}</p>
                  <p className="text-xs text-[var(--text-secondary)] font-medium truncate max-w-[200px]">{a.address_line1}</p>
                </div>
              </div>
              {a.id === currentAddress?.id && <Check className="size-4 text-[var(--primary)]" />}
            </button>
          ))}
          <button
            onClick={() => {
              if (!user) {
                openOTPSheet();
              } else {
                openProfileSheet('addresses');
              }
            }}
            disabled={disabled}
            className={cn("w-full p-3 rounded-[var(--radius-md)] border border-dashed border-[var(--border)] text-[var(--text-tertiary)] flex items-center justify-center gap-2 hover:bg-[var(--surface-muted)] transition-all font-bold", disabled && "opacity-50 pointer-events-none")}
          >
            <Plus className="size-4" />
            <span className="text-xs font-bold uppercase tracking-widest">Add New Address</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("space-y-2", disabled && "opacity-50 pointer-events-none transition-opacity")}>
      <div className="flex items-center justify-between">
        <label className="text-xs font-bold tracking-widest text-[var(--text-tertiary)] uppercase">
          Delivery Address
        </label>
        <button
          onClick={() => setIsChanging(true)}
          disabled={disabled}
          className="text-xs font-bold text-[var(--primary)] uppercase tracking-widest active:opacity-50 flex items-center gap-1"
        >
          {currentAddress ? 'Change' : 'Select'}
          <ChevronRight className="size-3" />
        </button>
      </div>

      <button
        onClick={() => setIsChanging(true)}
        disabled={isPending || disabled}
        className="w-full text-left p-4 bg-[var(--surface-muted)] rounded-[var(--radius-md)] flex items-start gap-4 border border-[var(--border)] active:scale-[0.98] transition-all hover:bg-[var(--surface-muted)]/50"
      >
        <div className="size-10 rounded-[var(--radius-md)] bg-[var(--surface)] border border-[var(--border)] flex items-center justify-center shrink-0 shadow-sm">
          {isPending ? <Loader2 className="size-5 animate-spin text-[var(--text-tertiary)]" /> : <Icon className="size-5 text-[var(--text-secondary)]" />}
        </div>
        <div className="flex-1 min-w-0 px-1">
          {currentAddress ? (
            <>
              <div className="flex flex-wrap items-center gap-2">
                <p className="text-[15px] font-bold text-[var(--text-primary)] truncate tracking-tight">
                  {currentAddress.name || currentAddress.type || 'Address'}
                </p>
                {etaMinutes && (
                  <div className="flex items-center gap-1.5 px-2.5 py-1 bg-[var(--well-success)] border border-[var(--success)]/20 rounded-full animate-in fade-in zoom-in duration-500">
                    <Clock className="size-3 text-[var(--success)]" />
                    <span className="text-xs font-bold text-[var(--success)] uppercase tracking-tight">
                      Arriving in ~{etaMinutes} mins
                    </span>
                  </div>
                )}
                {!etaMinutes && (
                  <label className="text-xs font-bold text-[var(--primary)] tracking-widest px-2.5 py-1 bg-[var(--primary)]/5 rounded-full border border-[var(--primary)]/10">
                    Current
                  </label>
                )}
              </div>
              <p className="text-xs text-[var(--text-secondary)] leading-tight mt-1 line-clamp-2 font-bold tracking-tight">
                {currentAddress.address_line1}{currentAddress.city ? `, ${currentAddress.city}` : ''}
              </p>
            </>
          ) : (
            <>
              <p className="text-[15px] font-bold text-[var(--text-tertiary)] italic tracking-tight">No address selected</p>
              <p className="text-xs text-[var(--text-tertiary)] mt-1 font-bold tracking-tight">Tap to choose a delivery location</p>
            </>
          )}
        </div>
      </button>
    </div>
  );
}

