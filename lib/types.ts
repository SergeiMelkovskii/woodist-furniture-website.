import type { Localized } from './utils';

export type ProductCategory = 'couches' | 'pouffes' | 'beds';

export const productCategories: ProductCategory[] = ['couches', 'pouffes', 'beds'];

export type Product = {
  id: string;
  category: ProductCategory;
  name: Localized;
  description: Localized;
  materials?: Localized;
  dimensions?: string;
  price?: string;
  images: string[];
  featured?: boolean;
  order?: number;
};

export type Project = {
  id: string;
  title: Localized;
  location?: string;
  year?: number;
  description: Localized;
  images: string[];
  featured?: boolean;
  order?: number;
};

export type CraftStep = {
  title: Localized;
  description: Localized;
};

export type Settings = {
  hero: {
    image: string;
    slogan: Localized;
    eyebrow?: Localized;
  };
  about: Localized;
  contact: {
    phone: string;
    whatsapp: string;
    telegram: string;
    address: Localized;
    email?: string;
    instagram?: string;
    mapEmbed?: string;
  };
  craftsmanship: {
    title: Localized;
    intro: Localized;
    steps: CraftStep[];
  };
};
