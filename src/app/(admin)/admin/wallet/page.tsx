import { createClient } from '@/lib/supabase/server'
import { WalletTable } from './wallet-table'

async function getWalletData() {
  const supabase = await createClient()
  const { data } = await supabase
    .from('user_wallets')
    .select('*, users(full_name, phone)')
    .order('balance', { ascending: false })
    .limit(100)

  return (data || []) as Array<{
    id: string;
    user_id: string;
    balance: number;
    total_earned: number | null;
    total_withdrawn: number | null;
    created_at: string;
    updated_at: string;
    users: { full_name: string | null; phone: string | null } | null;
  }>;
}

async function getWalletStats() {
  const supabase = await createClient()
  const [walletsResult, transactionsResult] = await Promise.all([
    supabase.from('user_wallets').select('balance'),
    supabase.from('wallet_transactions').select('amount, type'),
  ])

  const wallets = (walletsResult.data || []) as Array<{ balance: number }>;
  const transactions = (transactionsResult.data || []) as Array<{ amount: number; type: string }>;

  const totalBalance = wallets.reduce((sum, w) => sum + (w.balance || 0), 0)
  const creditedTotal = transactions
    .filter(t => t.type === 'credit')
    .reduce((sum, t) => sum + t.amount, 0)
  const debitedTotal = transactions
    .filter(t => t.type === 'debit')
    .reduce((sum, t) => sum + Math.abs(t.amount), 0)

  return { totalBalance, creditedTotal, debitedTotal, walletCount: wallets.length }
}

function formatCurrency(amount: number) {
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount)
}

export default async function WalletPage() {
  const [wallets, stats] = await Promise.all([getWalletData(), getWalletStats()])

  return (
    <div className="space-y-6">
      <h1 className="text-lg font-semibold text-[var(--text-primary)]">Wyshkit money</h1>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="border rounded-lg p-4">
          <p className="text-sm text-[var(--text-secondary)]">Total outstanding</p>
          <p className="text-xl font-semibold">{formatCurrency(stats.totalBalance)}</p>
        </div>
        <div className="border rounded-lg p-4">
          <p className="text-sm text-[var(--text-secondary)]">Total credited</p>
          <p className="text-xl font-semibold text-[var(--success)]">{formatCurrency(stats.creditedTotal)}</p>
        </div>
        <div className="border rounded-lg p-4">
          <p className="text-sm text-[var(--text-secondary)]">Total used</p>
          <p className="text-xl font-semibold text-blue-600">{formatCurrency(stats.debitedTotal)}</p>
        </div>
        <div className="border rounded-lg p-4">
          <p className="text-sm text-[var(--text-secondary)]">Active wallets</p>
          <p className="text-xl font-semibold">{stats.walletCount}</p>
        </div>
      </div>

      <WalletTable wallets={wallets} />
    </div>
  )
}
