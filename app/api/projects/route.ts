import { NextResponse } from 'next/server';
import { z } from 'zod';
import { getProjects, saveProjects } from '@/lib/content';
import { requireAdmin } from '@/lib/auth';
import { slugify } from '@/lib/utils';
import type { Project } from '@/lib/types';

const LocalizedSchema = z.object({
  en: z.string(),
  ru: z.string(),
  tr: z.string(),
});

const ProjectSchema = z.object({
  id: z.string().optional(),
  title: LocalizedSchema,
  location: z.string().optional(),
  year: z.number().optional(),
  description: LocalizedSchema,
  images: z.array(z.string()),
  featured: z.boolean().optional(),
  order: z.number().optional(),
});

export async function GET() {
  const projects = await getProjects();
  return NextResponse.json(projects);
}

export async function POST(req: Request) {
  try {
    await requireAdmin();
  } catch (e) {
    return e as Response;
  }

  const body = await req.json();
  const parsed = ProjectSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const all = await getProjects();
  const id = parsed.data.id || slugify(parsed.data.title.en) || `project-${Date.now()}`;
  if (all.some((p) => p.id === id)) {
    return NextResponse.json({ error: 'A project with this ID already exists' }, { status: 409 });
  }

  const newProject: Project = {
    ...parsed.data,
    id,
    order: parsed.data.order ?? all.length + 1,
  };
  await saveProjects([...all, newProject]);
  return NextResponse.json(newProject, { status: 201 });
}
