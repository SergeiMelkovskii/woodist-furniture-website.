import { NextResponse } from 'next/server';
import fs from 'node:fs/promises';
import path from 'node:path';
import { requireAdmin } from '@/lib/auth';

const ALLOWED = ['image/jpeg', 'image/png', 'image/webp', 'image/avif'];
const MAX_SIZE = 12 * 1024 * 1024;

export async function POST(req: Request) {
  try {
    await requireAdmin();
  } catch (e) {
    return e as Response;
  }

  const form = await req.formData();
  const file = form.get('file');
  const subdir = (form.get('subdir') as string | null) || '';

  if (!(file instanceof File)) {
    return NextResponse.json({ error: 'No file provided' }, { status: 400 });
  }
  if (!ALLOWED.includes(file.type)) {
    return NextResponse.json({ error: `Unsupported type: ${file.type}` }, { status: 415 });
  }
  if (file.size > MAX_SIZE) {
    return NextResponse.json({ error: 'File too large (max 12 MB)' }, { status: 413 });
  }

  const safeSub = subdir.replace(/[^a-z0-9_-]/gi, '');
  const dir = path.join(process.cwd(), 'public', 'uploads', safeSub);
  await fs.mkdir(dir, { recursive: true });

  const ext = file.type.split('/')[1] === 'jpeg' ? 'jpg' : file.type.split('/')[1];
  const stamp = `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
  const filename = `${stamp}.${ext}`;
  const target = path.join(dir, filename);
  const bytes = Buffer.from(await file.arrayBuffer());
  await fs.writeFile(target, bytes);

  const url = `/uploads/${safeSub ? `${safeSub}/` : ''}${filename}`;
  return NextResponse.json({ url });
}
