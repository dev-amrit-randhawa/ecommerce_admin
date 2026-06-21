'use client';

import { Bell, LogOut, Search, User } from 'lucide-react';
import { useRouter } from 'next/navigation';

import { logout as performLogout } from '@/lib/api/auth';
import { useAuthStore } from '@/lib/stores/auth-store';

export function TopNav() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);

  const handleLogout = async () => {
    await performLogout();
    router.replace('/login');
  };

  return (
    <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b bg-background/95 px-6 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex items-center gap-4">
        <div className="relative hidden md:block">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="search"
            placeholder="Search..."
            className="h-9 w-64 rounded-md border bg-muted/40 pl-9 pr-4 text-sm outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button
          className="relative rounded-md p-2 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
          aria-label="Notifications"
        >
          <Bell className="h-5 w-5" />
          <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-destructive" />
        </button>

        <div className="flex items-center gap-3">
          <div className="hidden text-right sm:block">
            <p className="text-sm font-medium">
              {user?.firstName} {user?.lastName}
            </p>
            <p className="text-xs text-muted-foreground capitalize">{user?.role?.replace('_', ' ')}</p>
          </div>
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-sm font-medium text-primary-foreground">
            {user?.firstName?.[0] || <User className="h-4 w-4" />}
          </div>
          <button
            onClick={handleLogout}
            className="rounded-md p-2 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
            aria-label="Logout"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
    </header>
  );
}
