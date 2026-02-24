import { createClient } from '@/lib/supabase/server'
import { PartnerTable } from './vendor-table'
import type { Vendor } from '@/lib/types/admin.types'

const PAGE_SIZE = 20

async function getPartners(status?: string, page = 1) {
  const supabase = await createClient()
  const from = (page - 1) * PAGE_SIZE
  const to = from + PAGE_SIZE - 1

  let query = supabase
    .from('vendors')
    .select('*', { count: 'exact' })
    .order('created_at', { ascending: false })
    .range(from, to)

  if (status) {
    query = query.eq('kyc_status', status)
  }

  const { data, count } = await query
  return { vendors: data || [], totalCount: count || 0 }
}

export default async function PartnersPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; page?: string }>
}) {
  const { status, page } = await searchParams
  const currentPage = parseInt(page || '1')
  const { vendors, totalCount } = await getPartners(status, currentPage)

  return (
    <div className="space-y-6">
      <h1 className="text-lg font-semibold text-zinc-900">Vendors</h1>
      <PartnerTable
        vendors={vendors}
        currentStatus={status}
        totalCount={totalCount}
        currentPage={currentPage}
        pageSize={PAGE_SIZE}
      />
    </div>
  )
}
