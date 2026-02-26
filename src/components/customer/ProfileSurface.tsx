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
  ChevronRight,
  Package,
  Sparkles,
  ShieldCheck,
  Store
} from 'lucide-react';
import { Logo } from '@/components/ui/Logo';
import { Button } from '@/components/ui/button';
import { OrderList } from '@/components/customer/orders/OrderList';
import { AddressManager } from './AddressManager';
import type { Address } from '@/lib/types/address';

type ProfileTab = 'account' | 'orders' | 'addresses' | 'settings';

interface ProfileSurfaceProps {
  initialAddresses?: Address[];
}

export function ProfileSurface({ initialAddresses = [] }: ProfileSurfaceProps = {}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, permissions, signOut } = useAuth();

  const activeTab = (searchParams.get('tab') as ProfileTab) || 'account';
  const action = searchParams.get('action');
  const isAddingAddress = action === 'add';

  const setActiveTab = (tab: ProfileTab) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('tab', tab);
    params.delete('action');
    router.replace(`/profile?${params.toString()}`);
  };

  const setAction = (newAction: string | null) => {
    const params = new URLSearchParams(searchParams.toString());
    if (newAction) params.set('action', newAction);
    else params.delete('action');
    router.push(`/profile?${params.toString()}`);
  };

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-8 text-center">
        <div className="size-16 bg-zinc-50 rounded-full flex items-center justify-center mb-4">
          <User className="size-8 text-zinc-300" />
        </div>
        <h2 className="text-xl font-bold text-zinc-900">Sign in to view profile</h2>
        <Button onClick={() => router.push('/auth?intent=signin&returnUrl=/profile')} className="bg-zinc-900 text-white rounded-xl px-8 mt-6">
          Sign In
        </Button>
      </div>
    );
  }

  const tabs = [
    { id: 'account', label: 'My Account', icon: User },
    { id: 'orders', label: 'Orders', icon: ShoppingBag },
    { id: 'addresses', label: 'Addresses', icon: MapPin },
    { id: 'settings', label: 'Settings', icon: Settings },
  ] as const;

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Profile Header */}
      <div className="px-6 py-8 border-b border-zinc-50">
        <div className="flex items-center gap-4">
          <div className="size-16 bg-zinc-900 rounded-full flex items-center justify-center text-white text-xl font-bold">
            {user.phone?.[0] || 'U'}
          </div>
          <div className="flex-1">
            <h2 className="text-lg font-bold text-zinc-900">+91 {user.phone}</h2>
            <button
              onClick={() => setActiveTab('settings')}
              className="text-xs font-semibold text-zinc-400 tracking-tight mt-1 hover:text-zinc-600 transition-colors"
            >
              Edit Profile
            </button>
          </div>
          {permissions?.isAdmin && (
            <Link href="/admin">
              <Button size="default" variant="outline" className="h-12 px-4 text-xs font-bold tracking-tight rounded-xl border-zinc-200">
                Admin
              </Button>
            </Link>
          )}
        </div>
      </div>

      {/* Surface Tabs */}
      {!isAddingAddress && (
        <div className="flex border-b border-zinc-50 px-2 shrink-0">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "flex-1 py-4 flex flex-col items-center gap-1.5 transition-all relative",
                activeTab === tab.id ? "text-zinc-900" : "text-zinc-400 hover:text-zinc-600"
              )}
            >
              <tab.icon className={cn("size-5", activeTab === tab.id ? "fill-zinc-900/5" : "")} />
              <span className="text-xs font-bold tracking-tight">{tab.label}</span>
              {activeTab === tab.id && (
                <div className="absolute bottom-0 left-4 right-4 h-0.5 bg-zinc-900 rounded-t-full" />
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
              <section className="bg-zinc-900 rounded-xl p-6 text-white relative overflow-hidden shadow-sm mb-6">
                <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
                  <Logo variant="minimal" className="size-32" />
                </div>
                <div className="relative z-10 space-y-3">
                  <h3 className="text-xs font-black text-white/40 tracking-[0.3em] mb-4">Professional Access</h3>
                  {permissions.isVendor && (
                    <Link href="/vendor" className="flex items-center gap-4 p-4 bg-white/10 rounded-xl hover:bg-white/15 transition-all border border-white/5 group">
                      <div className="size-12 rounded-xl bg-indigo-500 flex items-center justify-center shrink-0">
                        <Store className="size-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-black">Vendor Dashboard</p>
                        <p className="text-xs font-medium text-white/50 mt-0.5">Manage your catalog & orders</p>
                      </div>
                      <ChevronRight className="size-4 text-white/30" />
                    </Link>
                  )}
                  {permissions.isAdmin && (
                    <Link href="/admin" className="flex items-center gap-4 p-4 bg-white/10 rounded-xl hover:bg-white/15 transition-all border border-white/5 group">
                      <div className="size-12 rounded-xl bg-rose-500 flex items-center justify-center shrink-0">
                        <ShieldCheck className="size-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-black">Admin Control</p>
                        <p className="text-xs font-medium text-white/50 mt-0.5">Platform operations & overrides</p>
                      </div>
                      <ChevronRight className="size-4 text-white/30" />
                    </Link>
                  )}
                </div>
              </section>
            )}

            <section>
              <h3 className="text-[11px] font-bold text-zinc-400 tracking-tight mb-4">Quick Actions</h3>
              <div className="grid grid-cols-3 gap-3">
                <button onClick={() => setActiveTab('orders')} className="p-4 bg-zinc-50 rounded-xl flex flex-col items-center gap-2 border border-zinc-100">
                  <Package className="size-5" />
                  <span className="text-xs font-bold tracking-tight">Orders</span>
                </button>
                <button onClick={() => setActiveTab('orders')} className="p-4 bg-zinc-900 rounded-xl flex flex-col items-center gap-2 border border-zinc-800 text-white shadow-lg">
                  <Sparkles className="size-5 text-amber-400" />
                  <span className="text-xs font-bold tracking-tight">Briefs</span>
                </button>
                <button onClick={() => setActiveTab('addresses')} className="p-4 bg-zinc-50 rounded-xl flex flex-col items-center gap-2 border border-zinc-100">
                  <MapPin className="size-5" />
                  <span className="text-xs font-bold tracking-tight">Address</span>
                </button>
              </div>
            </section>

            <button onClick={() => signOut()} className="w-full p-4 mt-6 flex items-center justify-between text-zinc-900 font-semibold hover:bg-zinc-50 rounded-xl transition-colors border-t border-zinc-50">
              <div className="flex items-center gap-3">
                <LogOut className="size-5 text-zinc-400" />
                <span>Logout</span>
              </div>
              <ChevronRight className="size-4 text-zinc-300" />
            </button>
          </div>
        )}

        {activeTab === 'orders' && <OrderList />}

        {activeTab === 'addresses' && (
          <div className="p-6">
            <AddressManager initialAddresses={initialAddresses} isAdding={isAddingAddress} onToggleAdding={(adding) => setAction(adding ? 'add' : null)} />
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="p-6">
            <h3 className="text-[11px] font-bold text-zinc-400 tracking-tight mb-4">Settings</h3>
            <div className="p-4 bg-zinc-50 rounded-xl border border-zinc-100 text-zinc-400 font-medium">
              +91 {user.phone}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
