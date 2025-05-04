// 1. Updated ServicesSection.tsx
'use client';

import React from 'react';
import Link from 'next/link';
import { Scale, Building, Gavel, Rocket, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import useSWR from 'swr';
import { fetcher } from '@/lib/api';
import { Service, ServicesResponse } from '@/types/';
import { useLocale, useTranslations } from 'next-intl';

export default function ServicesSection() {
  const locale = useLocale();
  const isRTL = locale === 'ar';
  const t = useTranslations('services');
  
  // Fetch services using SWR with locale parameter
  const { data, error, isLoading } = useSWR<ServicesResponse>(
    `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/services?populate=*&locale=${locale}`,
    fetcher
  );
  
  // Map icons to components
  const getIcon = (iconName: string) => {
    // Make sure iconName exists before trying to use it
    if (!iconName) return <Scale className="h-8 w-8" />;
    
    switch (iconName) {
      case 'Scale':
        return <Scale className="h-8 w-8" />;
      case 'Building':
        return <Building className="h-8 w-8" />;
      case 'Gavel':
        return <Gavel className="h-8 w-8" />;
      case 'Rocket':
        return <Rocket className="h-8 w-8" />;
      default:
        return <Scale className="h-8 w-8" />;
    }
  };

  // Handle loading state
  if (isLoading) {
    return (
      <section className="py-20 min-h-[60vh] flex items-center justify-center">
        <div className="flex flex-col items-center">
          <Loader2 className="h-10 w-10 animate-spin text-[#643F2E]" />
          <p className="mt-4 text-gray-600">{t('loading')}</p>
        </div>
      </section>
    );
  }

  // Handle error state
  if (error) {
    return (
      <section className="py-20 min-h-[60vh] flex items-center justify-center">
        <div className="text-center p-6 max-w-md">
          <h2 className="text-2xl font-bold text-red-600 mb-4">{t('errorTitle')}</h2>
          <p className="text-gray-700">{t('error')}</p>
        </div>
      </section>
    );
  }

  const services = data?.data || [];
  
  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-[#643F2E] mb-4">
            {t('title')}
          </h2>
          <p className="text-gray-600 text-lg">
            {t('subtitle')}
          </p>
        </div>
        
        {services.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {services.map((service) => (
              <div
                key={service.id}
                className="bg-white rounded-lg shadow-md p-6 transition-transform hover:scale-105 duration-300"
              >
                <div className="text-[#643F2E] mb-4">
                  {service && service.Icon ? 
                    getIcon(service.Icon) : 
                    <Scale className="h-8 w-8" />}
                </div>
                <h3 className="text-xl font-semibold text-[#643F2E] mb-3">
                  {service?.Title || 'Service'}
                </h3>
                <p className="text-gray-600 mb-4 line-clamp-3">
                  {service?.Description || 'No description available'}
                </p>
                <Link
                  href={`/services/${service.Slug || service.id}`}
                  className="text-[#643F2E] hover:text-[#4d2416] font-medium inline-flex items-center"
                >
                  {t('learnMore')}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className={cn(
                      'h-4 w-4',
                      isRTL ? 'mr-1 rotate-180' : 'ml-1'
                    )}
                  >
                    <path d="M5 12h14" />
                    <path d="m12 5 7 7-7 7" />
                  </svg>
                </Link>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center p-6">
            <p className="text-gray-600">{t('noServices')}</p>
          </div>
        )}
      </div>
    </section>
  );
}