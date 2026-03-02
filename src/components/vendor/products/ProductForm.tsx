'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { X, Plus, Trash2, Image as ImageIcon, GripVertical, Package, Sparkles, ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  ResponsiveSurface
} from '@/components/ui/ResponsiveSurface';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { toast } from 'sonner';
import {
  createProduct,
  updateProduct,
  deleteProduct,
  createVariant,
  updateVariant,
  deleteVariant,
  type ProductInput,
  type VariantInput,
} from '@/lib/actions/vendor/products';
import type { Database } from '@/lib/supabase/database.types';

type Product = Database['public']['Tables']['products']['Row'];

type Variant = {
  id?: string;
  name: string | null;
  price: number | null;
  mrp?: number | null;
  stock_quantity?: number | null;
  serial_number?: string | null;
  is_active?: boolean | null;
};

type PersonalizationOption = {
  id?: string;
  name: string;
  price: number | null;
  input_type: string;
  char_limit?: number | null;
  instructions?: string | null;
  is_active?: boolean | null;
};

type Addon = {
  id?: string;
  name: string;
  price: number;
  is_active?: boolean | null;
};

interface ProductFormProps {
  vendorId: string;
  product?: Product & {
    variants?: Variant[];
    personalization_options?: any;
    addons?: any;
    product_addons?: any;
  };
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

const CATEGORIES = [
  'Electronics',
  'Fashion',
  'Home & lifestyle',
  'Food & beverages',
  'Health & beauty',
  'Sports & fitness',
  'Books & stationery',
  'Toys & games',
  'Other',
];

export function ProductForm({ vendorId, product, open, onOpenChange, onSuccess }: ProductFormProps) {
  const router = useRouter();
  const isEdit = !!product;

  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('basic');

  const [formData, setFormData] = useState<ProductInput>({
    name: product?.name || '',
    description: product?.description || '',
    base_price: product?.base_price ? Number(product.base_price) : 0,
    mrp: product?.mrp ? Number(product.mrp) : undefined,
    category_id: product?.category_id || '',
    images: product?.images || [],
    has_personalization: product?.has_personalization || false,
    is_active: product?.is_active ?? true,
    production_time_minutes: product?.production_time_minutes || 120,
    preview_time_minutes: product?.preview_time_minutes || 60,
    material: product?.material || '',
    weight_kg: product?.weight_kg ? Number(product.weight_kg) : 0,
    dimensions: typeof product?.dimensions === 'object' && product?.dimensions !== null ? (product.dimensions as any) : { length: 0, width: 0, height: 0 },
    hsn_code: product?.hsn_code || '',
    gst_percentage: product?.gst_percentage ? Number(product.gst_percentage) : 18.00,
  });

  const [variants, setVariants] = useState<Variant[]>(
    product?.variants?.map(v => ({
      ...v,
      name: v.name ?? '',
      price: v.price ?? 0,
      stock_quantity: v.stock_quantity ?? 100,
    })) || []
  );

  const [personalizationOptions, setPersonalizationOptions] = useState<PersonalizationOption[]>(
    product?.personalization_options || []
  );

  const [addons, setAddons] = useState<Addon[]>(
    (product?.product_addons || product?.addons || []) as Addon[]
  );

  const [newVariant, setNewVariant] = useState<Variant>({
    name: '',
    price: 0,
    stock_quantity: 100,
    serial_number: '',
  });

  const [newPersonalization, setNewPersonalization] = useState<Partial<PersonalizationOption>>({
    name: '',
    price: 0,
    input_type: 'text',
    char_limit: 50,
  });

  const [newAddon, setNewAddon] = useState<Addon>({
    name: '',
    price: 0,
  });

  const getTotalStock = useCallback(() => {
    if (variants.length === 0) return null;
    return variants.reduce((sum, v) => sum + (v.stock_quantity || 0), 0);
  }, [variants]);

  const handleSave = async () => {
    if (!formData.name.trim()) {
      toast.error('Product name is required');
      setActiveTab('basic');
      return;
    }
    if (formData.base_price <= 0) {
      toast.error('Price must be greater than 0');
      setActiveTab('basic');
      return;
    }

    setSaving(true);
    try {
      const fullInput: ProductInput = {
        ...formData,
        personalization_options: personalizationOptions.map(p => ({
          name: p.name,
          price: p.price || 0,
          input_type: p.input_type || 'text',
          char_limit: p.char_limit || null,
          instructions: p.instructions || null
        })),
        product_addons: addons.map(a => ({
          name: a.name,
          price: a.price || 0
        }))
      };

      if (isEdit && product) {
        const result = await updateProduct(product.id, fullInput);
        if (result.error) {
          toast.error(result.error);
          return;
        }

        // Update existing variants
        for (const v of variants) {
          if (v.id) {
            await updateVariant(v.id, {
              name: v.name ?? '',
              price: v.price ?? 0,
              mrp: v.mrp || undefined,
              stock_quantity: v.stock_quantity ?? 0,
              serial_number: v.serial_number || undefined,
            });
          } else {
            await createVariant(product.id, {
              name: v.name ?? '',
              price: v.price ?? 0,
              mrp: v.mrp || undefined,
              stock_quantity: v.stock_quantity ?? 0,
              serial_number: v.serial_number || undefined,
            });
          }
        }

        toast.success('Product updated');
      } else {
        const result = await createProduct(vendorId, fullInput);
        if (result.error) {
          toast.error(result.error);
          return;
        }

        if (result.data?.id) {
          for (const v of variants) {
            await createVariant(result.data.id, {
              name: v.name ?? '',
              price: v.price ?? 0,
              mrp: v.mrp || undefined,
              stock_quantity: v.stock_quantity ?? 0,
              serial_number: v.serial_number || undefined,
            });
          }
        }
        toast.success('Product created');
      }

      onOpenChange(false);
      onSuccess?.();
      router.refresh();
    } catch {
      toast.error('Something went wrong');
    } finally {
      setSaving(false);
    }
  };

  const handleAddVariant = () => {
    if (!newVariant.name?.trim()) {
      toast.error('Variant name required');
      return;
    }
    setVariants([...variants, { ...newVariant, is_active: true }]);
    setNewVariant({ name: '', price: 0, stock_quantity: 100, serial_number: '' });
  };

  const handleUpdateVariantStock = (index: number, quantity: number) => {
    setVariants(prev => prev.map((v, i) =>
      i === index ? { ...v, stock_quantity: quantity } : v
    ));
  };

  const handleRemoveVariant = async (index: number) => {
    const variant = variants[index];
    if (variant.id) {
      await deleteVariant(variant.id);
    }
    setVariants(variants.filter((_, i) => i !== index));
  };

  const handleAddPersonalization = () => {
    if (!newPersonalization.name?.trim()) {
      toast.error('Option name required');
      return;
    }
    setPersonalizationOptions([...personalizationOptions, { ...newPersonalization as PersonalizationOption, is_active: true }]);
    setNewPersonalization({ name: '', price: 0, input_type: 'text', char_limit: 50 });
    setFormData({ ...formData, has_personalization: true });
  };

  const handleRemovePersonalization = async (index: number) => {
    const newOptions = personalizationOptions.filter((_, i) => i !== index);
    setPersonalizationOptions(newOptions);
    if (newOptions.length === 0) {
      setFormData({ ...formData, has_personalization: false });
    }
  };

  const handleAddAddon = () => {
    if (!newAddon.name.trim()) {
      toast.error('Addon name required');
      return;
    }
    setAddons([...addons, { ...newAddon, is_active: true }]);
    setNewAddon({ name: '', price: 0 });
  };

  const handleRemoveAddon = (index: number) => {
    setAddons(addons.filter((_, i) => i !== index));
  };

  const totalStock = getTotalStock();

  return (
    <ResponsiveSurface
      open={open}
      onOpenChange={onOpenChange}
      title={isEdit ? 'Edit product' : 'Add product'}
      className="p-0 sm:max-w-xl"
    >

      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1">
        <div className="px-4 pt-3 border-b bg-[var(--surface-muted)]/50">
          <TabsList className="w-full h-9 bg-transparent p-0 gap-4">
            <TabsTrigger
              value="basic"
              className="px-0 pb-3 h-auto rounded-none border-b-2 border-transparent data-[state=active]:border-[var(--text-primary)] data-[state=active]:bg-transparent data-[state=active]:shadow-none text-sm"
            >
              Basic
            </TabsTrigger>
            <TabsTrigger
              value="variants"
              className="px-0 pb-3 h-auto rounded-none border-b-2 border-transparent data-[state=active]:border-[var(--text-primary)] data-[state=active]:bg-transparent data-[state=active]:shadow-none text-sm"
            >
              Variants
              {variants.length > 0 && (
                <Badge variant="secondary" className="ml-1.5 h-5 px-1.5 text-xs">{variants.length}</Badge>
              )}
            </TabsTrigger>
            <TabsTrigger
              value="personalization"
              className="px-0 pb-3 h-auto rounded-none border-b-2 border-transparent data-[state=active]:border-[var(--text-primary)] data-[state=active]:bg-transparent data-[state=active]:shadow-none text-sm"
            >
              Personalization
              {personalizationOptions.length > 0 && (
                <Badge variant="secondary" className="ml-1.5 h-5 px-1.5 text-xs">{personalizationOptions.length}</Badge>
              )}
            </TabsTrigger>
            <TabsTrigger
              value="addons"
              className="px-0 pb-3 h-auto rounded-none border-b-2 border-transparent data-[state=active]:border-[var(--text-primary)] data-[state=active]:bg-transparent data-[state=active]:shadow-none text-sm"
            >
              Addons
              {addons.length > 0 && (
                <Badge variant="secondary" className="ml-1.5 h-5 px-1.5 text-xs">{addons.length}</Badge>
              )}
            </TabsTrigger>
            <TabsTrigger
              value="specs"
              className="px-0 pb-3 h-auto rounded-none border-b-2 border-transparent data-[state=active]:border-[var(--text-primary)] data-[state=active]:bg-transparent data-[state=active]:shadow-none text-sm"
            >
              Specifications
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="basic" className="p-4 space-y-5 mt-0">
          <div className="space-y-1.5">
            <Label htmlFor="name" className="text-sm text-[var(--text-secondary)]">Product name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g. Chocolate truffle cake"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="description" className="text-sm text-[var(--text-secondary)]">Description</Label>
            <Textarea
              id="description"
              value={formData.description || ''}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Describe your product"
              rows={3}
              className="resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="price" className="text-sm text-[var(--text-secondary)]">Selling price</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-tertiary)] text-sm">₹</span>
                <Input
                  id="price"
                  type="number"
                  value={formData.base_price || ''}
                  onChange={(e) => setFormData({ ...formData, base_price: Number(e.target.value) })}
                  className="pl-7"
                  placeholder="0"
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="mrp" className="text-sm text-[var(--text-secondary)]">MRP (optional)</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-tertiary)] text-sm">₹</span>
                <Input
                  id="mrp"
                  type="number"
                  value={formData.mrp || ''}
                  onChange={(e) => setFormData({ ...formData, mrp: Number(e.target.value) || undefined })}
                  className="pl-7"
                  placeholder="0"
                />
              </div>
            </div>
          </div>

          <div className="space-y-1.5">
            <Label className="text-sm text-[var(--text-secondary)]">Category</Label>
            <Select
              value={formData.category_id || ''}
              onValueChange={(value) => setFormData({ ...formData, category_id: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {/* Anniversary: 091aeba8-ea35-4393-bb74-53cb5eed7e35 */}
                <SelectItem value="091aeba8-ea35-4393-bb74-53cb5eed7e35">Anniversary</SelectItem>
                <SelectItem value="32a09069-0bf0-4734-a98b-f4b4420539dd">Birthday</SelectItem>
                <SelectItem value="145751b2-9260-4b4b-97df-b8289252a792">Cakes</SelectItem>
                <SelectItem value="9d04c388-e01c-41c2-8fc1-9e965bd4302a">Personalized Cups</SelectItem>
                <SelectItem value="eaa504a7-5611-4400-8d58-5e9afcd3c721">Custom T-Shirts</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label className="text-sm text-[var(--text-secondary)]">Images</Label>
            <div className="border-2 border-dashed border-[var(--border)] rounded-lg p-6 text-center hover:border-[var(--border)] transition-colors cursor-pointer">
              <div className="flex flex-col items-center gap-2">
                <div className="size-10 rounded-full bg-[var(--surface-muted)] flex items-center justify-center">
                  <ImageIcon className="size-5 text-[var(--text-tertiary)]" />
                </div>
                <p className="text-sm text-[var(--text-secondary)]">Upload images</p>
                <p className="text-xs text-[var(--text-tertiary)]">PNG, JPG up to 5MB</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-sm text-[var(--text-secondary)]">Production time</Label>
              <Select
                value={String(formData.production_time_minutes || 120)}
                onValueChange={(value) => setFormData({ ...formData, production_time_minutes: Number(value) })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="60">1 hour</SelectItem>
                  <SelectItem value="120">2 hours</SelectItem>
                  <SelectItem value="180">3 hours</SelectItem>
                  <SelectItem value="240">4 hours</SelectItem>
                  <SelectItem value="360">6 hours</SelectItem>
                  <SelectItem value="480">8 hours</SelectItem>
                  <SelectItem value="1440">1 day</SelectItem>
                  <SelectItem value="2880">2 days</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label className="text-sm text-[var(--text-secondary)]">Preview time</Label>
              <Select
                value={String(formData.preview_time_minutes || 60)}
                onValueChange={(value) => setFormData({ ...formData, preview_time_minutes: Number(value) })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="30">30 mins</SelectItem>
                  <SelectItem value="60">1 hour</SelectItem>
                  <SelectItem value="120">2 hours</SelectItem>
                  <SelectItem value="180">3 hours</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="pt-2 space-y-3">
            <div className="flex items-center justify-between py-2">
              <div>
                <p className="text-sm font-medium text-[var(--text-primary)]">Active</p>
                <p className="text-xs text-[var(--text-secondary)]">Show in shop</p>
              </div>
              <Switch
                checked={formData.is_active}
                onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
              />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="variants" className="p-4 space-y-4 mt-0">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-[var(--text-primary)]">Variants</p>
              <p className="text-xs text-[var(--text-secondary)]">Size, weight, color options</p>
            </div>
            {totalStock !== null && (
              <div className="text-right">
                <p className="text-sm font-medium text-[var(--text-primary)]">{totalStock} units</p>
                <p className="text-xs text-[var(--text-secondary)]">Total stock</p>
              </div>
            )}
          </div>

          {variants.length > 0 && (
            <div className="space-y-2">
              {variants.map((v, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 p-3 bg-[var(--surface-muted)] rounded-lg border border-[var(--border)]"
                >
                  <GripVertical className="size-4 text-[var(--text-tertiary)] cursor-grab" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-[var(--text-primary)] truncate">{v.name || 'Unnamed Variant'}</p>
                    <p className="text-xs text-[var(--text-secondary)]">
                      {(v.price ?? 0) > 0 ? `+₹${Number(v.price).toLocaleString('en-IN')}` : 'Base price'}
                      {v.serial_number && <span className="ml-2 text-[var(--text-tertiary)]">SN: {v.serial_number}</span>}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-20">
                      <Input
                        type="number"
                        value={v.stock_quantity ?? 0}
                        onChange={(e) => handleUpdateVariantStock(i, Number(e.target.value))}
                        className="h-8 text-sm text-center"
                        min={0}
                      />
                    </div>
                    <span className="text-xs text-[var(--text-tertiary)]">qty</span>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="size-8 text-[var(--text-tertiary)] hover:text-[var(--destructive)] shrink-0"
                    onClick={() => handleRemoveVariant(i)}
                  >
                    <Trash2 className="size-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}

          <div className="p-3 border rounded-lg space-y-3 bg-[var(--surface)]">
            <p className="text-xs font-medium text-[var(--text-secondary)] tracking-wide">Add variant</p>
            <div className="grid grid-cols-2 gap-2">
              <Input
                placeholder="Name (e.g. 500g)"
                value={newVariant.name || ''}
                onChange={(e) => setNewVariant({ ...newVariant, name: e.target.value })}
              />
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-tertiary)] text-sm">+₹</span>
                <Input
                  type="number"
                  placeholder="0"
                  value={newVariant.price || ''}
                  onChange={(e) => setNewVariant({ ...newVariant, price: Number(e.target.value) })}
                  className="pl-8"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <Input
                type="number"
                placeholder="Stock quantity"
                value={newVariant.stock_quantity || ''}
                onChange={(e) => setNewVariant({ ...newVariant, stock_quantity: Number(e.target.value) })}
              />
              <Input
                placeholder="Serial number (optional)"
                value={newVariant.serial_number || ''}
                onChange={(e) => setNewVariant({ ...newVariant, serial_number: e.target.value })}
              />
            </div>
            <Button size="sm" onClick={handleAddVariant} className="w-full">
              <Plus className="size-4 mr-1" />
              Add variant
            </Button>
          </div>

          {variants.length === 0 && (
            <div className="text-center py-6 text-[var(--text-tertiary)]">
              <Package className="size-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">No variants added</p>
              <p className="text-xs mt-1">Add variants if your product has different sizes or options</p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="personalization" className="p-4 space-y-4 mt-0">
          <div>
            <p className="text-sm font-medium text-[var(--text-primary)]">Personalization options</p>
            <p className="text-xs text-[var(--text-secondary)]">Text engraving, photos, name prints</p>
          </div>

          {personalizationOptions.length > 0 && (
            <div className="space-y-2">
              {personalizationOptions.map((p, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 p-3 bg-[var(--surface-muted)] rounded-lg border border-[var(--border)]"
                >
                  <div className="size-8 rounded-full bg-[var(--well-warning)] flex items-center justify-center shrink-0">
                    <Sparkles className="size-4 text-[var(--warning)]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-[var(--text-primary)]">{p.name}</p>
                    <p className="text-xs text-[var(--text-secondary)]">
                      {p.input_type === 'text' ? 'Text input' : p.input_type === 'image' ? 'Image upload' : 'Text + image'}
                      {p.char_limit && ` • Max ${p.char_limit} chars`}
                      {p.price && p.price > 0 ? ` • +₹${Number(p.price).toLocaleString('en-IN')}` : ' • Free'}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="size-8 text-[var(--text-tertiary)] hover:text-[var(--destructive)] shrink-0"
                    onClick={() => handleRemovePersonalization(i)}
                  >
                    <Trash2 className="size-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}

          <div className="p-3 border rounded-lg space-y-3 bg-[var(--surface)]">
            <p className="text-xs font-medium text-[var(--text-secondary)] tracking-wide">Add option</p>
            <Input
              placeholder="Option name (e.g. Name engraving)"
              value={newPersonalization.name}
              onChange={(e) => setNewPersonalization({ ...newPersonalization, name: e.target.value })}
            />
            <div className="grid grid-cols-2 gap-2">
              <Select
                value={newPersonalization.input_type}
                onValueChange={(value: 'text' | 'image' | 'both') =>
                  setNewPersonalization({ ...newPersonalization, input_type: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="text">Text input</SelectItem>
                  <SelectItem value="image">Image upload</SelectItem>
                  <SelectItem value="both">Text + image</SelectItem>
                </SelectContent>
              </Select>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-tertiary)] text-sm">+₹</span>
                <Input
                  type="number"
                  placeholder="0"
                  value={newPersonalization.price || ''}
                  onChange={(e) => setNewPersonalization({ ...newPersonalization, price: Number(e.target.value) })}
                  className="pl-8"
                />
              </div>
            </div>
            {newPersonalization.input_type !== 'image' && (
              <Input
                type="number"
                placeholder="Character limit (e.g. 50)"
                value={newPersonalization.char_limit || ''}
                onChange={(e) => setNewPersonalization({ ...newPersonalization, char_limit: Number(e.target.value) })}
              />
            )}
            <Button size="sm" onClick={handleAddPersonalization} className="w-full">
              <Plus className="size-4 mr-1" />
              Add option
            </Button>
          </div>

          {personalizationOptions.length === 0 && (
            <div className="text-center py-6 text-[var(--text-tertiary)]">
              <Sparkles className="size-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">No personalization options</p>
              <p className="text-xs mt-1">Add options like name engraving or photo printing</p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="addons" className="p-4 space-y-4 mt-0">
          <div>
            <p className="text-sm font-medium text-[var(--text-primary)]">Addons</p>
            <p className="text-xs text-[var(--text-secondary)]">Premium packaging, express delivery, etc.</p>
          </div>

          {addons.length > 0 && (
            <div className="space-y-2">
              {addons.map((a, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 p-3 bg-[var(--surface-muted)] rounded-lg border border-[var(--border)]"
                >
                  <div className="size-8 rounded-full bg-[var(--well-success)] flex items-center justify-center shrink-0">
                    <ShoppingBag className="size-4 text-[var(--success)]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-[var(--text-primary)]">{a.name}</p>
                    <p className="text-xs text-[var(--text-secondary)]">
                      +₹{Number(a.price).toLocaleString('en-IN')}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="size-8 text-[var(--text-tertiary)] hover:text-[var(--destructive)] shrink-0"
                    onClick={() => handleRemoveAddon(i)}
                  >
                    <Trash2 className="size-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}

          <div className="p-3 border rounded-lg space-y-3 bg-[var(--surface)]">
            <p className="text-xs font-medium text-[var(--text-secondary)] tracking-wide">Add addon</p>
            <div className="grid grid-cols-2 gap-2">
              <Input
                placeholder="Name (e.g. Premium wrap)"
                value={newAddon.name}
                onChange={(e) => setNewAddon({ ...newAddon, name: e.target.value })}
              />
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-tertiary)] text-sm">+₹</span>
                <Input
                  type="number"
                  placeholder="0"
                  value={newAddon.price || ''}
                  onChange={(e) => setNewAddon({ ...newAddon, price: Number(e.target.value) })}
                  className="pl-8"
                />
              </div>
            </div>
            <Button size="sm" onClick={handleAddAddon} className="w-full">
              <Plus className="size-4 mr-1" />
              Add addon
            </Button>
          </div>

          {addons.length === 0 && (
            <div className="text-center py-6 text-[var(--text-tertiary)]">
              <ShoppingBag className="size-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">No addons added</p>
              <p className="text-xs mt-1">Add extras like premium packaging or express delivery</p>
            </div>
          )}
        </TabsContent>
        <TabsContent value="specs" className="p-4 space-y-5 mt-0">
          <div>
            <p className="text-sm font-medium text-[var(--text-primary)]">Physical Specifications</p>
            <p className="text-xs text-[var(--text-secondary)]">Required for accurate shipping and tax</p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="material" className="text-sm text-[var(--text-secondary)]">Material</Label>
              <Input
                id="material"
                value={formData.material || ''}
                onChange={(e) => setFormData({ ...formData, material: e.target.value })}
                placeholder="e.g. Ceramic, Cotton"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="weight" className="text-sm text-[var(--text-secondary)]">Weight (kg)</Label>
              <Input
                id="weight"
                type="number"
                value={formData.weight_kg || ''}
                onChange={(e) => setFormData({ ...formData, weight_kg: Number(e.target.value) })}
                placeholder="0"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="hsn" className="text-sm text-[var(--text-secondary)]">HSN Code</Label>
              <Input
                id="hsn"
                value={formData.hsn_code || ''}
                onChange={(e) => setFormData({ ...formData, hsn_code: e.target.value })}
                placeholder="e.g. 4901"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label className="text-sm text-[var(--text-secondary)]">Dimensions (cm)</Label>
            <div className="grid grid-cols-3 gap-2">
              <div className="space-y-1">
                <span className="text-xs text-[var(--text-tertiary)]">Length</span>
                <Input
                  type="number"
                  value={formData.dimensions?.length || ''}
                  onChange={(e) => setFormData({
                    ...formData,
                    dimensions: { ...formData.dimensions!, length: Number(e.target.value) }
                  })}
                  placeholder="L"
                />
              </div>
              <div className="space-y-1">
                <span className="text-xs text-[var(--text-tertiary)]">Width</span>
                <Input
                  type="number"
                  value={formData.dimensions?.width || ''}
                  onChange={(e) => setFormData({
                    ...formData,
                    dimensions: { ...formData.dimensions!, width: Number(e.target.value) }
                  })}
                  placeholder="W"
                />
              </div>
              <div className="space-y-1">
                <span className="text-xs text-[var(--text-tertiary)]">Height</span>
                <Input
                  type="number"
                  value={formData.dimensions?.height || ''}
                  onChange={(e) => setFormData({
                    ...formData,
                    dimensions: { ...formData.dimensions!, height: Number(e.target.value) }
                  })}
                  placeholder="H"
                />
              </div>
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="gst" className="text-sm text-[var(--text-secondary)]">GST Rate (%)</Label>
            <Select
              value={String(formData.gst_percentage || 18)}
              onValueChange={(value) => setFormData({ ...formData, gst_percentage: Number(value) })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="0">0% (GST Exempt)</SelectItem>
                <SelectItem value="5">5%</SelectItem>
                <SelectItem value="12">12%</SelectItem>
                <SelectItem value="18">18%</SelectItem>
                <SelectItem value="28">28%</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </TabsContent>
      </Tabs>

      <div className="sticky bottom-0 p-4 border-t bg-[var(--surface)]">
        <Button
          className="w-full"
          onClick={handleSave}
          disabled={saving}
        >
          {saving ? 'Saving...' : isEdit ? 'Save changes' : 'Add product'}
        </Button>
      </div>
    </ResponsiveSurface>
  );
}
