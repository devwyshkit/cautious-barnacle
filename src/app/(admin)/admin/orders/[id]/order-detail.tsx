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
import type { Json } from '@/lib/supabase/database.types'
import type { Tables } from '@/lib/supabase/types'

type OrderWithRelations = Tables<'orders'> & {
  vendors: { business_name: string | null; email: string | null; phone?: string | null } | null
  users: { full_name: string | null; phone: string | null; email: string | null } | null
  order_products: (Tables<'order_products'> & { products: { name: string; images: string[] | null } | null })[]
  order_status_history: Tables<'order_status_history'>[]
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
    PLACED: 'text-amber-600 border-amber-200 bg-amber-50',
    CONFIRMED: 'text-blue-600 border-blue-200 bg-blue-50',
    IN_PRODUCTION: 'text-purple-600 border-purple-200 bg-purple-50',
    PACKED: 'text-cyan-600 border-cyan-200 bg-cyan-50',
    DISPATCHED: 'text-indigo-600 border-indigo-200 bg-indigo-50',
    DELIVERED: 'text-emerald-600 border-emerald-200 bg-emerald-50',
    CANCELLED: 'text-red-600 border-red-200 bg-red-50',
    REFUNDED: 'text-zinc-600 border-zinc-200 bg-zinc-50',
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
    new Date(a.changed_at || 0).getTime() - new Date(b.changed_at || 0).getTime()
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
                <Package className="size-4" />Products
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y">
                {order.order_products.map((product) => (
                  <div key={product.id} className="flex items-center gap-4 p-4">
                    {product.products?.images?.[0] && (
                      <img src={product.products.images[0]} alt={product.products?.name || ''} className="size-12 rounded object-cover" />
                    )}
                    <div className="flex-1">
                      <p className="font-medium">{product.products?.name}</p>
                      <p className="text-sm text-zinc-500">Qty: {product.quantity} × {formatCurrency(product.unit_price ?? 0)}</p>
                      {product.personalization_details && (
                        <Badge variant="secondary" className="mt-1 text-xs">Personalized</Badge>
                      )}
                    </div>
                    <p className="font-semibold">{formatCurrency(product.total_price ?? product.unit_price * product.quantity)}</p>
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
                        <p className="font-medium capitalize">{entry.status.toLowerCase().replace(/_/g, ' ')}</p>
                        <p className="text-xs text-zinc-500">{formatDate(entry.changed_at)}</p>
                        {entry.metadata && (
                          <pre className="text-[10px] text-zinc-600 mt-1 bg-zinc-50 p-1 rounded max-w-full overflow-hidden">
                            {JSON.stringify(entry.metadata, null, 2)}
                          </pre>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
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
                <Store className="size-4" />Vendor
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm space-y-1">
              <p className="font-medium">{order.vendors?.business_name || 'Unknown'}</p>
              {order.vendors?.phone && <p className="text-zinc-500 font-mono">{order.vendors.phone}</p>}
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
