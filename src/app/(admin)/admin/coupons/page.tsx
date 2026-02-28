import { createClient } from '@/lib/supabase/server'
import { CouponList } from './coupon-list'
import type { Coupon } from '@/lib/types/admin.types'

async function getCoupons(): Promise<Coupon[]> {
  const supabase = await createClient()
  const { data } = await supabase
    .from('coupons')
    .select('*')
    .order('created_at', { ascending: false })
  return data || []
}

export default async function CouponsPage() {
  const coupons = await getCoupons()

  return (
    <div className="space-y-6">
      <h1 className="text-lg font-semibold text-zinc-900">Coupons</h1>
      <CouponList coupons={coupons} />
    </div>
  )
}
