import Link from 'next/link';
import { redirect } from 'next/navigation';
import { ArrowUpRight, Sofa, Hammer, Settings, Eye, AlertCircle } from 'lucide-react';
import AdminShell from '@/components/admin/AdminShell';
import { getSession } from '@/lib/auth';
import { getProducts, getProjects, getSettings } from '@/lib/content';

export default async function AdminDashboard() {
  const session = await getSession();
  if (!session.isAdmin) redirect('/admin/login');

  const [products, projects, settings] = await Promise.all([
    getProducts(),
    getProjects(),
    getSettings(),
  ]);

  const cards = [
    {
      label: 'Products',
      href: '/admin/products',
      icon: Sofa,
      count: products.length,
      meta: `${products.filter((p) => p.featured).length} featured`,
    },
    {
      label: 'Projects',
      href: '/admin/projects',
      icon: Hammer,
      count: projects.length,
      meta: `${projects.filter((p) => p.featured).length} featured`,
    },
    {
      label: 'Site Settings',
      href: '/admin/settings',
      icon: Settings,
      count: null,
      meta: 'Hero, contact, craftsmanship',
    },
  ];

  const heroMissing = !settings.hero.image;
  const productsMissingImages = products.filter((p) => p.images.length === 0).length;
  const projectsMissingImages = projects.filter((p) => p.images.length === 0).length;

  return (
    <AdminShell>
      <div className="mb-12">
        <div className="text-xs font-medium uppercase tracking-widest text-ink/50">
          Woodist Admin
        </div>
        <h1 className="mt-2 font-display text-4xl tracking-tight sm:text-5xl">
          Welcome back.
        </h1>
        <p className="mt-3 text-ink/60">
          Manage products, projects and site content from here. Changes are saved
          immediately and reflected on the live site.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        {cards.map(({ label, href, icon: Icon, count, meta }) => (
          <Link
            key={href}
            href={href}
            className="group block border border-ink/10 bg-bone p-6 transition-colors hover:border-ink"
          >
            <div className="flex items-start justify-between">
              <Icon size={20} className="text-ink/60" />
              <ArrowUpRight
                size={16}
                className="text-ink/30 transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-ink"
              />
            </div>
            <div className="mt-8">
              {count !== null && (
                <div className="font-display text-4xl tracking-tight">{count}</div>
              )}
              <div className="mt-2 text-sm font-medium">{label}</div>
              <div className="mt-1 text-xs text-ink/50">{meta}</div>
            </div>
          </Link>
        ))}
      </div>

      {(heroMissing || productsMissingImages > 0 || projectsMissingImages > 0) && (
        <div className="mt-10 border-l-2 border-taupe-700 bg-taupe-50 p-5">
          <div className="flex items-start gap-3">
            <AlertCircle size={18} className="mt-0.5 shrink-0 text-taupe-800" />
            <div className="text-sm text-taupe-900">
              <div className="font-medium">A few things to add</div>
              <ul className="mt-2 space-y-1 text-taupe-800">
                {heroMissing && <li>· Upload a hero image (Site Settings)</li>}
                {productsMissingImages > 0 && (
                  <li>· {productsMissingImages} product(s) without photos</li>
                )}
                {projectsMissingImages > 0 && (
                  <li>· {projectsMissingImages} project(s) without photos</li>
                )}
              </ul>
            </div>
          </div>
        </div>
      )}

      <div className="mt-12">
        <a
          href="/en"
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-2 text-sm text-ink/60 hover:text-ink"
        >
          <Eye size={14} />
          Open the live site
          <ArrowUpRight size={14} />
        </a>
      </div>
    </AdminShell>
  );
}
