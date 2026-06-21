import fs from 'node:fs/promises';
import path from 'node:path';
import type { Product, Project, Settings } from './types';

const DATA_DIR = path.join(process.cwd(), 'data');

async function readJson<T>(file: string): Promise<T> {
  const raw = await fs.readFile(path.join(DATA_DIR, file), 'utf-8');
  return JSON.parse(raw) as T;
}

async function writeJson<T>(file: string, data: T): Promise<void> {
  await fs.writeFile(
    path.join(DATA_DIR, file),
    JSON.stringify(data, null, 2),
    'utf-8',
  );
}

export async function getProducts(): Promise<Product[]> {
  const list = await readJson<Product[]>('products.json');
  return list.sort((a, b) => (a.order ?? 999) - (b.order ?? 999));
}

export async function getProduct(id: string): Promise<Product | null> {
  const all = await getProducts();
  return all.find((p) => p.id === id) ?? null;
}

export async function saveProducts(products: Product[]): Promise<void> {
  await writeJson('products.json', products);
}

export async function getProjects(): Promise<Project[]> {
  const list = await readJson<Project[]>('projects.json');
  return list.sort((a, b) => (a.order ?? 999) - (b.order ?? 999));
}

export async function getProject(id: string): Promise<Project | null> {
  const all = await getProjects();
  return all.find((p) => p.id === id) ?? null;
}

export async function saveProjects(projects: Project[]): Promise<void> {
  await writeJson('projects.json', projects);
}

export async function getSettings(): Promise<Settings> {
  return readJson<Settings>('settings.json');
}

export async function saveSettings(settings: Settings): Promise<void> {
  await writeJson('settings.json', settings);
}
