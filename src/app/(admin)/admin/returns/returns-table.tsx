'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Search, Check, X } from 'lucide-react'
import { executeAdminIntent } from '@/lib/actions/admin/engine'
import type { Database } from '@/lib/supabase/database.types'

type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row']

type ReturnWithOrder = Tables<'returns'> & {
  orders: {
    order_number: string
    total: number
    vendors: { business_name: string | null } | null
  } | null
}

interface ReturnsTableProps {
  returns: ReturnWithOrder[]
  currentStatus?: string
}

const STATUS_OPTIONS = [
  { value: 'all', label: 'All' },
  { value: 'pending', label: 'Pending' },
  { value: 'approved', label: 'Approved' },
  { value: 'rejected', label: 'Rejected' },
]

function formatCurrency(amount: number) {
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount)
}

function formatDate(date: string | null) {
  if (!date) return '-'
  return new Date(date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })
}

function getStatusBadge(status: string | null) {
  const colors: Record<string, string> = {
    pending: 'text-amber-600 border-amber-200',
    approved: 'text-emerald-600 border-emerald-200',
    rejected: 'text-red-600 border-red-200',
  }
  return <Badge variant="outline" className={colors[status || ''] || ''}>{status || 'pending'}</Badge>
}

export function ReturnsTable({ returns, currentStatus }: ReturnsTableProps) {
  const [search, setSearch] = useState('')
  const [processing, setProcessing] = useState<string | null>(null)
  const router = useRouter()

  const filtered = returns.filter((r) =>
    r.orders?.order_number?.toLowerCase().includes(search.toLowerCase()) ||
    r.orders?.vendors?.business_name?.toLowerCase().includes(search.toLowerCase()) ||
    r.reason?.toLowerCase().includes(search.toLowerCase())
  )

  const handleStatusFilter = (value: string) => {
    if (value === 'all') {
      router.push('/admin/returns')
    } else {
      router.push(`/admin/returns?status=${value}`)
    }
  }

  const handleApprove = async (id: string, amount: number) => {
    setProcessing(id)
    await executeAdminIntent({
      entity: 'return',
      action: 'APPROVE',
      id,
      metadata: { refund_amount: amount }
    })
    setProcessing(null)
    router.refresh()
  }

  const handleReject = async (id: string) => {
    setProcessing(id)
    await executeAdminIntent({
      entity: 'return',
      action: 'REJECT',
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
            placeholder="Search by order or reason..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={currentStatus || 'all'} onValueChange={handleStatusFilter}>
          <SelectTrigger className="w-[140px]"><SelectValue /></SelectTrigger>
          <SelectContent>
            {STATUS_OPTIONS.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order</TableHead>
              <TableHead className="hidden md:table-cell">Vendor</TableHead>
              <TableHead>Reason</TableHead>
              <TableHead>Refund</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="hidden lg:table-cell">Requested</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center text-zinc-500 py-8">
                  No returns found
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((returnProduct) => (
                <TableRow key={returnProduct.id} className={processing === returnProduct.id ? 'opacity-50' : ''}>
                  <TableCell className="font-medium">
                    #{returnProduct.orders?.order_number || '-'}
                  </TableCell>
                  <TableCell className="hidden md:table-cell text-zinc-500">
                    {returnProduct.orders?.vendors?.business_name || '-'}
                  </TableCell>
                  <TableCell className="max-w-[200px] truncate" title={returnProduct.reason ?? undefined}>
                    {returnProduct.reason}
                  </TableCell>
                  <TableCell className="font-semibold">
                    {returnProduct.refund_amount ? formatCurrency(returnProduct.refund_amount) : formatCurrency(returnProduct.orders?.total || 0)}
                  </TableCell>
                  <TableCell>{getStatusBadge(returnProduct.status)}</TableCell>
                  <TableCell className="hidden lg:table-cell text-zinc-500">
                    {formatDate(returnProduct.created_at)}
                  </TableCell>
                  <TableCell className="text-right">
                    {returnProduct.status === 'pending' && (
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleApprove(returnProduct.id, returnProduct.orders?.total || 0)}
                          disabled={processing === returnProduct.id}
                          className="text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50"
                        >
                          <Check className="size-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleReject(returnProduct.id)}
                          disabled={processing === returnProduct.id}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <X className="size-4" />
                        </Button>
                      </div>
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
