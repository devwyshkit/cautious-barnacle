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
import { update_partner_online_status } from '@/lib/actions/partner-actions';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import { usePartnerOrdersStatus } from '@/hooks/usePartnerOrdersStatus';

interface PartnerTopBarProps {
  partner: {
    id: string;
    name: string;
    display_name?: string | null;
    is_online?: boolean | null;
  };
}

export function PartnerTopBar({ partner }: PartnerTopBarProps) {
  const { pendingCount } = usePartnerOrdersStatus(partner.id);
  const [isOnline, setIsOnline] = useState(partner.is_online ?? false);
  const [isUpdating, setIsUpdating] = useState(false);
  const router = useRouter();

  const handleOnlineToggle = async (checked: boolean) => {
    setIsUpdating(true);
    const result = await update_partner_online_status(partner.id, checked);
    if (result.success) {
      setIsOnline(checked);
      toast.success(checked ? 'Store is now online' : 'Store is now offline');
    } else {
      toast.error('Failed to update status');
    }
    setIsUpdating(false);
  };

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push('/partner/login');
  };

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-zinc-100">
      <div className="flex items-center justify-between h-14 px-4">
        <div className="flex items-center gap-3">
          <div className="lg:hidden">
            <div className="size-8 rounded-lg bg-zinc-900 flex items-center justify-center">
              <span className="text-white text-sm font-semibold">W</span>
            </div>
          </div>
          <div className="hidden lg:block">
            <h1 className="text-sm font-medium text-zinc-900 truncate max-w-[200px]">
              {partner.display_name || partner.name}
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-zinc-50 border border-zinc-100">
            <div className={cn(
              "size-2 rounded-full",
              isOnline ? "bg-emerald-500" : "bg-zinc-300"
            )} />
            <span className="text-xs font-medium text-zinc-600">
              {isOnline ? 'Online' : 'Offline'}
            </span>
            <Switch
              checked={isOnline}
              onCheckedChange={handleOnlineToggle}
              disabled={isUpdating}
              className="data-[state=checked]:bg-emerald-500"
            />
          </div>

          <Link href="/partner/orders">
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="size-5 text-zinc-600" />
              {pendingCount > 0 && (
                <Badge
                  className="absolute -top-1 -right-1 size-5 p-0 flex items-center justify-center bg-red-500 text-white text-[10px] font-medium"
                >
                  {pendingCount > 9 ? '9+' : pendingCount}
                </Badge>
              )}
            </Button>
          </Link>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <Settings className="size-5 text-zinc-600" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem asChild>
                <Link href="/partner/onboarding">Store settings</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/partner/insights">View insights</Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-red-600" onClick={handleLogout}>
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
