'use client'

import { useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Search } from 'lucide-react'
import type { Database } from '@/lib/supabase/database.types'

type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row']

interface AuditLogTableProps {
  logs: any[]
  totalCount: number
  currentPage: number
  pageSize: number
}

function formatDate(date: string | null) {
  if (!date) return '-'
  return new Date(date).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit'
  })
}

function getActionBadge(action: string) {
  const colors: Record<string, string> = {
    create: 'text-emerald-600 border-emerald-200',
    update: 'text-blue-600 border-blue-200',
    delete: 'text-red-600 border-red-200',
    approve: 'text-green-600 border-green-200',
    reject: 'text-red-600 border-red-200',
  }
  return <Badge variant="outline" className={colors[action.toLowerCase()] || ''}>{action}</Badge>
}

export function AuditLogTable({ logs, totalCount, currentPage, pageSize }: AuditLogTableProps) {
  const router = useRouter()
  const [search, setSearch] = useState('')
  const [entityFilter, setEntityFilter] = useState('all')

  const entityTypes = [...new Set(logs.map(l => l.entity_type))]

  const filtered = logs.filter((l) => {
    const matchesSearch =
      l.action.toLowerCase().includes(search.toLowerCase()) ||
      l.admin_phone?.includes(search) ||
      l.entity_type.toLowerCase().includes(search.toLowerCase())
    const matchesEntity = entityFilter === 'all' || l.entity_type === entityFilter
    return matchesSearch && matchesEntity
  })

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-zinc-400" />
          <Input
            placeholder="Search by action, phone, or entity..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={entityFilter} onValueChange={setEntityFilter}>
          <SelectTrigger className="w-[160px]"><SelectValue placeholder="All entities" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All entities</SelectItem>
            {entityTypes.map((type) => (
              <SelectItem key={type} value={type}>{type}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Action</TableHead>
              <TableHead>Entity</TableHead>
              <TableHead className="hidden md:table-cell">Admin</TableHead>
              <TableHead className="hidden lg:table-cell">Changes</TableHead>
              <TableHead>Time</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-zinc-500 py-8">
                  No audit logs yet
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((log) => (
                <TableRow key={log.id}>
                  <TableCell>{getActionBadge(log.action)}</TableCell>
                  <TableCell>
                    <div>
                      <span className="font-medium">{log.entity_type}</span>
                      {log.entity_id && (
                        <span className="block text-xs text-zinc-500 font-mono truncate max-w-[150px]">
                          {log.entity_id}
                        </span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="hidden md:table-cell font-mono text-sm">
                    {log.admin_phone || '-'}
                  </TableCell>
                  <TableCell className="hidden lg:table-cell">
                    {log.new_value ? (
                      <span className="text-xs text-zinc-500">
                        {JSON.stringify(log.new_value).slice(0, 50)}...
                      </span>
                    ) : '-'}
                  </TableCell>
                  <TableCell className="text-zinc-500 text-sm">
                    {formatDate(log.created_at)}
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
            Showing {Math.min((currentPage - 1) * pageSize + 1, totalCount)} to {Math.min(currentPage * pageSize, totalCount)} of {totalCount} entries
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
