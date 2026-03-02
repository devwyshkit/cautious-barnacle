'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import { ArrowLeft, Check, X, Loader2, ExternalLink } from 'lucide-react'
import { executeAdminIntent } from '@/lib/actions/admin/engine'
import type { Vendor } from '@/lib/types/admin.types'

interface VendorDetailViewProps {
  vendor: Vendor
  stats: { orders: number; gmv: number; products: number }
}

function formatCurrency(amount: number) {
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount)
}

function formatDate(date: string | null) {
  if (!date) return '-'
  return new Date(date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
}

function getStatusBadge(status: string | null) {
  switch (status) {
    case 'SUBMITTED':
      return <Badge variant="outline" className="text-[var(--warning)] border-[var(--warning)]/20">Awaiting review</Badge>
    case 'ACTIVE':
      return <Badge variant="outline" className="text-[var(--success)] border-[var(--success)]/20">Active</Badge>
    case 'REJECTED':
      return <Badge variant="outline" className="text-[var(--destructive)] border-[var(--border)] bg-[var(--destructive-muted)]">Rejected</Badge>
    default:
      return <Badge variant="secondary">Unknown</Badge>
  }
}

export function VendorDetailView({ vendor, stats }: VendorDetailViewProps) {
  const [loading, setLoading] = useState(false)
  const [commission, setCommission] = useState(String(vendor.commission_percentage ?? 10))
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false)
  const [rejectReason, setRejectReason] = useState('')
  const router = useRouter()

  const handleApprove = async () => {
    setLoading(true)
    await executeAdminIntent({
      entity: 'vendor',
      action: 'APPROVE_KYC',
      id: vendor.id
    })
    setLoading(false)
    router.refresh()
  }

  const handleReject = async () => {
    if (!rejectReason.trim()) return
    setLoading(true)
    await executeAdminIntent({
      entity: 'vendor',
      action: 'REJECT_KYC',
      id: vendor.id,
      metadata: { reason: rejectReason }
    })
    setLoading(false)
    setRejectDialogOpen(false)
    router.refresh()
  }

  const handleToggle = async () => {
    await executeAdminIntent({
      entity: 'vendor',
      action: 'TOGGLE_STATUS',
      id: vendor.id,
      metadata: { isActive: !(vendor.is_active ?? false) }
    })
    router.refresh()
  }

  const handleCommissionUpdate = async () => {
    setLoading(true)
    await executeAdminIntent({
      entity: 'vendor',
      action: 'UPDATE_COMMISSION',
      id: vendor.id,
      metadata: { rate: parseFloat(commission) }
    })
    setLoading(false)
    router.refresh()
  }

  const addressStr = [vendor.city, vendor.state, vendor.pincode].filter(Boolean).join(', ') || null

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/vendors">
          <Button variant="ghost" size="icon"><ArrowLeft className="size-4" /></Button>
        </Link>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h1 className="text-lg font-semibold">{vendor.business_name || 'Unnamed vendor'}</h1>
            {getStatusBadge(vendor.kyc_status as any)}
          </div>
          <p className="text-sm text-[var(--text-secondary)]">Joined {formatDate(vendor.created_at)}</p>
        </div>
        {vendor.kyc_status === 'SUBMITTED' && (
          <div className="flex gap-2">
            <Button onClick={handleApprove} disabled={loading} className="bg-[var(--success)] hover:opacity-90">
              {loading ? <Loader2 className="size-4 animate-spin" /> : <Check className="size-4 mr-2" />}
              Approve
            </Button>
            <Button variant="outline" onClick={() => setRejectDialogOpen(true)} disabled={loading} className="text-[var(--destructive)] border-[var(--border)] hover:bg-[var(--destructive-muted)]">
              <X className="size-4 mr-2" />Reject
            </Button>
          </div>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm text-[var(--text-secondary)]">Total orders</CardTitle></CardHeader>
          <CardContent><p className="text-2xl font-semibold">{stats.orders}</p></CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm text-[var(--text-secondary)]">Total GMV</CardTitle></CardHeader>
          <CardContent><p className="text-2xl font-semibold">{formatCurrency(stats.gmv)}</p></CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm text-[var(--text-secondary)]">Listed products</CardTitle></CardHeader>
          <CardContent><p className="text-2xl font-semibold">{stats.products}</p></CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Contact Info */}
        <Card>
          <CardHeader><CardTitle className="text-sm font-medium">Contact information</CardTitle></CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-[var(--text-secondary)]">Owner name</span>
              <span>{(vendor as { owner_name?: string }).owner_name ?? vendor.business_name ?? vendor.name ?? '-'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[var(--text-secondary)]">Email</span>
              <span>{vendor.email || '-'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[var(--text-secondary)]">Phone</span>
              <span className="font-mono">{vendor.whatsapp_number ?? vendor.whatsapp_phoneNumber ?? '-'}</span>
            </div>
            {addressStr && (
              <div className="flex justify-between">
                <span className="text-[var(--text-secondary)]">Address</span>
                <span className="text-right max-w-[200px]">
                  {addressStr}
                </span>
              </div>
            )}
          </CardContent>
        </Card>

        {/* KYC Documents */}
        <Card>
          <CardHeader><CardTitle className="text-sm font-medium">KYC documents</CardTitle></CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="flex justify-between items-center">
              <span className="text-[var(--text-secondary)]">GSTIN</span>
              <div className="flex items-center gap-2">
                <span className="font-mono">{vendor.gstin || '-'}</span>
                {vendor.gstin && (
                  <a
                    href={`https://services.gst.gov.in/services/searchtp/${vendor.gstin}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[var(--text-tertiary)] hover:text-[var(--text-secondary)]"
                  >
                    <ExternalLink className="size-3" />
                  </a>
                )}
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[var(--text-secondary)]">PAN</span>
              <span className="font-mono">{vendor.pan_number ?? '-'}</span>
            </div>
            {Boolean(vendor.bank_details) && (
              <>
                <div className="border-t pt-3 mt-3">
                  <span className="text-[var(--text-secondary)] text-xs tracking-wide">Bank details</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[var(--text-secondary)]">Account</span>
                  <span className="font-mono">{(vendor.bank_details as { account_number?: string }).account_number || '-'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[var(--text-secondary)]">IFSC</span>
                  <span className="font-mono">{(vendor.bank_details as { ifsc?: string }).ifsc || '-'}</span>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Commission Settings */}
        <Card>
          <CardHeader><CardTitle className="text-sm font-medium">Commission rate</CardTitle></CardHeader>
          <CardContent>
            <div className="flex items-center gap-3">
              <Input
                type="number"
                value={commission}
                onChange={(e) => setCommission(e.target.value)}
                className="w-20"
                min="0"
                max="100"
              />
              <span className="text-[var(--text-secondary)]">%</span>
              <Button
                size="sm"
                variant="outline"
                onClick={handleCommissionUpdate}
                disabled={loading || commission === String(vendor.commission_percentage ?? 10)}
              >
                {loading ? <Loader2 className="size-4 animate-spin" /> : 'Update'}
              </Button>
            </div>
            <p className="text-xs text-[var(--text-secondary)] mt-2">Platform commission on each order</p>
          </CardContent>
        </Card>

        {/* Status Toggle */}
        <Card>
          <CardHeader><CardTitle className="text-sm font-medium">Vendor status</CardTitle></CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <span className="text-sm font-medium">{vendor.is_active ? 'Active' : 'Disabled'}</span>
                <p className="text-xs text-[var(--text-secondary)]">
                  {vendor.is_active ? 'Vendor can receive orders' : 'Vendor cannot receive orders'}
                </p>
              </div>
              <Switch checked={vendor.is_active ?? false} onCheckedChange={handleToggle} />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Reject Dialog */}
      <Dialog open={rejectDialogOpen} onOpenChange={setRejectDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject vendor application</DialogTitle>
            <DialogDescription>
              Please provide a reason for rejection. This will be shared with the vendor.
            </DialogDescription>
          </DialogHeader>
          <Textarea
            placeholder="Enter rejection reason..."
            value={rejectReason}
            onChange={(e) => setRejectReason(e.target.value)}
            rows={3}
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setRejectDialogOpen(false)}>Cancel</Button>
            <Button
              variant="destructive"
              onClick={handleReject}
              disabled={loading || !rejectReason.trim()}
            >
              {loading ? <Loader2 className="size-4 animate-spin" /> : 'Reject application'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
