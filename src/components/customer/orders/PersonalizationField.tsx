'use client';

import React, { useRef } from 'react';
import { ShoppingBag, Info, ImageIcon, Camera, X, Sparkles } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import { PersonalizationConfig } from '@/lib/types/personalization';

interface PersonalizationFieldProps {
    product: any;
    productIndex: number;
    totalProducts: number;
    config: PersonalizationConfig;
    schema?: any[];
    input: { text?: string; image_url?: string;[key: string]: any };
    uploadingProgress?: number;
    pastMockupUrl?: string;
    onInputChange: (field: string, value: string) => void;
    onFileUpload: (file: File) => void;
}

export function PersonalizationField({
    product,
    productIndex,
    totalProducts,
    config,
    schema,
    input,
    uploadingProgress,
    pastMockupUrl,
    onInputChange,
    onFileUpload
}: PersonalizationFieldProps) {
    const libraryRef = useRef<HTMLInputElement>(null);
    const cameraRef = useRef<HTMLInputElement>(null);

    return (
        <section className="group transition-all">
            {totalProducts > 1 && (
                <div className="flex items-center gap-3 mb-4 px-2">
                    <div className="size-8 rounded-xl bg-[var(--text-primary)] flex items-center justify-center shadow-lg shadow-[var(--text-primary)]/10">
                        <ShoppingBag className="size-4 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                        <h4 className="text-[12px] font-bold text-[var(--text-primary)] tracking-tight truncate leading-none">
                            {product.product_name}
                        </h4>
                        <p className="text-xs font-bold text-[var(--text-tertiary)] tracking-tight mt-1">Product {productIndex + 1}</p>
                    </div>
                    {!config.text_required && !config.image_required && (
                        <span className="text-xs font-bold bg-[var(--surface-muted)] text-[var(--text-tertiary)] px-2 py-1 rounded-lg tracking-tight border border-[var(--border)]/50">Optional</span>
                    )}
                </div>
            )}

            <div className="bg-[var(--surface)] rounded-xl p-6 border border-[var(--border)] shadow-sm transition-all group-hover:border-[var(--border)] space-y-5">
                {schema ? (
                    <div className="space-y-4">
                        {schema.map((field) => (
                            <div key={field.id} className="space-y-2">
                                <label className="text-xs font-bold text-[var(--text-primary)] tracking-tight block px-1">
                                    {field.label} {field.required && <span className="text-rose-500">*</span>}
                                </label>
                                {field.type === 'text' ? (
                                    <input
                                        type="text"
                                        value={input[field.id] || ''}
                                        onChange={(e) => onInputChange(field.id, e.target.value)}
                                        placeholder={field.placeholder}
                                        className="w-full bg-[var(--surface-muted)] border-[var(--border)] rounded-xl p-3 text-sm focus:bg-[var(--surface)] focus:border-[var(--text-primary)] transition-all outline-none border"
                                    />
                                ) : field.type === 'textarea' ? (
                                    <Textarea
                                        value={input[field.id] || ''}
                                        onChange={(e) => onInputChange(field.id, e.target.value)}
                                        placeholder={field.placeholder}
                                        className="w-full bg-[var(--surface-muted)] border-[var(--border)] rounded-xl p-3 text-sm focus:bg-[var(--surface)] focus:border-[var(--text-primary)] transition-all outline-none border min-h-[80px]"
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
                                    <label className="text-xs font-bold text-[var(--text-primary)] tracking-tight flex items-center gap-1.5">
                                        {config.text_label || 'Personalisation Theme'}
                                    </label>
                                    {config.char_limit && (
                                        <span className={cn(
                                            "text-xs font-bold tracking-tight tabular-nums",
                                            (input.text?.length || 0) > config.char_limit ? "text-rose-500" : "text-[var(--text-tertiary)]"
                                        )}>
                                            {input.text?.length || 0}/{config.char_limit}
                                        </span>
                                    )}
                                </div>

                                { /* WYSHKIT 2026: Smart Prediction Tokens (Anticipatory UX) */}
                                <div className="flex flex-wrap gap-2 px-1">
                                    {[
                                        { label: '🎂 Birthday', value: 'Theme: Happy Birthday! Add name and date.' },
                                        { label: '💍 Anniversary', value: 'Theme: Anniversary. Elegant style.' },
                                        { label: '❤️ Love', value: 'Theme: Romantic/Love. Add initials.' },
                                        { label: '🎓 Grad', value: 'Theme: Graduation. Class of 2026.' }
                                    ].map(token => (
                                        <button
                                            key={token.label}
                                            type="button"
                                            onClick={() => {
                                                const current = input.text || '';
                                                onInputChange('text', current ? `${current}\n${token.value}` : token.value);
                                            }}
                                            className="text-xs font-bold px-2.5 py-1 rounded-lg bg-[var(--surface-muted)] border border-[var(--border)] text-[var(--text-secondary)] hover:bg-[var(--surface-muted)] transition-all active:scale-95"
                                        >
                                            {token.label}
                                        </button>
                                    ))}
                                </div>

                                <Textarea
                                    value={input.text || ''}
                                    onChange={(e) => onInputChange('text', e.target.value)}
                                    placeholder={config.placeholder || "What should the design focus on?"}
                                    className="w-full bg-[var(--surface-muted)]/50 border-[var(--border)] rounded-[var(--radius-xl)] p-5 text-sm font-medium focus:bg-[var(--surface)] focus:border-[var(--primary)] focus:ring-4 focus:ring-[var(--primary)]/5 transition-all outline-none min-h-[120px] resize-none placeholder:text-[var(--text-tertiary)] border shadow-none text-[var(--text-primary)] leading-relaxed"
                                    maxLength={config.char_limit}
                                />
                            </div>
                        )}

                        {config.allow_image && (
                            <div className="space-y-4">
                                <div className="flex items-center gap-2 px-1">
                                    <div className="h-px flex-1 bg-[var(--surface-muted)]" />
                                    <span className="text-xs font-bold text-[var(--text-tertiary)] tracking-tight leading-none">Visual Reference</span>
                                    <div className="h-px flex-1 bg-[var(--surface-muted)]" />
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
                                        className="flex flex-col items-center justify-center gap-2 py-5 bg-[var(--surface-muted)] border border-[var(--border)] rounded-xl hover:bg-[var(--surface-muted)] transition-all active:scale-[0.98] disabled:opacity-50 group/btn"
                                    >
                                        <ImageIcon className="size-5 text-[var(--text-tertiary)] group-hover/btn:text-[var(--text-secondary)] group-hover/btn:scale-110 transition-all" />
                                        <span className="text-xs font-bold text-[var(--text-tertiary)] tracking-tight group-hover/btn:text-[var(--text-secondary)] transition-colors">Library</span>
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
                                        className="flex flex-col items-center justify-center gap-2 py-5 bg-[var(--text-primary)] rounded-xl hover:bg-[var(--foreground)] transition-all active:scale-[0.98] disabled:opacity-50 group/btn shadow-lg shadow-[var(--shadow-sm)]"
                                    >
                                        <Camera className="size-5 text-white/60 group-hover/btn:text-white group-hover/btn:scale-110 transition-all" />
                                        <span className="text-xs font-bold text-white/60 tracking-tight group-hover/btn:text-white transition-colors">Capture</span>
                                    </button>
                                </div>

                                {uploadingProgress !== undefined && (
                                    <div className="space-y-2 animate-in fade-in duration-300">
                                        <div className="flex items-center justify-between px-1">
                                            <span className="text-xs font-bold text-[var(--text-primary)] tracking-tight">Processing Image...</span>
                                            <span className="text-xs font-bold text-[var(--text-tertiary)] tabular-nums">{Math.round(uploadingProgress)}%</span>
                                        </div>
                                        <Progress value={uploadingProgress} className="h-1.5 bg-[var(--surface-muted)]" />
                                    </div>
                                )}

                                {input.image_url && (
                                    <div className="relative aspect-video rounded-xl overflow-hidden border border-[var(--border)] group shadow-sm bg-[var(--surface-muted)] animate-in zoom-in-95 duration-500">
                                        <img src={input.image_url} alt="Preview" className="size-full object-cover" />
                                        <div className="absolute inset-0 bg-[var(--foreground)]/10 group-hover:bg-[var(--foreground)]/20 transition-all" />
                                        <button
                                            type="button"
                                            onClick={() => onInputChange('image_url', '')}
                                            className="absolute top-3 right-3 size-10 bg-[var(--surface)] shadow-sm rounded-full flex items-center justify-center text-[var(--text-primary)] hover:scale-110 active:scale-95 transition-all z-10"
                                        >
                                            <X className="size-5" />
                                        </button>
                                    </div>
                                )}

                                {pastMockupUrl && (
                                    <div className="space-y-3 p-4 bg-[var(--well-warning)] rounded-xl border border-[var(--warning)]/20">
                                        <div className="flex items-center gap-2">
                                            <Sparkles className="size-3 text-[var(--warning)]" />
                                            <span className="text-xs font-bold text-[var(--text-primary)] tracking-tight uppercase">Previous Design Reference</span>
                                        </div>
                                        <div className="relative aspect-video rounded-lg overflow-hidden border border-[var(--border)] shadow-sm">
                                            <img src={pastMockupUrl} alt="Previous Design" className="size-full object-cover opacity-80" />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                                        </div>
                                        <p className="text-xs font-medium text-[var(--text-secondary)] leading-tight">
                                            Use your previous approved design as a guide for your new request.
                                        </p>
                                    </div>
                                )}
                            </div>
                        )}
                    </>
                )}

                {config.instructions && (
                    <div className="flex gap-2.5 p-4 bg-[var(--surface-muted)]/50 rounded-xl border border-[var(--border)]/50">
                        <Info className="size-3.5 text-[var(--text-tertiary)] shrink-0 mt-0.5" />
                        <p className="text-xs text-[var(--text-secondary)] font-medium leading-relaxed">
                            {config.instructions}
                        </p>
                    </div>
                )}
            </div>
        </section>
    );
}
