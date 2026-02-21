'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { formatDistanceToNow } from 'date-fns';
import { Clock, Upload, Eye, RotateCcw, CheckCircle2, AlertCircle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { PreviewUploader } from './PreviewUploader';
import type { PartnerOrder } from '@/lib/actions/partner/partner-actions';
import { ORDER_STATUS, getOrderStatusDisplay } from '@/lib/types/order-status';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';

interface PersonalizationQueueClientProps {
  initialOrders: PartnerOrder[];
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
  const [uploadState, setUploadState] = useState<{ orderId: string; orderItemId: string; orderNumber: string } | null>(null);

  const waitingForInput = orders.filter(o => o.status === ORDER_STATUS.PLACED);
  const needsPreview = orders.filter(o =>
    [ORDER_STATUS.DETAILS_RECEIVED, ORDER_STATUS.IN_PRODUCTION].includes(o.status as typeof ORDER_STATUS.DETAILS_RECEIVED)
  );
  const revisionRequested = orders.filter(o => o.status === ORDER_STATUS.REVISION_REQUESTED);
  const awaitingApproval = orders.filter(o => o.status === ORDER_STATUS.PREVIEW_READY);

  const handleUploadClick = (orderId: string, orderItemId: string, orderNumber: string) => {
    setUploadState({ orderId, orderItemId, orderNumber });
  };

  const handleUploadSuccess = () => {
    if (!uploadState) return;
    setOrders(prev => prev.map(o =>
      o.id === uploadState.orderId
        ? {
          ...o,
          order_items: o.order_items.map(item =>
            item.id === uploadState.orderItemId ? { ...item, status: 'preview_ready' } : item
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
      <div className="space-y-1 mt-2 p-2 bg-blue-50 rounded-lg">
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
            <div className="relative w-20 h-20 rounded-lg overflow-hidden bg-white">
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

  const OrderQueueCard = ({ order, showUpload = false }: { order: PartnerOrder; showUpload?: boolean }) => {
    const [showHistory, setShowHistory] = useState(false);
    // Note: order.previews is provided via realtime/initial state
    const designHistory = (order as any).previews || [];

    return (
      <Card key={order.id}>
        <CardContent className="p-4">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <p className="text-sm font-semibold text-zinc-900">
                  #{order.order_number}
                </p>
                <Badge
                  variant="outline"
                  className={cn(
                    'text-xs',
                    order.status === ORDER_STATUS.REVISION_REQUESTED
                      ? 'bg-orange-50 text-orange-700 border-orange-200'
                      : order.status === ORDER_STATUS.PREVIEW_READY
                        ? 'bg-blue-50 text-blue-700 border-blue-200'
                        : 'bg-amber-50 text-amber-700 border-amber-200'
                  )}
                >
                  {getOrderStatusDisplay(order.status)}
                </Badge>
              </div>
              <div className="flex items-center gap-1.5 text-zinc-500">
                <Clock className="size-3" />
                <span className="text-xs">
                  {formatDistanceToNow(new Date(order.created_at!), { addSuffix: true })}
                </span>
              </div>

              {order.order_items?.map((item) => (
                <div key={item.id} className="mt-3 p-3 bg-zinc-50 rounded-xl border border-zinc-100">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-sm font-medium text-zinc-900">
                      {item.quantity}× {item.item_name}
                    </p>
                    {showUpload && item.status !== 'preview_ready' && (
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-8 text-[10px] font-bold uppercase tracking-wider text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                        onClick={() => handleUploadClick(order.id, item.id, order.order_number || '')}
                      >
                        <Upload className="size-3.5 mr-1" />
                        Upload Preview
                      </Button>
                    )}
                    {item.status === 'preview_ready' && (
                      <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-100 text-[10px]">
                        Preview Sent
                      </Badge>
                    )}
                  </div>

                  {item.personalization_entry && renderPersonalizationDetails(item.personalization_entry)}
                  {!item.personalization_entry && item.personalization_details && renderPersonalizationDetails(item.personalization_details)}

                  {/* Show Item-Specific Preview if available */}
                  {item.status === 'preview_ready' && (
                    <div className="mt-2 flex items-center gap-2">
                      <div className="size-10 relative rounded-md overflow-hidden bg-white border border-zinc-200">
                        <Image
                          src={order.latest_preview?.preview_url || ''}
                          alt="Preview"
                          fill
                          className="object-cover"
                        />
                      </div>
                      <span className="text-[10px] text-zinc-500 italic">Waiting for approval</span>
                    </div>
                  )}
                </div>
              ))}

              {/* WYSHKIT 2026: Absolute Transparency (Partner History) */}
              {designHistory.length > 0 && (
                <div className="mt-4 pt-4 border-t border-zinc-100">
                  <button
                    onClick={() => setShowHistory(!showHistory)}
                    className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-zinc-400 hover:text-zinc-600 transition-colors"
                  >
                    <RotateCcw className={cn("size-3 transition-transform", showHistory && "rotate-180")} />
                    Design History ({designHistory.length})
                  </button>

                  {showHistory && (
                    <div className="mt-3 grid grid-cols-4 gap-2 animate-in fade-in slide-in-from-top-2 duration-300">
                      {designHistory.map((p: any, i: number) => (
                        <div key={p.id} className="relative aspect-square rounded-lg overflow-hidden border border-zinc-200 bg-white group/thumb">
                          <Image
                            src={p.preview_url}
                            alt={`Preview ${i}`}
                            fill
                            className="object-cover opacity-60 hover:opacity-100 transition-opacity"
                          />
                          <div className="absolute inset-x-0 bottom-0 bg-white/90 backdrop-blur-md px-1.5 py-1 translate-y-full group-hover/thumb:translate-y-0 transition-transform">
                            <span className="text-[7px] font-black uppercase text-zinc-900 block truncate leading-none">
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
            // Note: 'previews' is a one-to-many, we fetch it and manually map to latest_preview
            const { data: freshOrderData } = await supabase
              .from('orders')
              .select('*, order_items(*), previews(*)')
              .eq('id', payload.new.id)
              .single();

            if (freshOrderData) {
              // Transform to PartnerOrder type
              // We assume the first preview is the latest for now, or sort it.
              // Or better, checking the created_at.
              const previews = (freshOrderData.previews || []) as unknown as any[];
              previews.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
              const latest_preview = previews[0] || null;

              const freshOrder: PartnerOrder = {
                ...freshOrderData,
                status: freshOrderData.status as any,
                delivery_address: freshOrderData.delivery_address as any,
                order_items: freshOrderData.order_items || [],
                latest_preview
              };

              setOrders(prev => {
                const exists = prev.find(o => o.id === freshOrder.id);
                if (exists) {
                  return prev.map(o => o.id === freshOrder.id ? freshOrder : o);
                } else {
                  // Add new order if it's not there (e.g. newly placed)
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
              <div className="size-10 rounded-xl bg-zinc-100 flex items-center justify-center">
                <Clock className="size-5 text-zinc-500" />
              </div>
              <div>
                <p className="text-xl font-semibold text-zinc-900">{waitingForInput.length}</p>
                <p className="text-xs text-zinc-500">Waiting for input</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-3">
              <div className="size-10 rounded-xl bg-amber-50 flex items-center justify-center">
                <Upload className="size-5 text-amber-600" />
              </div>
              <div>
                <p className="text-xl font-semibold text-amber-600">{needsPreview.length}</p>
                <p className="text-xs text-zinc-500">Needs preview</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-3">
              <div className="size-10 rounded-xl bg-orange-50 flex items-center justify-center">
                <RotateCcw className="size-5 text-orange-600" />
              </div>
              <div>
                <p className="text-xl font-semibold text-orange-600">{revisionRequested.length}</p>
                <p className="text-xs text-zinc-500">Revision needed</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-3">
              <div className="size-10 rounded-xl bg-blue-50 flex items-center justify-center">
                <Eye className="size-5 text-blue-600" />
              </div>
              <div>
                <p className="text-xl font-semibold text-blue-600">{awaitingApproval.length}</p>
                <p className="text-xs text-zinc-500">Awaiting approval</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {needsPreview.length > 0 && (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          <h2 className="text-sm font-semibold text-zinc-900 mb-3 flex items-center gap-2">
            <AlertCircle className="size-4 text-amber-500" />
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
          <h2 className="text-sm font-semibold text-zinc-900 mb-3 flex items-center gap-2">
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
          <h2 className="text-sm font-semibold text-zinc-900 mb-3 flex items-center gap-2">
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
              <CheckCircle2 className="size-12 text-emerald-200 mx-auto mb-3" />
              <p className="text-sm text-zinc-500">All caught up</p>
              <p className="text-xs text-zinc-400 mt-1">
                No personalization orders pending
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      <PreviewUploader
        orderId={uploadState?.orderId || ''}
        orderItemId={uploadState?.orderItemId || ''}
        orderNumber={uploadState?.orderNumber || ''}
        isOpen={!!uploadState}
        onClose={() => setUploadState(null)}
        onSuccess={handleUploadSuccess}
      />
    </div>
  );
}
