'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Search, Check, X } from 'lucide-react'
import { executeAdminIntent } from '@/lib/actions/admin/engine'
import type { Partner } from '@/lib/types/admin.types'

interface PartnerTableProps {
  partners: Partner[]
  currentStatus?: string
  totalCount: number
  currentPage: number
  pageSize: number
}

const STATUS_OPTIONS = [
  { value: 'all', label: 'All' },
  { value: 'SUBMITTED', label: 'Pending' },
  { value: 'ACTIVE', label: 'Active' },
  { value: 'REJECTED', label: 'Rejected' },
]

function getStatusBadge(status: string | null) {
  switch (status) {
    case 'SUBMITTED':
      return <Badge variant="outline" className="text-amber-600 border-amber-200">Pending</Badge>
    case 'ACTIVE':
      return <Badge variant="outline" className="text-emerald-600 border-emerald-200">Active</Badge>
    case 'REJECTED':
      return <Badge variant="outline" className="text-red-600 border-red-200">Rejected</Badge>
    default:
      return <Badge variant="secondary">Unknown</Badge>
  }
}

function formatDate(date: string | null) {
  if (!date) return '-'
  return new Date(date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: '2-digit' })
}

export function PartnerTable({ partners, currentStatus, totalCount, currentPage, pageSize }: PartnerTableProps) {
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState<string | null>(null)
  const router = useRouter()

  const filtered = partners.filter((p) =>
    p.business_name?.toLowerCase().includes(search.toLowerCase()) ||
    p.email?.toLowerCase().includes(search.toLowerCase()) ||
    String(p.whatsapp_number ?? p.whatsapp_phoneNumber ?? '').includes(search)
  )

  const handleStatusFilter = (value: string) => {
    if (value === 'all') {
      router.push('/admin/partners')
    } else {
      router.push(`/admin/partners?status=${value}`)
    }
  }

  const handleApprove = async (id: string) => {
    setLoading(id)
    await executeAdminIntent({
      entity: 'partner',
      action: 'APPROVE_KYC',
      id
    })
    setLoading(null)
    router.refresh()
  }

  const handleReject = async (id: string) => {
    setLoading(id)
    await executeAdminIntent({
      entity: 'partner',
      action: 'REJECT_KYC',
      id,
      metadata: { reason: 'Documents not valid' }
    })
    setLoading(null)
    router.refresh()
  }

  const handleToggle = async (id: string, current: boolean) => {
    await executeAdminIntent({
      entity: 'partner',
      action: 'TOGGLE_STATUS',
      id,
      metadata: { isActive: !current }
    })
    router.refresh()
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-zinc-400" />
          <Input
            placeholder="Search partners..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={currentStatus || 'all'} onValueChange={handleStatusFilter}>
          <SelectTrigger className="w-[140px]">
            <SelectValue />
          </SelectTrigger>
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
              <TableHead>Partner</TableHead>
              <TableHead className="hidden md:table-cell">Contact</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="hidden lg:table-cell">Commission</TableHead>
              <TableHead className="hidden lg:table-cell">Joined</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-zinc-500 py-8">
                  No partners found
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((partner) => (
                <TableRow key={partner.id}>
                  <TableCell>
                    <Link href={`/admin/partners/${partner.id}`} className="font-medium hover:underline">
                      {partner.business_name || 'Unnamed'}
                    </Link>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    <div className="text-sm">{partner.email || '-'}</div>
                    <div className="text-xs text-zinc-500">{partner.whatsapp_number ?? (partner.whatsapp_phoneNumber != null ? String(partner.whatsapp_phoneNumber) : null) ?? '-'}</div>
                  </TableCell>
                  <TableCell>{getStatusBadge(partner.kyc_status)}</TableCell>
                  <TableCell className="hidden lg:table-cell">{partner.commission_percentage ?? 10}%</TableCell>
                  <TableCell className="hidden lg:table-cell">{formatDate(partner.created_at)}</TableCell>
                  <TableCell className="text-right">
                    {partner.kyc_status === 'SUBMITTED' ? (
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleApprove(partner.id)}
                          disabled={loading === partner.id}
                          className="text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50"
                        >
                          <Check className="size-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleReject(partner.id)}
                          disabled={loading === partner.id}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <X className="size-4" />
                        </Button>
                      </div>
                    ) : (
                      <Switch
                        checked={partner.is_active ?? false}
                        onCheckedChange={() => handleToggle(partner.id, partner.is_active ?? false)}
                      />
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {totalCount > pageSize && (
        <div className="flex items-center justify-between px-2 py-4">
          <div className="text-sm text-zinc-500">
            Showing {Math.min((currentPage - 1) * pageSize + 1, totalCount)} to {Math.min(currentPage * pageSize, totalCount)} of {totalCount} partners
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
