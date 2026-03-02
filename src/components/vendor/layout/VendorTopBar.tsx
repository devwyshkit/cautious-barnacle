'use client';

import { useState } from 'react';
import { Bell, ChevronDown, Settings, LogOut } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { update_vendor_online_status } from '@/lib/actions/vendor/vendor-actions';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import { useVendorOrdersStatus } from '@/hooks/useVendorOrdersStatus';
import { triggerHaptic, HapticPattern } from '@/lib/utils/haptic';

interface VendorTopBarProps {
  vendor: {
    id: string;
    name: string;
    is_online?: boolean | null;
  };
}

export function VendorTopBar({ vendor }: VendorTopBarProps) {
  const { pendingCount } = useVendorOrdersStatus(vendor.id);
  const [isOnline, setIsOnline] = useState(vendor.is_online ?? false);
  const [isUpdating, setIsUpdating] = useState(false);
  const router = useRouter();

  const handleOnlineToggle = async (checked: boolean) => {
    triggerHaptic(HapticPattern.ACTION);
    setIsUpdating(true);
    const result = await update_vendor_online_status(vendor.id, checked);
    if (result.success) {
      setIsOnline(checked);
      triggerHaptic(checked ? HapticPattern.SUCCESS : HapticPattern.ACTION);
      toast.success(checked ? 'Store is now online' : 'Store is now offline');
    } else {
      triggerHaptic(HapticPattern.ERROR);
      toast.error('Failed to update status');
    }
    setIsUpdating(false);
  };

  const handleLogout = async () => {
    triggerHaptic(HapticPattern.ACTION);
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push('/vendor/login');
  };

  return (
    <header className="sticky top-0 z-[var(--z-nav)] bg-[var(--surface)] border-b border-[var(--border)]">
      <div className="flex items-center justify-between h-14 px-4">
        <div className="flex items-center gap-3">
          <div className="lg:hidden">
            <div className="size-8 rounded-[var(--radius-lg)] bg-[var(--primary)] flex items-center justify-center">
              <span className="text-[var(--primary-foreground)] text-sm font-semibold">W</span>
            </div>
          </div>
          <div className="hidden lg:block">
            <h1 className="text-sm font-bold tracking-tight text-[var(--text-primary)] truncate max-w-[200px]">
              {vendor.name}
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[var(--surface-muted)] border border-[var(--border)] transition-colors">
            <div className={cn(
              "size-2 rounded-full",
              isOnline ? "bg-[var(--success)] shadow-[0_0_8px_var(--success)]" : "bg-[var(--text-tertiary)]"
            )} />
            <span className="text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider">
              {isOnline ? 'Online' : 'Offline'}
            </span>
            <Switch
              checked={isOnline}
              onCheckedChange={handleOnlineToggle}
              disabled={isUpdating}
              className="data-[state=checked]:bg-[var(--success)]"
            />
          </div>

          <Link href="/vendor/orders" onClick={() => triggerHaptic(HapticPattern.ACTION)}>
            <Button variant="ghost" size="icon" className="relative hover:bg-[var(--surface-muted)] rounded-full">
              <Bell className="size-5 text-[var(--text-secondary)]" />
              {pendingCount > 0 && (
                <Badge
                  className="absolute -top-1 -right-1 size-5 p-0 flex items-center justify-center bg-[var(--primary)] text-[var(--primary-foreground)] text-[10px] font-black border-0"
                >
                  {pendingCount > 9 ? '9+' : pendingCount}
                </Badge>
              )}
            </Button>
          </Link>

          <DropdownMenu>
            <DropdownMenuTrigger asChild onClick={() => triggerHaptic(HapticPattern.ACTION)}>
              <Button variant="ghost" size="icon" className="hover:bg-[var(--surface-muted)] rounded-full">
                <Settings className="size-5 text-[var(--text-secondary)]" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48 rounded-[var(--radius-xl)]">
              <DropdownMenuItem asChild>
                <Link href="/vendor/onboarding" className="font-medium">Store settings</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/vendor/insights" className="font-medium">View insights</Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-[var(--destructive)] font-bold" onClick={handleLogout}>
                <LogOut className="size-4 mr-2" />
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
