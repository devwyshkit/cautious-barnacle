'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ArrowLeft, Package, Truck, User, Store, CreditCard, Clock, Loader2 } from 'lucide-react'
import { executeAdminIntent } from '@/lib/actions/admin/engine'
import { ORDER_STATUS } from '@/lib/types/admin.types'
import type { Tables, Json } from '@/lib/supabase/database.types'

type OrderWithRelations = Tables<'orders'> & {
  partners: { business_name: string | null; email: string | null; phone?: string | null } | null
  users: { full_name: string | null; phone: string | null; email: string | null } | null
  order_items: (Tables<'order_items'> & { items: { name: string; images: string[] | null } | null })[]
  order_status_history: Pick<Tables<'order_status_history'>, 'id' | 'title' | 'description' | 'type' | 'created_at'>[]
  deliveries: (Tables<'deliveries'> & { delivery_updates: Tables<'delivery_updates'>[] })[]
  order_personalization: Tables<'order_personalization'>[]
}

interface OrderDetailProps {
  order: OrderWithRelations
}

function formatCurrency(amount: number) {
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount)
}

function formatDate(date: string | null) {
  if (!date) return '-'
  return new Date(date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })
}

function getStatusBadge(status: string) {
  const colors: Record<string, string> = {
    PENDING: 'text-amber-600 border-amber-200 bg-amber-50',
    CONFIRMED: 'text-blue-600 border-blue-200 bg-blue-50',
    PREPARING: 'text-purple-600 border-purple-200 bg-purple-50',
    READY: 'text-cyan-600 border-cyan-200 bg-cyan-50',
    OUT_FOR_DELIVERY: 'text-indigo-600 border-indigo-200 bg-indigo-50',
    DELIVERED: 'text-emerald-600 border-emerald-200 bg-emerald-50',
    CANCELLED: 'text-red-600 border-red-200 bg-red-50',
  }
  return <Badge variant="outline" className={colors[status] || ''}>{status.replace(/_/g, ' ').toLowerCase()}</Badge>
}

export function OrderDetail({ order }: OrderDetailProps) {
  const [updating, setUpdating] = useState(false)
  const router = useRouter()

  const handleStatusChange = async (newStatus: string) => {
    setUpdating(true)
    await executeAdminIntent({
      entity: 'order',
      action: 'UPDATE_STATUS',
      id: order.id,
      target_status: newStatus
    })
    setUpdating(false)
    router.refresh()
  }

  const address = order.delivery_address as { name?: string; phone?: string; address_line1?: string; city?: string; pincode?: string } | null
  const timeline = [...(order.order_status_history || [])].sort((a, b) =>
    new Date(a.created_at || 0).getTime() - new Date(b.created_at || 0).getTime()
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/orders">
          <Button variant="ghost" size="icon"><ArrowLeft className="size-4" /></Button>
        </Link>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h1 className="text-lg font-semibold">Order #{order.order_number}</h1>
            {getStatusBadge(order.status)}
          </div>
          <p className="text-sm text-zinc-500">Placed {formatDate(order.created_at)}</p>
        </div>
        <Select value={order.status} onValueChange={handleStatusChange} disabled={updating}>
          <SelectTrigger className="w-[160px]">
            {updating ? <Loader2 className="size-4 animate-spin" /> : <SelectValue />}
          </SelectTrigger>
          <SelectContent>
            {Object.values(ORDER_STATUS).map((s) => (
              <SelectItem key={s} value={s} className="capitalize">{s.replace(/_/g, ' ').toLowerCase()}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Package className="size-4" />Items
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y">
                {order.order_items.map((item) => (
                  <div key={item.id} className="flex items-center gap-4 p-4">
                    {item.items?.images?.[0] && (
                      <img src={item.items.images[0]} alt={item.items?.name || ''} className="size-12 rounded object-cover" />
                    )}
                    <div className="flex-1">
                      <p className="font-medium">{item.items?.name}</p>
                      <p className="text-sm text-zinc-500">Qty: {item.quantity} × {formatCurrency(item.unit_price ?? 0)}</p>
                      {item.personalization_details && (
                        <Badge variant="secondary" className="mt-1 text-xs">Personalized</Badge>
                      )}
                    </div>
                    <p className="font-semibold">{formatCurrency(item.total_price ?? item.unit_price * item.quantity)}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {timeline.length > 0 && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <Clock className="size-4" />Timeline
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="relative pl-6 space-y-4">
                  <div className="absolute left-[9px] top-1 bottom-1 w-px bg-zinc-200" />
                  {timeline.map((entry, i) => (
                    <div key={entry.id} className="relative">
                      <div className={`absolute -left-6 top-1 size-[18px] rounded-full border-2 ${i === timeline.length - 1 ? 'bg-emerald-500 border-emerald-500' : 'bg-white border-zinc-300'
                        }`} />
                      <div>
                        <p className="font-medium capitalize">{(entry.type ?? entry.title ?? '').toLowerCase().replace(/_/g, ' ')}</p>
                        <p className="text-xs text-zinc-500">{formatDate(entry.created_at)}</p>
                        {entry.description && <p className="text-sm text-zinc-600 mt-1">{entry.description}</p>}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {order.order_personalization.length > 0 && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">Personalization</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {order.order_personalization.map((p, idx) => {
                  const item = order.order_items.find(oi => oi.id === p.order_item_id);
                  return (
                    <div key={`${p.order_id}-${p.item_index}-${idx}`} className="space-y-2 pb-4 border-b last:border-0 last:pb-0">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-medium text-zinc-900">
                            {item?.items?.name || `Item ${p.item_index + 1}`}
                          </p>
                          <Badge variant={p.approved_at ? 'default' : 'secondary'}>
                            {p.approved_at ? 'Approved' : p.status || p.preview_version != null ? 'Preview ready' : 'Pending'}
                          </Badge>
                        </div>
                        <span className="text-xs text-zinc-500">
                          {p.revision_count || 0} revision(s)
                        </span>
                      </div>

                      {item?.personalization_details && (
                        <div className="text-xs text-zinc-600 bg-zinc-50 p-2 rounded">
                          <pre className="whitespace-pre-wrap">{JSON.stringify(item.personalization_details, null, 2)}</pre>
                        </div>
                      )}

                      {p.preview_url && (
                        <div className="mt-2">
                          <p className="text-xs text-zinc-500 mb-1 font-bold">LATEST PREVIEW</p>
                          <img src={p.preview_url} alt="Preview" className="max-w-[200px] rounded border shadow-sm" />
                        </div>
                      )}
                    </div>
                  );
                })}
              </CardContent>
            </Card>
          )}
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <User className="size-4" />Customer
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm space-y-1">
              <p className="font-medium">{order.users?.full_name || 'Unnamed'}</p>
              <p className="text-zinc-500 font-mono">{order.users?.phone}</p>
              {order.users?.email && <p className="text-zinc-500">{order.users.email}</p>}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Store className="size-4" />Partner
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm space-y-1">
              <p className="font-medium">{order.partners?.business_name || 'Unknown'}</p>
              {order.partners?.phone && <p className="text-zinc-500 font-mono">{order.partners.phone}</p>}
            </CardContent>
          </Card>

          {address && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <Truck className="size-4" />Delivery address
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm space-y-1">
                <p className="font-medium">{address.name}</p>
                <p className="text-zinc-500">{address.address_line1}</p>
                <p className="text-zinc-500">{address.city} - {address.pincode}</p>
                {address.phone && <p className="text-zinc-500 font-mono">{address.phone}</p>}
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <CreditCard className="size-4" />Payment
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm space-y-2">
              <div className="flex justify-between">
                <span className="text-zinc-500">Subtotal</span>
                <span>{formatCurrency(order.subtotal)}</span>
              </div>
              {order.discount && order.discount > 0 && (
                <div className="flex justify-between text-emerald-600">
                  <span>Discount</span>
                  <span>-{formatCurrency(order.discount)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-zinc-500">Delivery</span>
                <span>{order.delivery_fee ? formatCurrency(order.delivery_fee) : 'Free'}</span>
              </div>
              <div className="flex justify-between font-semibold pt-2 border-t">
                <span>Total</span>
                <span>{formatCurrency(order.total)}</span>
              </div>
              <div className="pt-2">
                <Badge variant={(order as { payment_status?: string }).payment_status === 'paid' ? 'default' : 'secondary'}>
                  {(order as { payment_status?: string }).payment_status || 'pending'}
                </Badge>
                {(order as { payment_method?: string }).payment_method && (
                  <span className="ml-2 text-xs text-zinc-500">{(order as { payment_method?: string }).payment_method}</span>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
