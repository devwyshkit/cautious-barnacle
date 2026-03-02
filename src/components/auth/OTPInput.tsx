"use client";

import { useState, useEffect } from "react";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

interface OTPInputProps {
  value: string;
  onChange: (value: string) => void;
  onComplete?: (value: string) => void;
  onResend?: () => void;
  onFocus?: () => void;
  error?: string;
  disabled?: boolean;
  resendCooldown?: number;
  className?: string;
}

export function OTPInput({
  value,
  onChange,
  onComplete,
  onResend,
  onFocus,
  error,
  disabled,
  resendCooldown = 30,
  className,
}: OTPInputProps) {
  const [cooldown, setCooldown] = useState(resendCooldown);

  useEffect(() => {
    if (cooldown > 0 && onResend) {
      const timer = setTimeout(() => setCooldown(cooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [cooldown, onResend]);

  const handleResend = () => {
    if (cooldown === 0 && onResend) {
      setCooldown(resendCooldown);
      onResend();
    }
  };

  return (
    <div className={cn("space-y-6", className)}>
      <div className="space-y-4">
        <div className="flex justify-center">
          <InputOTP
            maxLength={6}
            value={value}
            onChange={(val) => {
              onChange(val);
              if (val.length === 6 && onComplete) {
                onComplete(val);
              }
            }}
            onFocus={onFocus}
            disabled={disabled}
            // WYSHKIT 2026: Mobile UX - Numeric keyboard for OTP (Chapter 8)
            inputMode="numeric"
            pattern="[0-9]*"
          >
            <InputOTPGroup className="gap-2">
              {[...Array(6)].map((_, index) => (
                <InputOTPSlot
                  key={index}
                  index={index}
                  className={cn(
                    "size-12 rounded-[var(--radius-sm)] bg-[var(--surface-muted)] border-none font-semibold text-lg transition-all duration-200",
                    value[index] && "ring-1 ring-[var(--border)] bg-[var(--surface)]",
                    error && "ring-1 ring-rose-500 bg-rose-50"
                  )}
                />
              ))}
            </InputOTPGroup>
          </InputOTP>
        </div>
        {error ? (
          <p className="text-xs text-red-500 text-center font-medium animate-in fade-in slide-in-from-top-1">
            {error}
          </p>
        ) : (
          <p className="text-xs text-center text-[var(--text-tertiary)] leading-relaxed font-medium">
            Enter the 6-digit code sent to your phone
          </p>
        )}
      </div>

      {onResend && (
        <div className="text-center">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleResend}
            disabled={cooldown > 0 || disabled}
            className={cn(
              "text-xs font-semibold h-auto py-2 px-4 rounded-[var(--radius-sm)] transition-all active:scale-95",
              cooldown > 0 ? "text-[var(--text-tertiary)]" : "text-[var(--text-primary)] hover:bg-[var(--surface-muted)]"
            )}
          >
            {cooldown > 0 ? `Resend in ${cooldown}s` : "Resend OTP"}
          </Button>
        </div>
      )}
    </div>
  );
}
