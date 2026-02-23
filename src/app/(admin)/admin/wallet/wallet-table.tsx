'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Search, Plus, Loader2 } from 'lucide-react'
import { executeAdminIntent } from '@/lib/actions/admin/engine'
import type { Database } from '@/lib/supabase/database.types'

type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row']

type WalletWithUser = Tables<'wyshkit_money'> & { users: { full_name: string | null; phone: string | null } | null }

interface WalletTableProps {
  wallets: WalletWithUser[]
}

function formatCurrency(amount: number) {
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount)
}

export function WalletTable({ wallets }: WalletTableProps) {
  const [search, setSearch] = useState('')
  const [creditDialog, setCreditDialog] = useState<{ open: boolean; userId: string; userName: string } | null>(null)
  const [amount, setAmount] = useState('')
  const [reason, setReason] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const filtered = wallets.filter((w) =>
    w.users?.full_name?.toLowerCase().includes(search.toLowerCase()) ||
    w.users?.phone?.includes(search)
  )

  const handleCredit = async () => {
    if (!creditDialog || !amount) return
    setLoading(true)
    await executeAdminIntent({
      entity: 'wallet_credit',
      action: 'CREDIT',
      id: creditDialog.userId,
      metadata: { amount: parseFloat(amount), description: reason || 'Admin credit' }
    })
    setAmount('')
    setReason('')
    setCreditDialog(null)
    setLoading(false)
    router.refresh()
  }

  return (
    <div className="space-y-4">
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-zinc-400" />
        <Input placeholder="Search by name or phone..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Customer</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Balance</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 ? (
              <TableRow><TableCell colSpan={4} className="text-center text-zinc-500 py-8">No wallets found</TableCell></TableRow>
            ) : (
              filtered.map((wallet) => (
                <TableRow key={wallet.user_id}>
                  <TableCell className="font-medium">{wallet.users?.full_name || 'Unnamed'}</TableCell>
                  <TableCell className="font-mono text-sm">{wallet.users?.phone}</TableCell>
                  <TableCell className="font-semibold">{formatCurrency(wallet.balance || 0)}</TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCreditDialog({
                        open: true,
                        userId: wallet.user_id,
                        userName: wallet.users?.full_name || wallet.users?.phone || 'User',
                      })}
                    >
                      <Plus className="size-3 mr-1" />Credit
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={!!creditDialog} onOpenChange={(open) => !open && setCreditDialog(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Credit wyshkit money</DialogTitle>
            <DialogDescription>Add balance to {creditDialog?.userName}</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label>Amount</Label>
              <Input type="number" placeholder="100" value={amount} onChange={(e) => setAmount(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Reason</Label>
              <Textarea placeholder="Refund, promotional credit, etc." value={reason} onChange={(e) => setReason(e.target.value)} rows={2} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCreditDialog(null)}>Cancel</Button>
            <Button onClick={handleCredit} disabled={loading || !amount}>
              {loading ? <Loader2 className="size-4 animate-spin" /> : 'Credit'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
