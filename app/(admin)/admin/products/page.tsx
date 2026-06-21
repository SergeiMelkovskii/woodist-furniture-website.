import Link from 'next/link';
import { redirect } from 'next/navigation';
import { Plus, AlertCircle } from 'lucide-react';
import AdminShell from '@/components/admin/AdminShell';
import PlaceholderArt from '@/components/PlaceholderArt';
import { getSession } from '@/lib/auth';
import { getProducts } from '@/lib/content';

export default async function ProductsAdmin() {
  const session = await getSession();
  if (!session.isAdmin) redirect('/admin/login');

  const products = await getProducts();

  return (
    <AdminShell>
      <div className="flex items-center justify-between">
        <div>
          <div className="text-xs font-medium uppercase tracking-widest text-ink/50">
            Catalogue
          </div>
          <h1 className="mt-2 font-display text-4xl tracking-tight">Products</h1>
          <p className="mt-2 text-ink/60">
            {products.length} item{products.length === 1 ? '' : 's'} · drag isn't supported yet — use the sort field to change order
          </p>
        </div>
        <Link href="/admin/products/new" className="btn-primary">
          <Plus size={16} />
          New product
        </Link>
      </div>

      <div className="mt-10 divide-y divide-ink/10 border-y border-ink/10">
        {products.length === 0 ? (
          <div className="py-16 text-center text-ink/50">
            No products yet. Add your first piece.
          </div>
        ) : (
          products.map((product) => (
            <Link
              key={product.id}
              href={`/admin/products/${product.id}`}
              className="group flex items-center gap-6 py-5 transition-colors hover:bg-ink/[0.02]"
            >
              <div className="relative h-16 w-16 shrink-0 overflow-hidden bg-taupe-100">
                {product.images[0] ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={product.images[0]}
                    alt=""
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <PlaceholderArt label={product.name.en} className="!p-2" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-xs font-medium uppercase tracking-widest text-ink/50">
                  {product.category}
                  {product.featured && (
                    <span className="ml-3 text-taupe-700">★ Featured</span>
                  )}
                </div>
                <div className="mt-1 truncate font-display text-xl tracking-tight">
                  {product.name.en}
                </div>
                <div className="mt-1 flex flex-wrap gap-3 text-xs text-ink/50">
                  {product.dimensions && <span>{product.dimensions}</span>}
                  {product.price && <span>· {product.price}</span>}
                  {(!product.name.ru || !product.name.tr) && (
                    <span className="inline-flex items-center gap-1 text-amber-700">
                      <AlertCircle size={11} />
                      Missing translations
                    </span>
                  )}
                  {product.images.length === 0 && (
                    <span className="inline-flex items-center gap-1 text-amber-700">
                      <AlertCircle size={11} />
                      No photos
                    </span>
                  )}
                </div>
              </div>
              <div className="text-ink/30 transition-transform group-hover:translate-x-0.5 group-hover:text-ink">
                →
              </div>
            </Link>
          ))
        )}
      </div>
    </AdminShell>
  );
}
