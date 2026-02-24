'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Search, Star } from 'lucide-react'
import { executeAdminIntent } from '@/lib/actions/admin/engine'

interface CatalogTableProps {
  products: any[]
}

function formatCurrency(amount: number) {
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount)
}

export function CatalogTable({ products }: CatalogTableProps) {
  const [search, setSearch] = useState('')
  const router = useRouter()

  const filtered = products.filter((i) =>
    i.name?.toLowerCase().includes(search.toLowerCase()) ||
    i.vendors?.business_name?.toLowerCase().includes(search.toLowerCase())
  )

  const handleToggleActive = async (id: string, current: boolean) => {
    await executeAdminIntent({
      entity: 'product',
      action: 'TOGGLE_STATUS',
      ids: [id],
      metadata: { isActive: !current }
    })
    router.refresh()
  }

  const handleToggleSponsored = async (id: string, current: boolean) => {
    await executeAdminIntent({
      entity: 'product',
      action: 'TOGGLE_SPONSORED',
      ids: [id],
      metadata: { isSponsored: !current }
    })
    router.refresh()
  }

  return (
    <div className="space-y-4">
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-zinc-400" />
        <Input placeholder="Search products..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Product</TableHead>
              <TableHead className="hidden md:table-cell">Vendor</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Active</TableHead>
              <TableHead>Sponsored</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 ? (
              <TableRow><TableCell colSpan={5} className="text-center text-zinc-500 py-8">No products found</TableCell></TableRow>
            ) : (
              filtered.map((product) => (
                <TableRow key={product.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      {product.images?.[0] ? (
                        <Image src={product.images[0]} alt={product.name} width={40} height={40} className="rounded object-cover" />
                      ) : (
                        <div className="size-10 bg-zinc-100 rounded" />
                      )}
                      <span className="font-medium">{product.name}</span>
                    </div>
                  </TableCell>
                  <TableCell className="hidden md:table-cell text-zinc-500">{product.vendors?.business_name || '-'}</TableCell>
                  <TableCell>{formatCurrency(product.base_price)}</TableCell>
                  <TableCell>
                    <Switch checked={product.is_active ?? false} onCheckedChange={() => handleToggleActive(product.id, product.is_active ?? false)} />
                  </TableCell>
                  <TableCell>
                    <button
                      onClick={() => handleToggleSponsored(product.id, product.is_sponsored ?? false)}
                      className={`p-1.5 rounded transition-colors ${product.is_sponsored ? 'bg-amber-100 text-amber-600' : 'bg-zinc-100 text-zinc-400 hover:text-amber-600'}`}
                    >
                      <Star className="size-4" fill={product.is_sponsored ? 'currentColor' : 'none'} />
                    </button>
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
