'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { formatDistanceToNow } from 'date-fns';
import { Clock, Upload, Eye, RotateCcw, CheckCircle2, AlertCircle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { PreviewUploader } from './PreviewUploader';
import type { VendorOrder } from '@/lib/actions/commerce/orders';
import { ORDER_STATUS, getOrderStatusDisplay } from '@/lib/types/order-status';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';

interface PersonalizationQueueClientProps {
  initialOrders: VendorOrder[];
}

type PersonalizationInput = {
  text?: string;
  name?: string;
  message?: string;
  image_url?: string;
  [key: string]: string | undefined;
};

export function PersonalizationQueueClient({ initialOrders }: PersonalizationQueueClientProps) {
  const [orders, setOrders] = useState(initialOrders);
  const [uploadState, setUploadState] = useState<{ orderId: string; orderProductId: string; orderNumber: string } | null>(null);

  const waitingForInput = orders.filter(o => o.has_personalization && (!o.personalization_status || o.personalization_status === 'pending'));
  const needsPreview = orders.filter(o => o.has_personalization && o.personalization_status === 'submitted');
  const revisionRequested = orders.filter(o => o.has_personalization && o.personalization_status === 'revision_requested');
  const awaitingApproval = orders.filter(o => o.has_personalization && o.personalization_status === 'preview_ready');

  const handleUploadClick = (orderId: string, orderProductId: string, orderNumber: string) => {
    setUploadState({ orderId, orderProductId, orderNumber });
  };

  const handleUploadSuccess = () => {
    if (!uploadState) return;
    setOrders(prev => prev.map(o =>
      o.id === uploadState.orderId
        ? {
          ...o,
          order_products: o.order_products.map(product =>
            product.id === uploadState.orderProductId ? {
              ...product,
              personalization_entry: {
                ...product.personalization_entry,
                preview_ready: true
              }
            } : product
          )
        }
        : o
    ));
  };

  const parsePersonalizationInput = (input: unknown): PersonalizationInput | null => {
    if (!input) return null;
    if (typeof input === 'string') {
      try {
        return JSON.parse(input);
      } catch {
        return { text: input };
      }
    }
    return input as PersonalizationInput;
  };

  const renderPersonalizationDetails = (input: unknown) => {
    const parsed = parsePersonalizationInput(input);
    if (!parsed) return null;

    return (
      <div className="space-y-1 mt-2 p-2 bg-blue-50 rounded-[var(--radius-sm)]">
        {parsed.text && (
          <p className="text-xs text-blue-800">
            <span className="font-medium">Text:</span> {parsed.text}
          </p>
        )}
        {parsed.name && (
          <p className="text-xs text-blue-800">
            <span className="font-medium">Name:</span> {parsed.name}
          </p>
        )}
        {parsed.message && (
          <p className="text-xs text-blue-800">
            <span className="font-medium">Message:</span> {parsed.message}
          </p>
        )}
        {parsed.image_url && (
          <div className="mt-2">
            <p className="text-xs text-blue-800 font-medium mb-1">Customer image:</p>
            <div className="relative w-20 h-20 rounded-[var(--radius-sm)] overflow-hidden bg-[var(--surface)]">
              <Image
                src={parsed.image_url}
                alt="Customer upload"
                fill
                className="object-cover"
              />
            </div>
          </div>
        )}
      </div>
    );
  };

  const OrderQueueCard = ({ order, showUpload = false }: { order: VendorOrder; showUpload?: boolean }) => {
    const [showHistory, setShowHistory] = useState(false);
    // Note: order.previews is provided via realtime/initial state
    const designHistory = (order as any).previews || [];

    return (
      <Card key={order.id}>
        <CardContent className="p-4">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <p className="text-sm font-semibold text-[var(--text-primary)]">
                  #{order.order_number}
                </p>
                <Badge
                  variant="outline"
                  className={cn(
                    'text-xs',
                    order.personalization_status === 'revision_requested'
                      ? 'bg-orange-50 text-orange-700 border-orange-200'
                      : order.personalization_status === 'preview_ready'
                        ? 'bg-blue-50 text-blue-700 border-blue-200'
                        : 'bg-[var(--well-warning)] text-[var(--warning)] border-[var(--warning)]/20'
                  )}
                >
                  {order.personalization_status?.replace('_', ' ')?.toUpperCase() || 'PENDING'}
                </Badge>
              </div>
              <div className="flex items-center gap-1.5 text-[var(--text-secondary)]">
                <Clock className="size-3" />
                <span className="text-xs">
                  {formatDistanceToNow(new Date(order.created_at!), { addSuffix: true })}
                </span>
              </div>

              {order.order_products?.map((product) => (
                <div key={product.id} className="mt-3 p-3 bg-[var(--surface-muted)] rounded-[var(--radius-md)] border border-[var(--border)]">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-sm font-medium text-[var(--text-primary)]">
                      {product.quantity}× {product.product_name}
                    </p>
                    {showUpload && !product.personalization_entry?.preview_ready && (
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-8 text-xs font-bold tracking-tight text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                        onClick={() => handleUploadClick(order.id, product.id, order.order_number || '')}
                      >
                        <Upload className="size-3.5 mr-1" />
                        Upload Preview
                      </Button>
                    )}
                    {product.personalization_entry?.preview_ready && (
                      <Badge variant="outline" className="bg-[var(--well-success)] text-[var(--success)] border-[var(--success)]/20 text-xs">
                        Preview Sent
                      </Badge>
                    )}
                  </div>

                  {product.personalization_entry && renderPersonalizationDetails(product.personalization_entry)}
                  {!product.personalization_entry && product.personalization_details && renderPersonalizationDetails(product.personalization_details)}

                  {/* Show Product-Specific Preview if available */}
                  {product.personalization_entry?.preview_ready && (
                    <div className="mt-2 flex items-center gap-2">
                      <div className="size-10 relative rounded-md overflow-hidden bg-[var(--surface)] border border-[var(--border)]">
                        <Image
                          src={order.latest_preview?.preview_url || ''}
                          alt="Preview"
                          fill
                          className="object-cover"
                        />
                      </div>
                      <span className="text-xs text-[var(--text-secondary)] italic">Waiting for approval</span>
                    </div>
                  )}
                </div>
              ))}

              {/* WYSHKIT 2026: Absolute Transparency (Vendor History) */}
              {designHistory.length > 0 && (
                <div className="mt-4 pt-4 border-t border-[var(--border)]">
                  <button
                    onClick={() => setShowHistory(!showHistory)}
                    className="flex items-center gap-2 text-xs font-black tracking-tight text-[var(--text-tertiary)] hover:text-[var(--text-secondary)] transition-colors"
                  >
                    <RotateCcw className={cn("size-3 transition-transform", showHistory && "rotate-180")} />
                    Design History ({designHistory.length})
                  </button>

                  {showHistory && (
                    <div className="mt-3 grid grid-cols-4 gap-2 animate-in fade-in slide-in-from-top-2 duration-300">
                      {designHistory.map((p: any, i: number) => (
                        <div key={p.id} className="relative aspect-square rounded-[var(--radius-sm)] overflow-hidden border border-[var(--border)] bg-[var(--surface)] group/thumb">
                          <Image
                            src={p.preview_url}
                            alt={`Preview ${i}`}
                            fill
                            className="object-cover opacity-60 hover:opacity-100 transition-opacity"
                          />
                          <div className="absolute inset-x-0 bottom-0 bg-[var(--surface)]/90 backdrop-blur-md px-1.5 py-1 translate-y-full group-hover/thumb:translate-y-0 transition-transform">
                            <span className="text-[7px] font-black text-[var(--text-primary)] block truncate leading-none">
                              {p.submitted_at ? new Date(p.submitted_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Iter ' + i}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // WYSHKIT 2026: Realtime Updates
  useEffect(() => {
    const supabase = createClient();

    // We filter by 'has_personalization=eq.true'
    const channel = supabase
      .channel('personalization-queue')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'orders',
          filter: 'has_personalization=eq.true',
        },
        async (payload: any) => {
          if (payload.eventType === 'INSERT' || payload.eventType === 'UPDATE') {
            // Fetch fresh data for this order
            const { data: freshOrderData, error } = await supabase
              .from('orders')
              .select('*, order_products(*)')
              .eq('id', payload.new.id)
              .single();

            if (freshOrderData && !error) {
              const order_products = (freshOrderData.order_products || []).map((product: any) => ({
                ...product,
                personalization_entry: product.personalization_details || null
              }));

              const latest_preview = order_products.find((i: any) => i.personalization_entry?.preview_url)?.personalization_entry || null;

              const hasSubmitted = order_products.some((i: any) => i.personalization_entry?.text || i.personalization_entry?.image_url);
              const isPreviewReady = order_products.some((i: any) => i.personalization_entry?.preview_ready);
              const isApproved = order_products.every((i: any) => i.personalization_entry?.approved || !i.personalization_entry);

              let p_status = 'pending';
              if (isApproved) p_status = 'approved';
              else if (isPreviewReady) p_status = 'preview_ready';
              else if (hasSubmitted) p_status = 'submitted';

              const freshOrder: VendorOrder = {
                ...freshOrderData,
                status: freshOrderData.status as any,
                delivery_address: freshOrderData.delivery_address as any,
                order_products,
                latest_preview,
                personalization_status: p_status
              };

              setOrders(prev => {
                const exists = prev.find(o => o.id === freshOrder.id);
                if (exists) {
                  return prev.map(o => o.id === freshOrder.id ? freshOrder : o);
                } else {
                  return [freshOrder, ...prev];
                }
              });
            }
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-3">
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-3">
              <div className="size-10 rounded-[var(--radius-md)] bg-[var(--surface-muted)] flex items-center justify-center">
                <Clock className="size-5 text-[var(--text-secondary)]" />
              </div>
              <div>
                <p className="text-xl font-semibold text-[var(--text-primary)]">{waitingForInput.length}</p>
                <p className="text-xs text-[var(--text-secondary)]">Waiting for input</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-3">
              <div className="size-10 rounded-[var(--radius-md)] bg-[var(--well-warning)] flex items-center justify-center">
                <Upload className="size-5 text-[var(--warning)]" />
              </div>
              <div>
                <p className="text-xl font-semibold text-[var(--warning)]">{needsPreview.length}</p>
                <p className="text-xs text-[var(--text-secondary)]">Needs preview</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-3">
              <div className="size-10 rounded-[var(--radius-md)] bg-orange-50 flex items-center justify-center">
                <RotateCcw className="size-5 text-orange-600" />
              </div>
              <div>
                <p className="text-xl font-semibold text-orange-600">{revisionRequested.length}</p>
                <p className="text-xs text-[var(--text-secondary)]">Revision needed</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-3">
              <div className="size-10 rounded-[var(--radius-md)] bg-blue-50 flex items-center justify-center">
                <Eye className="size-5 text-blue-600" />
              </div>
              <div>
                <p className="text-xl font-semibold text-blue-600">{awaitingApproval.length}</p>
                <p className="text-xs text-[var(--text-secondary)]">Awaiting approval</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {needsPreview.length > 0 && (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          <h2 className="text-sm font-semibold text-[var(--text-primary)] mb-3 flex items-center gap-2">
            <AlertCircle className="size-4 text-[var(--warning)]" />
            Needs preview upload ({needsPreview.length})
          </h2>
          <div className="space-y-3">
            {needsPreview.map(order => (
              <OrderQueueCard key={order.id} order={order} showUpload />
            ))}
          </div>
        </div>
      )}

      {revisionRequested.length > 0 && (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          <h2 className="text-sm font-semibold text-[var(--text-primary)] mb-3 flex items-center gap-2">
            <RotateCcw className="size-4 text-orange-500" />
            Revision requested ({revisionRequested.length})
          </h2>
          <div className="space-y-3">
            {revisionRequested.map(order => (
              <OrderQueueCard key={order.id} order={order} showUpload />
            ))}
          </div>
        </div>
      )}

      {awaitingApproval.length > 0 && (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          <h2 className="text-sm font-semibold text-[var(--text-primary)] mb-3 flex items-center gap-2">
            <Eye className="size-4 text-blue-500" />
            Awaiting customer approval ({awaitingApproval.length})
          </h2>
          <div className="space-y-3">
            {awaitingApproval.map(order => (
              <OrderQueueCard key={order.id} order={order} />
            ))}
          </div>
        </div>
      )}

      {orders.length === 0 && (
        <Card>
          <CardContent className="py-12">
            <div className="text-center">
              <CheckCircle2 className="size-12 text-[var(--success)]/30 mx-auto mb-3" />
              <p className="text-sm text-[var(--text-secondary)]">All caught up</p>
              <p className="text-xs text-[var(--text-tertiary)] mt-1">
                No personalization orders pending
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      <PreviewUploader
        orderId={uploadState?.orderId || ''}
        orderProductId={uploadState?.orderProductId || ''}
        orderNumber={uploadState?.orderNumber || ''}
        isOpen={!!uploadState}
        onClose={() => setUploadState(null)}
        onSuccess={handleUploadSuccess}
      />
    </div>
  );
}
