'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { executeAdminIntent } from '@/lib/actions/admin/engine'
import { ORDER_STATUS } from '@/lib/types/admin.types'
import type { Database } from '@/lib/supabase/database.types'

type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row']

type OrderWithRelations = Tables<'orders'> & {
  vendors: { business_name: string | null } | null
  users: { full_name: string | null; phone: string | null } | null
}

interface OrderTableProps {
  orders: OrderWithRelations[]
  currentStatus?: string
  totalCount: number
  currentPage: number
  pageSize: number
}

const STATUS_OPTIONS = [
  { value: 'all', label: 'All' },
  ...Object.values(ORDER_STATUS).map(s => ({ value: s, label: s.replace(/_/g, ' ').toLowerCase() }))
]

function formatCurrency(amount: number) {
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount)
}

function formatDate(date: string) {
  return new Date(date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })
}

function getStatusBadge(status: string) {
  const colors: Record<string, string> = {
    PLACED: 'text-[var(--warning)] border-[var(--warning)]/20',
    CONFIRMED: 'text-blue-600 border-blue-200',
    IN_PRODUCTION: 'text-purple-600 border-purple-200',
    PACKED: 'text-cyan-600 border-cyan-200',
    DISPATCHED: 'text-indigo-600 border-indigo-200',
    DELIVERED: 'text-[var(--success)] border-[var(--success)]/20',
    CANCELLED: 'text-red-600 border-red-200',
    REFUNDED: 'text-[var(--text-secondary)] border-[var(--border)]',
  }
  return <Badge variant="outline" className={colors[status] || ''}>{status.replace(/_/g, ' ').toLowerCase()}</Badge>
}

export function OrderTable({ orders, currentStatus, totalCount, currentPage, pageSize }: OrderTableProps) {
  const [search, setSearch] = useState('')
  const [updating, setUpdating] = useState<string | null>(null)
  const router = useRouter()

  const filtered = orders.filter((o) =>
    o.order_number?.toLowerCase().includes(search.toLowerCase()) ||
    o.vendors?.business_name?.toLowerCase().includes(search.toLowerCase())
  )

  const handleStatusFilter = (value: string) => {
    if (value === 'all') {
      router.push('/admin/orders')
    } else {
      router.push(`/admin/orders?status=${value}`)
    }
  }

  const handleStatusChange = async (orderId: string, status: string) => {
    setUpdating(orderId)
    await executeAdminIntent({
      entity: 'order',
      action: 'UPDATE_STATUS',
      id: orderId,
      target_status: status
    })
    setUpdating(null)
    router.refresh()
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-[var(--text-tertiary)]" />
          <Input placeholder="Search orders..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
        </div>
        <Select value={currentStatus || 'all'} onValueChange={handleStatusFilter}>
          <SelectTrigger className="w-[160px]"><SelectValue /></SelectTrigger>
          <SelectContent>
            {STATUS_OPTIONS.map((opt) => (
              <SelectItem key={opt.value} value={opt.value} className="capitalize">{opt.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="border rounded-[var(--radius-sm)]">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order</TableHead>
              <TableHead className="hidden md:table-cell">Vendor</TableHead>
              <TableHead className="hidden lg:table-cell">Customer</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead className="hidden lg:table-cell">Date</TableHead>
              <TableHead className="text-right">Update</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 ? (
              <TableRow><TableCell colSpan={7} className="text-center text-[var(--text-secondary)] py-8">No orders found</TableCell></TableRow>
            ) : (
              filtered.map((order) => (
                <TableRow key={order.id} className={updating === order.id ? 'opacity-50' : ''}>
                  <TableCell className="font-medium">#{order.order_number}</TableCell>
                  <TableCell className="hidden md:table-cell">{order.vendors?.business_name || '-'}</TableCell>
                  <TableCell className="hidden lg:table-cell">
                    <div className="text-sm">{order.users?.full_name || 'Guest'}</div>
                    <div className="text-xs text-[var(--text-secondary)]">{order.users?.phone}</div>
                  </TableCell>
                  <TableCell>{getStatusBadge(order.status)}</TableCell>
                  <TableCell>{formatCurrency(order.total)}</TableCell>
                  <TableCell className="hidden lg:table-cell text-[var(--text-secondary)]">{order.created_at ? formatDate(order.created_at) : '-'}</TableCell>
                  <TableCell className="text-right">
                    <Select value={order.status} onValueChange={(v) => handleStatusChange(order.id, v)} disabled={updating === order.id}>
                      <SelectTrigger className="w-[130px] h-8 text-xs"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {Object.values(ORDER_STATUS).map((s) => (
                          <SelectItem key={s} value={s} className="text-xs capitalize">{s.replace(/_/g, ' ').toLowerCase()}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {totalCount > pageSize && (
        <div className="flex items-center justify-between px-2 py-4">
          <div className="text-sm text-[var(--text-secondary)]">
            Showing {Math.min((currentPage - 1) * pageSize + 1, totalCount)} to {Math.min(currentPage * pageSize, totalCount)} of {totalCount} orders
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage <= 1}
              onClick={() => {
                const params = new URLSearchParams(window.location.search);
                params.set('page', (currentPage - 1).toString());
                router.push(`${window.location.pathname}?${params.toString()}`);
              }}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage * pageSize >= totalCount}
              onClick={() => {
                const params = new URLSearchParams(window.location.search);
                params.set('page', (currentPage + 1).toString());
                router.push(`${window.location.pathname}?${params.toString()}`);
              }}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
