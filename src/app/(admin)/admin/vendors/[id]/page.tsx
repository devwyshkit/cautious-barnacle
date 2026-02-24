import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import { PartnerDetailView } from './vendor-detail'
import type { Vendor } from '@/lib/types/admin.types'

async function getPartner(id: string): Promise<Vendor | null> {
  const supabase = await createClient()
  const { data } = await supabase
    .from('vendors')
    .select('*')
    .eq('id', id)
    .single()
  return data
}

async function getPartnerStats(partnerId: string) {
  const supabase = await createClient()
  const [ordersResult, itemsResult] = await Promise.all([
    supabase.from('orders').select('total').eq('vendor_id', partnerId),
    supabase.from('products').select('id', { count: 'exact' }).eq('vendor_id', partnerId),
  ])

  // Explicit type cast to fix 'never' inference
  const orders = (ordersResult.data || []) as Array<{ total: number }>;

  return {
    orders: orders.length,
    gmv: orders.reduce((sum, o) => sum + (o.total || 0), 0),
    products: itemsResult.count || 0,
  }
}

export default async function PartnerDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const [vendor, stats] = await Promise.all([getPartner(id), getPartnerStats(id)])

  if (!vendor) notFound()

  return <PartnerDetailView vendor={vendor} stats={stats} />
}
