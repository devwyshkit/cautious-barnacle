import { createClient } from '@/lib/supabase/server'
import { ProductTable } from './product-table'

async function getProducts() {
  const supabase = await createClient()
  const { data } = await supabase
    .from('products')
    .select('id, name, base_price, is_active, is_sponsored, images, vendors(business_name)')
    .order('created_at', { ascending: false })
    .limit(100)
  return data || []
}

export default async function ProductsPage() {
  const products = await getProducts()

  return (
    <div className="space-y-6">
      <h1 className="text-lg font-semibold text-[var(--text-primary)]">Products</h1>
      <ProductTable products={products} />
    </div>
  )
}
