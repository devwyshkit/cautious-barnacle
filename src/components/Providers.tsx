import { Toaster } from 'sonner';
import { AuthProvider } from '@/providers/AuthProvider';
import { RealtimeProvider } from '@/providers/RealtimeProvider';

/**
 * Providers Component
 * 
 * Removed TanStack Query - using Supabase real-time subscriptions instead.
 * Supabase handles caching, deduplication, and real-time updates natively.
 */

import { User } from '@supabase/supabase-js';
import { UserPermissions } from '@/lib/auth/core';

export function Providers({
  children,
  initialUser,
  initialPermissions
}: {
  children: React.ReactNode;
  initialUser?: User | null;
  initialPermissions?: UserPermissions | null;
}) {
  return (
    <AuthProvider initialUser={initialUser} initialPermissions={initialPermissions}>
      <RealtimeProvider>
        {children}
        <Toaster position="top-center" richColors />
      </RealtimeProvider>
    </AuthProvider>
  );
}
