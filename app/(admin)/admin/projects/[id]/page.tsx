import { redirect, notFound } from 'next/navigation';
import AdminShell from '@/components/admin/AdminShell';
import ProjectForm from '@/components/admin/ProjectForm';
import { getSession } from '@/lib/auth';
import { getProject } from '@/lib/content';

export default async function EditProjectPage({
  params,
}: {
  params: { id: string };
}) {
  const session = await getSession();
  if (!session.isAdmin) redirect('/admin/login');

  if (params.id === 'new') {
    redirect('/admin/projects/new');
  }

  const project = await getProject(params.id);
  if (!project) notFound();

  return (
    <AdminShell>
      <ProjectForm mode="edit" initial={project} />
    </AdminShell>
  );
}
