import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Store, Search } from 'lucide-react';

/**
 * WYSHKIT 2026: Partner Not Found Page
 * Swiggy 2026 Pattern: Proper 404 handling with helpful navigation
 */
export default function PartnerNotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-background">
      <div className="text-center space-y-4 max-w-md">
        <div className="flex justify-center">
          <Store className="size-16 text-zinc-300" />
        </div>
        <h1 className="text-2xl font-bold text-zinc-900">Store Not Found</h1>
        <p className="text-sm text-zinc-500">
          The store you're looking for doesn't exist or is no longer available.
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
