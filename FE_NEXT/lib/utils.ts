import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getFullMediaUrl = (url: string) => {
  if (!url) return '';
  if (url.startsWith('http')) return url;
  const base = process.env.NEXT_PUBLIC_STRAPI_URL || '';
  return base.replace(/\/api$/, '') + url;
};
