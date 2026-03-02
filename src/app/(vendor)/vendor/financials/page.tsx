import { getVendorFromSession } from '@/lib/auth/server';
import { get_vendor_financials } from '@/lib/actions/vendor/vendor-actions';
import { formatCurrency } from '@/lib/utils/pricing';
import { redirect } from 'next/navigation';
import { IndianRupee, Clock, ArrowUpRight, Percent, Calendar, CheckCircle2, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { addDays, format, startOfWeek, endOfWeek, isSameWeek, isWithinInterval } from 'date-fns';
import { cn } from '@/lib/utils';

function getNextSettlementDate(settlementDays: number = 7): Date {
  const today = new Date();
  const dayOfWeek = today.getDay();
  const daysUntilSettlement = (7 - dayOfWeek) % 7 || 7;
  return addDays(today, Math.min(daysUntilSettlement, settlementDays));
}

function SettlementCalendar({ pendingAmount, settlementDays }: { pendingAmount: number; settlementDays: number }) {
  const today = new Date();
  const nextSettlement = getNextSettlementDate(settlementDays);
  const weekStart = startOfWeek(nextSettlement, { weekStartsOn: 1 });
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-semibold flex items-center gap-2">
          <Calendar className="size-4" />
          Settlement schedule
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-3 bg-[var(--well-success)] rounded-[var(--radius-md)] border border-[var(--well-success-border)]">
            <div>
              <p className="text-sm font-bold text-[var(--well-success-text)]">Next payout</p>
              <p className="text-xs text-[var(--well-success-text)]/70">{format(nextSettlement, 'EEEE, d MMM')}</p>
            </div>
            <p className="text-lg font-bold text-[var(--well-success-text)]">
              ₹{pendingAmount.toLocaleString('en-IN')}
            </p>
          </div>

          <div className="grid grid-cols-7 gap-1">
            {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, i) => (
              <div key={i} className="text-center text-xs text-[var(--text-tertiary)] py-1">{day}</div>
            ))}
            {weekDays.map((day, i) => {
              const isToday = format(day, 'yyyy-MM-dd') === format(today, 'yyyy-MM-dd');
              const isSettlementDay = format(day, 'yyyy-MM-dd') === format(nextSettlement, 'yyyy-MM-dd');
              return (
                <div
                  key={i}
                  className={`aspect-square flex items-center justify-center rounded-[var(--radius-md)] text-sm transition-colors ${isSettlementDay
                    ? 'bg-[var(--success)] text-[var(--background)] font-bold'
                    : isToday
                      ? 'bg-[var(--text-primary)] text-[var(--background)] font-bold'
                      : 'bg-[var(--surface-muted)] text-[var(--text-secondary)]'
                    }`}
                >
                  {format(day, 'd')}
                </div>
              );
            })}
          </div>

          <p className="text-xs text-[var(--text-secondary)] text-center">
            Payouts are processed every {settlementDays} days
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

export default async function VendorFinancialsPage() {
  const vendor = await getVendorFromSession();
  if (!vendor) redirect('/vendor/login');

  const { data: financials } = await get_vendor_financials(vendor.id);
  const payouts: any[] = []; // WYSHKIT 2026: Payouts table purged. Managed via Ledger now.

  const settlementDays = vendor.settlement_days || 7;

  return (
    <div className="px-4 py-6 space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-[var(--text-primary)]">Money</h1>
        <p className="text-sm text-[var(--text-secondary)] mt-1">
          Track earnings and payouts
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-3">
              <div className="size-10 rounded-[var(--radius-md)] bg-[var(--well-success)] flex items-center justify-center">
                <IndianRupee className="size-5 text-[var(--well-success-text)]" />
              </div>
              <div>
                <p className="text-xl font-semibold text-[var(--text-primary)]">
                  ₹{formatCurrency(financials?.total_earnings || 0)}
                </p>
                <p className="text-xs text-[var(--text-secondary)]">Total earnings</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-3">
              <div className="size-10 rounded-[var(--radius-md)] bg-[var(--well-warning)] flex items-center justify-center">
                <Clock className="size-5 text-[var(--well-warning-text)]" />
              </div>
              <div>
                <p className="text-xl font-semibold text-[var(--text-primary)]">
                  ₹{formatCurrency(financials?.pending_settlement || 0)}
                </p>
                <p className="text-xs text-[var(--text-secondary)]">Pending</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-3">
              <div className="size-10 rounded-[var(--radius-md)] bg-[var(--well-info)] flex items-center justify-center">
                <ArrowUpRight className="size-5 text-[var(--well-info-text)]" />
              </div>
              <div>
                <p className="text-xl font-semibold text-[var(--text-primary)]">
                  {financials?.last_payout ? `₹${formatCurrency(financials.last_payout)}` : 'None yet'}
                </p>
                <p className="text-xs text-[var(--text-secondary)]">Last payout</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-3">
              <div className="size-10 rounded-[var(--radius-md)] bg-[var(--surface-muted)] flex items-center justify-center">
                <Percent className="size-5 text-[var(--text-secondary)]" />
              </div>
              <div>
                <p className="text-xl font-semibold text-[var(--text-primary)]">
                  {financials?.commission_rate || 0}%
                </p>
                <p className="text-xs text-[var(--text-secondary)]">Commission</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <SettlementCalendar
        pendingAmount={financials?.pending_settlement || 0}
        settlementDays={settlementDays}
      />

      <Card>
        <CardHeader>
          <CardTitle className="text-base font-semibold">Payout details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between py-2">
              <span className="text-sm text-[var(--text-secondary)]">Bank account</span>
              <span className="text-sm font-medium text-[var(--text-primary)]">
                {(vendor as any).payout_account_number
                  ? `**** ${(vendor as any).payout_account_number.slice(-4)} `
                  : 'Not set'
                }
              </span>
            </div>
            <div className="flex items-center justify-between py-2">
              <span className="text-sm text-[var(--text-secondary)]">IFSC</span>
              <span className="text-sm font-medium text-[var(--text-primary)]">
                {(vendor as any).payout_ifsc || 'Not set'}
              </span>
            </div>
            <div className="flex items-center justify-between py-2">
              <span className="text-sm text-[var(--text-secondary)]">Settlement cycle</span>
              <span className="text-sm font-medium text-[var(--text-primary)]">
                {(vendor as any).settlement_days || 7} days
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base font-semibold">Recent payouts</CardTitle>
        </CardHeader>
        <CardContent>
          {payouts && payouts.length > 0 ? (
            <div className="space-y-3">
              {payouts.slice(0, 5).map((payout: { id: string; amount: number; status: string; created_at: string }) => (
                <div key={payout.id} className="flex items-center justify-between py-2 border-b border-[var(--border)] last:border-0">
                  <div className="flex items-center gap-3">
                    <div className={`size-8 rounded-full flex items-center justify-center ${payout.status === 'completed' ? 'bg-[var(--well-success)]' : 'bg-[var(--well-warning)]'
                      }`}>
                      {payout.status === 'completed'
                        ? <CheckCircle2 className="size-4 text-[var(--well-success-text)]" />
                        : <AlertCircle className="size-4 text-[var(--well-warning-text)]" />
                      }
                    </div>
                    <div>
                      <p className="text-sm font-medium text-[var(--text-primary)]">
                        ₹{payout.amount.toLocaleString('en-IN')}
                      </p>
                      <p className="text-xs text-[var(--text-secondary)]">
                        {format(new Date(payout.created_at), 'd MMM yyyy')}
                      </p>
                    </div>
                  </div>
                  <Badge variant="outline" className={cn(
                    "text-xs rounded-[var(--radius-xs)] font-bold",
                    payout.status === 'completed'
                      ? 'bg-[var(--well-success)] text-[var(--well-success-text)] border-[var(--well-success-border)]'
                      : 'bg-[var(--well-warning)] text-[var(--well-warning-text)] border-[var(--well-warning-border)]'
                  )}>
                    {payout.status}
                  </Badge>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-6">
              <p className="text-sm text-[var(--text-secondary)]">No payouts yet</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
