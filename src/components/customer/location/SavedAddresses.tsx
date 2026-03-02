'use client';

import React from 'react';
import { Home, Briefcase, MapPin, Check, Loader2, MoreVertical, Pencil, Trash2, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import type { Address } from '@/lib/types/address';

interface SavedAddressesProps {
    addresses: Address[];
    selectedAddressId?: string | null;
    settingDefault: string | null;
    deletingId: string | null;
    onSelect: (id: string, addr: Address) => void;
    onDelete: (id: string) => void;
    onEdit: (id: string) => void;
    onAdd: () => void;
}

export function SavedAddresses({
    addresses,
    selectedAddressId,
    settingDefault,
    deletingId,
    onSelect,
    onDelete,
    onEdit,
    onAdd
}: SavedAddressesProps) {
    return (
        <div className="space-y-4">
            <p className="text-xs font-bold text-[var(--text-secondary)] tracking-tight px-1">Saved addresses</p>
            <div className="space-y-2">
                {addresses.map((addr) => {
                    const isSelected = selectedAddressId === addr.id;
                    const isLoading = settingDefault === addr.id;
                    const isDeleting = deletingId === addr.id;
                    const Icon = addr.type === 'home' ? Home : addr.type === 'work' ? Briefcase : MapPin;

                    return (
                        <div
                            key={addr.id}
                            className={cn(
                                "w-full flex items-center gap-4 p-4 rounded-[var(--radius-lg)] border transition-all duration-300",
                                isSelected
                                    ? "bg-[var(--text-primary)] border-[var(--text-primary)] shadow-[var(--shadow-md)]"
                                    : "bg-[var(--surface)] border-[var(--border)] hover:border-[var(--text-tertiary)]"
                            )}
                        >
                            <button
                                onClick={() => onSelect(addr.id, addr)}
                                disabled={isLoading || !!settingDefault}
                                className="flex flex-1 items-center gap-4 text-left min-w-0 active:scale-[0.98] transition-transform"
                            >
                                <div className={cn(
                                    "size-10 rounded-[var(--radius-md)] flex items-center justify-center shrink-0 transition-colors",
                                    isSelected ? "bg-[var(--background)]/10" : "bg-[var(--surface-muted)]"
                                )}>
                                    {isLoading ? (
                                        <Loader2 className={cn("size-4 animate-spin", isSelected ? "text-[var(--text-inverse)]" : "text-[var(--text-tertiary)]")} />
                                    ) : (
                                        <Icon className={cn("size-4", isSelected ? "text-[var(--text-inverse)]" : "text-[var(--text-secondary)]")} />
                                    )}
                                </div>
                                <div className="flex flex-col min-w-0 flex-1">
                                    <div className="flex items-center gap-2">
                                        <span className={cn("text-sm font-bold", isSelected ? "text-[var(--text-inverse)]" : "text-[var(--text-primary)]")}>
                                            {addr.name}
                                        </span>
                                        {addr.is_default && !isSelected && (
                                            <span className="text-xs font-bold px-1.5 py-0.5 rounded-[var(--radius-xs)] bg-[var(--surface-muted)] text-[var(--text-secondary)]">Default</span>
                                        )}
                                    </div>
                                    <span className={cn("text-xs truncate mt-0.5 font-medium", isSelected ? "text-[var(--text-inverse)]/60" : "text-[var(--text-secondary)]")}>
                                        {addr.address_line1}{addr.city ? `, ${addr.city}` : ''}
                                    </span>
                                </div>
                                {isSelected && <Check className="size-4 text-[var(--text-inverse)] shrink-0 animate-in zoom-in duration-300" />}
                            </button>

                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <button
                                        disabled={isDeleting}
                                        className={cn(
                                            "p-2 rounded-[var(--radius-md)] shrink-0 transition-colors",
                                            isSelected ? "hover:bg-[var(--background)]/10 text-[var(--background)]/50 hover:text-[var(--background)]" : "hover:bg-[var(--surface-muted)] text-[var(--text-tertiary)] hover:text-[var(--text-secondary)]"
                                        )}
                                    >
                                        {isDeleting ? <Loader2 className="size-4 animate-spin" /> : <MoreVertical className="size-4" />}
                                    </button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-48 rounded-[var(--radius-md)] p-1.5 border-[var(--border)] shadow-[var(--shadow-sm)]">
                                    <DropdownMenuItem
                                        onClick={() => onEdit(addr.id)}
                                        className="rounded-[var(--radius-sm)] flex items-center gap-2.5 px-3 py-2.5 font-bold text-xs text-[var(--text-secondary)] focus:text-[var(--text-primary)]"
                                    >
                                        <Pencil className="size-3.5" />
                                        Edit Address
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                        className="rounded-[var(--radius-sm)] flex items-center gap-2.5 px-3 py-2.5 font-bold text-xs text-[var(--destructive)] focus:text-[var(--destructive)] focus:bg-[var(--destructive)]/5"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            onDelete(addr.id);
                                        }}
                                    >
                                        <Trash2 className="size-3.5" />
                                        Remove
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    );
                })}

                <button
                    onClick={onAdd}
                    className="w-full flex items-center gap-4 p-4 rounded-[var(--radius-lg)] border-2 border-dashed border-[var(--border)] hover:bg-[var(--surface-muted)] hover:border-[var(--text-tertiary)] transition-all text-left group"
                >
                    <div className="size-10 rounded-[var(--radius-md)] bg-[var(--surface-muted)] flex items-center justify-center shrink-0 group-hover:bg-[var(--border)] transition-colors">
                        <Plus className="size-4 text-[var(--text-tertiary)] group-hover:text-[var(--text-secondary)]" />
                    </div>
                    <span className="text-sm font-bold text-[var(--text-tertiary)] group-hover:text-[var(--text-secondary)]">Add new address</span>
                </button>
            </div>
        </div>
    );
}
