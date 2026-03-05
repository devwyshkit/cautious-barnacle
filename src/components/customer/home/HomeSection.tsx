import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { AppHeading, AppText } from '@/components/ui/Typography';

interface HomeSectionProps {
  title: string;
  subtitle?: string;
  href?: string;
  children: React.ReactNode;
  className?: string;
}

export function HomeSection({ title, subtitle, href, children, className }: HomeSectionProps) {
  return (
    <section className={cn("flex flex-col gap-[var(--space-3)]", className)}>
      <div className="flex items-center justify-between px-4 md:px-8">
        <div>
          <AppHeading level={3} className="tracking-tight">
            {title}
          </AppHeading>
          {subtitle && (
            <AppText variant="caption" className="text-[var(--text-secondary)] mt-0.5">
              {subtitle}
            </AppText>
          )}
        </div>

        {href && (
          <Link
            href={href}
            className="flex items-center gap-0.5 text-xs font-semibold text-[var(--text-secondary)] hover:text-[var(--text-secondary)] active:scale-95 transition-all"
          >
            See all
            <ChevronRight className="size-3 stroke-[3]" />
          </Link>
        )}
      </div>
      {children}
    </section>
  );
}
