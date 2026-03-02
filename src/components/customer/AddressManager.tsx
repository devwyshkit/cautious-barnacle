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
                    className="flex items-center gap-2 text-[var(--text-tertiary)] hover:text-[var(--text-primary)] transition-colors"
                >
                    <ChevronLeft className="size-4" />
                    <span className="text-xs font-bold tracking-tight">Back to addresses</span>
                </button>

                <div>
                    <h3 className="text-lg font-bold text-[var(--text-primary)]">Add New Address</h3>
                    <p className="text-xs text-[var(--text-secondary)] mt-1">We&apos;ll save this for your next orders</p>
                </div>

                <div className="bg-[var(--surface-muted)] rounded-[var(--radius-lg)] p-6 border border-[var(--border)]">
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
            <h3 className="text-xs font-bold text-[var(--text-tertiary)] tracking-tight mb-4">Saved Addresses</h3>

            {loading ? (
                <div className="flex items-center justify-center py-12">
                    <Loader2 className="size-6 animate-spin text-[var(--text-tertiary)]" />
                </div>
            ) : addresses.length === 0 ? (
                <div className="p-8 bg-[var(--surface-muted)] rounded-[var(--radius-lg)] text-center">
                    <div className="size-12 bg-[var(--surface-muted)] rounded-full flex items-center justify-center mx-auto mb-3">
                        <MapPin className="size-5 text-[var(--text-tertiary)]" />
                    </div>
                    <p className="text-sm font-semibold text-[var(--text-primary)]">No saved addresses</p>
                    <p className="text-xs text-[var(--text-secondary)] mt-1">Add your first delivery address</p>
                </div>
            ) : (
                <div className="space-y-3">
                    {addresses.map((addr) => {
                        const Icon = addr.type === 'home' ? Home : addr.type === 'work' ? Briefcase : MapPin;
                        return (
                            <div key={addr.id} className={cn(
                                "p-4 rounded-[var(--radius-xl)] border transition-all shadow-[var(--shadow-sm)]",
                                addr.is_default ? "bg-[var(--surface)] border-[var(--primary)]/10 shadow-[var(--shadow-md)]" : "bg-[var(--surface)] border-[var(--border)]"
                            )}>
                                <div className="flex items-start gap-3">
                                    <div className="size-10 rounded-[var(--radius-lg)] bg-[var(--surface-muted)] flex items-center justify-center shrink-0 border border-[var(--border)]">
                                        <Icon className="size-4 text-[var(--text-tertiary)]" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2">
                                            <h4 className="font-bold text-[var(--text-primary)] text-sm tracking-tight">{addr.name}</h4>
                                            {addr.is_default && (
                                                <span className="text-[var(--text-tiny)] font-bold px-1.5 py-0.5 rounded-[var(--radius-xs)] bg-[var(--text-primary)] text-[var(--background)] uppercase tracking-tighter">Default</span>
                                            )}
                                        </div>
                                        <p className="text-sm text-[var(--text-secondary)] mt-1 line-clamp-2">
                                            {addr.address_line1}{addr.city ? `, ${addr.city}` : ''} {addr.pincode || ''}
                                        </p>
                                        <div className="flex items-center gap-3 mt-3">
                                            {!addr.is_default && (
                                                <button
                                                    onClick={() => handleSetDefault(addr.id)}
                                                    disabled={!!settingDefault}
                                                    className="text-xs font-semibold text-[var(--text-secondary)] hover:text-[var(--text-primary)] disabled:opacity-50"
                                                >
                                                    {settingDefault === addr.id ? 'Setting...' : 'Set as default'}
                                                </button>
                                            )}
                                            <button
                                                onClick={() => handleDelete(addr.id)}
                                                className="text-xs font-semibold text-[var(--destructive)] hover:text-[var(--destructive)]/80"
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
                className="w-full mt-6 h-12 rounded-[var(--radius-xl)] border-dashed border-[var(--border)] text-[var(--text-secondary)] gap-2 hover:bg-[var(--surface-muted)]"
            >
                <Plus className="size-4" />
                Add New Address
            </Button>
        </>
    );
}
