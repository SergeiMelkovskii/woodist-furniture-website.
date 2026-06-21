import { NextResponse } from 'next/server';
import { z } from 'zod';
import { getSettings, saveSettings } from '@/lib/content';
import { requireAdmin } from '@/lib/auth';

const Localized = z.object({
  en: z.string(),
  ru: z.string(),
  tr: z.string(),
});

const SettingsSchema = z.object({
  hero: z.object({
    image: z.string(),
    eyebrow: Localized.optional(),
    slogan: Localized,
  }),
  about: Localized,
  contact: z.object({
    phone: z.string(),
    whatsapp: z.string(),
    telegram: z.string(),
    address: Localized,
    email: z.string().optional(),
    instagram: z.string().optional(),
    mapEmbed: z.string().optional(),
  }),
  craftsmanship: z.object({
    title: Localized,
    intro: Localized,
    steps: z.array(z.object({ title: Localized, description: Localized })),
  }),
});

export async function GET() {
  const settings = await getSettings();
  return NextResponse.json(settings);
}

export async function PUT(req: Request) {
  try {
    await requireAdmin();
  } catch (e) {
    return e as Response;
  }

  const body = await req.json();
  const parsed = SettingsSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }
  await saveSettings(parsed.data);
  return NextResponse.json(parsed.data);
}
