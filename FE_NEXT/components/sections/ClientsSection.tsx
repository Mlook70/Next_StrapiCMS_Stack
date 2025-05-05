// Updated ClientsSection.tsx using useClients hook

'use client';

import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Loader2, Quote } from 'lucide-react';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import { useLocale, useTranslations } from 'next-intl';
import useClients from '@/lib/APIs/hooks/useClients';

export default function ClientsSection(): JSX.Element {
  const locale = useLocale();
  const isRTL = locale === 'ar';
  const t = useTranslations('clients');
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [direction, setDirection] = useState<'next' | 'prev'>('next');

  const { clients, error, isLoading } = useClients();

  const handleNavigation = (direction: 'next' | 'prev'): void => {
    if (isAnimating || clients.length <= 1) return;
    setIsAnimating(true);
    setDirection(direction);
    if (direction === 'next') {
      setActiveTestimonial((prev) => (prev + 1) % clients.length);
    } else {
      setActiveTestimonial((prev) => (prev === 0 ? clients.length - 1 : prev - 1));
    }
  };

  useEffect(() => {
    if (isAnimating) {
      const timer = setTimeout(() => setIsAnimating(false), 500);
      return () => clearTimeout(timer);
    }
  }, [isAnimating]);

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

  if (error) {
    return (
      <section className="py-20 bg-[#4B2615] text-white">
        <div className="container mx-auto px-4 text-center">
          <p className="text-red-300">{t('error')}</p>
        </div>
      </section>
    );
  }

  const testimonials = clients || [];

  const goPrevious = () => handleNavigation('prev');
  const goNext = () => handleNavigation('next');

  return (
    <section className="py-20 bg-[#4B2615] text-white">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">{t('title')}</h2>
          <p className="text-gray-300">{t('subtitle')}</p>
        </div>

        {testimonials.length > 0 ? (
          <div className="max-w-4xl mx-auto relative">
            <div className="relative overflow-hidden">
              <div
                className={cn(
                  'flex transition-transform duration-500 ease-in-out',
                  isRTL ? 'flex-row-reverse' : 'flex-row'
                )}
                style={{
                  width: `${testimonials.length * 100}%`,
                  transform: `translateX(${isRTL ? activeTestimonial * (100 / testimonials.length) : -activeTestimonial * (100 / testimonials.length)}%)`
                }}
              >
                {testimonials.map((testimonial) => (
                  <div key={testimonial.id} className="w-full" style={{ width: `${100 / testimonials.length}%` }}>
                    <div className="flex flex-col md:flex-row items-center gap-8 px-4">
                      <div className={cn('w-full md:w-1/3 flex-shrink-0', isRTL ? 'order-last' : 'order-first')}>
                        <div className="relative h-64 w-64 mx-auto overflow-hidden rounded-lg">
                          {testimonial.Profile ? (
                            <Image
                              src={`${process.env.NEXT_PUBLIC_STRAPI_URL}${testimonial.Profile.formats.small?.url}`}
                              alt={testimonial.Profile.alternativeText || `${testimonial.FirstName} ${testimonial.LastName}`}
                              fill
                              className="object-cover"
                              sizes="(max-width: 768px) 100vw, 256px"
                            />
                          ) : (
                            <div className="h-full w-full bg-[#36190f] flex items-center justify-center">
                              <div className="w-20 h-20 rounded-full bg-[#4d2416] flex items-center justify-center text-3xl text-white">
                                {testimonial.FirstName?.[0]}{testimonial.LastName?.[0]}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="w-full md:w-2/3">
                        <div className="bg-[#36190f] rounded-lg p-6 relative">
                          <Quote className={cn('absolute top-3 text-[#4B2615] opacity-20 h-12 w-12', isRTL ? 'right-3' : 'left-3')} />
                          <p className={cn('text-lg mb-6 relative z-10', isRTL ? 'text-right' : 'text-left')}>
                            "{testimonial.Feedback}"
                          </p>
                          <div className={cn('flex items-center', isRTL ? 'justify-end' : 'justify-start')}>
                            <div className={isRTL ? 'text-right' : 'text-left'}>
                              <h4 className="font-semibold">{testimonial.FirstName} {testimonial.LastName}</h4>
                              <p className="text-gray-300 text-sm">{testimonial.Position}, {testimonial.Company}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {testimonials.length > 1 && (
              <div className="flex justify-center mt-8 space-x-4">
                <button
                  onClick={goPrevious}
                  className="bg-[#4d2416] hover:bg-[#3d1d12] rounded-full p-2 transition-colors disabled:opacity-50"
                  aria-label={t('prevButton')}
                  disabled={isAnimating}
                >
                  {isRTL ? <ChevronRight className="h-6 w-6" /> : <ChevronLeft className="h-6 w-6" />}
                </button>

                <div className={cn('flex items-center', isRTL ? 'space-x-reverse space-x-4' : 'space-x-2')}>
                  {testimonials.map((_, index) => (
                    <button
                      key={index}
                      className={`h-2 rounded-full transition-all ${
                        activeTestimonial === index ? 'w-6 bg-white' : 'w-2 bg-gray-500'
                      }`}
                      onClick={() => {
                        if (!isAnimating) {
                          setDirection(index > activeTestimonial ? 'next' : 'prev');
                          setActiveTestimonial(index);
                          setIsAnimating(true);
                        }
                      }}
                      aria-label={`Go to testimonial ${index + 1}`}
                    />
                  ))}
                </div>

                <button
                  onClick={ goNext}
                  className="bg-[#4d2416] hover:bg-[#3d1d12] rounded-full p-2 transition-colors disabled:opacity-50"
                  aria-label={t('nextButton')}
                  disabled={isAnimating}
                >
                  {isRTL ? <ChevronLeft className="h-6 w-6" /> : <ChevronRight className="h-6 w-6" />}
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center">
            <p>{t('noTestimonials')}</p>
          </div>
        )}
      </div>
    </section>
  );
}
