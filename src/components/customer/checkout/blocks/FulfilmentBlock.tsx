'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Home, Briefcase, MapPin, Check, Plus, Loader2, MoreVertical, Pencil, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { AddressForm } from '@/components/customer/checkout/AddressForm';
import { getUserAddresses, deleteAddress } from '@/lib/actions/user/addresses';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import type { Address } from '@/lib/types/address';
import type { AddressCommitState } from '../types';

interface FulfilmentBlockProps {
  addressState: AddressCommitState;
  onCommit: (address: Address | null) => void;
  userId: string | null;
  initialAddresses?: Address[];
  /** When in "Change" mode, pre-select this address */
  initialSelectedAddressId?: string | null;
}

export function FulfilmentBlock({ addressState, onCommit, userId, initialAddresses, initialSelectedAddressId }: FulfilmentBlockProps) {
  const router = useRouter();
  const [addresses, setAddresses] = useState<Address[]>(initialAddresses || []);
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(() => {
    if (initialSelectedAddressId) return initialSelectedAddressId;
    if (initialAddresses && initialAddresses.length > 0) {
      const defaultAddr = initialAddresses.find((a) => a.is_default);
      return defaultAddr ? defaultAddr.id : initialAddresses[0].id;
    }
    return null;
  });
  const [loading, setLoading] = useState(!initialAddresses);
  const [isAddingAddress, setIsAddingAddress] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    // WYSHKIT 2026: Skip client-side fetch if initialAddresses provided (server-side data)
    if (initialAddresses && initialAddresses.length > 0) {
      setLoading(false);
      return;
    }

    // Only fetch if no initial data and user is logged in
    if (userId && !addressState.committed && !initialAddresses) {
      const loadAddresses = async () => {
        setLoading(true);
        try {
          const result = await getUserAddresses();
          if (result.addresses) {
            setAddresses(result.addresses);
            const defaultAddr = result.addresses.find((a: Address) => a.is_default);
            if (defaultAddr && !addressState.committed) {
              setSelectedAddressId(defaultAddr.id);
              onCommit(defaultAddr);
            } else if (result.addresses.length > 0 && !addressState.committed) {
              setSelectedAddressId(result.addresses[0].id);
              onCommit(result.addresses[0]);
            }
          }
        } catch {
        } finally {
          setLoading(false);
        }
      };
      loadAddresses();
    } else {
      setLoading(false);
    }
  }, [userId]); // Only depend on userId - initialAddresses and addressState are stable

  if (addressState.committed && addressState.address) {
    const addr = addressState.address;
    const Icon = addr.type === 'home' ? Home : addr.type === 'work' ? Briefcase : MapPin;

    return (
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="label-overline">Delivering to</label>
          <button
            onClick={() => onCommit(null)}
            className="text-xs font-semibold text-zinc-900 active:opacity-50"
          >
            Change
          </button>
        </div>
        <div className="p-2.5 bg-zinc-50 rounded-lg flex items-start gap-2.5">
          <div className="size-8 rounded-md bg-white border border-zinc-100 flex items-center justify-center shrink-0">
            <Icon className="size-3.5 text-zinc-600" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5">
              <p className="text-sm font-semibold text-zinc-900 truncate">{addr.name}</p>
              <Check className="size-3 text-emerald-500 shrink-0" />
            </div>
            <p className="text-xs text-zinc-500 leading-relaxed mt-0.5 line-clamp-2">
              {addr.address_line1}{addr.city ? `, ${addr.city}` : ''} {addr.pincode || ''}
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="space-y-2">
        <label className="label-overline">Delivery address</label>
        <div className="flex items-center justify-center py-6">
          <Loader2 className="size-4 animate-spin text-zinc-400" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <label className="label-overline">Delivery address</label>

      {isAddingAddress ? (
        <div className="p-4 bg-white rounded-2xl border border-zinc-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-zinc-900">Add New Address</h3>
          </div>

          <AddressForm
            onCancel={() => setIsAddingAddress(false)}
            onSuccess={(newAddr) => {
              const newAddresses = [newAddr, ...addresses];
              setAddresses(newAddresses);
              setSelectedAddressId(newAddr.id);
              onCommit(newAddr);
              setIsAddingAddress(false);
            }}
          />
        </div>
      ) : addresses.length === 0 ? (
        <div className="p-4 text-center bg-zinc-50 rounded-lg">
          <div className="size-8 rounded-full bg-zinc-100 flex items-center justify-center mx-auto mb-2">
            <MapPin className="size-3.5 text-zinc-400" />
          </div>
          <p className="text-xs font-semibold text-zinc-500 mb-2">No saved addresses</p>
          <Button
            onClick={() => setIsAddingAddress(true)}
            variant="outline"
            size="sm"
            className="rounded-lg font-semibold gap-1.5 h-8 text-xs"
          >
            <Plus className="size-3.5" />
            Add address
          </Button>
        </div>
      ) : (
        <div className="space-y-3">
          <div className="space-y-1.5">
            {addresses.map((addr: Address) => {
              const Icon = addr.type === 'home' ? Home : addr.type === 'work' ? Briefcase : MapPin;
              const isSelected = selectedAddressId === addr.id;
              const isDeleting = deletingId === addr.id;

              return (
                <div
                  key={addr.id}
                  className={cn(
                    "w-full flex items-start gap-2.5 p-2.5 rounded-lg border transition-all",
                    isSelected
                      ? "bg-zinc-900 border-zinc-900"
                      : "bg-white border-zinc-100 hover:border-zinc-200"
                  )}
                >
                  <button
                    onClick={() => {
                      setSelectedAddressId(addr.id);
                      onCommit(addr);
                    }}
                    className="flex-1 flex items-start gap-2.5 text-left min-w-0 active:scale-[0.98]"
                  >
                    <div className={cn(
                      "size-3.5 rounded-full border-2 flex items-center justify-center mt-0.5 shrink-0",
                      isSelected ? "border-white" : "border-zinc-200"
                    )}>
                      {isSelected && <div className="size-1.5 rounded-full bg-white" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 mb-0.5">
                        <Icon className={cn("size-3", isSelected ? "text-white/70" : "text-zinc-400")} />
                        <p className={cn("text-[13px] font-semibold", isSelected ? "text-white" : "text-zinc-900")}>
                          {addr.name}
                        </p>
                      </div>
                      <p className={cn("text-xs leading-relaxed", isSelected ? "text-white/60" : "text-zinc-500")}>
                        {addr.address_line1}{addr.city ? `, ${addr.city}` : ''}
                      </p>
                    </div>
                  </button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button
                        onClick={(e) => e.stopPropagation()}
                        disabled={isDeleting}
                        className={cn(
                          "p-1.5 rounded-lg shrink-0 transition-colors",
                          isSelected ? "hover:bg-white/10 text-white/70" : "hover:bg-zinc-100 text-zinc-400"
                        )}
                        aria-label="Address options"
                      >
                        {isDeleting ? <Loader2 className="size-3.5 animate-spin" /> : <MoreVertical className="size-3.5" />}
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48">
                      <DropdownMenuItem onClick={() => router.push('/profile?tab=addresses')}>
                        <Pencil className="size-3.5 mr-2" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="text-red-600 focus:text-red-600"
                        onClick={async (e) => {
                          e.preventDefault();
                          setDeletingId(addr.id);
                          const err = await deleteAddress(addr.id);
                          setDeletingId(null);
                          if (err?.error) {
                            toast.error('Failed to delete address');
                            return;
                          }
                          setAddresses((prev) => prev.filter((a) => a.id !== addr.id));
                          if (selectedAddressId === addr.id) {
                            const remaining = addresses.filter((a) => a.id !== addr.id);
                            if (remaining.length > 0) {
                              setSelectedAddressId(remaining[0].id);
                              onCommit(remaining[0]);
                            } else {
                              onCommit(null);
                            }
                          }
                          toast.success('Address deleted');
                        }}
                      >
                        <Trash2 className="size-3.5 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              );
            })}
          </div>

          <Button
            onClick={() => setIsAddingAddress(true)}
            variant="ghost"
            size="sm"
            className="w-full h-9 rounded-lg font-bold text-xs text-zinc-500 border border-dashed border-zinc-200 hover:bg-zinc-50 hover:text-zinc-900 gap-1.5"
          >
            <Plus className="size-3.5" />
            Add New Address
          </Button>
        </div>
      )}
    </div>
  );
}
