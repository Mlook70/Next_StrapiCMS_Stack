// lib/heroApi.ts
import { fetcher } from './api';

// Types to match your Strapi API response
export interface MediaItem {
  id: number;
  documentId: string;
  name: string;
  alternativeText: string | null;
  caption: string | null;
  width: number | null;
  height: number | null;
  formats: {
    thumbnail?: {
      url: string;
      width: number;
      height: number;
    };
    small?: {
      url: string;
      width: number;
      height: number;
    };
    medium?: {
      url: string;
      width: number;
      height: number;
    };
  } | null;
  hash: string;
  ext: string;
  mime: string;
  size: number;
  url: string;
  previewUrl: string | null;
  provider: string;
  provider_metadata: any | null;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
}

export interface HeroSlideData {
  id: number;
  documentId: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  locale: string;
  AltMedia1: string;
  AltMedia2: string;
  AltMedia3: string;
  AltAvatar: string;
  Media1: MediaItem;
  Media2: MediaItem;
  Media3: MediaItem;
  Avatar: MediaItem;
  localizations: {
    id: number;
    documentId: string;
    locale: string;
    AltMedia1: string;
    AltMedia2: string;
    AltMedia3: string;
    AltAvatar: string;
  }[];
}

export interface HeroApiResponse {
  data: HeroSlideData[];
  meta: {
    pagination: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
}

/**
 * Fetches hero slide data from Strapi CMS
 * @param locale The current locale (e.g., 'en', 'ar')
 * @returns Hero slide data
 */
export async function fetchHeroData(locale: string = 'en'): Promise<HeroSlideData | null> {
  try {
    const apiUrl = `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/hero-slides?populate=*&locale=${locale}`;
    const response = await fetcher<HeroApiResponse>(apiUrl);
    
    if (response.data && response.data.length > 0) {
      return response.data[0];
    }
    
    return null;
  } catch (error) {
    console.error('Failed to fetch hero data:', error);
    return null;
  }
}

/**
 * Constructs the full URL for a Strapi media item
 * @param url The relative URL from Strapi
 * @returns The full URL including the base API URL
 */
export function getFullMediaUrl(url: string): string {
  if (!url) return '';
  
  // If it's already a full URL, return it
  if (url.startsWith('http')) {
    return url;
  }
  
  // Remove /api from the URL path if it exists in both the base URL and the media URL
  const baseUrl = process.env.NEXT_PUBLIC_STRAPI_URL || '';
  const baseWithoutApi = baseUrl.endsWith('/api') 
    ? baseUrl.substring(0, baseUrl.length - 4) 
    : baseUrl;
    
  return `${baseWithoutApi}${url}`;
}