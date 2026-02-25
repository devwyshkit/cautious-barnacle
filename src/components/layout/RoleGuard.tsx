'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { Loader2 } from 'lucide-react';
import { type UserRole } from '@/lib/auth/core';
import { resolveUserPermissionsClient } from '@/lib/auth/client';
import { logger } from '@/lib/logging/logger';

interface RoleGuardProps {
  children: React.ReactNode;
  allowedRoles: ('admin' | 'vendor' | 'customer')[];
  fallbackPath?: string;
}

export function RoleGuard({
  children,
  allowedRoles,
  fallbackPath = '/'
}: RoleGuardProps) {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    let mounted = true;

    async function checkRole() {
      if (authLoading) return;

      if (!user) {
        if (mounted) setLoading(false);
        return;
      }

      try {
        const permissions = await resolveUserPermissionsClient(user.id);

        if (mounted) {
          // Wyshkit 2026: Admins can access everything (Vendor/Admin dashboards)
          // We check the specific permission flags
          const isAuthorized =
            (allowedRoles.includes('admin') && permissions.isAdmin) ||
            (allowedRoles.includes('vendor') && (permissions.isVendor || permissions.isAdmin)) ||
            (allowedRoles.includes('customer') && permissions.isCustomer);

          if (isAuthorized) {
            setAuthorized(true);
          } else {
            router.push(fallbackPath);
          }
        }
      } catch (error) {
        logger.error('Error checking role in RoleGuard', error, { allowedRoles, fallbackPath });
        if (mounted) router.push(fallbackPath);
      } finally {
        if (mounted) setLoading(false);
      }
    }

    checkRole();
    return () => {
      mounted = false;
    };
  }, [user, authLoading, allowedRoles, fallbackPath, router]);


  if (authLoading || loading) {
    return (
      <div className="flex h-screen w-full flex-col items-center justify-center bg-white">
        <Loader2 className="h-10 w-10 animate-spin text-[var(--primary)]" />
        <p className="mt-4 text-[13px] font-bold text-zinc-900 tracking-tight">Authenticating...</p>
      </div>
    );
  }

  if (!authorized) {
    // Show a proper message instead of returning null (which causes 404)
    return (
      <div className="flex h-screen w-full flex-col items-center justify-center bg-white">
        <div className="text-center space-y-4 px-6">
          <h2 className="text-xl font-bold text-zinc-900">Access Denied</h2>
          <p className="text-sm text-zinc-600">You don&apos;t have permission to access this page.</p>
          <p className="text-xs text-zinc-400">Redirecting...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
