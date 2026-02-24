import { OrderListItem } from "@/lib/types/order";
import { format } from "date-fns";
import { ChevronRight, Package } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { ORDER_STATUS } from "@/lib/types/order-status";
import { getOrderStatusDisplay, getOrderStatusColor } from "@/lib/types/order-status";
import { formatCurrency } from "@/lib/utils/pricing";

interface OrderCardProps {
  order: OrderListItem;
}

export function OrderCard({ order }: OrderCardProps) {
  const orderId = order.id ?? '';
  const orderNumber = order.order_number ?? '—';
  const status = order.status ?? 'UNKNOWN';
  const total = order.total ?? 0;
  const created_at = order.created_at ?? '';
  const item_count = order.item_count ?? 1;

  const isActive = ['PLACED', 'CONFIRMED', 'IN_PRODUCTION', 'PACKED', 'OUT_FOR_DELIVERY'].includes(status);

  return (
    <Link
      href={`/orders/${orderId}`}
      className="block bg-white p-5 rounded-xl border border-zinc-100 active:scale-[0.98] transition-all hover:border-zinc-200 shadow-sm hover:shadow-sm hover:shadow-zinc-200/40 cursor-pointer group"
      prefetch={false}
    >
      <div className="flex items-start gap-4">
        {/* Vendor Avatar / Image */}
        <div className="size-14 rounded-xl bg-zinc-50 border border-zinc-100 overflow-hidden shrink-0 flex items-center justify-center relative">
          {order.first_product_name ? (
            <img src={order.first_product_name} alt={order.vendor_name || 'Store'} className="size-full object-cover" />
          ) : (
            <Package className="size-6 text-zinc-300" />
          )}
          {isActive && (
            <div className="absolute top-1 right-1 size-2 bg-[var(--primary)] rounded-full ring-2 ring-white animate-pulse" />
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-sm font-black text-zinc-900 truncate leading-tight group-hover:text-[var(--primary)] transition-colors">
                {order.vendor_name || "Wyshkit Vendor"}
              </h3>
              <p className="text-xs font-bold text-zinc-400 mt-0.5 tracking-tight">
                Order #{orderNumber}
              </p>
            </div>
            <p className="text-sm font-black text-zinc-950 tabular-nums">{formatCurrency(total)}</p>
          </div>

          <div className="mt-3 flex flex-wrap gap-2">
            <span className={cn(
              "px-2 py-0.5 rounded-md text-[11px] font-black tracking-tight",
              status === 'DELIVERED' ? "bg-emerald-50 text-emerald-600" :
                isActive ? "bg-amber-50 text-[var(--primary)]" :
                  "bg-zinc-100 text-zinc-600"
            )}>
              {getOrderStatusDisplay(status)}
            </span>

            {order.has_personalization && (
              <span className={cn(
                "px-2 py-0.5 rounded-md text-[11px] font-black tracking-tight flex items-center gap-1",
                order.personalization_status === 'submitted' ? "bg-amber-50 text-amber-600" :
                  order.personalization_status === 'approved' ? "bg-emerald-50 text-emerald-600" :
                    "bg-zinc-100 text-zinc-500"
              )}>
                <div className={cn(
                  "size-1 rounded-full",
                  order.personalization_status === 'submitted' ? "bg-amber-500 animate-pulse" :
                    order.personalization_status === 'approved' ? "bg-emerald-500" :
                      "bg-zinc-400"
                )} />
                {order.personalization_status || 'Design Pending'}
              </span>
            )}
          </div>

          <p className="text-[11px] font-medium text-zinc-500 mt-3 line-clamp-1">
            {order.first_product_name || "Order Details"}
          </p>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-zinc-50 flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-zinc-400 text-xs font-bold">
          {created_at ? format(new Date(created_at), "MMM d, yyyy") : '—'}
        </div>
        <div className={cn(
          "px-4 py-1.5 rounded-full text-xs font-black tracking-tight transition-all",
          isActive
            ? "bg-[var(--primary)] text-white shadow-lg shadow-amber-900/10 active:scale-95"
            : "bg-zinc-50 text-zinc-500 group-hover:bg-zinc-900 group-hover:text-white"
        )}>
          {isActive ? 'Track Order' : 'Details'}
        </div>
      </div>
    </Link>
  );
}
