import { notFound } from 'next/navigation';
import ServiceDetailsPage from '@/components/sections/service/ServiceDetails';
import { getServiceBySlug } from '@/lib/APIs/get/getServiceBySlug';

export default async function ServicePage({
  params,
}: {
  params: { locale: string; slug: string };
}) {
  const service = await getServiceBySlug(params.slug, params.locale);

  if (!service) return notFound();

  return <ServiceDetailsPage service={service} />;
}
