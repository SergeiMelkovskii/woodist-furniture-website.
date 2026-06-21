import { redirect } from 'next/navigation';
import AdminShell from '@/components/admin/AdminShell';
import ProjectForm from '@/components/admin/ProjectForm';
import { getSession } from '@/lib/auth';

export default async function NewProjectPage() {
  const session = await getSession();
  if (!session.isAdmin) redirect('/admin/login');

  return (
    <AdminShell>
      <ProjectForm mode="create" />
    </AdminShell>
  );
}
