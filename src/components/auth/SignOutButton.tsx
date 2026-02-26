'use client';

import { LogOut } from 'lucide-react';
import { useRouter, usePathname } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { cn } from '@/lib/utils';
import { useAuth } from '@/providers/AuthProvider';
import { useState } from 'react';
import { logger } from '@/lib/logging/logger';

interface SignOutButtonProps {
  className?: string;
  variant?: 'sidebar' | 'ghost' | 'minimal';
  showLabel?: boolean;
}

export function SignOutButton({
  className,
  variant = 'sidebar',
  showLabel = true
}: SignOutButtonProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [isLoading, setIsLoading] = useState(false);
  const { signOut } = useAuth();

  const handleSignOut = async () => {
    try {
      setIsLoading(true);

      // WYSHKIT 2026: Use centralized auth hook for consistent state cleanup
      await signOut();

      // Clear vendor cookie manually (specific to this button context)
      document.cookie = 'wyshkit_vendor_id=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';

      if (pathname.startsWith('/vendor')) {
        router.push('/vendor/login');
      } else {
        router.push('/');
      }
      router.refresh();
    } catch (error) {
      logger.error('Error signing out', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (variant === 'minimal') {
    return (
      <button
        onClick={handleSignOut}
        disabled={isLoading}
        className={cn("p-2 text-zinc-400 hover:text-rose-600 transition-colors", className)}
      >
        <LogOut className="size-5" />
      </button>
    );
  }

  return (
    <button
      onClick={handleSignOut}
      disabled={isLoading}
      className={cn(
        "flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all group w-full",
        variant === 'sidebar'
          ? "text-zinc-500 hover:bg-rose-50 hover:text-rose-600"
          : "text-zinc-400 hover:text-zinc-900",
        isLoading && "opacity-50 cursor-not-allowed",
        className
      )}
    >
      <LogOut className={cn("size-5 shrink-0", variant === 'sidebar' ? "text-zinc-400 group-hover:text-rose-500" : "")} />
      {showLabel && <span className="text-sm font-bold tracking-tight">Sign Out</span>}
    </button>
  );
}
