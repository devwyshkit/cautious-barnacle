'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from '@/components/ui/sheet'
import {
  LayoutDashboard,
  Store,
  ShoppingCart,
  Package,
  Layers,
  Tag,
  MapPin,
  Menu,
  LogOut,
  Users,
  Wallet,
  RotateCcw,
  BarChart3,
  Truck,
  Settings,
  FileText,
} from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import type { AdminSession } from '@/lib/types/admin.types'

const NAV_LINKS = [
  { label: 'Overview', href: '/admin', icon: LayoutDashboard },
  { label: 'Insights', href: '/admin/insights', icon: BarChart3 },
  { label: 'Orders', href: '/admin/orders', icon: ShoppingCart },
  { label: 'Deliveries', href: '/admin/deliveries', icon: Truck },
  { label: 'Vendors', href: '/admin/vendors', icon: Store },
  { label: 'Products', href: '/admin/products', icon: Package },
  { label: 'Categories', href: '/admin/categories', icon: Layers },
  { label: 'Customers', href: '/admin/customers', icon: Users },
  { label: 'Wyshkit money', href: '/admin/wallet', icon: Wallet },
  { label: 'Returns', href: '/admin/returns', icon: RotateCcw },
  { label: 'Coupons', href: '/admin/coupons', icon: Tag },
  { label: 'Serviceability', href: '/admin/serviceability', icon: MapPin },
  { label: 'Settings', href: '/admin/settings', icon: Settings },
  { label: 'Audit logs', href: '/admin/audit-logs', icon: FileText },
]

interface AdminShellProps {
  admin: AdminSession
  children: React.ReactNode
}

function NavLink({ href, icon: Icon, label }: { href: string; icon: typeof LayoutDashboard; label: string }) {
  const pathname = usePathname()
  const isActive = href === '/admin' ? pathname === '/admin' : pathname.startsWith(href)

  return (
    <Link
      href={href}
      className={cn(
        'flex items-center gap-3 px-3 py-2 text-sm rounded-md transition-colors',
        isActive
          ? 'bg-[var(--primary)] text-[var(--text-inverse)] shadow-brand font-medium'
          : 'text-[var(--text-secondary)] hover:bg-[var(--surface-muted)] hover:text-[var(--text-primary)]'
      )}
    >
      <Icon className="size-4" />
      {label}
    </Link>
  )
}

function Sidebar() {
  return (
    <nav className="flex flex-col gap-1 p-3 overflow-y-auto max-h-[calc(100vh-56px)]">
      {NAV_LINKS.map((link) => (
        <NavLink key={link.href} {...link} />
      ))}
    </nav>
  )
}

export function AdminShell({ admin, children }: AdminShellProps) {
  const router = useRouter()
  const supabase = createClient()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/admin/login')
  }

  return (
    <div className="min-h-[100dvh] bg-[var(--surface-muted)]">
      {/* Desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 z-[var(--z-nav)] hidden w-56 border-r border-[var(--border)] bg-[var(--surface)] lg:block">
        <div className="flex h-14 items-center border-b border-[var(--border)] px-4">
          <Link href="/admin" className="flex items-center gap-2">
            <div className="size-7 rounded bg-[var(--primary)] flex items-center justify-center">
              <span className="text-[var(--text-inverse)] text-xs font-semibold">W</span>
            </div>
            <span className="font-semibold text-[var(--text-primary)]">Wyshkit Admin</span>
          </Link>
        </div>
        <Sidebar />
      </aside>

      {/* Main content */}
      <div className="lg:pl-56">
        <header className="sticky top-0 z-[var(--z-nav)] flex h-14 items-center gap-4 border-b border-[var(--border)] bg-[var(--surface)] px-4">
          {/* Mobile menu */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="lg:hidden">
                <Menu className="size-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-56 p-0">
              <SheetTitle className="sr-only">Main Menu</SheetTitle>
              <div className="flex h-14 items-center border-b border-[var(--border)] px-4">
                <span className="font-semibold text-[var(--text-primary)]">Wyshkit</span>
              </div>
              <Sidebar />
            </SheetContent>
          </Sheet>

          <div className="flex-1" />

          <div className="flex items-center gap-3">
            <span className="text-sm text-[var(--text-secondary)] hidden sm:block">
              {admin.name || admin.phone}
            </span>
            <Button variant="ghost" size="icon" onClick={handleLogout}>
              <LogOut className="size-4" />
            </Button>
          </div>
        </header>

        <main className="p-4 lg:p-6">
          {children}
        </main>
      </div>
    </div>
  )
}
