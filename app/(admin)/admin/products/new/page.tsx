import { redirect } from 'next/navigation';
import AdminShell from '@/components/admin/AdminShell';
import ProductForm from '@/components/admin/ProductForm';
import { getSession } from '@/lib/auth';

export default async function NewProductPage() {
  const session = await getSession();
  if (!session.isAdmin) redirect('/admin/login');

  return (
    <AdminShell>
      <ProductForm mode="create" />
    </AdminShell>
  );
}
