'use client';

import React, { useRef } from 'react';
import { Loader2, ChevronLeft, ChevronRight } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';
import useServices from '@/lib/APIs/hooks/useServices';
import ServiceCard from './ServiceCard';
import { cn } from '@/lib/utils';

const ServicesSection: React.FC = () => {
  const locale = useLocale();
  const isRTL = locale === 'ar';
  const t = useTranslations('services');
  const { services, error, isLoading } = useServices();
  const sliderRef = useRef<HTMLDivElement>(null);

  const scrollLeft = () => {
    sliderRef.current?.scrollBy({ left: -300, behavior: 'smooth' });
  };
  
  const scrollRight = () => {
    sliderRef.current?.scrollBy({ left: 300, behavior: 'smooth' });
  };
  

  return (
    <section className="py-20 bg-[#F3F3F3]">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-[#643F2E] mb-4">{t('title')}</h2>
          <p className="text-gray-600 text-lg">{t('subtitle')}</p>
        </div>

        {isLoading ? (
          <div className="flex flex-col items-center">
            <Loader2 className="h-10 w-10 animate-spin text-[#643F2E]" />
            <p className="mt-4 text-gray-600">{t('loading')}</p>
          </div>
        ) : error ? (
          <div className="text-center p-6 max-w-md mx-auto">
            <h2 className="text-2xl font-bold text-red-600 mb-4">{t('errorTitle')}</h2>
            <p className="text-gray-700">{t('error')}</p>
          </div>
        ) : services.data.length > 0 ? (
          <div className="relative max-w-7xl mx-auto">
            <button
              onClick={scrollLeft}
              className="absolute -left-4 top-1/2 -translate-y-1/2 bg-white text-gray-500 p-2 rounded-full shadow-md z-10 hover:bg-gray-100 transition-colors"
              aria-label={isRTL ? t('nextButton') : t('prevButton')}
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              onClick={scrollRight}
              className="absolute -right-4 top-1/2 -translate-y-1/2 bg-white text-gray-500 p-2 rounded-full shadow-md z-10 hover:bg-gray-100 transition-colors"
              aria-label={isRTL ? t('prevButton') : t('nextButton')}
            >
              <ChevronRight className="h-5 w-5" />
            </button>

            <div
              ref={sliderRef}
              className="flex overflow-x-auto hide-scrollbar gap-6 snap-x pb-6"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              {services.data.map((service) => (
                <div key={service.id} className="flex-shrink-0 w-64 snap-start">
                  <ServiceCard
                    service={service}
                    isRTL={isRTL}
                    learnMoreText={t('learnMore')}
                  />
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center">
            <p className="text-gray-600">{t('noServices')}</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default ServicesSection;
