import Link from 'next/link';
import { redirect } from 'next/navigation';
import { Plus, AlertCircle } from 'lucide-react';
import AdminShell from '@/components/admin/AdminShell';
import PlaceholderArt from '@/components/PlaceholderArt';
import { getSession } from '@/lib/auth';
import { getProjects } from '@/lib/content';

export default async function ProjectsAdmin() {
  const session = await getSession();
  if (!session.isAdmin) redirect('/admin/login');

  const projects = await getProjects();

  return (
    <AdminShell>
      <div className="flex items-center justify-between">
        <div>
          <div className="text-xs font-medium uppercase tracking-widest text-ink/50">
            Showcase
          </div>
          <h1 className="mt-2 font-display text-4xl tracking-tight">
            Individual Projects
          </h1>
          <p className="mt-2 text-ink/60">
            {projects.length} project{projects.length === 1 ? '' : 's'}
          </p>
        </div>
        <Link href="/admin/projects/new" className="btn-primary">
          <Plus size={16} />
          New project
        </Link>
      </div>

      <div className="mt-10 grid gap-6 sm:grid-cols-2">
        {projects.length === 0 ? (
          <div className="col-span-full py-16 text-center text-ink/50">
            No projects yet.
          </div>
        ) : (
          projects.map((project) => (
            <Link
              key={project.id}
              href={`/admin/projects/${project.id}`}
              className="group block border border-ink/10 bg-bone transition-colors hover:border-ink"
            >
              <div className="relative aspect-[16/10] overflow-hidden bg-ink">
                {project.images[0] ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={project.images[0]}
                    alt=""
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <PlaceholderArt
                    label={project.title.en}
                    category={project.location}
                    variant="interior"
                  />
                )}
              </div>
              <div className="p-5">
                <div className="text-xs font-medium uppercase tracking-widest text-ink/50">
                  {project.location}
                  {project.year && <span className="ml-3">{project.year}</span>}
                  {project.featured && (
                    <span className="ml-3 text-taupe-700">★ Featured</span>
                  )}
                </div>
                <div className="mt-2 font-display text-2xl tracking-tight">
                  {project.title.en}
                </div>
                <div className="mt-1 flex flex-wrap gap-3 text-xs text-ink/50">
                  {(!project.title.ru || !project.title.tr) && (
                    <span className="inline-flex items-center gap-1 text-amber-700">
                      <AlertCircle size={11} />
                      Missing translations
                    </span>
                  )}
                  {project.images.length === 0 && (
                    <span className="inline-flex items-center gap-1 text-amber-700">
                      <AlertCircle size={11} />
                      No photos
                    </span>
                  )}
                </div>
              </div>
            </Link>
          ))
        )}
      </div>
    </AdminShell>
  );
}
