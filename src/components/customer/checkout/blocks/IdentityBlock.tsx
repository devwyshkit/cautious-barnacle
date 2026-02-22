'use client';

import React, { useState } from 'react';
import { PhoneInput } from '@/components/auth/PhoneInput';
import { OTPInput } from '@/components/auth/OTPInput';
import { useAuth } from '@/hooks/useAuth';
import { cn } from '@/lib/utils';
import type { IdentityState } from '../types';
import { Smartphone, Check } from 'lucide-react';

interface IdentityBlockProps {
  identity: IdentityState;
  onComplete: (state: IdentityState) => void;
}

export function IdentityBlock({ identity, onComplete }: IdentityBlockProps) {
  const { user, signInWithPhone, verifyOTP } = useAuth();
  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (user) {
    return (
      <div className="space-y-2 font-sans">
        <label className="label-overline">Identity</label>

        <div className="p-2.5 bg-zinc-50 rounded-lg border border-zinc-100 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="size-8 rounded-full bg-zinc-900 flex items-center justify-center">
              <Check className="text-white size-4 stroke-[3px]" />
            </div>
            <div>
              <p className="text-[13px] font-semibold text-zinc-900">
                {user.user_metadata?.full_name || 'Verified user'}
              </p>
              <p className="text-xs font-medium text-zinc-500">
                {user.phone || user.email}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const handleSendOTP = async () => {
    if (!phone || phone.length !== 10) {
      setError('Enter a valid 10-digit number');
      return;
    }

    setError('');
    setLoading(true);

    try {
      const result = await signInWithPhone(phone);
      setLoading(false);

      if (result.success) {
        setStep('otp');
        setOtp('');
      } else {
        const isRetryable = result.isRetryable || result.error?.includes('500');
        if (isRetryable) {
          setError('SMS provider not configured. For test numbers, enter the OTP configured in Supabase Dashboard (Auth > Phone > Test OTP).');
          setStep('otp');
        } else {
          setError(result.error || 'Failed to send OTP');
        }
      }
    } catch {
      setLoading(false);
      setError('Connection issue. Proceed if you received OTP.');
      setStep('otp');
    }
  };

  const handleVerifyOTP = async (otpValue: string) => {
    setError('');
    setLoading(true);

    try {
      const result = await verifyOTP(phone, otpValue);

      if (result.success) {
        setLoading(false);
        onComplete('logged-in');
      } else {
        // WYSHKIT 2026: Better error messages for test OTP debugging
        const errorMsg = result.error || 'Invalid OTP';
        if (errorMsg.includes('expired') || errorMsg.includes('invalid')) {
          setError('Invalid or expired OTP. For test numbers, use the OTP configured in Supabase.');
        } else {
          setError(errorMsg);
        }
        setLoading(false);
      }
    } catch {
      setError('Verification failed');
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    setError('');
    setLoading(true);
    try {
      const result = await signInWithPhone(phone);
      setLoading(false);
      if (!result.success && !result.isRetryable) {
        setError(result.error || 'Failed to resend');
      }
    } catch {
      setLoading(false);
      setError('Connection issue');
    }
  };

  return (
    <div className="space-y-2 font-sans">
      <label className="label-overline">Identity verification</label>

      {step === 'phone' ? (
        <div className="space-y-2 md:max-w-md">
          <PhoneInput
            value={phone}
            onChange={setPhone}
            error={error}
            disabled={loading}
          />
          <button
            onClick={handleSendOTP}
            disabled={loading || phone.length !== 10}
            className={cn(
              "w-full h-10 rounded-lg font-bold text-sm transition-all active:scale-95",
              phone.length === 10 && !loading
                ? "bg-zinc-900 text-white"
                : "bg-zinc-100 text-zinc-400"
            )}
          >
            {loading ? 'Sending...' : 'Send OTP'}
          </button>
        </div>
      ) : (
        <div className="space-y-2 md:max-w-md">
          <OTPInput
            value={otp}
            onChange={setOtp}
            onComplete={handleVerifyOTP}
            onResend={handleResendOTP}
            error={error}
            disabled={loading}
          />
          <button
            onClick={() => setStep('phone')}
            className="text-xs font-bold text-zinc-400 hover:text-zinc-900 transition-colors px-1"
          >
            Change mobile number
          </button>
        </div>
      )}
    </div>
  );
}
