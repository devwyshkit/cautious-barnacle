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
import { approvePartnerKYC, rejectPartnerKYC, togglePartnerStatus, updatePartnerCommission } from '@/lib/actions/commerce/admin-actions'
import type { Partner } from '@/lib/types/admin.types'

interface PartnerDetailViewProps {
  partner: Partner
  stats: { orders: number; gmv: number; items: number }
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
      return <Badge variant="outline" className="text-amber-600 border-amber-200">Awaiting review</Badge>
    case 'ACTIVE':
      return <Badge variant="outline" className="text-emerald-600 border-emerald-200">Active</Badge>
    case 'REJECTED':
      return <Badge variant="outline" className="text-red-600 border-red-200">Rejected</Badge>
    default:
      return <Badge variant="secondary">Unknown</Badge>
  }
}

export function PartnerDetailView({ partner, stats }: PartnerDetailViewProps) {
  const [loading, setLoading] = useState(false)
  const [commission, setCommission] = useState(String(partner.commission_percentage ?? 10))
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false)
  const [rejectReason, setRejectReason] = useState('')
  const router = useRouter()

  const handleApprove = async () => {
    setLoading(true)
    await approvePartnerKYC(partner.id)
    setLoading(false)
    router.refresh()
  }

  const handleReject = async () => {
    if (!rejectReason.trim()) return
    setLoading(true)
    await rejectPartnerKYC(partner.id, rejectReason)
    setLoading(false)
    setRejectDialogOpen(false)
    router.refresh()
  }

  const handleToggle = async () => {
    await togglePartnerStatus(partner.id, !(partner.is_active ?? false))
    router.refresh()
  }

  const handleCommissionUpdate = async () => {
    setLoading(true)
    await updatePartnerCommission(partner.id, parseFloat(commission))
    setLoading(false)
    router.refresh()
  }

  const addressStr = [partner.city, partner.state, partner.pincode].filter(Boolean).join(', ') || null

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/partners">
          <Button variant="ghost" size="icon"><ArrowLeft className="size-4" /></Button>
        </Link>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h1 className="text-lg font-semibold">{partner.business_name || 'Unnamed partner'}</h1>
            {getStatusBadge(partner.kyc_status)}
          </div>
          <p className="text-sm text-zinc-500">Joined {formatDate(partner.created_at)}</p>
        </div>
        {partner.kyc_status === 'SUBMITTED' && (
          <div className="flex gap-2">
            <Button onClick={handleApprove} disabled={loading} className="bg-emerald-600 hover:bg-emerald-700">
              {loading ? <Loader2 className="size-4 animate-spin" /> : <Check className="size-4 mr-2" />}
              Approve
            </Button>
            <Button variant="outline" onClick={() => setRejectDialogOpen(true)} disabled={loading} className="text-red-600 border-red-200 hover:bg-red-50">
              <X className="size-4 mr-2" />Reject
            </Button>
          </div>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm text-zinc-500">Total orders</CardTitle></CardHeader>
          <CardContent><p className="text-2xl font-semibold">{stats.orders}</p></CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm text-zinc-500">Total GMV</CardTitle></CardHeader>
          <CardContent><p className="text-2xl font-semibold">{formatCurrency(stats.gmv)}</p></CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm text-zinc-500">Listed items</CardTitle></CardHeader>
          <CardContent><p className="text-2xl font-semibold">{stats.items}</p></CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Contact Info */}
        <Card>
          <CardHeader><CardTitle className="text-sm font-medium">Contact information</CardTitle></CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-zinc-500">Owner name</span>
              <span>{(partner as { owner_name?: string }).owner_name ?? partner.partner_name ?? partner.name ?? '-'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-500">Email</span>
              <span>{partner.email || '-'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-500">Phone</span>
              <span className="font-mono">{partner.whatsapp_number ?? partner.whatsapp_phoneNumber ?? '-'}</span>
            </div>
            {addressStr && (
              <div className="flex justify-between">
                <span className="text-zinc-500">Address</span>
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
              <span className="text-zinc-500">GSTIN</span>
              <div className="flex items-center gap-2">
                <span className="font-mono">{partner.gstin || '-'}</span>
                {partner.gstin && (
                  <a
                    href={`https://services.gst.gov.in/services/searchtp/${partner.gstin}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-zinc-400 hover:text-zinc-600"
                  >
                    <ExternalLink className="size-3" />
                  </a>
                )}
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-zinc-500">PAN</span>
              <span className="font-mono">{partner.pan_number ?? '-'}</span>
            </div>
            {Boolean(partner.bank_details) && (
              <>
                <div className="border-t pt-3 mt-3">
                  <span className="text-zinc-500 text-xs tracking-wide">Bank details</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-500">Account</span>
                  <span className="font-mono">{(partner.bank_details as { account_number?: string }).account_number || '-'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-500">IFSC</span>
                  <span className="font-mono">{(partner.bank_details as { ifsc?: string }).ifsc || '-'}</span>
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
              <span className="text-zinc-500">%</span>
              <Button
                size="sm"
                variant="outline"
                onClick={handleCommissionUpdate}
                disabled={loading || commission === String(partner.commission_percentage ?? 10)}
              >
                {loading ? <Loader2 className="size-4 animate-spin" /> : 'Update'}
              </Button>
            </div>
            <p className="text-xs text-zinc-500 mt-2">Platform commission on each order</p>
          </CardContent>
        </Card>

        {/* Status Toggle */}
        <Card>
          <CardHeader><CardTitle className="text-sm font-medium">Partner status</CardTitle></CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <span className="text-sm font-medium">{partner.is_active ? 'Active' : 'Disabled'}</span>
                <p className="text-xs text-zinc-500">
                  {partner.is_active ? 'Partner can receive orders' : 'Partner cannot receive orders'}
                </p>
              </div>
              <Switch checked={partner.is_active ?? false} onCheckedChange={handleToggle} />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Reject Dialog */}
      <Dialog open={rejectDialogOpen} onOpenChange={setRejectDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject partner application</DialogTitle>
            <DialogDescription>
              Please provide a reason for rejection. This will be shared with the partner.
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
