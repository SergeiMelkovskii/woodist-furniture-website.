# Woodist — Furniture studio website

A minimal, editorial site for **Woodist** (Çatalköy, Girne — North Cyprus).
Built with Next.js 14, Tailwind, Framer Motion, and a self-hosted admin
dashboard for managing products, projects, and site content.

## What's inside

- **Public site** — Home, Products, Individual Projects, Contact
- **3 languages** — English, Russian, Turkish (with a quiet EN/RU/TR switcher)
- **Animated craftsmanship section** on the home page
- **Admin dashboard** at `/admin` — sign in, upload photos, edit text in all 3
  languages, manage products and projects
- **No SaaS, no database** — all content lives as JSON in `/data/`, all
  uploaded images live in `/public/uploads/`

## Quick start

```bash
# 1. Install
npm install

# 2. Add a local env file
cp .env.example .env.local
# then edit .env.local and set ADMIN_PASSWORD and SESSION_SECRET

# 3. Run
npm run dev
```

- Public site: <http://localhost:3000>
- Admin sign-in: <http://localhost:3000/admin/login>

## Environment variables

| Name              | Required | Purpose                                                |
| ----------------- | -------- | ------------------------------------------------------ |
| `ADMIN_PASSWORD`  | yes      | The password for `/admin` sign-in                      |
| `SESSION_SECRET`  | yes      | Random string >= 32 chars used to sign admin cookies   |

Generate a strong `SESSION_SECRET` with:
```bash
node -e "console.log(require('crypto').randomBytes(48).toString('base64'))"
```

## How to add content

1. Go to `/admin/login` and sign in with `ADMIN_PASSWORD`
2. **Products** — add Couches, Pouffes, or Beds with photos, descriptions, and
   prices in all three languages
3. **Projects** — add completed projects (Blue Office, Osyi Shop are seeded)
4. **Site Settings** — upload the hero photo, edit the slogan, change contact
   numbers, edit the four "Our Craftsmanship" steps

All edits write directly to JSON in `/data/` and uploaded photos go to
`/public/uploads/`. Refresh the public site and you'll see the change.

## Project structure

```
app/
  (public)/[locale]/        Public site, prefixed with /en, /ru, /tr
    page.tsx                  Home (hero, featured products, process, CTA)
    products/                 Product list + detail
    projects/                 Project list + detail
    contact/                  Contact page with map and quick-message links
  (admin)/admin/            Admin dashboard, not localized
    login/                    Password sign-in
    products/                 CRUD for products
    projects/                 CRUD for projects
    settings/                 Hero, contact, craftsmanship process
  api/                      API routes (auth, products, projects, settings, upload)

components/
  Header / Footer / Logo / LanguageSwitcher
  Hero / ProductCard / ProjectCard
  CraftsmanshipProcess      (the animated 4-step section)
  PlaceholderArt            (shows when a product/project has no photo yet)
  LenisProvider             (smooth scrolling)
  admin/                    Form + uploader components used by the dashboard

data/
  products.json
  projects.json
  settings.json

messages/                   Translations for the static UI strings
  en.json
  ru.json
  tr.json

public/
  images/                   Logo and favicon
  uploads/                  Photos uploaded through the admin
```

## Translatable content

Each piece of text that the public site shows in multiple languages is stored
as a `{ en, ru, tr }` object. In the admin, switch between EN / RU / TR tabs
under each text field — the small `o` next to a tab means that language is
empty. If a language is missing at render time, the site falls back to English.

UI labels that don't change ("Products", "Contact", "Materials", ...) live in
`messages/{en,ru,tr}.json` and are not editable through the admin — change
them in the repo and redeploy.

## Deployment notes

The default setup writes uploaded images to `/public/uploads/`. This works
locally and on long-running servers, but **on Vercel's serverless runtime the
filesystem is ephemeral** — uploaded files persist only for the current
invocation.

For a production deployment to Vercel, choose one of:

1. **Vercel Blob (recommended, free tier 1 GB)** — replace the `fs.writeFile`
   call in `app/api/upload/route.ts` with `@vercel/blob`'s `put()` and store
   the returned URL.
2. **Cloudinary or S3** — same pattern, swap in the SDK of choice.
3. **Self-host on a regular VPS** — the default `fs.writeFile` works as-is.

Content JSON edits via the admin have the same caveat. On a VPS they persist
to disk. On Vercel they don't — for that case, swap `lib/content.ts` to read
from a database (Vercel Postgres / Neon / Supabase) and the API routes to
write there instead of `fs.writeFile`.

## Scripts

| Command            | Action                                |
| ------------------ | ------------------------------------- |
| `npm run dev`      | Start the dev server on `:3000`       |
| `npm run build`    | Production build                      |
| `npm run start`    | Run the production build              |
| `npm run lint`     | Lint                                  |
| `npm run typecheck`| Run TypeScript without emitting       |
