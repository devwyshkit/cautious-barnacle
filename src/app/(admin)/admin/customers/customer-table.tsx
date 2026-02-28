'use client'

import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import { Badge } from '@/components/ui/badge'
import { Search } from 'lucide-react'
import type { Database } from '@/lib/supabase/database.types'

type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row']

type Customer = Pick<Tables<'users'>, 'id' | 'full_name' | 'phone' | 'email' | 'created_at' | 'status'>

interface CustomerTableProps {
  customers: Customer[]
  totalCount: number
  currentPage: number
  pageSize: number
}

function formatDate(date: string | null) {
  if (!date) return '-'
  return new Date(date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: '2-digit' })
}

export function CustomerTable({ customers, totalCount, currentPage, pageSize }: CustomerTableProps) {
  const router = useRouter()
  const [search, setSearch] = useState('')

  const filtered = customers.filter((c) =>
    c.full_name?.toLowerCase().includes(search.toLowerCase()) ||
    c.phone?.includes(search) ||
    c.email?.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-4">
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-zinc-400" />
        <Input
          placeholder="Search by name, phone, or email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9"
        />
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Customer</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead className="hidden md:table-cell">Email</TableHead>
              <TableHead className="hidden lg:table-cell">Joined</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-zinc-500 py-8">
                  No customers found
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((customer) => (
                <TableRow key={customer.id}>
                  <TableCell className="font-medium">
                    {customer.full_name || 'Unnamed'}
                  </TableCell>
                  <TableCell className="font-mono text-sm">{customer.phone}</TableCell>
                  <TableCell className="hidden md:table-cell text-zinc-500">
                    {customer.email || '-'}
                  </TableCell>
                  <TableCell className="hidden lg:table-cell text-zinc-500">
                    {formatDate(customer.created_at)}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={customer.status === 'active' ? 'text-emerald-600 border-emerald-200' : 'text-zinc-500'}
                    >
                      {customer.status || 'active'}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {totalCount > pageSize && (
        <div className="flex items-center justify-between px-2 py-4 border-t border-zinc-100">
          <div className="text-sm text-zinc-500">
            Showing {Math.min((currentPage - 1) * pageSize + 1, totalCount)} to {Math.min(currentPage * pageSize, totalCount)} of {totalCount} customers
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage <= 1}
              onClick={() => {
                const params = new URLSearchParams(window.location.search)
                params.set('page', (currentPage - 1).toString())
                router.push(`${window.location.pathname}?${params.toString()}`)
              }}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage * pageSize >= totalCount}
              onClick={() => {
                const params = new URLSearchParams(window.location.search)
                params.set('page', (currentPage + 1).toString())
                router.push(`${window.location.pathname}?${params.toString()}`)
              }}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
