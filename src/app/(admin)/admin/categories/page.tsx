import { createClient } from '@/lib/supabase/server'
import { CategoryList } from './category-list'
import type { Category } from '@/lib/types/admin.types'

async function getCategories(): Promise<Category[]> {
  const supabase = await createClient()
  const { data } = await supabase
    .from('categories')
    .select('*')
    .order('display_order', { ascending: true })
  return data || []
}

export default async function CategoriesPage() {
  const categories = await getCategories()

  return (
    <div className="space-y-6">
      <h1 className="text-lg font-semibold text-zinc-900">Categories</h1>
      <CategoryList categories={categories} />
    </div>
  )
}
