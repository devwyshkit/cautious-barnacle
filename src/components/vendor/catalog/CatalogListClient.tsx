'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Search, Package } from 'lucide-react';
import { CatalogList } from './CatalogList';
import { ProductForm } from './ProductForm';
import { executePartnerIntent } from '@/lib/actions/vendor/engine';
import { getItemWithFullSpec } from '@/lib/actions/discovery/products';
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

type Product = Database['public']['Tables']['products']['Row'];

// Use the unified ItemWithFullSpec type for consistency
import { ItemWithFullSpec } from '@/lib/supabase/types';
type ItemWithDetails = ItemWithFullSpec;

interface CatalogListClientProps {
  initialItems: Product[];
  partnerId: string;
}

export function CatalogListClient({ initialItems, partnerId }: CatalogListClientProps) {
  const router = useRouter();
  const [products, setItems] = useState<ItemWithDetails[]>(initialItems as ItemWithDetails[]);
  const [search, setSearch] = useState('');
  const [showProductForm, setShowProductForm] = useState(false);
  const [editingItem, setEditingItem] = useState<ItemWithDetails | null>(null);
  const [deletingItem, setDeletingItem] = useState<Product | null>(null);

  const filteredItems = products.filter(product =>
    product.name.toLowerCase().includes(search.toLowerCase()) ||
    product.category?.toLowerCase().includes(search.toLowerCase())
  );

  const handleToggleActive = async (itemId: string, isActive: boolean) => {
    const result = await executePartnerIntent({
      entity: 'product',
      action: 'TOGGLE_STATUS',
      id: itemId,
      metadata: { isActive }
    });
    if (result.success) {
      setItems(prev => prev.map(product =>
        product.id === itemId ? { ...product, is_active: isActive } : product
      ));
      toast.success(isActive ? 'Product activated' : 'Product deactivated');
    } else {
      toast.error(result.error || 'Failed to update');
    }
  };

  const handleToggleStock = async (itemId: string, stockStatus: string) => {
    const result = await executePartnerIntent({
      entity: 'product',
      action: 'TOGGLE_STOCK',
      id: itemId,
      metadata: { stockStatus }
    });
    if (result.success) {
      setItems(prev => prev.map(product =>
        product.id === itemId ? { ...product, stock_status: stockStatus } : product
      ));
      toast.success('Stock status updated');
    } else {
      toast.error(result.error || 'Failed to update');
    }
  };

  const handleEditItem = async (product: Product) => {
    const result = await getItemWithFullSpec(product.id);

    if (result.data) {
      // Swiggy Pattern: Ensure full specification is passed to the editing sheet
      setEditingItem(result.data as ItemWithDetails);
    } else {
      // Fallback if getItemWithDetails fails
      setEditingItem({
        ...product,
        product_variants: [],
        personalization_options: [],
        vendors: (product as any).vendors || {} as any,
        item_addons: []
      } as ItemWithDetails);
    }
  };

  const handleDeleteItem = async () => {
    if (!deletingItem) return;

    const result = await executePartnerIntent({
      entity: 'product',
      action: 'DELETE',
      id: deletingItem.id
    });
    if (result.success) {
      setItems(prev => prev.filter(product => product.id !== deletingItem.id));
      toast.success('Product deleted');
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
            placeholder="Search products"
            className="pl-9"
          />
        </div>
        <Button onClick={() => setShowProductForm(true)}>
          <Plus className="size-4 mr-1.5" />
          Add product
        </Button>
      </div>

      {filteredItems.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl border border-zinc-100">
          <Package className="size-12 text-zinc-300 mx-auto mb-3" />
          {search ? (
            <>
              <p className="text-zinc-500 text-sm">No products match "{search}"</p>
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
              <p className="text-zinc-500 text-sm">No products in your catalog yet</p>
              <p className="text-zinc-400 text-xs mt-1">Add your first product to get started</p>
              <Button
                className="mt-4"
                onClick={() => setShowProductForm(true)}
              >
                <Plus className="size-4 mr-1.5" />
                Add product
              </Button>
            </>
          )}
        </div>
      ) : (
        <CatalogList
          products={filteredItems as any}
          onToggleActive={handleToggleActive}
          onToggleStock={handleToggleStock}
          onEdit={handleEditItem}
          onDelete={setDeletingItem}
        />
      )}

      <ProductForm
        partnerId={partnerId}
        open={showProductForm}
        onOpenChange={setShowProductForm}
        onSuccess={handleFormSuccess}
      />

      {editingItem && (
        <ProductForm
          partnerId={partnerId}
          product={editingItem}
          open={!!editingItem}
          onOpenChange={(open) => !open && setEditingItem(null)}
          onSuccess={handleFormSuccess}
        />
      )}

      <AlertDialog open={!!deletingItem} onOpenChange={(open) => !open && setDeletingItem(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete product?</AlertDialogTitle>
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
