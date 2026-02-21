'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Search, Package } from 'lucide-react';
import { CatalogList } from './CatalogList';
import { ItemForm } from './ItemForm';
import { toggle_item_active_status, toggle_item_stock_status } from '@/lib/actions/partner-actions';
import { deleteItem, getItemWithFullSpec } from '@/lib/actions/item-actions';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import type { Database } from '@/lib/supabase/database.types';

type Item = Database['public']['Tables']['items']['Row'];

// Use the unified ItemWithFullSpec type for consistency
import { ItemWithFullSpec } from '@/lib/supabase/types';
type ItemWithDetails = ItemWithFullSpec;

interface CatalogListClientProps {
  initialItems: Item[];
  partnerId: string;
}

export function CatalogListClient({ initialItems, partnerId }: CatalogListClientProps) {
  const router = useRouter();
  const [items, setItems] = useState<ItemWithDetails[]>(initialItems as ItemWithDetails[]);
  const [search, setSearch] = useState('');
  const [showItemForm, setShowItemForm] = useState(false);
  const [editingItem, setEditingItem] = useState<ItemWithDetails | null>(null);
  const [deletingItem, setDeletingItem] = useState<Item | null>(null);

  const filteredItems = items.filter(item =>
    item.name.toLowerCase().includes(search.toLowerCase()) ||
    item.category?.toLowerCase().includes(search.toLowerCase())
  );

  const handleToggleActive = async (itemId: string, isActive: boolean) => {
    const result = await toggle_item_active_status(itemId, isActive);
    if (result.success) {
      setItems(prev => prev.map(item =>
        item.id === itemId ? { ...item, is_active: isActive } : item
      ));
      toast.success(isActive ? 'Item activated' : 'Item deactivated');
    } else {
      toast.error(result.error || 'Failed to update');
    }
  };

  const handleToggleStock = async (itemId: string, stockStatus: string) => {
    const result = await toggle_item_stock_status(itemId, stockStatus);
    if (result.success) {
      setItems(prev => prev.map(item =>
        item.id === itemId ? { ...item, stock_status: stockStatus } : item
      ));
      toast.success('Stock status updated');
    } else {
      toast.error(result.error || 'Failed to update');
    }
  };

  const handleEditItem = async (item: Item) => {
    const result = await getItemWithFullSpec(item.id);

    if (result.data) {
      // Swiggy Pattern: Ensure full specification is passed to the editing sheet
      setEditingItem(result.data as ItemWithDetails);
    } else {
      // Fallback if getItemWithDetails fails
      setEditingItem({
        ...item,
        variants: [],
        personalization_options: [],
        partners: (item as any).partners || {} as any,
        item_addons: []
      } as ItemWithDetails);
    }
  };

  const handleDeleteItem = async () => {
    if (!deletingItem) return;

    const result = await deleteItem(deletingItem.id);
    if (result.success) {
      setItems(prev => prev.filter(item => item.id !== deletingItem.id));
      toast.success('Item deleted');
    } else {
      toast.error(result.error || 'Failed to delete');
    }
    setDeletingItem(null);
  };

  const handleFormSuccess = () => {
    router.refresh();
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-zinc-400" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search items"
            className="pl-9"
          />
        </div>
        <Button onClick={() => setShowItemForm(true)}>
          <Plus className="size-4 mr-1.5" />
          Add item
        </Button>
      </div>

      {filteredItems.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl border border-zinc-100">
          <Package className="size-12 text-zinc-300 mx-auto mb-3" />
          {search ? (
            <>
              <p className="text-zinc-500 text-sm">No items match "{search}"</p>
              <Button
                variant="link"
                className="mt-2 text-sm"
                onClick={() => setSearch('')}
              >
                Clear search
              </Button>
            </>
          ) : (
            <>
              <p className="text-zinc-500 text-sm">No items in your catalog yet</p>
              <p className="text-zinc-400 text-xs mt-1">Add your first item to get started</p>
              <Button
                className="mt-4"
                onClick={() => setShowItemForm(true)}
              >
                <Plus className="size-4 mr-1.5" />
                Add item
              </Button>
            </>
          )}
        </div>
      ) : (
        <CatalogList
          items={filteredItems as any}
          onToggleActive={handleToggleActive}
          onToggleStock={handleToggleStock}
          onEdit={handleEditItem}
          onDelete={setDeletingItem}
        />
      )}

      <ItemForm
        partnerId={partnerId}
        open={showItemForm}
        onOpenChange={setShowItemForm}
        onSuccess={handleFormSuccess}
      />

      {editingItem && (
        <ItemForm
          partnerId={partnerId}
          item={editingItem}
          open={!!editingItem}
          onOpenChange={(open) => !open && setEditingItem(null)}
          onSuccess={handleFormSuccess}
        />
      )}

      <AlertDialog open={!!deletingItem} onOpenChange={(open) => !open && setDeletingItem(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete item?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete "{deletingItem?.name}". This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteItem}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
