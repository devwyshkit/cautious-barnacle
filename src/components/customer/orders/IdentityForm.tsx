'use client';

import React, { useState, useEffect } from 'react';
import { Sparkles, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';
import { ActionSlider } from '@/components/ui/ActionSlider';
import { triggerHaptic, HapticPattern } from '@/lib/utils/haptic';
import { createClient } from '@/lib/supabase/client';
import { logger } from '@/lib/logging/logger';
import { submit_order_personalization } from '@/lib/actions/commerce/orders';
import imageCompression from 'browser-image-compression';

import { PersonalizationConfig, SelectedPersonalization, SelectedAddon } from '@/lib/types/personalization';
import { IdentityFormHeader } from './IdentityFormHeader';
import { IdentityItemField } from './IdentityItemField';
import { IdentitySuccessState } from './IdentitySuccessState';

interface OrderItem {
    id: string;
    item_name: string;
    is_personalized?: boolean;
    personalization_config?: PersonalizationConfig;
    personalization?: SelectedPersonalization;
    selected_addons?: SelectedAddon[];
    personalization_details?: SelectedPersonalization;
    personalization_schema?: any[];
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

    // Load draft details on mount
    useEffect(() => {
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
    useEffect(() => {
        if (Object.keys(formData).length > 0) {
            localStorage.setItem(`wyshkit_draft_${orderId}`, JSON.stringify(formData));
        }
    }, [formData, orderId]);

    const personalizedItems = items;
    const allOptional = personalizedItems.every(item => {
        const config = item.personalization_config || {};
        return !config.text_required && !config.image_required;
    });

    const handleInputChange = (itemId: string, field: string, value: string) => {
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
                onProgress: (percent: number) => {
                    setUploadingItems(prev => ({ ...prev, [itemId]: 10 + (percent * 0.4) }));
                }
            };

            const compressedFile = await imageCompression(file, options);
            const finalFile = new File([compressedFile], file.name, { type: file.type || 'image/jpeg' });
            const supabase = createClient();
            const fileName = `customer-uploads/${orderId}/${itemId}-${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.]/g, '_')}`;

            const { data, error } = await supabase.storage
                .from('order-assets')
                .upload(fileName, finalFile);

            if (error) throw error;

            setUploadingItems(prev => ({ ...prev, [itemId]: 100 }));
            const { data: { publicUrl } } = supabase.storage.from('order-assets').getPublicUrl(data.path);

            handleInputChange(itemId, 'image_url', publicUrl);
            triggerHaptic(HapticPattern.SUCCESS);
            setTimeout(() => setUploadingItems(prev => {
                const next = { ...prev };
                delete next[itemId];
                return next;
            }), 1000);
            toast.success("Image added to design");
        } catch (error) {
            logger.error('Image upload error', error as Error);
            toast.error('Failed to upload image');
            setUploadingItems(prev => {
                const next = { ...prev };
                delete next[itemId];
                return next;
            });
        }
    };

    const handleSubmit = async () => {
        // Validation logic
        for (const item of personalizedItems) {
            const config = (item.personalization_config || {}) as PersonalizationConfig;
            const input = formData[item.id] || {};
            if (config.text_required && !input.text?.trim()) {
                toast.error(`Please provide details for ${item.item_name}`);
                return;
            }
        }

        setIsSubmitting(true);
        setIsOptimisticSuccess(true);
        triggerHaptic(HapticPattern.SUCCESS);

        try {
            const personalizationData = personalizedItems.reduce((acc: Record<string, any>, item: any) => {
                const itemFormData = formData[item.id] || {};
                acc[item.id] = {
                    text: itemFormData.text || null,
                    image_url: itemFormData.image_url || null,
                    addons: (item.selected_addons || []).filter((a: any) => a.requires_preview).map((a: any) => a.name)
                };
                return acc;
            }, {});

            const result = await submit_order_personalization(orderId, personalizationData);
            if (result.success) {
                localStorage.removeItem(`wyshkit_draft_${orderId}`);
                onSubmitted();
            } else {
                toast.error(result.error || "Submission failed");
            }
        } catch (error) {
            toast.error("An unexpected error occurred");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isOptimisticSuccess) {
        return <IdentitySuccessState onClose={onSubmitted} />;
    }

    if (personalizedItems.length === 0) return null;

    return (
        <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
            {isAutoOpenedForSuccess && <IdentityFormHeader orderId={orderId} designDeadline={designDeadline} />}

            <div className="space-y-6">
                {personalizedItems.map((item, idx) => {
                    const legacyConfig = item.personalization_config || (item.personalization as any) || {};
                    const addons = (item.selected_addons || []).filter(a => a.requires_preview);
                    const config: PersonalizationConfig = addons.length > 0 ? {
                        text_required: true,
                        allow_text: true,
                        allow_image: true,
                        text_label: addons.length === 1 ? `Details for ${addons[0].name}` : `Identity Details`,
                        placeholder: "e.g. Name: 'Prateek', Date: '20th Oct'..."
                    } : {
                        ...legacyConfig,
                        allow_text: legacyConfig.allow_text ?? true,
                        text_label: legacyConfig.text_label ?? legacyConfig.prompt ?? 'details',
                        text_required: legacyConfig.text_required ?? true
                    };

                    return (
                        <IdentityItemField
                            key={item.id}
                            item={item}
                            itemIndex={idx}
                            totalItems={personalizedItems.length}
                            config={config}
                            schema={item.personalization_schema}
                            input={formData[item.id] || {}}
                            uploadingProgress={uploadingItems[item.id]}
                            onInputChange={(field, value) => handleInputChange(item.id, field, value)}
                            onFileUpload={(file) => handleFileUpload(item.id, file)}
                        />
                    );
                })}
            </div>

            <div className="pt-4 flex flex-col gap-6">
                <div className="bg-zinc-50 p-6 rounded-xl border border-zinc-100 shadow-inner">
                    <div className="flex justify-center gap-4 mb-6 opacity-30">
                        <span className="flex items-center gap-1.5 text-[8px] font-black tracking-tight"><ShieldCheck className="size-3" /> Encrypted</span>
                        <span className="flex items-center gap-1.5 text-[8px] font-black tracking-tight"><CheckCircle2 className="size-3" /> Verified</span>
                    </div>

                    <ActionSlider
                        onConfirm={handleSubmit}
                        label="Slide to Share Brief"
                        successLabel="Shared"
                        isLoading={isSubmitting}
                        variant="amber"
                        className="h-16"
                    />
                </div>

                {onSkip && (
                    <button
                        onClick={onSkip}
                        className="w-full text-center text-xs font-black text-zinc-400 tracking-tight hover:text-zinc-600 transition-colors py-2 active:scale-95"
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
