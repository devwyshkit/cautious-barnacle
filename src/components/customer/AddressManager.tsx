'use client';

import React, { useState } from 'react';
import { MapPin, Home, Briefcase, Plus, Loader2, ChevronLeft } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { AddressForm } from '@/components/customer/checkout/AddressForm';
import { toast } from 'sonner';
import { getAddresses, setDefaultAddress, deleteAddress } from '@/lib/actions/user/addresses';
import type { Address } from '@/lib/types/address';

interface AddressManagerProps {
    initialAddresses: Address[];
    isAdding: boolean;
    onToggleAdding: (adding: boolean) => void;
}

export function AddressManager({ initialAddresses, isAdding, onToggleAdding }: AddressManagerProps) {
    const [addresses, setAddresses] = useState<Address[]>(initialAddresses);
    const [loading, setLoading] = useState(false);
    const [settingDefault, setSettingDefault] = useState<string | null>(null);

    const handleSetDefault = async (id: string) => {
        setSettingDefault(id);
        try {
            const result = await setDefaultAddress(id);
            if (result.success) {
                setAddresses(prev => prev.map(a => ({ ...a, is_default: a.id === id })));
                toast.success("Default address updated");
            }
        } catch { } finally {
            setSettingDefault(null);
        }
    };

    const handleDelete = async (id: string) => {
        try {
            await deleteAddress(id);
            setAddresses(prev => prev.filter(a => a.id !== id));
            toast.info("Address deleted");
        } catch {
            toast.error("Failed to delete address");
        }
    };

    if (isAdding) {
        return (
            <div className="space-y-6">
                <button
                    onClick={() => onToggleAdding(false)}
                    className="flex items-center gap-2 text-zinc-400 hover:text-zinc-900 transition-colors"
                >
                    <ChevronLeft className="size-4" />
                    <span className="text-xs font-bold tracking-tight">Back to addresses</span>
                </button>

                <div>
                    <h3 className="text-lg font-black text-zinc-900">Add New Address</h3>
                    <p className="text-xs text-zinc-500 mt-1">We'll save this for your next orders</p>
                </div>

                <div className="bg-zinc-50 rounded-xl p-6 border border-zinc-100">
                    <AddressForm
                        onCancel={() => onToggleAdding(false)}
                        onSuccess={(newAddr) => {
                            setAddresses(prev => [newAddr, ...prev]);
                            onToggleAdding(false);
                            toast.success("Address added successfully");
                        }}
                    />
                </div>
            </div>
        );
    }

    return (
        <>
            <h3 className="text-[11px] font-bold text-zinc-400 tracking-tight mb-4">Saved Addresses</h3>

            {loading ? (
                <div className="flex items-center justify-center py-12">
                    <Loader2 className="size-6 animate-spin text-zinc-400" />
                </div>
            ) : addresses.length === 0 ? (
                <div className="p-8 bg-zinc-50 rounded-xl text-center">
                    <div className="size-12 bg-zinc-100 rounded-full flex items-center justify-center mx-auto mb-3">
                        <MapPin className="size-5 text-zinc-400" />
                    </div>
                    <p className="text-sm font-semibold text-zinc-900">No saved addresses</p>
                    <p className="text-xs text-zinc-500 mt-1">Add your first delivery address</p>
                </div>
            ) : (
                <div className="space-y-3">
                    {addresses.map((addr) => {
                        const Icon = addr.type === 'home' ? Home : addr.type === 'work' ? Briefcase : MapPin;
                        return (
                            <div key={addr.id} className={cn(
                                "p-4 rounded-xl border transition-all",
                                addr.is_default ? "bg-zinc-50 border-zinc-200" : "border-zinc-100"
                            )}>
                                <div className="flex items-start gap-3">
                                    <div className="size-10 rounded-xl bg-zinc-100 flex items-center justify-center shrink-0">
                                        <Icon className="size-4 text-zinc-600" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2">
                                            <h4 className="font-bold text-zinc-900">{addr.name}</h4>
                                            {addr.is_default && (
                                                <span className="text-[11px] font-bold px-1.5 py-0.5 rounded bg-zinc-900 text-white">Default</span>
                                            )}
                                        </div>
                                        <p className="text-sm text-zinc-500 mt-1 line-clamp-2">
                                            {addr.address_line1}{addr.city ? `, ${addr.city}` : ''} {addr.pincode || ''}
                                        </p>
                                        <div className="flex items-center gap-3 mt-3">
                                            {!addr.is_default && (
                                                <button
                                                    onClick={() => handleSetDefault(addr.id)}
                                                    disabled={!!settingDefault}
                                                    className="text-xs font-semibold text-zinc-600 hover:text-zinc-900 disabled:opacity-50"
                                                >
                                                    {settingDefault === addr.id ? 'Setting...' : 'Set as default'}
                                                </button>
                                            )}
                                            <button
                                                onClick={() => handleDelete(addr.id)}
                                                className="text-xs font-semibold text-[#D91B24] hover:text-[#D91B24]/80"
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            <Button
                onClick={() => onToggleAdding(true)}
                variant="outline"
                className="w-full mt-6 h-12 rounded-xl border-dashed border-zinc-300 text-zinc-600 gap-2 hover:bg-zinc-50"
            >
                <Plus className="size-4" />
                Add New Address
            </Button>
        </>
    );
}
