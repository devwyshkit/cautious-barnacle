'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Search } from 'lucide-react'
import type { Database } from '@/lib/supabase/database.types'

type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row']

type OrderRecord = Tables<'orders'> & {
  vendors: { name?: string | null; business_name: string | null } | null
  users: { name?: string | null; full_name?: string | null; phone: string | null } | null
}

interface DeliveryTableProps {
  deliveries: OrderRecord[]
  currentStatus?: string
}

const STATUS_OPTIONS = [
  { value: 'all', label: 'All' },
  { value: 'pending', label: 'Pending' },
  { value: 'picked_up', label: 'Picked up' },
  { value: 'in_transit', label: 'In transit' },
  { value: 'delivered', label: 'Delivered' },
  { value: 'failed', label: 'Failed' },
]

function formatDate(date: string | null) {
  if (!date) return '-'
  return new Date(date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })
}

function getStatusBadge(status: string | null) {
  if (!status) return <Badge variant="outline">Unknown</Badge>

  // Map Order statuses to Delivery colors
  const colors: Record<string, string> = {
    PLACED: 'text-[var(--text-secondary)] border-[var(--border)]',
    CONFIRMED: 'text-[var(--warning)] border-[var(--warning)]/20',
    IN_PRODUCTION: 'text-[var(--warning)] border-[var(--warning)]/20',
    PACKED: 'text-blue-600 border-blue-200',
    DISPATCHED: 'text-purple-600 border-purple-200',
    DELIVERED: 'text-[var(--success)] border-[var(--success)]/20',
    CANCELLED: 'text-red-600 border-red-200',
    REFUNDED: 'text-red-600 border-red-200',
  }

  return <Badge variant="outline" className={colors[status] || ''}>{status.replace(/_/g, ' ')}</Badge>
}

export function DeliveryTable({ deliveries, currentStatus }: DeliveryTableProps) {
  const [search, setSearch] = useState('')
  const router = useRouter()

  const filtered = deliveries.filter((d) =>
    d.order_number?.toLowerCase().includes(search.toLowerCase()) ||
    d.awb_number?.toLowerCase().includes(search.toLowerCase()) ||
    (d.vendors?.name ?? d.vendors?.business_name)?.toLowerCase().includes(search.toLowerCase()) ||
    d.vendors?.business_name?.toLowerCase().includes(search.toLowerCase())
  )

  const handleStatusFilter = (value: string) => {
    if (value === 'all') {
      router.push('/admin/deliveries')
    } else {
      router.push(`/admin/deliveries?status=${value}`)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-[var(--text-tertiary)]" />
          <Input placeholder="Search order or AWB..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
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
              <TableHead>AWB / Courier</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="hidden lg:table-cell">ETA</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 ? (
              <TableRow><TableCell colSpan={5} className="text-center text-[var(--text-secondary)] py-8">No deliveries found</TableCell></TableRow>
            ) : (
              filtered.map((delivery) => (
                <TableRow key={delivery.id}>
                  <TableCell>
                    <div>
                      <span className="font-medium">#{delivery.order_number}</span>
                      <span className="block text-xs text-[var(--text-secondary)]">
                        {delivery.users?.name ?? delivery.users?.full_name ?? delivery.users?.phone ?? '-'}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="hidden md:table-cell text-[var(--text-secondary)]">
                    {delivery.vendors?.business_name || delivery.vendors?.name || '-'}
                  </TableCell>
                  <TableCell>
                    <div>
                      <span className="font-mono text-sm">{delivery.awb_number || 'Not assigned'}</span>
                      {delivery.courier_vendor && (
                        <span className="block text-xs text-[var(--text-secondary)]">{delivery.courier_vendor}</span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>{getStatusBadge(delivery.status)}</TableCell>
                  <TableCell className="hidden lg:table-cell text-[var(--text-secondary)]">
                    {formatDate(delivery.promised_delivery_at)}
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
