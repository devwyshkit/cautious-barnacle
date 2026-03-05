import { OrderProductListItem } from "@/lib/types/order";
import { format } from "date-fns";
import { ChevronRight, Package, Sparkles } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { ORDER_STATUS } from "@/lib/types/order-status";
import { getOrderStatusDisplay } from "@/lib/types/order-status";
import { formatCurrency } from "@/lib/utils/pricing";
import { AppText, AppHeading } from "@/components/ui/Typography";

interface OrderCardProps {
  order: OrderProductListItem;
  variant?: 'default' | 'compact';
}

/**
 * WYSHKIT 2026: OrderCard - Bento Pattern
 * High-density, rounded, isolated card. Zero full-width bleeds.
 */
export function OrderCard({ order, variant = 'default' }: OrderCardProps) {
  const orderId = order.id ?? '';
  const orderNumber = order.order_number ?? '—';
  const status = order.status ?? 'UNKNOWN';
  const total = order.total ?? 0;
  const created_at = order.created_at ?? '';

  const isActive = ['PLACED', 'CONFIRMED', 'IN_PRODUCTION', 'PACKED', 'OUT_FOR_DELIVERY'].includes(status);

  if (variant === 'compact') {
    return (
      <Link
        href={`/orders/${order.order_number || orderId}`}
        className="flex items-center gap-3 bg-[var(--surface)] p-3 rounded-2xl border border-[var(--border)] shadow-sm active:scale-[0.98] transition-all group mb-2 last:mb-0"
        prefetch={false}
      >
        <div className="size-10 rounded-xl bg-[var(--surface-muted)] border border-[var(--border)] overflow-hidden shrink-0 flex items-center justify-center">
          {order.vendor_image_url ? (
            <img src={order.vendor_image_url} alt="" className="size-full object-cover" />
          ) : (
            <Package className="size-4 text-[var(--text-tertiary)]" />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <AppHeading level={4} className="truncate transition-colors group-hover:text-[var(--primary)] text-sm">
            {order.vendor_name || "Store"}
          </AppHeading>
          <AppText variant="caption" className="transition-opacity group-hover:opacity-70 text-[var(--text-tertiary)] mt-0.5">
            {created_at ? format(new Date(created_at), "MMM d") : '—'} · {formatCurrency(total)}
          </AppText>
        </div>
        <div className="size-6 rounded-full bg-[var(--surface-muted)] flex items-center justify-center shrink-0">
          <ChevronRight className="size-3 text-[var(--text-secondary)]" />
        </div>
      </Link>
    );
  }

  return (
    <Link
      href={`/orders/${order.order_number || orderId}`}
      className="block bg-[var(--surface)] p-4 rounded-[var(--radius-xl)] border border-[var(--border)] shadow-sm shadow-[var(--shadow-xs)] active:scale-[0.98] transition-all cursor-pointer group mb-3 last:mb-0"
      prefetch={false}
    >
      <div className="flex items-start gap-3">
        {/* Vendor Avatar / Image */}
        <div className="size-12 rounded-xl bg-[var(--surface-muted)] border border-[var(--border)] overflow-hidden shrink-0 flex items-center justify-center relative">
          {order.vendor_image_url ? (
            <img src={order.vendor_image_url} alt={order.vendor_name || 'Store'} className="size-full object-cover" />
          ) : (
            <Package className="size-5 text-[var(--text-tertiary)]" />
          )}
          {isActive && (
            <div className="absolute -top-1 -right-1 size-3 bg-[var(--success)] rounded-full ring-2 ring-[var(--surface)] animate-pulse shadow-sm" />
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <span className="text-sm font-bold text-[var(--text-primary)] truncate block leading-tight group-hover:text-[var(--primary)] transition-colors">
                {order.vendor_name || "Wyshkit Vendor"}
              </span>
              <span className="text-[10px] font-bold text-[var(--text-tertiary)] uppercase tracking-wider block mt-0.5">
                Order #{orderNumber}
              </span>
            </div>
            <span className="text-sm font-black text-[var(--text-primary)] tabular-nums shrink-0">
              {formatCurrency(total)}
            </span>
          </div>

          <div className="mt-2.5 flex flex-wrap gap-1.5">
            <span className={cn(
              "px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider",
              status === ORDER_STATUS.DELIVERED ? "bg-[var(--well-success)] text-[var(--success)]" :
                isActive ? "bg-[var(--well-warning)] text-[var(--primary)]" :
                  "bg-[var(--surface-muted)] text-[var(--text-secondary)]"
            )}>
              {getOrderStatusDisplay(status)}
            </span>

            {order.has_personalization && (
              <span className={cn(
                "px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider flex items-center gap-1 border",
                order.personalization_status === 'submitted' ? "bg-[var(--well-warning)] text-[var(--warning)] border-[var(--warning)]/20" :
                  order.personalization_status === 'approved' ? "bg-[var(--well-success)] text-[var(--success)] border-[var(--success)]/20" :
                    "bg-[var(--surface-muted)] text-[var(--text-secondary)] border-[var(--border)]"
              )}>
                <Sparkles className="size-2.5" />
                <span>
                  {order.personalization_status === 'approved' ? 'Approved' :
                    order.personalization_status === 'submitted' ? 'Reviewing' :
                      'Personalised'}
                </span>
              </span>
            )}
          </div>

          <p className="text-xs font-medium text-[var(--text-secondary)] mt-2 line-clamp-1">
            {order.first_product_name || "Order Details"}
          </p>
        </div>
      </div>

      <div className="mt-3 pt-3 border-t border-[var(--border)]/50 flex items-center justify-between">
        <div className="text-[11px] font-bold text-[var(--text-tertiary)] uppercase tracking-wider flex items-center gap-1.5">
          {created_at ? format(new Date(created_at), "MMM d, yyyy") : '—'}
        </div>
        <div className={cn(
          "px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider transition-all",
          isActive
            ? "bg-[var(--primary)] text-white shadow-sm active:scale-95"
            : "bg-[var(--surface-muted)] text-[var(--text-secondary)] group-hover:bg-[var(--text-primary)] group-hover:text-white"
        )}>
          {isActive ? 'Track Order' : 'Details'}
        </div>
      </div>
    </Link>
  );
}
