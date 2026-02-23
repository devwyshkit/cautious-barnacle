'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ChevronRight } from 'lucide-react';
import { HERO_SLIDES } from '@/lib/constants/home-config';

/**
 * WYSHKIT 2026: Hero carousel - Swiggy-style promo banners
 * Fallback when no trending items (prevents empty space above Featured Stores)
 */
export function HeroCarousel() {
  return (
    <section className="px-4 pb-3 md:px-8 slide-in-from-bottom-2 [animation-delay:0.05s]">
      <div className="flex gap-3 overflow-x-auto no-scrollbar -mx-4 px-4 snap-x snap-mandatory">
        {HERO_SLIDES.map((slide) => (
          <Link
            key={slide.id}
            href={slide.ctaLink}
            className="flex-shrink-0 w-[85vw] max-w-[400px] h-40 md:h-48 rounded-xl overflow-hidden relative group snap-center"
          >
            <Image
              src={slide.image}
              alt={slide.title}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              sizes="(max-width: 768px) 85vw, 400px"
              priority={slide.id === '1'}
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/30 to-transparent flex flex-col justify-center pl-6 pr-4">
              <h3 className="text-lg md:text-xl font-bold text-white tracking-tight mb-0.5">{slide.title}</h3>
              <p className="text-xs md:text-sm text-white/90 mb-3">{slide.subtitle}</p>
              <span className="inline-flex items-center gap-1 text-sm font-bold text-white">
                {slide.ctaText}
                <ChevronRight className="size-4" />
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
