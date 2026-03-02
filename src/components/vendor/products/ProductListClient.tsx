'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Search, Package } from 'lucide-react';
import { ProductList } from './ProductList';
import { ProductForm } from './ProductForm';
import { executeVendorIntent } from '@/lib/actions/vendor/engine';
import { getProductWithFullSpec } from '@/lib/actions/discovery/products';
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

// Use a more relaxed type for the vendor dashboard to avoid discovery-only field requirements
export type ProductWithDetails = any;

interface ProductListClientProps {
  initialProducts: any[];
  vendorId: string;
}

export function ProductListClient({ initialProducts, vendorId }: ProductListClientProps) {
  const router = useRouter();
  const [products, setProducts] = useState<ProductWithDetails[]>(initialProducts as ProductWithDetails[]);
  const [search, setSearch] = useState('');
  const [showProductForm, setShowProductForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<ProductWithDetails | null>(null);
  const [deletingProduct, setDeletingProduct] = useState<Product | null>(null);

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(search.toLowerCase()) ||
    (product as any).category?.toLowerCase().includes(search.toLowerCase())
  );

  const handleToggleActive = async (productId: string, isActive: boolean) => {
    const result = await executeVendorIntent({
      entity: 'product',
      action: 'TOGGLE_STATUS',
      id: productId,
      metadata: { isActive }
    });
    if (result.success) {
      setProducts(prev => prev.map(product =>
        product.id === productId ? { ...product, is_active: isActive } : product
      ));
      toast.success(isActive ? 'Product activated' : 'Product deactivated');
    } else {
      toast.error(result.error || 'Failed to update');
    }
  };

  const handleToggleStock = async (productId: string, stockStatus: string) => {
    const result = await executeVendorIntent({
      entity: 'product',
      action: 'TOGGLE_STOCK',
      id: productId,
      metadata: { stockStatus }
    });
    if (result.success) {
      setProducts(prev => prev.map(product =>
        product.id === productId ? { ...product, is_active: stockStatus === 'IN_STOCK' } : product
      ));
      toast.success('Stock status updated');
    } else {
      toast.error(result.error || 'Failed to update');
    }
  };

  const handleEditProduct = async (product: Product) => {
    const result = await getProductWithFullSpec(product.id);

    if (result.data) {
      // WyshKit Pattern: Ensure full specification is passed to the editing sheet
      setEditingProduct(result.data as ProductWithDetails);
    } else {
      // Fallback
      setEditingProduct({
        ...product,
        product_variants: [],
        personalization_options: [],
        vendors: (product as any).vendors || {} as any,
        product_addons: []
      } as ProductWithDetails);
    }
  };

  const handleDeleteProduct = async () => {
    if (!deletingProduct) return;

    const result = await executeVendorIntent({
      entity: 'product',
      action: 'DELETE',
      id: deletingProduct.id
    });
    if (result.success) {
      setProducts(prev => prev.filter(product => product.id !== deletingProduct.id));
      toast.success('Product deleted');
    } else {
      toast.error(result.error || 'Failed to delete');
    }
    setDeletingProduct(null);
  };

  const handleFormSuccess = () => {
    router.refresh();
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-[var(--text-tertiary)]" />
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

      {filteredProducts.length === 0 ? (
        <div className="text-center py-12 bg-[var(--surface)] rounded-xl border border-[var(--border)]">
          <Package className="size-12 text-[var(--text-tertiary)] mx-auto mb-3" />
          {search ? (
            <>
              <p className="text-[var(--text-secondary)] text-sm">No products match &quot;{search}&quot;</p>
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
              <p className="text-[var(--text-secondary)] text-sm">No products in your shop yet</p>
              <p className="text-[var(--text-tertiary)] text-xs mt-1">Add your first product to get started</p>
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
        <ProductList
          products={filteredProducts as any}
          onToggleActive={handleToggleActive}
          onToggleStock={handleToggleStock}
          onEdit={handleEditProduct}
          onDelete={setDeletingProduct}
        />
      )}

      <ProductForm
        vendorId={vendorId}
        open={showProductForm}
        onOpenChange={setShowProductForm}
        onSuccess={handleFormSuccess}
      />

      {editingProduct && (
        <ProductForm
          vendorId={vendorId}
          product={editingProduct}
          open={!!editingProduct}
          onOpenChange={(open) => !open && setEditingProduct(null)}
          onSuccess={handleFormSuccess}
        />
      )}

      <AlertDialog open={!!deletingProduct} onOpenChange={(open) => !open && setDeletingProduct(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete product?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete &quot;{deletingProduct?.name}&quot;. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteProduct}
              className="bg-[var(--destructive)] hover:bg-[var(--destructive-hover)] text-[var(--text-inverse)] shadow-brand"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
