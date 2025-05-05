import { Service } from '@/types';

const API_URL = process.env.NEXT_PUBLIC_STRAPI_URL;

export const getServiceBySlug = async (
  slug: string,
  locale: string
): Promise<Service | null> => {
  const fetchService = async (filter: string) => {
    const res = await fetch(
      `${API_URL}/api/services?${filter}&populate[service_contents][populate]=*&locale=${locale}`,
      { cache: 'no-store' }
    );

    const data = await res.json();
    return data?.data?.[0] || null;
  };

  // Try slug
  let service = await fetchService(`filters[Slug][$eq]=${slug}`);

  // Try fallback by ID (if it's a number)
  if (!service && !isNaN(Number(slug))) {
    service = await fetchService(`filters[id][$eq]=${slug}`);
  }

  return service;
};
