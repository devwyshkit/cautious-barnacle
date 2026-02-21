"use client";

import { useMemo } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { normalizePhone } from "@/lib/utils/phone";
import { logger } from "@/lib/logging/logger";
import { useAuthContext } from "@/providers/AuthProvider";
import { mergeGuestCartToUser } from "@/lib/actions/draft-order";

export function useAuth() {
  const { user, permissions, loading, error, signOut: signOutContext, refreshSession } = useAuthContext();
  const router = useRouter();
  const supabase = useMemo(() => createClient(), []);

  const signInWithPhone = async (phone: string) => {
    try {
      // Swiggy 2026: Strict normalization for all phone numbers
      const authPhone = normalizePhone(phone);

      const { error } = await supabase.auth.signInWithOtp({
        phone: authPhone,
        options: { channel: "sms" },
      });
      if (error) throw error;
      return { success: true };
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to send OTP';
      const isRetryable =
        errorMessage.includes("500") ||
        errorMessage.includes("Internal Server Error") ||
        errorMessage.includes("20003") ||
        errorMessage.includes("Twilio") ||
        errorMessage.includes("provider") ||
        errorMessage.includes("Authenticate");
      return {
        success: false,
        error: errorMessage,
        isRetryable,
      };
    }
  };

  const verifyOTP = async (phone: string, token: string) => {
    try {
      // Swiggy 2026: KISS - Consistent E.164 normalization for all numbers
      const authPhone = normalizePhone(phone);

      const result = await supabase.auth.verifyOtp({
        phone: authPhone,
        token,
        type: "sms",
      });

      if (!result.error && result.data.user) {
        // Swiggy 2026: Parallelize critical path for faster Time-to-Interactive
        await Promise.all([
          mergeGuestCartToUser().catch(e => logger.error('Cart merge failed', e as Error)),
          refreshSession()
        ]);

        return { success: true, user: result.data.user };
      }

      return {
        success: false,
        error: result.error?.message || "OTP verification failed"
      };
    } catch (error: unknown) {
      return { success: false, error: error instanceof Error ? error.message : "Failed to verify OTP" };
    }
  };

  const signOut = async () => {
    const result = await signOutContext();
    if (result.success) {
      router.push("/");
    }
    return result;
  };



  return {
    user,
    permissions,
    loading,
    error,
    signInWithPhone,
    verifyOTP,
    signOut,
  };
}
