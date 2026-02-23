'use client';

import React, { useRef } from 'react';
import { ShoppingBag, Info, ImageIcon, Camera, X } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import { PersonalizationConfig } from '@/lib/types/personalization';

interface IdentityItemFieldProps {
    item: any;
    itemIndex: number;
    totalItems: number;
    config: PersonalizationConfig;
    schema?: any[];
    input: { text?: string; image_url?: string;[key: string]: any };
    uploadingProgress?: number;
    onInputChange: (field: string, value: string) => void;
    onFileUpload: (file: File) => void;
}

export function IdentityItemField({
    item,
    itemIndex,
    totalItems,
    config,
    schema,
    input,
    uploadingProgress,
    onInputChange,
    onFileUpload
}: IdentityItemFieldProps) {
    const libraryRef = useRef<HTMLInputElement>(null);
    const cameraRef = useRef<HTMLInputElement>(null);

    return (
        <section className="group transition-all">
            {totalItems > 1 && (
                <div className="flex items-center gap-3 mb-4 px-2">
                    <div className="size-8 rounded-xl bg-zinc-900 flex items-center justify-center shadow-lg shadow-zinc-900/10">
                        <ShoppingBag className="size-4 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                        <h4 className="text-[12px] font-black text-zinc-950 tracking-tight truncate leading-none">
                            {item.item_name}
                        </h4>
                        <p className="text-[11px] font-bold text-zinc-400 tracking-tight mt-1">Item {itemIndex + 1}</p>
                    </div>
                    {!config.text_required && !config.image_required && (
                        <span className="text-[11px] font-black bg-zinc-100 text-zinc-400 px-2 py-1 rounded-lg tracking-tight border border-zinc-200/50">Optional</span>
                    )}
                </div>
            )}

            <div className="bg-white rounded-xl p-6 border border-zinc-100 shadow-sm transition-all group-hover:border-zinc-200 space-y-5">
                {schema ? (
                    <div className="space-y-4">
                        {schema.map((field) => (
                            <div key={field.id} className="space-y-2">
                                <label className="text-xs font-black text-zinc-900 tracking-tight block px-1">
                                    {field.label} {field.required && <span className="text-rose-500">*</span>}
                                </label>
                                {field.type === 'text' ? (
                                    <input
                                        type="text"
                                        value={input[field.id] || ''}
                                        onChange={(e) => onInputChange(field.id, e.target.value)}
                                        placeholder={field.placeholder}
                                        className="w-full bg-zinc-50 border-zinc-100 rounded-xl p-3 text-sm focus:bg-white focus:border-zinc-900 transition-all outline-none border"
                                    />
                                ) : field.type === 'textarea' ? (
                                    <Textarea
                                        value={input[field.id] || ''}
                                        onChange={(e) => onInputChange(field.id, e.target.value)}
                                        placeholder={field.placeholder}
                                        className="w-full bg-zinc-50 border-zinc-100 rounded-xl p-3 text-sm focus:bg-white focus:border-zinc-900 transition-all outline-none border min-h-[80px]"
                                    />
                                ) : null}
                            </div>
                        ))}
                    </div>
                ) : (
                    <>
                        {config.allow_text && (
                            <div className="space-y-3">
                                <div className="flex items-center justify-between px-1">
                                    <label className="text-xs font-black text-zinc-900 tracking-tight flex items-center gap-1.5">
                                        {config.text_label || 'Identity Theme'}
                                    </label>
                                    {config.char_limit && (
                                        <span className={cn(
                                            "text-xs font-bold tracking-tight tabular-nums",
                                            (input.text?.length || 0) > config.char_limit ? "text-rose-500" : "text-zinc-400"
                                        )}>
                                            {input.text?.length || 0}/{config.char_limit}
                                        </span>
                                    )}
                                </div>
                                <Textarea
                                    value={input.text || ''}
                                    onChange={(e) => onInputChange('text', e.target.value)}
                                    placeholder={config.placeholder || "What should the design focus on?"}
                                    className="w-full bg-zinc-50/50 border-zinc-100 rounded-xl p-5 text-sm font-medium focus:bg-white focus:border-zinc-900 focus:ring-4 focus:ring-zinc-900/5 transition-all outline-none min-h-[120px] resize-none placeholder:text-zinc-300 border shadow-none text-zinc-900 leading-relaxed"
                                    maxLength={config.char_limit}
                                />
                            </div>
                        )}

                        {config.allow_image && (
                            <div className="space-y-4">
                                <div className="flex items-center gap-2 px-1">
                                    <div className="h-px flex-1 bg-zinc-50" />
                                    <span className="text-[11px] font-black text-zinc-300 tracking-tight leading-none">Visual Reference</span>
                                    <div className="h-px flex-1 bg-zinc-50" />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <input
                                        type="file"
                                        ref={libraryRef}
                                        accept="image/*"
                                        className="hidden"
                                        aria-label="Upload image from library"
                                        onChange={(e) => {
                                            const file = e.target.files?.[0];
                                            if (file) onFileUpload(file);
                                        }}
                                    />
                                    <button
                                        type="button"
                                        disabled={uploadingProgress !== undefined}
                                        onClick={() => libraryRef.current?.click()}
                                        className="flex flex-col items-center justify-center gap-2 py-5 bg-zinc-50 border border-zinc-100 rounded-xl hover:bg-zinc-100 transition-all active:scale-[0.98] disabled:opacity-50 group/btn"
                                    >
                                        <ImageIcon className="size-5 text-zinc-400 group-hover/btn:text-zinc-600 group-hover/btn:scale-110 transition-all" />
                                        <span className="text-xs font-black text-zinc-400 tracking-tight group-hover/btn:text-zinc-600 transition-colors">Library</span>
                                    </button>

                                    <input
                                        type="file"
                                        ref={cameraRef}
                                        accept="image/*"
                                        capture="environment"
                                        className="hidden"
                                        aria-label="Capture image from camera"
                                        onChange={(e) => {
                                            const file = e.target.files?.[0];
                                            if (file) onFileUpload(file);
                                        }}
                                    />
                                    <button
                                        type="button"
                                        disabled={uploadingProgress !== undefined}
                                        onClick={() => cameraRef.current?.click()}
                                        className="flex flex-col items-center justify-center gap-2 py-5 bg-zinc-900 rounded-xl hover:bg-black transition-all active:scale-[0.98] disabled:opacity-50 group/btn shadow-lg shadow-zinc-200"
                                    >
                                        <Camera className="size-5 text-white/60 group-hover/btn:text-white group-hover/btn:scale-110 transition-all" />
                                        <span className="text-xs font-black text-white/60 tracking-tight group-hover/btn:text-white transition-colors">Capture</span>
                                    </button>
                                </div>

                                {uploadingProgress !== undefined && (
                                    <div className="space-y-2 animate-in fade-in duration-300">
                                        <div className="flex items-center justify-between px-1">
                                            <span className="text-[11px] font-black text-zinc-900 tracking-tight">Processing Image...</span>
                                            <span className="text-xs font-bold text-zinc-400 tabular-nums">{Math.round(uploadingProgress)}%</span>
                                        </div>
                                        <Progress value={uploadingProgress} className="h-1.5 bg-zinc-100" />
                                    </div>
                                )}

                                {input.image_url && (
                                    <div className="relative aspect-video rounded-xl overflow-hidden border border-zinc-100 group shadow-sm bg-zinc-50 animate-in zoom-in-95 duration-500">
                                        <img src={input.image_url} alt="Preview" className="size-full object-cover" />
                                        <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-all" />
                                        <button
                                            type="button"
                                            onClick={() => onInputChange('image_url', '')}
                                            className="absolute top-3 right-3 size-10 bg-white shadow-sm rounded-full flex items-center justify-center text-zinc-900 hover:scale-110 active:scale-95 transition-all z-10"
                                        >
                                            <X className="size-5" />
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}
                    </>
                )}

                {config.instructions && (
                    <div className="flex gap-2.5 p-4 bg-zinc-50/50 rounded-xl border border-zinc-100/50">
                        <Info className="size-3.5 text-zinc-400 shrink-0 mt-0.5" />
                        <p className="text-xs text-zinc-500 font-medium leading-relaxed">
                            {config.instructions}
                        </p>
                    </div>
                )}
            </div>
        </section>
    );
}
