'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Search, Check } from 'lucide-react'
import { executeAdminIntent } from '@/lib/actions/admin/engine'
import type { Database } from '@/lib/supabase/database.types'

type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row']

type PayoutWithPartner = Tables<'partner_payouts'> & {
  partners: { business_name: string | null } | null
}

interface PayoutTableProps {
  payouts: PayoutWithPartner[]
}

function formatCurrency(amount: number) {
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount)
}

function formatDate(date: string | null) {
  if (!date) return '-'
  return new Date(date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: '2-digit' })
}

function getStatusBadge(status: string) {
  const colors: Record<string, string> = {
    pending: 'text-amber-600 border-amber-200',
    processing: 'text-blue-600 border-blue-200',
    processed: 'text-emerald-600 border-emerald-200',
    failed: 'text-red-600 border-red-200',
  }
  return <Badge variant="outline" className={colors[status] || ''}>{status}</Badge>
}

export function PayoutTable({ payouts }: PayoutTableProps) {
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [processing, setProcessing] = useState<string | null>(null)
  const router = useRouter()

  const filtered = payouts.filter((p) => {
    const matchesSearch = p.partners?.business_name?.toLowerCase().includes(search.toLowerCase()) ||
      p.id?.toLowerCase().includes(search.toLowerCase())
    const matchesStatus = statusFilter === 'all' || p.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const handleProcess = async (id: string) => {
    setProcessing(id)
    await executeAdminIntent({
      entity: 'payout',
      action: 'PROCESS',
      id
    })
    setProcessing(null)
    router.refresh()
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-zinc-400" />
          <Input
            placeholder="Search partner or transaction ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[140px]"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="processed">Processed</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Partner</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead className="hidden md:table-cell">Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-zinc-500 py-8">
                  No payouts found
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((payout) => (
                <TableRow key={payout.id} className={processing === payout.id ? 'opacity-50' : ''}>
                  <TableCell className="font-medium">
                    {payout.partners?.business_name || 'Unknown partner'}
                  </TableCell>
                  <TableCell className="font-semibold">{formatCurrency(payout.payout_amount)}</TableCell>
                  <TableCell className="hidden md:table-cell text-zinc-500">
                    {formatDate(payout.created_at)}
                  </TableCell>
                  <TableCell>{getStatusBadge(payout.status)}</TableCell>
                  <TableCell className="text-right">
                    {payout.status === 'pending' && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleProcess(payout.id)}
                        disabled={processing === payout.id}
                        className="text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50"
                      >
                        <Check className="size-4 mr-1" />
                        Process
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
