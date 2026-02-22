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
            <p className="text-[11px] font-black text-zinc-600 tracking-wider px-1">Saved addresses</p>
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
                                "w-full flex items-center gap-4 p-4 rounded-2xl border transition-all duration-300",
                                isSelected
                                    ? "bg-zinc-900 border-zinc-900 shadow-xl shadow-zinc-200"
                                    : "bg-white border-zinc-100 hover:border-zinc-200"
                            )}
                        >
                            <button
                                onClick={() => onSelect(addr.id, addr)}
                                disabled={isLoading || !!settingDefault}
                                className="flex flex-1 items-center gap-4 text-left min-w-0 active:scale-[0.98] transition-transform"
                            >
                                <div className={cn(
                                    "size-10 rounded-xl flex items-center justify-center shrink-0 transition-colors",
                                    isSelected ? "bg-white/10" : "bg-zinc-50"
                                )}>
                                    {isLoading ? (
                                        <Loader2 className={cn("size-4 animate-spin", isSelected ? "text-white" : "text-zinc-400")} />
                                    ) : (
                                        <Icon className={cn("size-4", isSelected ? "text-white text-zinc-900" : "text-zinc-600")} />
                                    )}
                                </div>
                                <div className="flex flex-col min-w-0 flex-1">
                                    <div className="flex items-center gap-2">
                                        <span className={cn("text-sm font-bold", isSelected ? "text-white" : "text-zinc-900")}>
                                            {addr.name}
                                        </span>
                                        {addr.is_default && !isSelected && (
                                            <span className="text-[11px] font-black px-1.5 py-0.5 rounded bg-zinc-100 text-zinc-500">Default</span>
                                        )}
                                    </div>
                                    <span className={cn("text-xs truncate mt-0.5 font-medium", isSelected ? "text-white/60" : "text-zinc-500")}>
                                        {addr.address_line1}{addr.city ? `, ${addr.city}` : ''}
                                    </span>
                                </div>
                                {isSelected && <Check className="size-4 text-white shrink-0 animate-in zoom-in duration-300" />}
                            </button>

                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <button
                                        disabled={isDeleting}
                                        className={cn(
                                            "p-2 rounded-xl shrink-0 transition-colors",
                                            isSelected ? "hover:bg-white/10 text-white/50 hover:text-white" : "hover:bg-zinc-50 text-zinc-400 hover:text-zinc-600"
                                        )}
                                    >
                                        {isDeleting ? <Loader2 className="size-4 animate-spin" /> : <MoreVertical className="size-4" />}
                                    </button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-48 rounded-2xl p-1.5 border-zinc-100 shadow-xl">
                                    <DropdownMenuItem
                                        onClick={() => onEdit(addr.id)}
                                        className="rounded-xl flex items-center gap-2.5 px-3 py-2.5 font-bold text-xs text-zinc-600 focus:text-zinc-900"
                                    >
                                        <Pencil className="size-3.5" />
                                        Edit Address
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                        className="rounded-xl flex items-center gap-2.5 px-3 py-2.5 font-bold text-xs text-rose-600 focus:text-rose-700 focus:bg-rose-50"
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
                    className="w-full flex items-center gap-4 p-4 rounded-2xl border-2 border-dashed border-zinc-100 hover:bg-zinc-50 hover:border-zinc-200 transition-all text-left group"
                >
                    <div className="size-10 rounded-xl bg-zinc-50 flex items-center justify-center shrink-0 group-hover:bg-zinc-100 transition-colors">
                        <Plus className="size-4 text-zinc-400 group-hover:text-zinc-600" />
                    </div>
                    <span className="text-sm font-bold text-zinc-400 group-hover:text-zinc-600">Add new address</span>
                </button>
            </div>
        </div>
    );
}
