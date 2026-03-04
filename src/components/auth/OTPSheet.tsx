'use client';

import React, { useState } from 'react';
import { useUI } from '@/providers/UIProvider';
import { useAuth } from '@/providers/AuthProvider';
import { ResponsiveSurface } from '@/components/ui/ResponsiveSurface';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, Phone } from 'lucide-react';
import { toast } from 'sonner';
import { triggerHaptic, HapticPattern } from '@/lib/utils/haptic';

export function OTPSheet() {
    const { isOTPSheetOpen, closeOTPSheet } = useUI();
    const { signInWithPhone, verifyOTP: verifyOTPAuth, loading: authLoading } = useAuth();
    const [phone, setPhone] = useState('');
    const [otp, setOtp] = useState('');
    const [step, setStep] = useState<'phone' | 'otp'>('phone');
    const [localLoading, setLocalLoading] = useState(false);

    const loading = localLoading || authLoading;

    const handleSendOTP = async () => {
        if (phone.length < 10) {
            toast.error('Enter a valid 10-digit mobile number');
            return;
        }
        setLocalLoading(true);
        triggerHaptic(HapticPattern.ACTION);

        try {
            const result = await signInWithPhone(phone);
            if (result.success) {
                setStep('otp');
                toast.success('OTP sent successfully');
            } else {
                toast.error(result.error || 'Failed to send OTP');
            }
        } catch (err) {
            toast.error('Connection error. Please try again.');
        } finally {
            setLocalLoading(false);
        }
    };

    const handleVerifyOTP = async () => {
        if (otp.length < 6) {
            toast.error('Enter the 6-digit OTP');
            return;
        }
        setLocalLoading(true);
        triggerHaptic(HapticPattern.ACTION);

        try {
            const result = await verifyOTPAuth(phone, otp);
            if (result.success) {
                triggerHaptic(HapticPattern.SUCCESS);
                toast.success('Logged in successfully');
                closeOTPSheet();
            } else {
                toast.error(result.error || 'Invalid OTP');
            }
        } catch (err) {
            toast.error('Verification failed. Please try again.');
        } finally {
            setLocalLoading(false);
        }
    };

    return (
        <ResponsiveSurface
            open={isOTPSheetOpen}
            onOpenChange={closeOTPSheet}
            title={step === 'phone' ? 'Login or Signup' : 'Verify Mobile'}
            description={step === 'phone' ? 'Enter your mobile number to proceed' : 'We sent a code to +91 ' + phone}
            className="md:max-w-md"
        >
            <div className="p-6 space-y-6">
                {step === 'phone' ? (
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="phone">Mobile Number</Label>
                            <div className="relative">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-bold text-[var(--text-tertiary)]">+91</span>
                                <Input
                                    id="phone"
                                    type="tel"
                                    placeholder="00000 00000"
                                    className="pl-12 h-12 text-base font-bold tracking-tight rounded-[var(--radius-xl)]"
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                                />
                            </div>
                        </div>
                        <Button
                            className="w-full h-12 rounded-[var(--radius-xl)] bg-[var(--text-primary)] text-[var(--text-inverse)] font-bold text-sm"
                            onClick={handleSendOTP}
                            disabled={loading}
                        >
                            {loading ? <Loader2 className="size-4 animate-spin" /> : 'Continue'}
                        </Button>
                    </div>
                ) : (
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="otp">Enter OTP</Label>
                            <Input
                                id="otp"
                                type="text"
                                maxLength={6}
                                placeholder="000000"
                                className="h-12 text-center text-lg font-bold tracking-[0.5em] rounded-[var(--radius-xl)]"
                                value={otp}
                                onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                            />
                        </div>
                        <Button
                            className="w-full h-12 rounded-[var(--radius-xl)] bg-[var(--primary)] text-[var(--primary-foreground)] font-bold text-sm"
                            onClick={handleVerifyOTP}
                            disabled={loading}
                        >
                            {loading ? <Loader2 className="size-4 animate-spin" /> : 'Verify & Login'}
                        </Button>
                        <button
                            onClick={() => setStep('phone')}
                            className="w-full text-xs font-bold text-[var(--text-tertiary)] hover:text-[var(--text-primary)] transition-colors"
                        >
                            Edit Number
                        </button>
                    </div>
                )}
                <p className="text-[10px] text-center text-[var(--text-tertiary)] leading-relaxed px-4">
                    By continuing, you agree to our Terms of Service and Privacy Policy.
                </p>
            </div>
        </ResponsiveSurface>
    );
}
