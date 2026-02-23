import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Package, ChevronRight, Calendar, MapPin } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { OrderList } from "@/components/customer/orders/OrderList";
import type { OrderListItem } from "@/lib/types/order";

export default async function OrdersPage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect("/auth?intent=signin&returnUrl=/orders");
    }

    // WYSHKIT 2026: Direct lookup on orders table
    const { data: dbOrders, error } = await supabase
        .from('orders')
        .select('id, order_number, status, total, created_at, delivery_address, has_personalization, personalization_status, partners(name, image_url), order_items(item_name)')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });


    // Map DB orders to OrderListItem for the component
    const mappedOrders = ((dbOrders as any[]) || []).map((row) => ({
        ...row,
        order_number: row.order_number ?? null,
        created_at: row.created_at ?? null,
        partner_name: row.partners?.name ?? null,
        item_count: row.order_items?.length || 1,
        first_item_image: row.partners?.image_url ?? null,
        first_item_name: row.order_items?.[0]?.item_name || null,
        has_personalization: row.has_personalization || false,
        personalization_status: row.personalization_status || null,
    }));


    return (
        <div className="bg-zinc-50/50 min-h-screen py-6">
            <div className="max-w-xl mx-auto px-4">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-2xl font-black text-zinc-900 tracking-tight flex items-center gap-2">
                            My Orders
                        </h1>
                        <p className="text-[11px] font-bold text-zinc-400 tracking-tight mt-0.5">
                            Track and manage your orders
                        </p>
                    </div>
                    <span className="text-xs font-black text-zinc-500 tracking-tight bg-white px-3 py-1.5 rounded-full border border-zinc-100 shadow-sm">
                        {dbOrders?.length || 0} Total
                    </span>
                </div>

                {error ? (
                    <div className="p-8 text-center bg-white rounded-xl border border-zinc-100 shadow-sm">
                        <p className="text-sm font-medium text-zinc-500">Failed to load orders. Please try again.</p>
                    </div>
                ) : !dbOrders || dbOrders.length === 0 ? (
                    <div className="p-12 text-center bg-white rounded-xl border border-zinc-100 shadow-sm">
                        <div className="size-16 rounded-full bg-zinc-50 flex items-center justify-center mx-auto mb-4 border border-zinc-100">
                            <Package className="size-8 text-zinc-300" />
                        </div>
                        <h3 className="text-lg font-bold text-zinc-900 mb-2">No orders yet</h3>
                        <p className="text-sm text-zinc-500 mb-6 max-w-[200px] mx-auto">Start exploring the best stores in Bangalore!</p>
                        <Link href="/">
                            <button className="bg-zinc-900 text-white rounded-xl px-8 py-3 font-bold text-sm active:scale-95 transition-all">
                                Browse Stores
                            </button>
                        </Link>
                    </div>
                ) : (
                    <OrderList initialOrders={mappedOrders} />
                )}
            </div>
        </div>
    );
}
