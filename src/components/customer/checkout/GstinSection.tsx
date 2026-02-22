'use client';

import { useState } from 'react';
import { ShieldCheck, ChevronDown, ChevronUp, Loader2, Check, XCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { validateGSTINAction } from '@/lib/actions/commerce/gstin';
import { toast } from 'sonner';

interface GstinSectionProps {
    initialGstin?: string;
    onGstinChange?: (gstin: string) => void;
    onBusinessNameChange?: (name: string | null) => void;
}

export function GstinSection({ initialGstin = '', onGstinChange, onBusinessNameChange }: GstinSectionProps) {
    const [gstin, setGstin] = useState(initialGstin);
    const [expanded, setExpanded] = useState(false);
    const [validation, setValidation] = useState<'idle' | 'validating' | 'valid' | 'invalid'>('idle');
    const [error, setError] = useState<string | null>(null);
    const [businessName, setBusinessName] = useState<string | null>(null);

    const handleBlur = async () => {
        const trimmed = gstin.trim();
        if (!trimmed) {
            setValidation('idle');
            setError(null);
            onBusinessNameChange?.(null);
            return;
        }
        setValidation('validating');
        setError(null);

        try {
            const result = await validateGSTINAction(trimmed);
            if (result.valid) {
                setValidation('valid');
                setError(null);
                setBusinessName(result.businessName ?? null);
                onBusinessNameChange?.(result.businessName ?? null);
                if (result.businessName) {
                    toast.success(`Verified: ${result.businessName}`);
                }
            } else {
                setValidation('invalid');
                setError(result.error ?? 'Invalid GSTIN');
                setBusinessName(null);
                onBusinessNameChange?.(null);
            }
        } catch (err) {
            setValidation('invalid');
            setError('Validation failed');
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value.toUpperCase();
        setGstin(val);
        onGstinChange?.(val);
    };

    return (
        <section className="bg-white rounded-[28px] border border-zinc-100 overflow-hidden transition-all duration-300 shadow-sm">
            <button
                onClick={() => setExpanded(!expanded)}
                className="w-full px-6 py-5 flex items-center justify-between hover:bg-zinc-50/50 transition-colors"
                type="button"
            >
                <div className="flex items-center gap-3">
                    <div className="size-10 rounded-2xl bg-zinc-50 flex items-center justify-center text-zinc-400">
                        <ShieldCheck className={cn("size-5", validation === 'valid' && "text-emerald-500")} />
                    </div>
                    <div className="text-left">
                        <p className="text-[13px] font-black tracking-tight text-zinc-900">Business purchase?</p>
                        <p className="text-xs font-bold text-zinc-400 tracking-wider mt-0.5">
                            {validation === 'valid' ? businessName : 'Add GSTIN for tax invoice (Optional)'}
                        </p>
                    </div>
                </div>
                {expanded ? <ChevronUp className="size-4 text-zinc-300" /> : <ChevronDown className="size-4 text-zinc-300" />}
            </button>

            {expanded && (
                <div className="px-6 pb-6 animate-in slide-in-from-top-2 duration-300">
                    <div className="relative">
                        <input
                            type="text"
                            value={gstin}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            placeholder="Enter 15-digit GSTIN"
                            className={cn(
                                "w-full h-14 bg-zinc-50 rounded-2xl px-5 text-sm font-bold border-2 transition-all outline-none",
                                validation === 'idle' && "border-transparent focus:border-zinc-200",
                                validation === 'validating' && "border-zinc-100",
                                validation === 'valid' && "border-emerald-100 text-emerald-900 bg-emerald-50/30",
                                validation === 'invalid' && "border-rose-100 text-rose-900 bg-rose-50/30"
                            )}
                        />
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
                            {validation === 'validating' && <Loader2 className="size-4 animate-spin text-zinc-400" />}
                            {validation === 'valid' && <Check className="size-4 text-emerald-500" />}
                            {validation === 'invalid' && <XCircle className="size-4 text-rose-500" />}
                        </div>
                    </div>
                    {error && (
                        <p className="mt-2 ml-1 text-xs font-bold text-rose-500 tracking-wider">{error}</p>
                    )}
                    <p className="mt-3 px-1 text-[11px] font-medium text-zinc-400 leading-relaxed">
                        Enter your GSTIN to claim input tax credit on business purchases. Verified in real time.
                    </p>
                </div>
            )}
        </section>
    );
}
