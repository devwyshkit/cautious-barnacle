'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Plus } from 'lucide-react'
import { executeAdminIntent } from '@/lib/actions/admin/engine'
import type { Coupon, DiscountType } from '@/lib/types/admin.types'

interface CouponListProps {
  coupons: Coupon[]
}

export function CouponList({ coupons }: CouponListProps) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    code: '',
    discount_type: 'percentage' as DiscountType,
    discount_value: '',
    min_order_value: '',
    max_discount_amount: '',
    usage_limit: '',
  })
  const router = useRouter()

  const handleCreate = async () => {
    if (!form.code || !form.discount_value) return
    setLoading(true)
    await executeAdminIntent({
      entity: 'coupon',
      action: 'CREATE',
      metadata: {
        code: form.code.toUpperCase(),
        discount_type: form.discount_type,
        discount_value: parseFloat(form.discount_value),
        min_order_value: form.min_order_value ? parseFloat(form.min_order_value) : undefined,
        max_discount_amount: form.max_discount_amount ? parseFloat(form.max_discount_amount) : undefined,
        usage_limit: form.usage_limit ? parseInt(form.usage_limit) : undefined,
      }
    })
    setForm({ code: '', discount_type: 'percentage', discount_value: '', min_order_value: '', max_discount_amount: '', usage_limit: '' })
    setOpen(false)
    setLoading(false)
    router.refresh()
  }

  const handleToggle = async (id: string, current: boolean) => {
    await executeAdminIntent({
      entity: 'coupon',
      action: 'TOGGLE_STATUS',
      id,
      metadata: { isActive: !current }
    })
    router.refresh()
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button><Plus className="size-4 mr-2" />Add coupon</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Create coupon</DialogTitle></DialogHeader>
            <div className="space-y-4 pt-4">
              <Input placeholder="CODE" value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })} className="font-mono" />
              <div className="flex gap-2">
                <Select value={form.discount_type} onValueChange={(v: DiscountType) => setForm({ ...form, discount_type: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="percentage">Percentage</SelectItem>
                    <SelectItem value="fixed">Fixed</SelectItem>
                  </SelectContent>
                </Select>
                <Input type="number" placeholder={form.discount_type === 'percentage' ? '% off' : '₹ off'} value={form.discount_value} onChange={(e) => setForm({ ...form, discount_value: e.target.value })} />
              </div>
              <Input type="number" placeholder="Min order value" value={form.min_order_value} onChange={(e) => setForm({ ...form, min_order_value: e.target.value })} />
              <Input type="number" placeholder="Max discount" value={form.max_discount_amount} onChange={(e) => setForm({ ...form, max_discount_amount: e.target.value })} />
              <Input type="number" placeholder="Usage limit" value={form.usage_limit} onChange={(e) => setForm({ ...form, usage_limit: e.target.value })} />
              <Button onClick={handleCreate} disabled={loading || !form.code || !form.discount_value} className="w-full">Create</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Code</TableHead>
              <TableHead>Discount</TableHead>
              <TableHead className="hidden md:table-cell">Min order</TableHead>
              <TableHead className="hidden lg:table-cell">Usage</TableHead>
              <TableHead>Active</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {coupons.length === 0 ? (
              <TableRow><TableCell colSpan={5} className="text-center text-zinc-500 py-8">No coupons yet</TableCell></TableRow>
            ) : (
              coupons.map((coupon) => (
                <TableRow key={coupon.id}>
                  <TableCell><Badge variant="secondary" className="font-mono">{coupon.code}</Badge></TableCell>
                  <TableCell>
                    {coupon.discount_type === 'percentage' ? `${coupon.discount_value}%` : `₹${coupon.discount_value}`}
                    {coupon.max_discount_amount && <span className="text-xs text-zinc-500 ml-1">(max ₹{coupon.max_discount_amount})</span>}
                  </TableCell>
                  <TableCell className="hidden md:table-cell">{coupon.min_order_value ? `₹${coupon.min_order_value}` : '-'}</TableCell>
                  <TableCell className="hidden lg:table-cell">{coupon.used_count ?? 0} / {coupon.usage_limit || '∞'}</TableCell>
                  <TableCell>
                    <Switch checked={coupon.is_active ?? false} onCheckedChange={() => handleToggle(coupon.id, coupon.is_active ?? false)} />
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
