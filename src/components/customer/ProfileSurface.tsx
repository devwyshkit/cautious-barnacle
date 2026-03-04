'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/providers/AuthProvider';
import { cn } from '@/lib/utils';
import {
  User,
  ShoppingBag,
  MapPin,
  Settings,
  LogOut,
  Package,
  Sparkles,
  ShieldCheck,
  Store,
  MessageCircle,
  Phone,
  Info,
  ChevronRight,
  ExternalLink
} from 'lucide-react';
import { Logo } from '@/components/ui/Logo';
import { Button } from '@/components/ui/button';
import { OrderList } from '@/components/customer/orders/OrderList';
import { useUI } from '@/providers/UIProvider';
import { AddressManager } from './AddressManager';
import type { Address } from '@/lib/types/address';

type ProfileTab = 'account' | 'orders' | 'addresses' | 'support' | 'settings';

interface ProfileSurfaceProps {
  initialAddresses?: Address[];
}

export function ProfileSurface({ initialAddresses = [] }: ProfileSurfaceProps = {}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, permissions, signOut } = useAuth();
  const { profileTab, openProfileSheet, openOTPSheet } = useUI();

  const activeTab = (profileTab as ProfileTab) || 'account';
  const action = searchParams.get('action');
  const [localIsAdding, setLocalIsAdding] = React.useState(false);

  const isAddingAddress = action === 'add' || localIsAdding;

  const setActiveTab = (tab: ProfileTab) => {
    openProfileSheet(tab);
    setLocalIsAdding(false);
  };

  const setAction = (newAction: string | null) => {
    // WYSHKIT 2026: Profile is a sheet. Avoid manipulating URL for tabs.
    // Use local state for nested component views.
    setLocalIsAdding(newAction === 'add');
  };

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-8 text-center">
        <div className="size-16 bg-[var(--surface-muted)] rounded-full flex items-center justify-center mb-4">
          <User className="size-8 text-[var(--text-tertiary)]" />
        </div>
        <h2 className="text-xl font-bold text-[var(--text-primary)]">Sign in to view profile</h2>
        <Button onClick={() => openOTPSheet()} className="bg-[var(--primary)] text-[var(--primary-foreground)] rounded-[var(--radius-xl)] px-8 mt-6">
          Sign In
        </Button>
      </div>
    );
  }

  const tabs = [
    { id: 'account', label: 'My Account', icon: User },
    { id: 'orders', label: 'Orders', icon: ShoppingBag },
    { id: 'addresses', label: 'Addresses', icon: MapPin },
    { id: 'support', label: 'Support', icon: MessageCircle },
    { id: 'settings', label: 'Settings', icon: Settings },
  ] as const;

  return (
    <div className="flex flex-col h-full bg-[var(--surface)]">
      {/* Profile Header */}
      <div className="px-6 py-8 border-b border-[var(--surface-muted)]">
        <div className="flex items-center gap-4">
          <div className="size-16 bg-[var(--text-primary)] rounded-full flex items-center justify-center text-[var(--primary-foreground)] text-xl font-bold">
            {user.phone?.[0] || 'U'}
          </div>
          <div className="flex-1">
            <h2 className="text-lg font-bold text-[var(--text-primary)]">+91 {user.phone}</h2>
            <button
              onClick={() => setActiveTab('settings')}
              className="text-xs font-semibold text-[var(--text-tertiary)] tracking-tight mt-1 hover:text-[var(--text-secondary)] transition-colors"
            >
              Edit Profile
            </button>
          </div>
          {permissions?.isAdmin && (
            <Link href="/admin">
              <Button size="default" variant="outline" className="h-12 px-4 text-xs font-bold tracking-tight rounded-[var(--radius-xl)] border-[var(--border)]">
                Admin
              </Button>
            </Link>
          )}
        </div>
      </div>

      {/* Surface Tabs */}
      {!isAddingAddress && (
        <div className="flex border-b border-[var(--surface-muted)] px-2 shrink-0">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "flex-1 py-4 flex flex-col items-center gap-1.5 transition-all relative",
                activeTab === tab.id ? "text-[var(--text-primary)]" : "text-[var(--text-tertiary)] hover:text-[var(--text-secondary)]"
              )}
            >
              <tab.icon className={cn("size-5", activeTab === tab.id ? "fill-[var(--text-primary)]/5" : "")} />
              <span className="text-xs font-bold tracking-tight">{tab.label}</span>
              {activeTab === tab.id && (
                <div className="absolute bottom-0 left-4 right-4 h-0.5 bg-[var(--text-primary)] rounded-full" />
              )}
            </button>
          ))}
        </div>
      )}

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto overscroll-contain custom-scrollbar pb-24">
        {activeTab === 'account' && (
          <div className="p-6 space-y-6">
            {(permissions?.isVendor || permissions?.isAdmin) && (
              <section className="bg-[var(--primary)] rounded-[var(--radius-xl)] p-6 text-[var(--primary-foreground)] relative overflow-hidden shadow-[var(--shadow-brand)] mb-6">
                <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
                  <Logo variant="minimal" className="size-32" />
                </div>
                <div className="relative z-10 space-y-3">
                  <h3 className="text-xs font-bold text-[var(--text-inverse)]/40 tracking-[0.3em] mb-4">Professional Access</h3>
                  {permissions.isVendor && (
                    <Link href="/vendor" className="flex items-center gap-4 p-4 bg-[var(--surface)]/10 rounded-[var(--radius-xl)] hover:bg-[var(--surface)]/15 transition-all border border-[var(--text-inverse)]/5 group">
                      <div className="size-12 rounded-[var(--radius-lg)] bg-[var(--text-inverse)]/10 flex items-center justify-center shrink-0 border border-[var(--text-inverse)]/10">
                        <Store className="size-6 text-[var(--text-inverse)]" />
                      </div>
                      <div className="flex-1">
                        <h4 className="text-sm font-bold text-[var(--text-inverse)] tracking-tight">Vendor Portal</h4>
                        <p className="text-xs font-medium text-[var(--text-inverse)]/50 mt-0.5">Manage your catalog & orders</p>
                      </div>
                      <ChevronRight className="size-4 text-[var(--text-inverse)]/30 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  )}
                  {permissions.isAdmin && (
                    <Link href="/admin" className="flex items-center gap-4 p-4 bg-[var(--surface)]/10 rounded-[var(--radius-xl)] hover:bg-[var(--surface)]/15 transition-all border border-[var(--text-inverse)]/5 group">
                      <div className="size-12 rounded-[var(--radius-lg)] bg-[var(--text-inverse)]/10 flex items-center justify-center shrink-0 border border-[var(--text-inverse)]/10">
                        <ShieldCheck className="size-6 text-[var(--text-inverse)]" />
                      </div>
                      <div className="flex-1">
                        <h4 className="text-sm font-bold text-[var(--text-inverse)] tracking-tight">Admin Console</h4>
                        <p className="text-xs font-medium text-[var(--text-inverse)]/50 mt-0.5">Platform operations & overrides</p>
                      </div>
                      <ChevronRight className="size-4 text-[var(--text-inverse)]/30 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  )}
                </div>
              </section>
            )}

            <section>
              <h3 className="text-xs font-bold text-[var(--text-tertiary)] tracking-tight mb-4">Quick Actions</h3>
              <div className="grid grid-cols-3 gap-3">
                <button onClick={() => setActiveTab('orders')} className="p-4 bg-[var(--surface)] rounded-[var(--radius-xl)] flex flex-col items-center gap-2 border border-[var(--border)] shadow-[var(--shadow-sm)] hover:bg-[var(--surface-muted)] transition-colors">
                  <Package className="size-5 text-[var(--text-secondary)]" />
                  <span className="text-xs font-bold tracking-tight">Orders</span>
                </button>
                <button onClick={() => setActiveTab('orders')} className="p-4 bg-[var(--primary)] rounded-[var(--radius-xl)] flex flex-col items-center gap-2 border border-[var(--primary-hover)]/30 text-[var(--primary-foreground)] shadow-[var(--shadow-brand)] hover:opacity-90 transition-opacity">
                  <Sparkles className="size-5 text-[var(--warning)]" />
                  <span className="text-xs font-bold tracking-tight">Briefs</span>
                </button>
                <button onClick={() => setActiveTab('addresses')} className="p-4 bg-[var(--surface)] rounded-[var(--radius-xl)] flex flex-col items-center gap-2 border border-[var(--border)] shadow-[var(--shadow-sm)] hover:bg-[var(--surface-muted)] transition-colors">
                  <MapPin className="size-5 text-[var(--text-secondary)]" />
                  <span className="text-xs font-bold tracking-tight">Address</span>
                </button>
              </div>
            </section>

            <button onClick={() => signOut()} className="w-full p-4 mt-6 flex items-center justify-between text-[var(--text-primary)] font-semibold hover:bg-[var(--well-destructive)] rounded-[var(--radius-xl)] transition-colors border border-transparent">
              <div className="flex items-center gap-3">
                <LogOut className="size-5 text-[var(--destructive)]" />
                <span className="text-[var(--destructive)]">Logout</span>
              </div>
              <ChevronRight className="size-4 text-[var(--destructive)]/50" />
            </button>
          </div>
        )}

        {activeTab === 'orders' && <OrderList />}

        {activeTab === 'addresses' && (
          <div className="p-6">
            <AddressManager initialAddresses={initialAddresses} isAdding={isAddingAddress} onToggleAdding={(adding) => setAction(adding ? 'add' : null)} />
          </div>
        )}

        {activeTab === 'support' && (
          <div className="px-6 py-4 space-y-4">
            <button
              onClick={() => { }}
              className="w-full flex items-center justify-between p-4 rounded-[var(--radius-xl)] bg-[var(--surface-muted)] border border-[var(--border)] hover:bg-[var(--surface)] transition-all group"
            >
              <div className="flex items-center gap-4">
                <div className="size-10 rounded-[var(--radius-lg)] bg-[var(--primary)]/5 flex items-center justify-center text-[var(--primary)]">
                  <MessageCircle className="size-5" />
                </div>
                <div className="text-left">
                  <p className="text-sm font-bold text-[var(--text-primary)]">Chat with us</p>
                  <p className="text-xs text-[var(--text-tertiary)]">Response time: ~2 mins</p>
                </div>
              </div>
              <ChevronRight className="size-4 text-[var(--text-tertiary)] group-hover:translate-x-1 transition-transform" />
            </button>

            <button
              onClick={() => { }}
              className="w-full flex items-center justify-between p-4 rounded-[var(--radius-xl)] bg-[var(--surface-muted)] border border-[var(--border)] hover:bg-[var(--surface)] transition-all group"
            >
              <div className="flex items-center gap-4">
                <div className="size-10 rounded-[var(--radius-lg)] bg-[var(--info)]/5 flex items-center justify-center text-[var(--info)]">
                  <Phone className="size-5" />
                </div>
                <div className="text-left">
                  <p className="text-sm font-bold text-[var(--text-primary)]">Call for Order Support</p>
                  <p className="text-xs text-[var(--text-tertiary)]">Available 9 AM - 11 PM</p>
                </div>
              </div>
              <ChevronRight className="size-4 text-[var(--text-tertiary)] group-hover:translate-x-1 transition-transform" />
            </button>

            <div className="pt-4 space-y-2">
              <p className="text-[10px] font-black text-[var(--text-secondary)] uppercase tracking-widest px-1">Resources</p>
              <div className="space-y-1">
                <button className="w-full flex items-center justify-between py-3 px-1 hover:text-[var(--primary)] transition-colors group">
                  <div className="flex items-center gap-3">
                    <Info className="size-4 opacity-50" />
                    <span className="text-sm font-bold">Frequently Asked Questions</span>
                  </div>
                  <ExternalLink className="size-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                </button>
                <button className="w-full flex items-center justify-between py-3 px-1 hover:text-[var(--primary)] transition-colors group">
                  <div className="flex items-center gap-3">
                    <Info className="size-4 opacity-50" />
                    <span className="text-sm font-bold">Shipping & Returns Policy</span>
                  </div>
                  <ExternalLink className="size-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="p-6">
            <h3 className="text-xs font-bold text-[var(--text-tertiary)] tracking-tight mb-4">Settings</h3>
            <div className="p-4 bg-[var(--surface-muted)] rounded-[var(--radius-xl)] border border-[var(--border)] text-[var(--text-tertiary)] font-bold text-xs tabular-nums">
              +91 {user.phone}
            </div>
          </div>
        )}
      </div>
    </div >
  );
}
