// 2. Service Detail Page - app/[locale]/services/[slug]/page.tsx
import { notFound } from 'next/navigation';
import ServiceDetailsPage from '@/components/sections/ServiceDetails';

export default async function ServicePage({
  params,
}: {
  params: { locale: string; slug: string };
}) {
  const locale = params.locale;

  // First try to fetch by slug
  let res = await fetch(
    `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/services?filters[Slug][$eq]=${params.slug}&populate[service_contents][populate]=*&locale=${locale}`,
    { cache: 'no-store' }
  );

  let data = await res.json();
  let service = data.data?.[0];

  // If not found by slug and the slug looks like an ID, try to fetch by ID (for backward compatibility)
  if (!service && !isNaN(Number(params.slug))) {
    res = await fetch(
      `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/services?filters[id][$eq]=${params.slug}&populate[service_contents][populate]=*&locale=${locale}`,
      { cache: 'no-store' }
    );
    data = await res.json();
    service = data.data?.[0];
  }

  if (!service) return notFound();

  return <ServiceDetailsPage service={service} />;
}

export async function generateStaticParams() {
  try {
    const allParams = [];
    
    for (const locale of ['en', 'ar']) {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/services?locale=${locale}`,
        { cache: 'no-store' }
      );
      
      if (!res.ok) continue;
      
      const data = await res.json();
      
      const localeParams = data.data.map((service: any) => ({
        locale,
        slug: service.Slug || service.id.toString(),
      }));
      
      allParams.push(...localeParams);
    }
    
    return allParams;
  } catch (error) {
    console.error('Error in generateStaticParams:', error);
    return [];
  }
}