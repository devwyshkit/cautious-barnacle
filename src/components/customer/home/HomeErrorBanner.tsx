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
      <div className="mx-4 md:mx-8 p-4 bg-red-50 border border-red-200 rounded-xl">
        <div className="flex items-start gap-3">
          <div className="size-5 rounded-full bg-red-100 flex items-center justify-center shrink-0 mt-0.5">
            <AlertCircle className="size-4 text-red-600" />
          </div>
          <div className="flex-1 space-y-2">
            <h3 className="text-sm font-bold text-red-900">Unable to load content</h3>
            <p className="text-xs text-red-700 leading-relaxed">
              {errors.join(', ')}. Please check your connection and try again.
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => router.refresh()}
              className="h-7 text-xs border-red-300 text-red-900 hover:bg-red-100 mt-2"
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
      <div className="mx-4 md:mx-8 p-3 bg-amber-50 border border-amber-200 rounded-xl">
        <div className="flex items-start gap-2">
          <AlertCircle className="size-4 text-amber-600 shrink-0 mt-0.5" />
          <p className="text-xs text-amber-800 leading-relaxed">
            Some content couldn&apos;t be loaded: {errors.join(', ')}. Showing available content.
          </p>
        </div>
      </div>
    );
  }

  return null;
}
