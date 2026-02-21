'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { cn } from '@/lib/utils';
import {
  User,
  ShoppingBag,
  MapPin,
  Settings,
  LogOut,
  ChevronRight,
  Package,
  Home,
  Briefcase,
  Plus,
  Loader2,
  ChevronLeft,
  Sparkles,
  ShieldCheck,
  Store,
  CreditCard
} from 'lucide-react';
import { Logo } from '@/components/ui/Logo';
import { Button } from '@/components/ui/button';
import { OrderList } from '@/components/customer/orders/OrderList';
import { getAddresses, setDefaultAddress, deleteAddress } from '@/lib/actions/addresses';
import { AddressForm } from '@/components/customer/checkout/AddressForm';
import { toast } from 'sonner';
import type { Address } from '@/lib/types/address';

type ProfileTab = 'account' | 'orders' | 'addresses' | 'settings';

interface ProfileSurfaceProps {
  initialAddresses?: Address[];
}

export function ProfileSurface({ initialAddresses = [] }: ProfileSurfaceProps = {}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, permissions, signOut } = useAuth();


  // WYSHKIT 2026: Route-based navigation - URL is source of truth
  const activeTab = (searchParams.get('tab') as ProfileTab) || 'account';
  const action = searchParams.get('action');

  // Derived state from URL
  const isAddingAddress = action === 'add';

  const setActiveTab = (tab: ProfileTab) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('tab', tab);
    // When changing tabs, clear the action
    params.delete('action');
    router.replace(`/profile?${params.toString()}`);
  };

  const updateAction = (newAction: string | null) => {
    const params = new URLSearchParams(searchParams.toString());
    if (newAction) params.set('action', newAction);
    else params.delete('action');
    router.push(`/profile?${params.toString()}`);
  };

  const [addresses, setAddresses] = useState<Address[]>(initialAddresses);
  const [loadingAddresses, setLoadingAddresses] = useState(false);
  const [settingDefault, setSettingDefault] = useState<string | null>(null);


  const loadAddresses = async () => {
    setLoadingAddresses(true);
    try {
      const result = await getAddresses();
      if (result?.addresses) {
        setAddresses(result.addresses);
      }
    } catch { } finally {
      setLoadingAddresses(false);
    }
  };

  const handleSetDefault = async (id: string) => {
    setSettingDefault(id);
    try {
      const result = await setDefaultAddress(id);
      if (result.success) {
        setAddresses(prev => prev.map(a => ({ ...a, is_default: a.id === id })));
        toast.success("Default address updated");
      }
    } catch { } finally {
      setSettingDefault(null);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteAddress(id);
      setAddresses(prev => prev.filter(a => a.id !== id));
      toast.info("Address deleted");
    } catch {
      toast.error("Failed to delete address");
    }
  };

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-8 text-center">
        <div className="size-16 bg-zinc-50 rounded-full flex items-center justify-center mb-4">
          <User className="size-8 text-zinc-300" />
        </div>
        <h2 className="text-xl font-bold text-zinc-900">Sign in to view profile</h2>
        <p className="text-sm text-zinc-500 mt-2 mb-6">Access your orders, saved addresses and more</p>
        <Button onClick={() => router.push('/auth?intent=signin&returnUrl=/profile')} className="bg-zinc-900 text-white rounded-xl px-8">
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
              className="text-xs font-semibold text-zinc-400 uppercase tracking-widest mt-1 hover:text-zinc-600 transition-colors"
            >
              Edit Profile
            </button>
          </div>
          {permissions?.isAdmin && (
            <Link href="/admin">
              <Button size="sm" variant="outline" className="h-8 text-[10px] font-bold uppercase tracking-wider rounded-lg border-zinc-200">
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
              <span className="text-[10px] font-bold uppercase tracking-wider">{tab.label}</span>
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
            {(permissions?.isPartner || permissions?.isAdmin) && (
              <section className="bg-zinc-900 rounded-[2.5rem] p-6 text-white relative overflow-hidden shadow-xl mb-6">
                <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
                  <Logo variant="minimal" className="size-32" />
                </div>

                <div className="relative z-10">
                  <h3 className="text-[10px] font-black text-white/40 uppercase tracking-[0.3em] mb-4">Professional Access</h3>
                  <div className="space-y-3">
                    {permissions.isPartner && (
                      <Link href="/partner" className="flex items-center gap-4 p-4 bg-white/10 rounded-3xl hover:bg-white/15 transition-all border border-white/5 group">
                        <div className="size-12 rounded-2xl bg-indigo-500 flex items-center justify-center shrink-0 shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition-transform">
                          <Store className="size-6 text-white" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-black">Partner Dashboard</p>
                          <p className="text-[10px] font-medium text-white/50 mt-0.5">Manage your catalog & orders</p>
                        </div>
                        <ChevronRight className="size-4 text-white/30" />
                      </Link>
                    )}
                    {permissions.isAdmin && (
                      <Link href="/admin" className="flex items-center gap-4 p-4 bg-white/10 rounded-3xl hover:bg-white/15 transition-all border border-white/5 group">
                        <div className="size-12 rounded-2xl bg-rose-500 flex items-center justify-center shrink-0 shadow-lg shadow-rose-500/20 group-hover:scale-105 transition-transform">
                          <ShieldCheck className="size-6 text-white" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-black">Admin Control</p>
                          <p className="text-[10px] font-medium text-white/50 mt-0.5">Platform operations & overrides</p>
                        </div>
                        <ChevronRight className="size-4 text-white/30" />
                      </Link>
                    )}
                  </div>
                </div>
              </section>
            )}

            <section>
              <h3 className="text-[11px] font-bold text-zinc-400 uppercase tracking-[0.2em] mb-4">Quick Actions</h3>
              <div className="grid grid-cols-3 gap-3">
                <button
                  onClick={() => setActiveTab('orders')}
                  className="p-4 bg-zinc-50 rounded-2xl flex flex-col items-center gap-2 border border-zinc-100 hover:bg-zinc-100 transition-colors text-zinc-900"
                >
                  <Package className="size-5" />
                  <span className="text-[10px] font-bold uppercase tracking-wider">Orders</span>
                </button>
                <button
                  onClick={() => setActiveTab('orders')}
                  className="p-4 bg-zinc-900 rounded-2xl flex flex-col items-center gap-2 border border-zinc-800 hover:bg-black transition-colors text-white shadow-lg shadow-zinc-200"
                >
                  <Sparkles className="size-5 text-amber-400" />
                  <span className="text-[10px] font-bold uppercase tracking-wider">Briefs</span>
                </button>
                <button
                  onClick={() => setActiveTab('addresses')}
                  className="p-4 bg-zinc-50 rounded-2xl flex flex-col items-center gap-2 border border-zinc-100 hover:bg-zinc-100 transition-colors text-zinc-900"
                >
                  <MapPin className="size-5" />
                  <span className="text-[10px] font-bold uppercase tracking-wider">Address</span>
                </button>
              </div>
            </section>

            <section className="pt-6 border-t border-zinc-50">
              <button
                onClick={() => signOut()}
                className="w-full p-4 flex items-center justify-between text-zinc-900 font-semibold hover:bg-zinc-50 rounded-xl transition-colors"
              >
                <div className="flex items-center gap-3">
                  <LogOut className="size-5 text-zinc-400" />
                  <span>Logout from Wyshkit</span>
                </div>
                <ChevronRight className="size-4 text-zinc-300" />
              </button>
            </section>

            {/* Support Section */}
            <section className="pt-8">
              <div className="p-8 bg-zinc-900 rounded-[2.5rem] text-white flex flex-col items-center text-center gap-6 shadow-2xl shadow-zinc-200">
                <div className="space-y-2">
                  <h3 className="text-xl font-black">Need help with something?</h3>
                  <p className="text-zinc-400 text-sm max-w-[200px] mx-auto">Our support team is available 24/7 for you.</p>
                </div>
                <Button className="w-full bg-white text-zinc-900 hover:bg-zinc-100 rounded-2xl font-black h-14 text-sm uppercase tracking-widest shadow-xl shadow-white/5">
                  Contact Support
                </Button>
              </div>
            </section>
          </div>
        )}

        {activeTab === 'orders' && (
          <div className="p-0">
            {/* WYSHKIT 2026: In a real implementation, we'd pass server data here. 
                 For ProfilePage (client component), we might still need to fetch or use a Server Component wrapper. 
                 For now, we leave it as client-fetch for the Profile tab, but OrdersPage will use the prop. */ }
            <OrderList />
          </div>
        )}

        {activeTab === 'addresses' && (
          <div className="p-6">
            {!isAddingAddress ? (
              <>
                <h3 className="text-[11px] font-bold text-zinc-400 uppercase tracking-[0.2em] mb-4">Saved Addresses</h3>

                {loadingAddresses ? (
                  <div className="flex items-center justify-center py-12">
                    <Loader2 className="size-6 animate-spin text-zinc-400" />
                  </div>
                ) : addresses.length === 0 ? (
                  <div className="p-8 bg-zinc-50 rounded-2xl text-center">
                    <div className="size-12 bg-zinc-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <MapPin className="size-5 text-zinc-400" />
                    </div>
                    <p className="text-sm font-semibold text-zinc-900">No saved addresses</p>
                    <p className="text-xs text-zinc-500 mt-1">Add your first delivery address</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {addresses.map((addr) => {
                      const Icon = addr.type === 'home' ? Home : addr.type === 'work' ? Briefcase : MapPin;
                      return (
                        <div key={addr.id} className={cn(
                          "p-4 rounded-2xl border transition-all",
                          addr.is_default ? "bg-zinc-50 border-zinc-200" : "border-zinc-100"
                        )}>
                          <div className="flex items-start gap-3">
                            <div className="size-10 rounded-xl bg-zinc-100 flex items-center justify-center shrink-0">
                              <Icon className="size-4 text-zinc-600" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <h4 className="font-bold text-zinc-900">{addr.name}</h4>
                                {addr.is_default && (
                                  <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-zinc-900 text-white">Default</span>
                                )}
                              </div>
                              <p className="text-sm text-zinc-500 mt-1 line-clamp-2">
                                {addr.address_line1}{addr.city ? `, ${addr.city}` : ''} {addr.pincode || ''}
                              </p>
                              <div className="flex items-center gap-3 mt-3">
                                {!addr.is_default && (
                                  <button
                                    onClick={() => handleSetDefault(addr.id)}
                                    disabled={!!settingDefault}
                                    className="text-xs font-semibold text-zinc-600 hover:text-zinc-900 disabled:opacity-50"
                                  >
                                    {settingDefault === addr.id ? 'Setting...' : 'Set as default'}
                                  </button>
                                )}
                                <button
                                  onClick={() => handleDelete(addr.id)}
                                  className="text-xs font-semibold text-[#D91B24] hover:text-[#D91B24]/80"
                                >
                                  Delete
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                <Button
                  onClick={() => updateAction('add')}
                  variant="outline"
                  className="w-full mt-6 h-12 rounded-xl border-dashed border-zinc-300 text-zinc-600 gap-2 hover:bg-zinc-50"
                >
                  <Plus className="size-4" />
                  Add New Address
                </Button>
              </>
            ) : (
              <div className="space-y-6">
                <button
                  onClick={() => updateAction(null)}
                  className="flex items-center gap-2 text-zinc-400 hover:text-zinc-900 transition-colors"
                >
                  <ChevronLeft className="size-4" />
                  <span className="text-[10px] font-bold uppercase tracking-wider">Back to addresses</span>
                </button>

                <div>
                  <h3 className="text-lg font-black text-zinc-900">Add New Address</h3>
                  <p className="text-xs text-zinc-500 mt-1">We'll save this for your next orders</p>
                </div>

                <div className="bg-zinc-50 rounded-3xl p-6 border border-zinc-100">
                  <AddressForm
                    onCancel={() => updateAction(null)}
                    onSuccess={(newAddr) => {
                      setAddresses(prev => [newAddr, ...prev]);
                      updateAction(null);
                      toast.success("Address added successfully");
                    }}
                  />
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="p-6">
            <h3 className="text-[11px] font-bold text-zinc-400 uppercase tracking-[0.2em] mb-4">Personal Settings</h3>
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest ml-1">Phone Number</label>
                <div className="p-4 bg-zinc-50 rounded-xl border border-zinc-100 text-zinc-400 font-medium">
                  +91 {user.phone}
                </div>
              </div>
              {/* Other settings... */}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
