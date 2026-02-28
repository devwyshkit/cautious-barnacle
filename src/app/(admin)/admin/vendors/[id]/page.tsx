import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import { VendorDetailView } from './vendor-detail'
import type { Vendor } from '@/lib/types/admin.types'

async function getVendor(id: string): Promise<Vendor | null> {
  const supabase = await createClient()
  const { data } = await supabase
    .from('vendors')
    .select('*')
    .eq('id', id)
    .single()
  return data
}

async function getVendorStats(vendorId: string) {
  const supabase = await createClient()
  const [ordersResult, productsResult] = await Promise.all([
    supabase.from('orders').select('total').eq('vendor_id', vendorId),
    supabase.from('products').select('id', { count: 'exact' }).eq('vendor_id', vendorId),
  ])

  // Explicit type cast to fix 'never' inference
  const orders = (ordersResult.data || []) as Array<{ total: number }>;

  return {
    orders: orders.length,
    gmv: orders.reduce((sum, o) => sum + (o.total || 0), 0),
    products: productsResult.count || 0,
  }
}

export default async function VendorDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const [vendor, stats] = await Promise.all([getVendor(id), getVendorStats(id)])

  if (!vendor) notFound()

  return <VendorDetailView vendor={vendor} stats={stats} />
}
