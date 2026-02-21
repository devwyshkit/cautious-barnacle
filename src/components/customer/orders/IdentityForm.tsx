'use client';

import React, { useState } from 'react';
import { Sparkles, Camera, Image as ImageIcon, Info, ShieldCheck, Check, Clock, X, Loader2, CheckCircle2, ShoppingBag } from 'lucide-react';
import { toast } from 'sonner';
import { Textarea } from '@/components/ui/textarea';
import { ActionSlider } from '@/components/ui/ActionSlider';
import { triggerHaptic, HapticPattern } from '@/lib/utils/haptic';
import { createClient } from '@/lib/supabase/client';
import { logger } from '@/lib/logging/logger';
import { submit_order_personalization } from '@/lib/actions/orders';
import { cn } from '@/lib/utils';
import imageCompression from 'browser-image-compression';
import { HyperlocalTimer } from '@/components/ui/HyperlocalTimer';
import { Progress } from '@/components/ui/progress';

import { PersonalizationConfig, SelectedPersonalization, SelectedAddon } from '@/lib/types/personalization';

interface OrderItem {
    id: string;
    item_name: string;
    is_personalized?: boolean;
    personalization_config?: PersonalizationConfig;
    personalization?: SelectedPersonalization;
    selected_addons?: SelectedAddon[];
    personalization_details?: SelectedPersonalization;
}

interface IdentityFormProps {
    orderId: string;
    items: OrderItem[];
    onSubmitted: () => void;
    onSkip?: () => void;
    designDeadline?: string | null;
    isAutoOpenedForSuccess?: boolean;
}

export function IdentityForm({
    orderId,
    items,
    onSubmitted,
    onSkip,
    designDeadline,
    isAutoOpenedForSuccess
}: IdentityFormProps) {
    const [formData, setFormData] = useState<Record<string, { text?: string; image_url?: string }>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isOptimisticSuccess, setIsOptimisticSuccess] = useState(false);
    const [uploadingItems, setUploadingItems] = useState<Record<string, number>>({});

    // WYSHKIT 2026: Momentum Persistence
    // Load draft details on mount
    React.useEffect(() => {
        const saved = localStorage.getItem(`wyshkit_draft_${orderId}`);
        if (saved) {
            try {
                setFormData(JSON.parse(saved));
            } catch (e) {
                logger.error('Failed to parse saved draft', e as Error);
            }
        }
    }, [orderId]);

    // Save draft details on change
    React.useEffect(() => {
        if (Object.keys(formData).length > 0) {
            localStorage.setItem(`wyshkit_draft_${orderId}`, JSON.stringify(formData));
        }
    }, [formData, orderId]);

    const personalizedItems = items;
    const allOptional = isAllOptional(personalizedItems);

    const handleInputChange = (itemId: string, field: 'text' | 'image_url', value: string) => {
        setFormData(prev => ({
            ...prev,
            [itemId]: {
                ...prev[itemId],
                [field]: value
            }
        }));
    };

    const handleFileUpload = async (itemId: string, file: File) => {
        if (!file) return;

        try {
            setUploadingItems(prev => ({ ...prev, [itemId]: 10 }));

            const options = {
                maxSizeMB: 0.5,
                maxWidthOrHeight: 1200,
                useWebWorker: true,
                initialQuality: 0.8,
                onProgress: (percent: number) => {
                    setUploadingItems(prev => ({ ...prev, [itemId]: 10 + (percent * 0.4) }));
                }
            };

            const compressedFile = await imageCompression(file, options);
            setUploadingItems(prev => ({ ...prev, [itemId]: 50 }));

            const finalFile = new File([compressedFile], file.name, { type: file.type || 'image/jpeg' });

            const supabase = createClient();
            const fileName = `customer-uploads/${orderId}/${itemId}-${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.]/g, '_')}`;

            // Simulate upload progress
            const uploadInterval = setInterval(() => {
                setUploadingItems(prev => {
                    const current = prev[itemId] || 50;
                    if (current < 90) return { ...prev, [itemId]: current + 5 };
                    return prev;
                });
            }, 100);

            const { data, error } = await supabase.storage
                .from('order-assets')
                .upload(fileName, finalFile, {
                    cacheControl: '3600',
                    upsert: false
                });

            clearInterval(uploadInterval);

            if (error) throw error;

            setUploadingItems(prev => ({ ...prev, [itemId]: 100 }));

            const { data: { publicUrl } } = supabase.storage
                .from('order-assets')
                .getPublicUrl(data.path);

            handleInputChange(itemId, 'image_url', publicUrl);
            triggerHaptic(HapticPattern.SUCCESS);

            setTimeout(() => {
                setUploadingItems(prev => {
                    const next = { ...prev };
                    delete next[itemId];
                    return next;
                });
            }, 1000);

            toast.success("Image added to design");
        } catch (error) {
            const err = error as Error;
            logger.error('Image upload error in IdentityForm', err);
            toast.error(err.message || 'Failed to upload image');
            setUploadingItems(prev => {
                const next = { ...prev };
                delete next[itemId];
                return next;
            });
        }
    };

    const handleSubmit = async () => {
        for (const item of personalizedItems) {
            const legacyConfig = item.personalization_config || ({} as PersonalizationConfig);
            const addons = item.selected_addons?.filter(a => a.requires_preview) || [];

            const isAddonFlow = addons.length > 0;
            const config: PersonalizationConfig = isAddonFlow ? {
                text_required: true,
                image_required: false,
                char_limit: 500,
                text_label: `Details for ${addons.map(a => a.name).join(', ')}`,
                placeholder: "Please describe how you want this personalized...",
                allow_text: true,
                allow_image: true
            } : legacyConfig;

            const input = formData[item.id] || {};

            if (config.text_required && !input.text?.trim()) {
                toast.error(`Please provide details for ${item.item_name}`);
                return { success: false };
            }
            if (config.char_limit && (input.text?.length || 0) > config.char_limit) {
                toast.error(`${item.item_name} text exceeds limit of ${config.char_limit} chars`);
                return { success: false };
            }
            if (config.image_required && !input.image_url) {
                toast.error(`Please upload an image for ${item.item_name}`);
                return { success: false };
            }
        }

        setIsSubmitting(true);
        // WYSHKIT 2026: Optimistic Success for instantaneous feel
        setIsOptimisticSuccess(true);
        triggerHaptic(HapticPattern.SUCCESS);

        try {
            const personalizationData = personalizedItems.reduce((acc: Record<string, any>, item: OrderItem) => {
                const itemFormData = formData[item.id] || {};
                const addons = item.selected_addons || [];

                acc[item.id] = {
                    text: itemFormData.text || null,
                    image_url: itemFormData.image_url || null,
                    addons: addons.filter(a => a.requires_preview).map(a => a.name)
                };
                return acc;
            }, {});

            const result = await submit_order_personalization(orderId, personalizationData);
            if (result.success) {
                triggerHaptic(HapticPattern.SUCCESS);
                // WYSHKIT 2026: Clear draft on success
                localStorage.removeItem(`wyshkit_draft_${orderId}`);
                onSubmitted();
            } else {
                toast.error(result.error || "Failed to submit details");
            }
            return result;
        } catch (error) {
            toast.error("An unexpected error occurred");
            return { success: false };
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isOptimisticSuccess) {
        return (
            <div className="flex flex-col items-center justify-center p-12 space-y-6 text-center animate-in fade-in zoom-in duration-500 min-h-[400px]">
                <div className="relative">
                    <div className="w-20 h-20 bg-emerald-500/10 rounded-full flex items-center justify-center border border-emerald-500/20">
                        <Check className="size-10 text-emerald-500" />
                    </div>
                    <Sparkles className="absolute -top-1 -right-1 size-6 text-amber-500 animate-pulse" />
                </div>
                <div className="space-y-2">
                    <h2 className="text-2xl font-black text-zinc-900 uppercase tracking-tight">Mission Started!</h2>
                    <p className="text-zinc-500 text-sm max-w-[280px] font-medium leading-relaxed">
                        Your vision is being transmitted to our partner. We'll alert you as soon as the preview is ready.
                    </p>
                </div>
                <div className="pt-8">
                    <button
                        onClick={() => onSubmitted()}
                        className="h-14 px-8 bg-zinc-900 text-white rounded-2xl font-black uppercase tracking-widest hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl shadow-zinc-950/20"
                    >
                        Great, thanks
                    </button>
                </div>
            </div>
        );
    }

    if (personalizedItems.length === 0) return null;

    return (
        <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500 font-outfit">
            {isAutoOpenedForSuccess && (
                <div className="bg-zinc-950 rounded-[2.5rem] p-7 text-white shadow-2xl shadow-zinc-950/20 border border-white/10 mb-8 relative overflow-hidden">
                    {/* Glossy Overlay effect */}
                    <div className="absolute top-0 inset-x-0 h-24 bg-gradient-to-b from-white/5 to-transparent pointer-events-none" />

                    <div className="flex items-start justify-between relative z-10 mb-4">
                        <div className="space-y-1">
                            <div className="flex items-center gap-3">
                                <div className="size-10 rounded-2xl bg-emerald-500 flex items-center justify-center shadow-lg shadow-emerald-500/20">
                                    <CheckCircle2 className="size-6 text-white" />
                                </div>
                                <h3 className="text-xl font-black uppercase tracking-tight">Mission Started</h3>
                            </div>
                            <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest mt-1">Design Hub • Order {orderId.slice(0, 8).toUpperCase()}</p>
                        </div>
                        <div className="size-12 rounded-3xl bg-white/5 backdrop-blur-md border border-white/10 flex items-center justify-center">
                            <Sparkles className="size-6 text-amber-500 animate-pulse" />
                        </div>
                    </div>

                    <p className="text-sm font-medium text-zinc-400 leading-relaxed max-w-[280px] mb-6 relative z-10">
                        Your payment is confirmed. To start the bespoke crafting process, please share your vision below.
                    </p>

                    {designDeadline && (
                        <div className="bg-white/5 border border-white/10 rounded-[2rem] p-5 flex items-center justify-between relative z-10 backdrop-blur-sm">
                            <div className="flex items-center gap-3">
                                <div className="size-9 rounded-full bg-rose-500/10 flex items-center justify-center border border-rose-500/20">
                                    <Clock className="size-4 text-rose-500" />
                                </div>
                                <div>
                                    <p className="text-[10px] font-black uppercase tracking-widest text-white/40 mb-0.5">Approval SLA Baseline</p>
                                    <HyperlocalTimer
                                        deadline={designDeadline}
                                        variant="minimal"
                                        className="text-[13px] font-black text-rose-500 p-0 shadow-none bg-transparent"
                                    />
                                </div>
                            </div>
                            <div className="px-3 py-1 bg-white/10 rounded-full border border-white/10">
                                <span className="text-[9px] font-black text-white/60 uppercase tracking-widest">Priority</span>
                            </div>
                        </div>
                    )}
                </div>
            )}

            <div className="space-y-6">
                {personalizedItems.map((item: OrderItem) => {
                    const legacyConfig: PersonalizationConfig = item.personalization_config || (item.personalization as unknown as PersonalizationConfig) || {};
                    const addons = (item.selected_addons || [])?.filter(a => a.requires_preview) || [];
                    const isAddonFlow = addons.length > 0;
                    const itemName = item.item_name;

                    const config: PersonalizationConfig = isAddonFlow ? {
                        text_required: true,
                        image_required: false,
                        char_limit: 500,
                        text_label: addons.length === 1 ? `Details for ${addons[0].name}` : `Identity Details`,
                        placeholder: "e.g. Name: 'Prateek', Date: '20th Oct'...",
                        allow_text: true,
                        allow_image: true,
                        instructions: "Our partner will use these details for your preview."
                    } : {
                        ...legacyConfig,
                        allow_text: legacyConfig.allow_text ?? true,
                        text_label: legacyConfig.text_label ?? (legacyConfig as any).prompt ?? 'details',
                        text_required: legacyConfig.text_required ?? true
                    };

                    const input = formData[item.id] || {};

                    return (
                        <section key={item.id} className="group transition-all">
                            {personalizedItems.length > 1 && (
                                <div className="flex items-center gap-3 mb-4 px-2">
                                    <div className="size-8 rounded-xl bg-zinc-900 flex items-center justify-center shadow-lg shadow-zinc-900/10">
                                        <ShoppingBag className="size-4 text-white" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h4 className="text-[12px] font-black text-zinc-950 uppercase tracking-tight truncate leading-none">
                                            {itemName}
                                        </h4>
                                        <p className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest mt-1">Item {items.indexOf(item) + 1}</p>
                                    </div>
                                    {!config.text_required && !config.image_required && (
                                        <span className="text-[9px] font-black bg-zinc-100 text-zinc-400 px-2 py-1 rounded-lg uppercase tracking-widest border border-zinc-200/50">Optional</span>
                                    )}
                                </div>
                            )}

                            <div className="bg-white rounded-[2rem] p-6 border border-zinc-100 shadow-sm transition-all group-hover:border-zinc-200 space-y-5">
                                {(config.allow_text || config.allow_image) && (
                                    <div className="space-y-4">
                                        {config.allow_text && (
                                            <div className="space-y-3">
                                                <div className="flex items-center justify-between px-1">
                                                    <label className="text-[10px] font-black text-zinc-900 uppercase tracking-widest flex items-center gap-1.5">
                                                        {config.text_label || 'Identity Theme'}
                                                    </label>
                                                    {config.char_limit && (
                                                        <span className={cn(
                                                            "text-[10px] font-bold tracking-tight tabular-nums",
                                                            (input.text?.length || 0) > config.char_limit ? "text-rose-500" : "text-zinc-400"
                                                        )}>
                                                            {input.text?.length || 0}/{config.char_limit}
                                                        </span>
                                                    )}
                                                </div>
                                                <Textarea
                                                    value={input.text || ''}
                                                    onChange={(e) => handleInputChange(item.id, 'text', e.target.value)}
                                                    placeholder={config.placeholder || "What should the design focus on?"}
                                                    className="w-full bg-zinc-50/50 border-zinc-100 rounded-2xl p-5 text-sm font-medium focus:bg-white focus:border-zinc-900 focus:ring-4 focus:ring-zinc-900/5 transition-all outline-none min-h-[120px] resize-none placeholder:text-zinc-300 border shadow-none text-zinc-900 leading-relaxed"
                                                    maxLength={config.char_limit}
                                                />
                                            </div>
                                        )}
                                    </div>
                                )}

                                {config.allow_image && (
                                    <div className="space-y-4">
                                        <div className="flex items-center gap-2 px-1">
                                            <div className="h-px flex-1 bg-zinc-50" />
                                            <span className="text-[9px] font-black text-zinc-300 uppercase tracking-widest leading-none">Visual Reference</span>
                                            <div className="h-px flex-1 bg-zinc-50" />
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <button
                                                type="button"
                                                disabled={!!uploadingItems[item.id]}
                                                onClick={() => {
                                                    const input = document.createElement('input');
                                                    input.type = 'file';
                                                    input.accept = 'image/*';
                                                    input.onchange = (e) => {
                                                        const file = (e.target as HTMLInputElement).files?.[0];
                                                        if (file) handleFileUpload(item.id, file);
                                                    };
                                                    triggerHaptic(HapticPattern.ACTION);
                                                    input.click();
                                                }}
                                                className="flex flex-col items-center justify-center gap-2 py-5 bg-zinc-50 border border-zinc-100 rounded-2xl hover:bg-zinc-100 transition-all active:scale-[0.98] disabled:opacity-50 group/btn"
                                            >
                                                <ImageIcon className="size-5 text-zinc-400 group-hover/btn:text-zinc-600 group-hover/btn:scale-110 transition-all" />
                                                <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest group-hover/btn:text-zinc-600 transition-colors">Library</span>
                                            </button>

                                            <button
                                                type="button"
                                                disabled={!!uploadingItems[item.id]}
                                                onClick={() => {
                                                    const input = document.createElement('input');
                                                    input.type = 'file';
                                                    input.accept = 'image/*';
                                                    input.capture = 'environment';
                                                    input.onchange = (e) => {
                                                        const file = (e.target as HTMLInputElement).files?.[0];
                                                        if (file) handleFileUpload(item.id, file);
                                                    };
                                                    triggerHaptic(HapticPattern.ACTION);
                                                    input.click();
                                                }}
                                                className="flex flex-col items-center justify-center gap-2 py-5 bg-zinc-900 rounded-2xl hover:bg-black transition-all active:scale-[0.98] disabled:opacity-50 group/btn shadow-lg shadow-zinc-200"
                                            >
                                                <Camera className="size-5 text-white/60 group-hover/btn:text-white group-hover/btn:scale-110 transition-all" />
                                                <span className="text-[10px] font-black text-white/60 uppercase tracking-widest group-hover/btn:text-white transition-colors">Capture</span>
                                            </button>
                                        </div>

                                        {uploadingItems[item.id] !== undefined && (
                                            <div className="space-y-2 animate-in fade-in duration-300">
                                                <div className="flex items-center justify-between px-1">
                                                    <span className="text-[9px] font-black text-zinc-900 uppercase tracking-widest">Processing Image...</span>
                                                    <span className="text-[10px] font-bold text-zinc-400 tabular-nums">{Math.round(uploadingItems[item.id])}%</span>
                                                </div>
                                                <Progress value={uploadingItems[item.id]} className="h-1.5 bg-zinc-100" />
                                            </div>
                                        )}

                                        {input.image_url && (
                                            <div className="relative aspect-video rounded-2xl overflow-hidden border border-zinc-100 group shadow-sm bg-zinc-50 animate-in zoom-in-95 duration-500">
                                                <img src={input.image_url} alt="Preview" className="size-full object-cover" />
                                                <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-all" />
                                                <button
                                                    type="button"
                                                    onClick={() => handleInputChange(item.id, 'image_url', '')}
                                                    className="absolute top-3 right-3 size-10 bg-white shadow-xl rounded-full flex items-center justify-center text-zinc-900 hover:scale-110 active:scale-95 transition-all z-10"
                                                >
                                                    <X className="size-5" />
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                )}

                                {config.instructions && (
                                    <div className="flex gap-2.5 p-4 bg-zinc-50/50 rounded-2xl border border-zinc-100/50">
                                        <Info className="size-3.5 text-zinc-400 shrink-0 mt-0.5" />
                                        <p className="text-[10px] text-zinc-500 font-medium leading-relaxed">
                                            {config.instructions}
                                        </p>
                                    </div>
                                )}
                            </div>
                        </section>
                    );
                })}
            </div>

            <div className="pt-4 flex flex-col gap-6">
                <div className="bg-zinc-50 p-6 rounded-[2.5rem] border border-zinc-100 shadow-inner">
                    <div className="flex justify-center gap-4 mb-6 opacity-30">
                        <span className="flex items-center gap-1.5 text-[8px] font-black uppercase tracking-widest"><ShieldCheck className="size-3" /> Encrypted</span>
                        <span className="flex items-center gap-1.5 text-[8px] font-black uppercase tracking-widest"><CheckCircle2 className="size-3" /> Verified</span>
                    </div>

                    <ActionSlider
                        onConfirm={handleSubmit}
                        label="Slide to Share Brief"
                        successLabel="Shared"
                        isLoading={isSubmitting}
                        variant="amber"
                        className="h-16 flex items-center justify-center px-2 bg-black text-white transition-all hover:bg-zinc-900 hover:shadow-2xl hover:shadow-zinc-200"
                    />
                </div>

                {onSkip && (
                    <button
                        onClick={onSkip}
                        className="w-full text-center text-[10px] font-black text-zinc-400 uppercase tracking-widest hover:text-zinc-600 transition-colors py-2 active:scale-95"
                    >
                        {allOptional ? "Skip (Optional)" : "I'll add details later"}
                    </button>
                )}
            </div>

            <div className="pt-2 flex items-center justify-center gap-2 opacity-10">
                <div className="h-px w-8 bg-zinc-950" />
                <Sparkles className="size-4" />
                <div className="h-px w-8 bg-zinc-950" />
            </div>
        </div>
    );
}

// Helper to determine if all items are optional
const isAllOptional = (items: OrderItem[]) => items.every(item => {
    const config = item.personalization_config || {};
    return !config.text_required && !config.image_required;
});
