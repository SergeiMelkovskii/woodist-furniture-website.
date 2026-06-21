'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { LayoutDashboard, Sofa, Hammer, Settings, LogOut, ExternalLink } from 'lucide-react';
import Logo from '@/components/Logo';
import { cn } from '@/lib/utils';

const nav = [
  { href: '/admin', label: 'Overview', icon: LayoutDashboard, match: (p: string) => p === '/admin' },
  { href: '/admin/products', label: 'Products', icon: Sofa, match: (p: string) => p.startsWith('/admin/products') },
  { href: '/admin/projects', label: 'Projects', icon: Hammer, match: (p: string) => p.startsWith('/admin/projects') },
  { href: '/admin/settings', label: 'Site Settings', icon: Settings, match: (p: string) => p.startsWith('/admin/settings') },
];

export default function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  const onLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/admin/login');
    router.refresh();
  };

  return (
    <div className="grid min-h-screen grid-cols-1 lg:grid-cols-[260px,1fr]">
      <aside className="border-b border-ink/10 bg-ink text-bone lg:flex lg:min-h-screen lg:flex-col lg:border-b-0 lg:border-r lg:border-ink/15">
        <div className="flex items-center justify-between p-6 lg:p-8">
          <Logo />
        </div>
        <nav className="flex flex-row gap-1 overflow-x-auto p-3 lg:flex-1 lg:flex-col lg:overflow-visible lg:p-4">
          {nav.map((item) => {
            const Icon = item.icon;
            const active = item.match(pathname);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'inline-flex items-center gap-3 rounded-sm px-4 py-3 text-sm transition-colors whitespace-nowrap',
                  active
                    ? 'bg-bone text-ink'
                    : 'text-bone/70 hover:bg-bone/10 hover:text-bone',
                )}
              >
                <Icon size={16} />
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="hidden lg:block lg:p-4">
          <a
            href="/en"
            target="_blank"
            rel="noreferrer"
            className="inline-flex w-full items-center gap-3 rounded-sm px-4 py-3 text-sm text-bone/60 transition-colors hover:bg-bone/10 hover:text-bone"
          >
            <ExternalLink size={16} />
            View live site
          </a>
          <button
            onClick={onLogout}
            className="mt-1 inline-flex w-full items-center gap-3 rounded-sm px-4 py-3 text-sm text-bone/60 transition-colors hover:bg-bone/10 hover:text-bone"
          >
            <LogOut size={16} />
            Sign out
          </button>
        </div>
      </aside>

      <main className="bg-bone p-6 sm:p-10 lg:p-14">
        <div className="mx-auto w-full max-w-5xl">{children}</div>
      </main>

      <div className="fixed right-4 top-4 z-50 lg:hidden">
        <button
          onClick={onLogout}
          className="rounded-full bg-ink px-3 py-1.5 text-xs uppercase tracking-widest text-bone"
        >
          Sign out
        </button>
      </div>
    </div>
  );
}
