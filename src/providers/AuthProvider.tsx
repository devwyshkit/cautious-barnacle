"use client";

import { createClient } from "@/lib/supabase/client";
import type { User, AuthChangeEvent, Session } from "@supabase/supabase-js";
import * as AuthCoreLib from "@/lib/auth/core";
import { logger } from "@/lib/logging/logger";
import { useEffect, useMemo, useState, createContext, useContext, useRef } from "react";
import { normalizePhone } from "@/lib/utils/phone";
import { mergeGuestCartToUser } from "@/lib/actions/cart/logic";
import { useRouter } from "next/navigation";

interface AuthContextType {
    user: User | null;
    permissions: AuthCoreLib.UserPermissions | null;
    loading: boolean;
    error: string | null;
    signInWithPhone: (phone: string) => Promise<{ success: boolean; error?: string; isRetryable?: boolean }>;
    verifyOTP: (phone: string, token: string) => Promise<{ success: boolean; user?: User; error?: string }>;
    signOut: () => Promise<{ success: boolean; error?: string }>;
    refreshSession: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [permissions, setPermissions] = useState<AuthCoreLib.UserPermissions | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    const supabase = useMemo(() => createClient(), []);
    const fetchingRef = useRef<string | null>(null);
    const userIdRef = useRef<string | null>(null);

    // Sync ref with state
    useEffect(() => {
        userIdRef.current = user?.id || null;
    }, [user?.id]);

    const updatePermissions = async (userId: string) => {
        if (fetchingRef.current === userId) return;
        fetchingRef.current = userId;

        try {
            // SWIGGY 2026: Zero trust. Always fetch fresh permissions from DB.
            const perms = await AuthCoreLib.resolveUserPermissions(supabase, userId);
            setPermissions(perms);
            setError(null);
        } catch (innerErr) {
            logger.error('[AuthProvider] resolveUserPermissions failed', innerErr as Error);
        } finally {
            fetchingRef.current = null;
        }
    };

    const refreshSession = async () => {
        try {
            // WYSHKIT 2026: Security Hardening - Use getUser() as source of truth
            const { data: { user: fetchedUser }, error: userError } = await supabase.auth.getUser();

            if (userError || !fetchedUser) {
                setUser(null);
                setPermissions(null);
                setLoading(false);
                return;
            }

            setUser(fetchedUser);
            updatePermissions(fetchedUser.id);
            setLoading(false);
        } catch (err) {
            logger.error('Auth Init Error:', err as Error);
            setError('Failed to initialize authentication');
            setLoading(false);
        }
    };

    useEffect(() => {
        refreshSession();

        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event: AuthChangeEvent, session: Session | null) => {
            const currentUser = session?.user ?? null;

            if (currentUser?.id !== userIdRef.current) {
                setUser(currentUser);

                if (currentUser) {
                    updatePermissions(currentUser.id);
                } else {
                    setPermissions(null);
                }
            } else if (currentUser && !permissions && !fetchingRef.current) {
                updatePermissions(currentUser.id);
            }

            setError(null);
            setLoading(false);
        });

        return () => {
            subscription.unsubscribe();
        };
    }, [supabase]);

    const signInWithPhone = async (phone: string) => {
        try {
            const authPhone = normalizePhone(phone);
            const { error } = await supabase.auth.signInWithOtp({
                phone: authPhone,
                options: { channel: "sms" },
            });
            if (error) throw error;
            return { success: true };
        } catch (err: unknown) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to send OTP';
            const isRetryable = errorMessage.includes("500") || errorMessage.includes("Twilio");
            return { success: false, error: errorMessage, isRetryable };
        }
    };

    const verifyOTP = async (phone: string, token: string) => {
        try {
            const authPhone = normalizePhone(phone);
            const result = await supabase.auth.verifyOtp({
                phone: authPhone,
                token,
                type: "sms",
            });

            if (!result.error && result.data.user) {
                // Swiggy 2026: Parallelize critical path for faster TTI
                await Promise.all([
                    mergeGuestCartToUser().catch(e => logger.error('Cart merge failed', e as Error)),
                    refreshSession()
                ]);

                return { success: true, user: result.data.user };
            }

            return { success: false, error: result.error?.message || "OTP verification failed" };
        } catch (err: unknown) {
            return { success: false, error: err instanceof Error ? err.message : "Failed to verify OTP" };
        }
    };

    const signOut = async () => {
        try {
            const { error } = await supabase.auth.signOut();
            if (error) throw error;
            setUser(null);
            setPermissions(null);
            router.push("/");
            return { success: true };
        } catch (err: unknown) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to sign out';
            return { success: false, error: errorMessage };
        }
    };

    const value = useMemo(() => ({
        user,
        permissions,
        loading,
        error,
        signInWithPhone,
        verifyOTP,
        signOut,
        refreshSession
    }), [user, permissions, loading, error]);

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}
