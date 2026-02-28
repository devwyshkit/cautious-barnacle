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
    const val = e.target.value.replace(/\D/g, "").slice(0, 10);
    onChange(val);
  };

  return (
    <div className="w-full md:max-w-md space-y-4">
      <div className="w-full space-y-1.5">
        <div className="relative w-full">
          <div className={cn(
            "absolute left-4 top-1/2 -translate-y-1/2 text-sm font-semibold transition-colors",
            error ? "text-red-400" : "text-zinc-400"
          )}>
            +91
          </div>
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
              "w-full pl-12 h-14 text-base font-semibold transition-all duration-200 rounded-xl border-none focus-visible:ring-1",
              error
                ? "bg-red-50 text-red-900 focus-visible:ring-red-200"
                : "bg-zinc-50 text-zinc-900 focus-visible:ring-zinc-200"
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
        <p className="text-xs text-zinc-400 leading-relaxed font-medium">
          We&apos;ll send a 6-digit verification code to this number.
        </p>
      )}
    </div>
  );
}
