import React from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';

interface LogoProps {
  className?: string;
  variant?: 'default' | 'white' | 'minimal';
}

export function Logo({ className, variant = 'default' }: LogoProps) {
  return (
    <div className={cn("flex items-center select-none", className)}>
        <div className="relative h-8 md:h-9 w-28 md:w-32">
          <Image 
            src="/images/logo.png" 
            alt="wyshkit" 
            fill 
            className={cn(
              "object-contain object-left",
              variant === 'white' && "brightness-0 invert"
            )}
            priority
          />
        </div>

    </div>
  );
}
