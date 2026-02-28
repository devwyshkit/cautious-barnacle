import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface HomeSectionProps {
  title: string;
  subtitle?: string;
  href?: string;
  children: React.ReactNode;
  className?: string;
}

export function HomeSection({ title, subtitle, href, children, className }: HomeSectionProps) {
  return (
    <section className={cn("space-y-6", className)}>
      <div className="flex items-center justify-between px-4 md:px-8">
        <div>
          <h2 className="text-[16px] md:text-[18px] font-semibold text-zinc-900 tracking-tight">
            {title}
          </h2>
          {subtitle && (
            <p className="text-[11px] text-zinc-500 mt-0.5 tracking-tight">{subtitle}</p>
          )}
        </div>

        {href && (
          <Link
            href={href}
            className="flex items-center gap-0.5 text-xs font-semibold text-zinc-500 hover:text-zinc-700 active:scale-95 transition-all"
          >
            See all
            <ChevronRight className="size-4" />
          </Link>
        )}
      </div>
      {children}
    </section>
  );
}
