import { NextResponse } from 'next/server';
import { z } from 'zod';
import { getProducts, saveProducts } from '@/lib/content';
import { requireAdmin } from '@/lib/auth';
import { slugify } from '@/lib/utils';
import type { Product } from '@/lib/types';

const LocalizedSchema = z.object({
  en: z.string(),
  ru: z.string(),
  tr: z.string(),
});

const ProductSchema = z.object({
  id: z.string().optional(),
  category: z.enum(['couches', 'pouffes', 'beds']),
  name: LocalizedSchema,
  description: LocalizedSchema,
  materials: LocalizedSchema.optional(),
  dimensions: z.string().optional(),
  price: z.string().optional(),
  images: z.array(z.string()),
  featured: z.boolean().optional(),
  order: z.number().optional(),
});

export async function GET() {
  const products = await getProducts();
  return NextResponse.json(products);
}

export async function POST(req: Request) {
  try {
    await requireAdmin();
  } catch (e) {
    return e as Response;
  }

  const body = await req.json();
  const parsed = ProductSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const all = await getProducts();
  const id = parsed.data.id || slugify(parsed.data.name.en) || `item-${Date.now()}`;
  if (all.some((p) => p.id === id)) {
    return NextResponse.json({ error: 'A product with this ID already exists' }, { status: 409 });
  }

  const newProduct: Product = {
    ...parsed.data,
    id,
    order: parsed.data.order ?? all.length + 1,
  };
  await saveProducts([...all, newProduct]);
  return NextResponse.json(newProduct, { status: 201 });
}
