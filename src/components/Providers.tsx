import { Toaster } from 'sonner';
import { AuthProvider } from '@/providers/AuthProvider';
import { RealtimeProvider } from '@/providers/RealtimeProvider';
// SurfaceScribeProvider removed - using native CSS env() for safe areas

/**
 * Providers Component
 * 
 * Removed TanStack Query - using Supabase real-time subscriptions instead.
 * Supabase handles caching, deduplication, and real-time updates natively.
 */

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <RealtimeProvider>
        {children}
        <Toaster position="top-center" richColors />
      </RealtimeProvider>
    </AuthProvider>
  );
}
