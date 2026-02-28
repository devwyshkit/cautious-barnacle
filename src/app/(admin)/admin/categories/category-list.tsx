'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
  DialogFooter,
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
import { Plus, Trash2, Loader2 } from 'lucide-react'
import { executeAdminIntent } from '@/lib/actions/admin/engine'
import type { Category } from '@/lib/types/admin.types'

interface CategoryListProps {
  categories: Category[]
}

export function CategoryList({ categories }: CategoryListProps) {
  const [open, setOpen] = useState(false)
  const [name, setName] = useState('')
  const [slug, setSlug] = useState('')
  const [loading, setLoading] = useState(false)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const router = useRouter()

  const handleCreate = async () => {
    if (!name) return
    setLoading(true)
    await executeAdminIntent({
      entity: 'category',
      action: 'CREATE',
      metadata: {
        name,
        slug: slug || name.toLowerCase().replace(/\s+/g, '-')
      }
    })
    setName('')
    setSlug('')
    setOpen(false)
    setLoading(false)
    router.refresh()
  }

  const handleToggle = async (id: string, current: boolean) => {
    await executeAdminIntent({
      entity: 'category',
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
      entity: 'category',
      action: 'DELETE',
      id: deleteId
    })
    setDeleteId(null)
    setLoading(false)
    router.refresh()
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button><Plus className="size-4 mr-2" />Add category</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add category</DialogTitle>
              <DialogDescription>Create a new product category</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              <Input
                placeholder="Category name"
                value={name}
                onChange={(e) => {
                  setName(e.target.value)
                  setSlug(e.target.value.toLowerCase().replace(/\s+/g, '-'))
                }}
              />
              <Input
                placeholder="Slug"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
              />
              <Button onClick={handleCreate} disabled={loading || !name} className="w-full">
                {loading ? <Loader2 className="size-4 animate-spin" /> : 'Create'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="border rounded-lg divide-y">
        {categories.length === 0 ? (
          <p className="p-8 text-center text-zinc-500">No categories yet</p>
        ) : (
          categories.map((cat) => (
            <div key={cat.id} className="flex items-center gap-4 p-4">
              <div className="flex-1">
                <p className="font-medium">{cat.name}</p>
                <p className="text-xs text-zinc-500">{cat.slug}</p>
              </div>
              <Switch checked={cat.is_active ?? false} onCheckedChange={() => handleToggle(cat.id, cat.is_active ?? false)} />
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setDeleteId(cat.id)}
                className="text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                <Trash2 className="size-4" />
              </Button>
            </div>
          ))
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete category?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. Products in this category will need to be reassigned.
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
