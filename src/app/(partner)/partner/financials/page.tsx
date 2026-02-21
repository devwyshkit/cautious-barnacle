import { getPartnerFromSession } from '@/lib/auth/server';
import { get_partner_financials, get_partner_payouts } from '@/lib/actions/partner/partner-actions';
import { formatCurrency } from '@/lib/utils/pricing';
import { redirect } from 'next/navigation';
import { IndianRupee, Clock, ArrowUpRight, Percent, Calendar, CheckCircle2, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { addDays, format, startOfWeek, endOfWeek, isSameWeek, isWithinInterval } from 'date-fns';

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
          <div className="flex items-center justify-between p-3 bg-emerald-50 rounded-lg border border-emerald-100">
            <div>
              <p className="text-sm font-medium text-emerald-900">Next payout</p>
              <p className="text-xs text-emerald-600">{format(nextSettlement, 'EEEE, d MMM')}</p>
            </div>
            <p className="text-lg font-semibold text-emerald-700">
              ₹{pendingAmount.toLocaleString('en-IN')}
            </p>
          </div>

          <div className="grid grid-cols-7 gap-1">
            {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, i) => (
              <div key={i} className="text-center text-xs text-zinc-400 py-1">{day}</div>
            ))}
            {weekDays.map((day, i) => {
              const isToday = format(day, 'yyyy-MM-dd') === format(today, 'yyyy-MM-dd');
              const isSettlementDay = format(day, 'yyyy-MM-dd') === format(nextSettlement, 'yyyy-MM-dd');
              return (
                <div
                  key={i}
                  className={`aspect - square flex items - center justify - center rounded - lg text - sm ${isSettlementDay
                    ? 'bg-emerald-500 text-white font-medium'
                    : isToday
                      ? 'bg-zinc-900 text-white'
                      : 'bg-zinc-50 text-zinc-600'
                    } `}
                >
                  {format(day, 'd')}
                </div>
              );
            })}
          </div>

          <p className="text-xs text-zinc-500 text-center">
            Payouts are processed every {settlementDays} days
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

export default async function PartnerFinancialsPage() {
  const partner = await getPartnerFromSession();
  if (!partner) redirect('/partner/login');

  const [{ data: financials }, { data: payouts }] = await Promise.all([
    get_partner_financials(partner.id),
    get_partner_payouts(partner.id),
  ]);

  const settlementDays = partner.settlement_days || 7;

  return (
    <div className="px-4 py-6 space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-zinc-900">Money</h1>
        <p className="text-sm text-zinc-500 mt-1">
          Track earnings and payouts
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-3">
              <div className="size-10 rounded-xl bg-emerald-50 flex items-center justify-center">
                <IndianRupee className="size-5 text-emerald-600" />
              </div>
              <div>
                <p className="text-xl font-semibold text-zinc-900">
                  ₹{formatCurrency(financials?.total_earnings || 0)}
                </p>
                <p className="text-xs text-zinc-500">Total earnings</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-3">
              <div className="size-10 rounded-xl bg-amber-50 flex items-center justify-center">
                <Clock className="size-5 text-amber-600" />
              </div>
              <div>
                <p className="text-xl font-semibold text-zinc-900">
                  ₹{formatCurrency(financials?.pending_settlement || 0)}
                </p>
                <p className="text-xs text-zinc-500">Pending</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-3">
              <div className="size-10 rounded-xl bg-blue-50 flex items-center justify-center">
                <ArrowUpRight className="size-5 text-blue-600" />
              </div>
              <div>
                <p className="text-xl font-semibold text-zinc-900">
                  {financials?.last_payout ? `₹${formatCurrency(financials.last_payout)}` : 'None yet'}
                </p>
                <p className="text-xs text-zinc-500">Last payout</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-3">
              <div className="size-10 rounded-xl bg-zinc-100 flex items-center justify-center">
                <Percent className="size-5 text-zinc-600" />
              </div>
              <div>
                <p className="text-xl font-semibold text-zinc-900">
                  {financials?.commission_rate || 0}%
                </p>
                <p className="text-xs text-zinc-500">Commission</p>
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
              <span className="text-sm text-zinc-600">Bank account</span>
              <span className="text-sm font-medium text-zinc-900">
                {partner.payout_account_number
                  ? `**** ${partner.payout_account_number.slice(-4)} `
                  : 'Not set'
                }
              </span>
            </div>
            <div className="flex items-center justify-between py-2">
              <span className="text-sm text-zinc-600">IFSC</span>
              <span className="text-sm font-medium text-zinc-900">
                {partner.payout_ifsc || 'Not set'}
              </span>
            </div>
            <div className="flex items-center justify-between py-2">
              <span className="text-sm text-zinc-600">Settlement cycle</span>
              <span className="text-sm font-medium text-zinc-900">
                {partner.settlement_days || 7} days
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
                <div key={payout.id} className="flex items-center justify-between py-2 border-b border-zinc-100 last:border-0">
                  <div className="flex items-center gap-3">
                    <div className={`size - 8 rounded - full flex items - center justify - center ${payout.status === 'completed' ? 'bg-emerald-50' : 'bg-amber-50'
                      } `}>
                      {payout.status === 'completed'
                        ? <CheckCircle2 className="size-4 text-emerald-600" />
                        : <AlertCircle className="size-4 text-amber-600" />
                      }
                    </div>
                    <div>
                      <p className="text-sm font-medium text-zinc-900">
                        ₹{payout.amount.toLocaleString('en-IN')}
                      </p>
                      <p className="text-xs text-zinc-500">
                        {format(new Date(payout.created_at), 'd MMM yyyy')}
                      </p>
                    </div>
                  </div>
                  <Badge variant="outline" className={
                    payout.status === 'completed'
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                      : 'bg-amber-50 text-amber-700 border-amber-200'
                  }>
                    {payout.status}
                  </Badge>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-6">
              <p className="text-sm text-zinc-500">No payouts yet</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
