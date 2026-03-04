import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Store, Search } from 'lucide-react';

/**
 * WYSHKIT 2026: Vendor Not Found Page
 * WYSHKIT 2026 Pattern: Proper 404 handling with helpful navigation
 */
export default function VendorNotFound() {
  return (
    <div className="min-h-[100dvh] flex items-center justify-center p-6 bg-background">
      <div className="text-center space-y-4 max-w-md">
        <div className="flex justify-center">
          <Store className="size-16 text-[var(--text-tertiary)]" />
        </div>
        <h1 className="text-2xl font-bold text-[var(--text-primary)]">Store Not Found</h1>
        <p className="text-sm text-[var(--text-secondary)]">
          The store you&apos;re looking for doesn&apos;t exist or is no longer available.
        </p>
        <div className="flex gap-3 justify-center pt-4">
          <Button asChild variant="default">
            <Link href="/">Browse Stores</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/search">
              <Search className="size-4 mr-2" />
              Search
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
