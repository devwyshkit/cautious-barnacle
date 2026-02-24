import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import { OrderDetail } from './order-detail'

async function getOrder(id: string) {
  const supabase = await createClient()
  const { data } = await supabase
    .from('orders')
    .select(`
      *,
      vendors(business_name, email),
      users(full_name, phone, email),
      order_products(*, products(name, images)),
      order_status_history(id, status, changed_at, metadata, order_id)
    `)
    .eq('id', id)
    .single()
  return data
}

export default async function OrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const order = await getOrder(id)

  if (!order) {
    notFound()
  }

  return <OrderDetail order={order} />
}
