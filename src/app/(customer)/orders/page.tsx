import { Suspense } from "react";
import { headers } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Package, ChevronRight, Calendar, MapPin, Loader2 } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { OrderList } from "@/components/customer/orders/OrderList";
import { logger } from "@/lib/logging/logger";
import { SurfaceErrorBoundaryWithRouter } from "@/components/error/SurfaceErrorBoundary";
import type { OrderProductListItem } from "@/lib/types/order";

export default async function OrdersPage() {
    const headerList = await headers();
    const userId = headerList.get('x-wyshkit-user-id');

    if (!userId) {
        redirect("/auth?intent=signin&returnUrl=/orders");
    }

    return (
        <SurfaceErrorBoundaryWithRouter surfaceName="Orders" showHomeButton>
            <div className="bg-[var(--surface-muted)]/50 min-h-[100dvh] py-6 font-sans">
                <div className="max-w-xl mx-auto px-4">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h1 className="text-2xl font-black text-[var(--text-primary)] tracking-tight flex items-center gap-2">
                                My Orders
                            </h1>
                            <p className="text-xs font-bold text-[var(--text-tertiary)] tracking-tight mt-0.5 uppercase">
                                Track and manage your orders
                            </p>
                        </div>
                    </div>

                    <Suspense fallback={<OrdersSkeleton />}>
                        <AsyncOrderList userId={userId} />
                    </Suspense>
                </div>
            </div>
        </SurfaceErrorBoundaryWithRouter>
    );
}

async function AsyncOrderList({ userId }: { userId: string }) {
    const supabase = await createClient();

    // WYSHKIT 2026: One-Trip Orders Surface
    const { data: orders, error } = await supabase.rpc('get_user_orders_v1' as any);

    if (error) {
        logger.error('Failed to fetch orders in AsyncOrderList', error);
        throw error;
    }

    if (!orders || (orders as any[]).length === 0) {
        return (
            <div className="p-[var(--space-12)] text-center bg-[var(--surface)] rounded-[var(--radius-3xl)] border border-[var(--border)] shadow-[var(--shadow-sm)] animate-in fade-in slide-in-from-bottom-2">
                <div className="size-16 rounded-full bg-[var(--surface-muted)] flex items-center justify-center mx-auto mb-4 border border-[var(--border)]">
                    <Package className="size-8 text-[var(--text-tertiary)]" />
                </div>
                <h3 className="text-lg font-bold text-[var(--text-primary)] mb-1">No orders yet</h3>
                <p className="text-xs font-medium text-[var(--text-tertiary)] mb-8 max-w-[200px] mx-auto">Start exploring the best premium stores in your city!</p>
                <Link href="/">
                    <button className="bg-[var(--text-primary)] text-white rounded-2xl px-10 py-4 font-bold text-sm active:scale-95 transition-all shadow-lg shadow-[var(--shadow-sm)]">
                        Browse Stores
                    </button>
                </Link>
            </div>
        );
    }

    const orderList = orders as unknown as OrderProductListItem[];

    return (
        <div className="space-y-4 animate-in fade-in duration-500">
            <div className="flex justify-end mb-2">
                <span className="text-xs font-black text-[var(--text-tertiary)] tracking-widest uppercase bg-[var(--surface-muted)]/50 px-2 py-1 rounded">
                    {orderList.length} Total Orders
                </span>
            </div>
            <OrderList initialOrders={orderList} />
        </div>
    );
}

function OrdersSkeleton() {
    return (
        <div className="space-y-4">
            {[1, 2, 3].map((i) => (
                <div key={i} className="h-32 bg-[var(--surface)] rounded-[var(--radius-3xl)] border border-[var(--border)] animate-pulse flex items-center px-[var(--space-6)] gap-[var(--space-4)]">
                    <div className="size-16 rounded-2xl bg-[var(--surface-muted)]" />
                    <div className="flex-1 space-y-2">
                        <div className="h-4 w-1/3 bg-[var(--surface-muted)] rounded" />
                        <div className="h-3 w-1/2 bg-[var(--surface-muted)] rounded" />
                    </div>
                </div>
            ))}
        </div>
    );
}
