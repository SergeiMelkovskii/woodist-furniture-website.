import { redirect, notFound } from 'next/navigation';
import AdminShell from '@/components/admin/AdminShell';
import ProductForm from '@/components/admin/ProductForm';
import { getSession } from '@/lib/auth';
import { getProduct } from '@/lib/content';

export default async function EditProductPage({
  params,
}: {
  params: { id: string };
}) {
  const session = await getSession();
  if (!session.isAdmin) redirect('/admin/login');

  if (params.id === 'new') {
    redirect('/admin/products/new');
  }

  const product = await getProduct(params.id);
  if (!product) notFound();

  return (
    <AdminShell>
      <ProductForm mode="edit" initial={product} />
    </AdminShell>
  );
}
