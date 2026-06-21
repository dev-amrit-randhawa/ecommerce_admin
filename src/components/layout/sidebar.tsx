'use client';

import {
  BarChart3,
  Box,
  ChevronLeft,
  FileText,
  Grid3X3,
  History,
  Home,
  Image,
  Layers,
  Package,
  Percent,
  RefreshCw,
  RotateCcw,
  Settings,
  ShoppingCart,
  Tag,
  Upload,
  Users,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

import { cn } from '@/lib/utils';

const navigation = [
  { name: 'Dashboard', href: '/', icon: Home },
  { name: 'Products', href: '/products', icon: Package },
  { name: 'Categories', href: '/categories', icon: Grid3X3 },
  { name: 'Brands', href: '/brands', icon: Tag },
  { name: 'Inventory', href: '/inventory', icon: Box },
  { name: 'Orders', href: '/orders', icon: ShoppingCart },
  { name: 'Returns', href: '/returns', icon: RotateCcw },
  { name: 'Refunds', href: '/refunds', icon: RefreshCw },
  { name: 'Customers', href: '/customers', icon: Users },
  { name: 'Coupons', href: '/coupons', icon: Percent },
  { name: 'CMS Pages', href: '/cms/pages', icon: FileText },
  { name: 'Banners', href: '/cms/banners', icon: Image },
  { name: 'Analytics', href: '/analytics', icon: BarChart3 },
  { name: 'Audit Logs', href: '/audit-logs', icon: History },
  { name: 'Bulk Ops', href: '/bulk', icon: Upload },
  { name: 'Settings', href: '/settings', icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={cn(
        'sticky top-0 flex h-screen flex-col border-r bg-card transition-all duration-300',
        collapsed ? 'w-16' : 'w-64',
      )}
    >
      <div className="flex h-16 items-center justify-between border-b px-4">
        {!collapsed && (
          <Link href="/" className="text-lg font-bold">
            Speffo
          </Link>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          <ChevronLeft
            className={cn('h-4 w-4 transition-transform', collapsed && 'rotate-180')}
          />
        </button>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto p-2">
        {navigation.map((item) => {
          const isActive =
            pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));

          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:bg-accent hover:text-foreground',
                collapsed && 'justify-center px-2',
              )}
              title={collapsed ? item.name : undefined}
            >
              <item.icon className="h-4 w-4 shrink-0" />
              {!collapsed && <span>{item.name}</span>}
            </Link>
          );
        })}
      </nav>

      <div className="border-t p-2">
        <div
          className={cn(
            'flex items-center gap-3 rounded-md px-3 py-2',
            collapsed && 'justify-center px-2',
          )}
        >
          <Layers className="h-4 w-4 shrink-0 text-muted-foreground" />
          {!collapsed && (
            <span className="text-xs text-muted-foreground">v1.0.0</span>
          )}
        </div>
      </div>
    </aside>
  );
}
