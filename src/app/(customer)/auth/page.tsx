import { AuthPageClient } from '@/components/auth/AuthPageClient';
import { Suspense } from 'react';

/**
 * WYSHKIT 2026: Full-page auth when /auth is opened directly (e.g. redirect from profile, refresh).
 * Same AuthPageClient as the sheet; different container only.
 */
export default async function AuthPage({
  searchParams,
}: {
  searchParams: Promise<{ intent?: string; returnUrl?: string }>;
}) {
  const params = await searchParams;
  const intent = params.intent ?? 'signin';
  const returnUrl = params.returnUrl ?? '/';

  return (
    <div className="min-h-screen bg-zinc-50 flex flex-col">
      <Suspense
        fallback={
          <div className="flex-1 flex items-center justify-center">
            <p className="text-sm text-zinc-500">Loading...</p>
          </div>
        }
      >
        <AuthPageClient intent={intent} returnUrl={returnUrl} />
      </Suspense>
    </div>
  );
}
