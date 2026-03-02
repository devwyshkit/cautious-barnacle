"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { PhoneInput } from "@/components/auth/PhoneInput";
import { OTPInput } from "@/components/auth/OTPInput";
import { useAuth } from "@/providers/AuthProvider";
import { ChevronLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import { Logo } from "@/components/ui/Logo";
import { logger } from '@/lib/logging/logger';
import { triggerHaptic, HapticPattern } from "@/lib/utils/haptic";

interface AuthPageClientProps {
  intent?: string;
  returnUrl?: string;
  title?: string;
  description?: string;
  hideHeader?: boolean;
  hideBack?: boolean;
  onComplete?: () => void;
}

/**
 * WYSHKIT 2026: Intent-Based Auth Page Client Component
 * Uses routes instead of Zustand drawers
 */
export function AuthPageClient({
  intent = 'signin',
  returnUrl = '/',
  title = "Login",
  description = "Enter your phone number to continue",
  hideHeader = false,
  hideBack = false,
  onComplete,
}: AuthPageClientProps) {
  const router = useRouter();
  const { signInWithPhone, verifyOTP } = useAuth();
  const [step, setStep] = useState<"phone" | "otp">("phone");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isWarning, setIsWarning] = useState(false);

  const handleSendOTP = async () => {
    if (!phone || phone.length !== 10) {
      setError("Enter a valid 10-digit number");
      return;
    }

    setError("");
    setLoading(true);

    try {
      triggerHaptic(HapticPattern.ACTION);
      const result = await signInWithPhone(phone);
      setLoading(false);

      if (result.success) {
        setStep("otp");
        setOtp("");
      } else {
        const isRetryable = result.isRetryable || result.error?.includes("500");
        if (isRetryable) {
          setError("OTP might be delayed. Please wait a moment.");
          setIsWarning(true);
          setStep("otp");
        } else if (result.error?.includes("rate limit")) {
          setError("Too many attempts. Wait 60s.");
        } else {
          setError(result.error || "Failed to send OTP");
        }
      }
    } catch {
      setLoading(false);
      setError("Connection issue. If you got an OTP, proceed.");
      setStep("otp");
    }
  };

  const handleVerifyOTP = async (otpValue: string) => {
    setError("");
    setLoading(true);

    try {
      triggerHaptic(HapticPattern.SUCCESS);
      const result = await verifyOTP(phone, otpValue);

      if (result.success) {
        // WYSHKIT 2026: Ensure session is propagated before redirect
        setLoading(false);

        // WYSHKIT 2026: Intent-Based Navigation
        if (onComplete) {
          onComplete();
        } else {
          router.push(returnUrl);
          router.refresh();
        }
      } else {
        setError(result.error || "Invalid OTP");
        setLoading(false);
      }
    } catch (err: any) {
      logger.error('OTP verification error in AuthPageClient', err);
      setError("Verification failed");
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    setError("");
    setLoading(true);
    try {
      const result = await signInWithPhone(phone);
      setLoading(false);
      if (!result.success && !result.isRetryable) {
        setError(result.error || "Failed to resend");
      }
    } catch {
      setLoading(false);
      setError("Connection issue");
    }
  };

  return (
    <div className={cn("max-w-md mx-auto w-full", hideHeader ? "py-0" : "py-6 sm:py-8 px-4 sm:px-6")}>
      {!hideHeader && (
        <div className="flex items-center justify-between mb-6">
          {step === "otp" ? (
            <button
              onClick={() => setStep("phone")}
              className="size-9 rounded-xl bg-[var(--surface-muted)] flex items-center justify-center transition-colors hover:bg-[var(--border)]"
            >
              <ChevronLeft className="size-5 text-[var(--text-secondary)]" />
            </button>
          ) : !hideBack ? (
            <button
              onClick={() => router.back()}
              className="size-9 rounded-xl bg-[var(--surface-muted)] flex items-center justify-center transition-colors hover:bg-[var(--input)]"
            >
              <ChevronLeft className="size-5 text-[var(--text-secondary)]" />
            </button>
          ) : (
            <div className="size-9" />
          )}

          <Logo variant="minimal" className="scale-90" />

          <div className="size-9" /> {/* Spacer for symmetry */}
        </div>
      )}

      <div className="text-center mb-8">
        <h2 className="text-2xl font-semibold text-[var(--text-primary)] tracking-tight">
          {step === "phone" ? title : "Verify OTP"}
        </h2>
        <p className="text-sm text-[var(--text-secondary)] mt-1.5">
          {step === "phone" ? description : `Code sent to +91 ${phone}`}
        </p>
      </div>

      {step === "phone" ? (
        <div className="space-y-5">
          <PhoneInput
            value={phone}
            onChange={setPhone}
            error={isWarning ? "" : error}
            disabled={loading}
          />
          <Button
            onClick={handleSendOTP}
            disabled={loading || phone.length !== 10}
            className={cn(
              "w-full h-14 rounded-xl font-bold text-base transition-all shadow-none",
              phone.length === 10 ? "bg-[var(--text-primary)] hover:opacity-90 active:scale-95 text-white" : "bg-[var(--surface-muted)] text-[var(--text-tertiary)]"
            )}
          >
            {loading ? "Sending..." : "Continue"}
          </Button>
          <p className="text-center text-xs text-[var(--text-tertiary)] px-8 leading-relaxed">
            By continuing, you agree to our <span className="text-[var(--text-primary)] font-medium hover:underline cursor-pointer">Terms of Service</span> and <span className="text-[var(--text-primary)] font-medium hover:underline cursor-pointer">Privacy Policy</span>
          </p>
        </div>
      ) : (
        <div className="space-y-8">
          <OTPInput
            value={otp}
            onChange={setOtp}
            onComplete={handleVerifyOTP}
            onResend={handleResendOTP}
            error={isWarning ? "" : error}
            disabled={loading}
          />
          <div className="text-center">
            <p className="text-sm text-[var(--text-secondary)]">
              Didn&apos;t receive the code?
              <button
                onClick={handleResendOTP}
                className="text-[var(--text-primary)] ml-1.5 font-semibold hover:underline"
                disabled={loading}
              >
                Resend OTP
              </button>
            </p>
          </div>
        </div>
      )}

      {error && (
        <div className={cn(
          "mt-4 p-3 rounded-xl text-xs font-medium text-center animate-in fade-in slide-in-from-bottom-2",
          isWarning ? "bg-[var(--well-warning)] text-[var(--well-warning-text)] border border-[var(--warning-border)]" : "bg-[var(--well-destructive)] text-[var(--well-destructive-text)] border border-[var(--destructive)]/20"
        )}>
          {error}
        </div>
      )}
    </div>
  );
}
