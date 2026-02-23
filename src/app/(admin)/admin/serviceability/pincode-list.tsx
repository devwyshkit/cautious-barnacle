'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from '@/components/ui/dialog'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Plus, Search, Trash2, Loader2 } from 'lucide-react'
import { executeAdminIntent } from '@/lib/actions/admin/engine'
import type { ServiceablePincode } from '@/lib/types/admin.types'

interface PincodeListProps {
  pincodes: ServiceablePincode[]
}

export function PincodeList({ pincodes }: PincodeListProps) {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({ pincode: '' })
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const router = useRouter()

  const filtered = pincodes.filter((p) =>
    p.pincode.includes(search)
  )

  const handleCreate = async () => {
    if (!form.pincode) return
    setLoading(true)
    await executeAdminIntent({
      entity: 'pincode',
      action: 'ADD',
      metadata: { pincode: form.pincode }
    })
    setForm({ pincode: '' })
    setOpen(false)
    setLoading(false)
    router.refresh()
  }

  const handleToggle = async (id: string, current: boolean) => {
    await executeAdminIntent({
      entity: 'pincode',
      action: 'TOGGLE_STATUS',
      id,
      metadata: { isActive: !current }
    })
    router.refresh()
  }

  const handleDelete = async () => {
    if (!deleteId) return
    setLoading(true)
    await executeAdminIntent({
      entity: 'pincode',
      action: 'DELETE',
      id: deleteId
    })
    setDeleteId(null)
    setLoading(false)
    router.refresh()
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-zinc-400" />
          <Input placeholder="Search pincodes..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button><Plus className="size-4 mr-2" />Add pincode</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add pincode</DialogTitle>
              <DialogDescription>Add a new serviceable pincode</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              <Input
                placeholder="Pincode"
                value={form.pincode}
                onChange={(e) => setForm({ ...form, pincode: e.target.value.replace(/\D/g, '').slice(0, 6) })}
                maxLength={6}
              />
              <Button onClick={handleCreate} disabled={loading || !form.pincode} className="w-full">
                {loading ? <Loader2 className="size-4 animate-spin" /> : 'Add'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Pincode</TableHead>
              <TableHead>Est. Days</TableHead>
              <TableHead>Active</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 ? (
              <TableRow><TableCell colSpan={4} className="text-center text-zinc-500 py-8">No pincodes found</TableCell></TableRow>
            ) : (
              filtered.map((pincode) => (
                <TableRow key={pincode.id}>
                  <TableCell className="font-mono font-medium">{pincode.pincode}</TableCell>
                  <TableCell>{pincode.estimated_delivery_days ?? '-'}</TableCell>
                  <TableCell>
                    <Switch checked={pincode.is_active ?? false} onCheckedChange={() => handleToggle(pincode.id, pincode.is_active ?? false)} />
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setDeleteId(pincode.id)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="size-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <p className="text-xs text-zinc-500">{pincodes.filter((p) => p.is_active).length} active / {pincodes.length} total</p>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete pincode?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. Orders to this pincode will no longer be serviceable.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">
              {loading ? <Loader2 className="size-4 animate-spin" /> : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
