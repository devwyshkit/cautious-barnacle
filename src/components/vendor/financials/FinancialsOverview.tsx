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
        <div className="bg-white p-5 rounded-xl border border-zinc-100">
          <p className="text-xs text-zinc-500 mb-1">Today's earnings</p>
          <h2 className="text-2xl font-semibold text-zinc-900">₹{stats.todayEarnings.toLocaleString('en-IN')}</h2>
          <div className="mt-3 flex items-center gap-2 text-emerald-600">
            <div className="bg-emerald-50 px-2 py-0.5 rounded flex items-center gap-1">
              <TrendingUp className="size-3" />
              <span className="text-xs font-medium">+12.4%</span>
            </div>
            <span className="text-xs text-zinc-400">vs avg Tuesday</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-zinc-100 border-l-4 border-l-amber-400">
          <p className="text-xs text-zinc-500 mb-1">Pending settlement</p>
          <h2 className="text-2xl font-semibold text-zinc-900">₹{stats.pendingSettlement.toLocaleString('en-IN')}</h2>
          <p className="mt-3 text-xs text-amber-600 flex items-center gap-1">
            <Zap className="size-3" />
            Next payout: T+2 (Thu, 10 AM)
          </p>
        </div>

        <div className="bg-zinc-900 p-5 rounded-xl">
          <p className="text-xs text-zinc-400 mb-1">Your take rate</p>
          <h2 className="text-2xl font-semibold text-white">{100 - (vendor.commission_percentage || 20)}%</h2>
          <div className="mt-3">
            <Badge className="bg-zinc-800 text-zinc-400 border-none text-xs">
              {vendor.vendor_tier || 'Vendor Plus'}
            </Badge>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-zinc-100 overflow-hidden">
        <div className="p-4 border-b border-zinc-100 flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-zinc-900">Settlement ledger</h3>
            <p className="text-xs text-zinc-500 mt-0.5">Daily payouts via Razorpay Route</p>
          </div>
          <Button variant="outline" size="sm">
            <Download className="size-4 mr-1.5" />
            Export
          </Button>
        </div>

        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="text-xs text-zinc-500 font-medium">Date</TableHead>
              <TableHead className="text-xs text-zinc-500 font-medium">Route ID</TableHead>
              <TableHead className="text-xs text-zinc-500 font-medium">Status</TableHead>
              <TableHead className="text-xs text-zinc-500 font-medium text-right">Amount</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {stats.payoutHistory.map((payout) => (
              <TableRow key={payout.id}>
                <TableCell className="text-sm text-zinc-900">{payout.date}</TableCell>
                <TableCell>
                  <code className="text-xs text-zinc-500 bg-zinc-100 px-1.5 py-0.5 rounded">
                    {payout.payoutId}
                  </code>
                </TableCell>
                <TableCell>
                  <Badge 
                    variant="outline"
                    className={cn(
                      "text-xs",
                      payout.status === 'PROCESSED' ? "bg-emerald-50 text-emerald-700 border-emerald-200" :
                      payout.status === 'PENDING' ? "bg-amber-50 text-amber-700 border-amber-200" :
                      "bg-red-50 text-red-700 border-red-200"
                    )}
                  >
                    {payout.status.toLowerCase()}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <span className="text-sm font-medium text-zinc-900">₹{payout.amount.toLocaleString('en-IN')}</span>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="bg-amber-50 rounded-xl border border-amber-100 p-5">
        <div className="flex items-start gap-4">
          <div className="size-10 rounded-lg bg-amber-100 flex items-center justify-center flex-shrink-0">
            <Info className="size-5 text-amber-600" />
          </div>
          <div className="flex-1">
            <h3 className="font-medium text-zinc-900 mb-1">Commission structure</h3>
            <p className="text-sm text-zinc-600 mb-4">
              You're charged {vendor.commission_percentage || 20}% on successful orders. 
              Personalization fees are settled 100% to you.
            </p>
            <div className="flex gap-6">
              <div>
                <p className="text-lg font-semibold text-zinc-900">48 hrs</p>
                <p className="text-xs text-zinc-500">Payout cycle</p>
              </div>
              <div>
                <p className="text-lg font-semibold text-zinc-900">₹0</p>
                <p className="text-xs text-zinc-500">Listing fee</p>
              </div>
              <div>
                <p className="text-lg font-semibold text-zinc-900">{100 - (vendor.commission_percentage || 20)}%</p>
                <p className="text-xs text-zinc-500">Your take-home</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
