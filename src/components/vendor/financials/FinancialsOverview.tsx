'use client';

import {
  IndianRupee,
  TrendingUp,
  Clock,
  Download,
  Info,
  Zap
} from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface Settlement {
  id: string;
  date: string;
  amount: number;
  status: 'PROCESSED' | 'PENDING' | 'FAILED';
  payoutId: string;
}

interface FinancialsOverviewProps {
  vendor: {
    commission_percentage?: number | null;
    vendor_tier?: string | null;
  };
  stats: {
    todayEarnings: number;
    pendingSettlement: number;
    payoutHistory: Settlement[];
  };
}

export function FinancialsOverview({ vendor, stats }: FinancialsOverviewProps) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-[var(--surface)] p-5 rounded-[var(--radius-md)] border border-[var(--border)]">
          <p className="text-xs text-[var(--text-secondary)] mb-1">Today&apos;s earnings</p>
          <h2 className="text-2xl font-semibold text-[var(--text-primary)]">₹{stats.todayEarnings.toLocaleString('en-IN')}</h2>
          <div className="mt-3 flex items-center gap-2 text-[var(--success)]">
            <div className="bg-[var(--well-success)] px-2 py-0.5 rounded flex items-center gap-1">
              <TrendingUp className="size-3" />
              <span className="text-xs font-medium text-[var(--well-success-text)]">+12.4%</span>
            </div>
            <span className="text-xs text-[var(--text-tertiary)]">vs avg Tuesday</span>
          </div>
        </div>

        <div className="bg-[var(--surface)] p-5 rounded-[var(--radius-md)] border border-[var(--border)] border-l-4 border-l-[var(--warning)]">
          <p className="text-xs text-[var(--text-secondary)] mb-1">Pending settlement</p>
          <h2 className="text-2xl font-semibold text-[var(--text-primary)]">₹{stats.pendingSettlement.toLocaleString('en-IN')}</h2>
          <p className="mt-3 text-xs text-[var(--warning)] flex items-center gap-1">
            <Zap className="size-3" />
            Next payout: T+2 (Thu, 10 AM)
          </p>
        </div>

        <div className="bg-[var(--text-primary)] p-5 rounded-[var(--radius-md)]">
          <p className="text-xs text-[var(--text-tertiary)] mb-1">Your take rate</p>
          <h2 className="text-2xl font-semibold text-[var(--text-inverse)]">{100 - (vendor.commission_percentage || 20)}%</h2>
          <div className="mt-3">
            <Badge className="bg-[var(--text-primary)] text-[var(--text-tertiary)] border-none text-xs">
              {vendor.vendor_tier || 'Vendor Plus'}
            </Badge>
          </div>
        </div>
      </div>

      <div className="bg-[var(--surface)] rounded-[var(--radius-md)] border border-[var(--border)] overflow-hidden">
        <div className="p-4 border-b border-[var(--border)] flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-[var(--text-primary)]">Settlement ledger</h3>
            <p className="text-xs text-[var(--text-secondary)] mt-0.5">Daily payouts via Razorpay Route</p>
          </div>
          <Button variant="outline" size="sm">
            <Download className="size-4 mr-1.5" />
            Export
          </Button>
        </div>

        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="text-xs text-[var(--text-secondary)] font-medium">Date</TableHead>
              <TableHead className="text-xs text-[var(--text-secondary)] font-medium">Route ID</TableHead>
              <TableHead className="text-xs text-[var(--text-secondary)] font-medium">Status</TableHead>
              <TableHead className="text-xs text-[var(--text-secondary)] font-medium text-right">Amount</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {stats.payoutHistory.map((payout) => (
              <TableRow key={payout.id}>
                <TableCell className="text-sm text-[var(--text-primary)]">{payout.date}</TableCell>
                <TableCell>
                  <code className="text-xs text-[var(--text-secondary)] bg-[var(--surface-muted)] px-1.5 py-0.5 rounded">
                    {payout.payoutId}
                  </code>
                </TableCell>
                <TableCell>
                  <Badge
                    variant="outline"
                    className={cn(
                      "text-xs",
                      payout.status === 'PROCESSED' ? "bg-[var(--well-success)] text-[var(--well-success-text)] border-[var(--success)]/10" :
                        payout.status === 'PENDING' ? "bg-[var(--well-warning)] text-[var(--well-warning-text)] border-[var(--warning)]/10" :
                          "bg-[var(--well-destructive)] text-[var(--well-destructive-text)] border-[var(--destructive)]/10"
                    )}
                  >
                    {payout.status.toLowerCase()}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <span className="text-sm font-medium text-[var(--text-primary)]">₹{payout.amount.toLocaleString('en-IN')}</span>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="bg-[var(--well-warning)] rounded-[var(--radius-md)] border border-[var(--warning)]/10 p-5">
        <div className="flex items-start gap-4">
          <div className="size-10 rounded-[var(--radius-sm)] bg-[var(--warning)]/10 flex items-center justify-center flex-shrink-0">
            <Info className="size-5 text-[var(--warning)]" />
          </div>
          <div className="flex-1">
            <h3 className="font-medium text-[var(--text-primary)] mb-1">Commission structure</h3>
            <p className="text-sm text-[var(--text-secondary)] mb-4">
              You&apos;re charged {vendor.commission_percentage || 20}% on successful orders.
              Personalization fees are settled 100% to you.
            </p>
            <div className="flex gap-6">
              <div>
                <p className="text-lg font-semibold text-[var(--text-primary)]">48 hrs</p>
                <p className="text-xs text-[var(--text-secondary)]">Payout cycle</p>
              </div>
              <div>
                <p className="text-lg font-semibold text-[var(--text-primary)]">₹0</p>
                <p className="text-xs text-[var(--text-secondary)]">Listing fee</p>
              </div>
              <div>
                <p className="text-lg font-semibold text-[var(--text-primary)]">{100 - (vendor.commission_percentage || 20)}%</p>
                <p className="text-xs text-[var(--text-secondary)]">Your take-home</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
