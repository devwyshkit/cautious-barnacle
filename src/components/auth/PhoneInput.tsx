"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

interface PhoneInputProps {
  value: string;
  onChange: (value: string) => void;
  onFocus?: () => void;
  disabled?: boolean;
  error?: string;
}

export function PhoneInput({ value, onChange, onFocus, disabled, error }: PhoneInputProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value;
    // Allow leading +, then only digits (standard E.164-ish or test format)
    if (val.startsWith('+')) {
      val = '+' + val.slice(1).replace(/\D/g, "");
    } else {
      val = val.replace(/\D/g, "");
    }
    onChange(val);
  };

  return (
    <div className="w-full md:max-w-md space-y-4">
      <div className="w-full space-y-1.5">
        <div className="relative w-full">
          {!value.startsWith('+') && (
            <div className={cn(
              "absolute left-4 top-1/2 -translate-y-1/2 text-sm font-semibold transition-colors",
              error ? "text-red-400" : "text-[var(--text-tertiary)]"
            )}>
              +91
            </div>
          )}
          <Input
            id="phone"
            type="tel"
            inputMode="numeric"
            pattern="[0-9]*"
            value={value}
            onChange={handleChange}
            onFocus={onFocus}
            placeholder="Enter phone number"
            disabled={disabled}
            className={cn(
              "w-full h-14 text-base font-semibold transition-all duration-200 rounded-[var(--radius-md)] border-none focus-visible:ring-1",
              !value.startsWith('+') ? "pl-12" : "pl-4",
              error
                ? "bg-rose-50 text-rose-900 focus-visible:ring-rose-200"
                : "bg-[var(--surface-muted)] text-[var(--text-primary)] focus-visible:ring-[var(--primary-ring)]"
            )}
            autoFocus
          />
        </div>
      </div>
      {error ? (
        <p className="text-xs text-red-500 font-medium animate-in fade-in slide-in-from-top-1">
          {error}
        </p>
      ) : (
        <p className="text-xs text-[var(--text-tertiary)] leading-relaxed font-medium">
          We&apos;ll send a 6-digit verification code to this number.
        </p>
      )}
    </div>
  );
}
