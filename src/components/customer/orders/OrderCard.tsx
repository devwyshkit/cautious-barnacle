import { OrderProductListItem } from "@/lib/types/order";
import { format } from "date-fns";
import { ChevronRight, Package } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { ORDER_STATUS } from "@/lib/types/order-status";
import { getOrderStatusDisplay, getOrderStatusColor } from "@/lib/types/order-status";
import { formatCurrency } from "@/lib/utils/pricing";

interface OrderCardProps {
  order: OrderProductListItem;
}

export function OrderCard({ order }: OrderCardProps) {
  const orderId = order.id ?? '';
  const orderNumber = order.order_number ?? '—';
  const status = order.status ?? 'UNKNOWN';
  const total = order.total ?? 0;
  const created_at = order.created_at ?? '';
  const product_count = order.product_count ?? 1;

  const isActive = ['PLACED', 'CONFIRMED', 'IN_PRODUCTION', 'PACKED', 'OUT_FOR_DELIVERY'].includes(status);

  return (
    <Link
      href={`/orders/${orderId}`}
      className="block bg-[var(--surface)] p-5 rounded-[var(--radius-md)] border border-[var(--border)] active:scale-[0.98] transition-all hover:border-[var(--border)] shadow-sm hover:shadow-sm hover:shadow-[var(--shadow-sm)]/40 cursor-pointer group"
      prefetch={false}
    >
      <div className="flex items-start gap-4">
        {/* Vendor Avatar / Image */}
        <div className="size-14 rounded-[var(--radius-md)] bg-[var(--surface-muted)] border border-[var(--border)] overflow-hidden shrink-0 flex items-center justify-center relative">
          {order.first_product_name ? (
            <img src={order.first_product_name} alt={order.vendor_name || 'Store'} className="size-full object-cover" />
          ) : (
            <Package className="size-6 text-[var(--text-tertiary)]" />
          )}
          {isActive && (
            <div className="absolute top-1 right-1 size-2 bg-[var(--primary)] rounded-full ring-2 ring-[var(--surface)] animate-pulse" />
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-sm font-bold text-[var(--text-primary)] truncate leading-tight group-hover:text-[var(--primary)] transition-colors">
                {order.vendor_name || "Wyshkit Vendor"}
              </h3>
              <p className="text-xs font-bold text-[var(--text-tertiary)] mt-0.5 tracking-tight">
                Order #{orderNumber}
              </p>
            </div>
            <p className="text-sm font-bold text-[var(--text-primary)] tabular-nums">{formatCurrency(total)}</p>
          </div>

          <div className="mt-3 flex flex-wrap gap-2">
            <span className={cn(
              "px-2 py-0.5 rounded-[var(--radius-md)] text-xs font-bold tracking-tight",
              status === 'DELIVERED' ? "bg-[var(--well-success)] text-[var(--success)]" :
                isActive ? "bg-[var(--well-warning)] text-[var(--primary)]" :
                  "bg-[var(--surface-muted)] text-[var(--text-secondary)]"
            )}>
              {getOrderStatusDisplay(status)}
            </span>

            {order.has_personalization && (
              <span className={cn(
                "px-2 py-0.5 rounded-[var(--radius-md)] text-xs font-bold tracking-tighter flex items-center gap-1 uppercase border",
                order.personalization_status === 'submitted' ? "bg-[var(--well-warning)] text-[var(--warning)] border-[var(--warning)]/20" :
                  order.personalization_status === 'approved' ? "bg-[var(--well-success)] text-[var(--success)] border-[var(--success)]/20" :
                    "bg-[var(--surface-muted)] text-[var(--text-secondary)] border-[var(--border)]"
              )}>
                <span>✦</span>
                {order.personalization_status === 'approved' ? 'Design Approved' :
                  order.personalization_status === 'submitted' ? 'Reviewing Design' :
                    'Personalised'}
              </span>
            )}
          </div>

          <p className="text-xs font-medium text-[var(--text-secondary)] mt-3 line-clamp-1">
            {order.first_product_name || "Order Details"}
          </p>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-[var(--surface-muted)] flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-[var(--text-tertiary)] text-xs font-bold">
          {created_at ? format(new Date(created_at), "MMM d, yyyy") : '—'}
        </div>
        <div className={cn(
          "px-4 py-1.5 rounded-full text-xs font-bold tracking-tight transition-all",
          isActive
            ? "bg-[var(--primary)] text-[var(--text-inverse)] shadow-[var(--shadow-brand)] active:scale-95"
            : "bg-[var(--surface-muted)] text-[var(--text-secondary)] group-hover:bg-[var(--text-primary)] group-hover:text-[var(--text-inverse)]"
        )}>
          {isActive ? 'Track Order' : 'Details'}
        </div>
      </div>
    </Link>
  );
}
