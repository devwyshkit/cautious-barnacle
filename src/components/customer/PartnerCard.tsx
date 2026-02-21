import React from 'react';
import Image from 'next/image';
import { Star, MapPin, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';
import { MorphLink } from '@/components/ui/MorphLink';

const FALLBACK_IMAGE = '/images/logo-horizontal.png';

interface PartnerCardProps {
  id: string;
  name: string;
  rating?: number;
  city?: string | null;
  image_url: string | null;
  deliveryTime?: { min: number; max: number } | null;
  distance?: number | null; // WYSHKIT 2026: Input for time calculation
  prep_hours?: number | null; // WYSHKIT 2026: Fallback for time calculation
  className?: string;
  variant?: 'portrait' | 'landscape' | 'row';
  priority?: boolean;
}

/**
 * WYSHKIT 2026: Unified Partner Surface
 * Swiggy 2026 Pattern: One component, multiple variants (DRY)
 */
export function PartnerCard({
  id,
  name,
  rating,
  city,
  image_url,
  deliveryTime,
  distance,
  prep_hours,
  className,
  variant = 'portrait',
  priority = false,
}: PartnerCardProps) {
  // Logic: 10 mins per km + 20 mins prep. Fallback to prep_hours if available.
  const timeEstimate = deliveryTime || (distance ? {
    min: Math.max(25, Math.ceil(distance * 10) + 20),
    max: Math.max(35, Math.ceil(distance * 10) + 30)
  } : prep_hours ? {
    min: prep_hours * 60,
    max: prep_hours * 60 + 30
  } : null);
  const isPortrait = variant === 'portrait';
  const isLandscape = variant === 'landscape';
  const isRow = variant === 'row';

  const content = (
    <div className={cn(
      "relative rounded-2xl overflow-hidden shadow-sm border border-border/40 bg-card transition-all group-hover:shadow-md",
      isPortrait && "aspect-[4/5]",
      isLandscape && "aspect-[16/9] w-full",
      isRow && "flex items-center gap-3 p-3 w-full"
    )}
    >
      <div className={cn(
        "relative",
        isRow ? "size-14 shrink-0 rounded-lg overflow-hidden" : "inset-0 absolute"
      )}>
        <Image
          src={image_url || FALLBACK_IMAGE}
          alt={name}
          fill
          className="object-cover group-hover:scale-110 transition-transform duration-1000 ease-out"
          loading={priority ? undefined : "lazy"}
          priority={priority}
          sizes={isRow ? "56px" : "(max-width: 640px) 200px, 300px"}
        />
        {!isRow && <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/30 to-transparent" />}
      </div>

      <div className={cn(
        isRow ? "flex-1 min-w-0" : "absolute bottom-3 left-3 right-3"
      )}>
        <div className="space-y-0.5">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className={cn(
              "text-[9px] font-black uppercase tracking-widest",
              isRow ? "text-muted-foreground" : "text-white/60"
            )}>
              {city || 'Local Store'}
            </span>
            {rating && (
              <div className="flex items-center gap-0.5 bg-emerald-600 px-1.5 py-0.5 rounded-md shadow-sm">
                <Star className="size-2.5 fill-white text-white" />
                <span className="text-[10px] font-black text-white">{rating.toFixed(1)}</span>
              </div>
            )}
            {timeEstimate && (
              <div className={cn(
                "flex items-center gap-1 px-1.5 py-0.5 rounded-md shadow-sm border",
                isRow
                  ? "bg-orange-50 text-orange-700 border-orange-100"
                  : "bg-white/10 backdrop-blur-md text-white border-white/20"
              )}>
                <Clock className="size-2.5" />
                <span className="text-[9px] font-black uppercase tracking-tighter">
                  {timeEstimate.min}-{timeEstimate.max} mins
                </span>
              </div>
            )}
          </div>
          <h4 className={cn(
            "font-black leading-tight line-clamp-1 uppercase tracking-tight",
            isRow ? "text-sm text-foreground" : "text-[13px] text-white"
          )}>
            {name}
          </h4>
        </div>
      </div>
    </div>
  );

  return (
    <MorphLink
      href={`/partner/${id}`}
      className={cn("flex flex-col cursor-pointer group transition-all", className)}
      prefetch={false}
      morphId={id}
      morphName="partner"
    >
      {content}
    </MorphLink>
  );
}
