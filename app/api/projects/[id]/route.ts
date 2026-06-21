import { NextResponse } from 'next/server';
import { z } from 'zod';
import { getProjects, saveProjects } from '@/lib/content';
import { requireAdmin } from '@/lib/auth';

const LocalizedSchema = z.object({
  en: z.string(),
  ru: z.string(),
  tr: z.string(),
});

const ProjectPatchSchema = z.object({
  title: LocalizedSchema.optional(),
  location: z.string().optional(),
  year: z.number().optional(),
  description: LocalizedSchema.optional(),
  images: z.array(z.string()).optional(),
  featured: z.boolean().optional(),
  order: z.number().optional(),
});

export async function PUT(
  req: Request,
  { params }: { params: { id: string } },
) {
  try {
    await requireAdmin();
  } catch (e) {
    return e as Response;
  }

  const body = await req.json();
  const parsed = ProjectPatchSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const all = await getProjects();
  const idx = all.findIndex((p) => p.id === params.id);
  if (idx === -1) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }
  const updated = { ...all[idx], ...parsed.data };
  all[idx] = updated;
  await saveProjects(all);
  return NextResponse.json(updated);
}

export async function DELETE(
  _: Request,
  { params }: { params: { id: string } },
) {
  try {
    await requireAdmin();
  } catch (e) {
    return e as Response;
  }

  const all = await getProjects();
  const next = all.filter((p) => p.id !== params.id);
  if (next.length === all.length) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }
  await saveProjects(next);
  return NextResponse.json({ ok: true });
}
