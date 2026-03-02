'use client';

import { AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

interface HomeErrorBannerProps {
  errors: string[];
  allFailed: boolean;
}

/**
 * Home Error Banner (Client Component)
 * Shows errors and allows reload - Wyshkit 2026: Clear user feedback
 */
export function HomeErrorBanner({ errors, allFailed }: HomeErrorBannerProps) {
  const router = useRouter();
  if (allFailed) {
    return (
      <div className="mx-[var(--space-4)] md:mx-[var(--space-8)] p-[var(--space-4)] bg-[var(--destructive-foreground)] border border-[var(--destructive)]/20 rounded-[var(--radius-md)]">
        <div className="flex items-start gap-[var(--space-3)]">
          <div className="size-5 rounded-full bg-[var(--destructive)]/10 flex items-center justify-center shrink-0 mt-0.5">
            <AlertCircle className="size-4 text-[var(--destructive)]" />
          </div>
          <div className="flex-1 space-y-[var(--space-2)]">
            <h3 className="text-sm font-bold text-[var(--text-primary)]">Unable to load content</h3>
            <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
              {errors.join(', ')}. Please check your connection and try again.
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => router.refresh()}
              className="h-7 text-xs border-[var(--border)] text-[var(--text-primary)] hover:bg-[var(--surface-muted)] mt-[var(--space-2)]"
            >
              <RefreshCw className="size-3 mr-1.5" />
              Reload page
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (errors.length > 0) {
    return (
      <div className="mx-[var(--space-4)] md:mx-[var(--space-8)] p-[var(--space-3)] bg-[var(--warning-foreground)] border border-[var(--warning)]/20 rounded-[var(--radius-md)]">
        <div className="flex items-start gap-[var(--space-2)]">
          <AlertCircle className="size-4 text-[var(--warning)] shrink-0 mt-0.5" />
          <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
            Some content couldn&apos;t be loaded: {errors.join(', ')}. Showing available content.
          </p>
        </div>
      </div>
    );
  }

  return null;
}
