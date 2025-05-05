'use client';

import React, { useRef } from 'react';
import { ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';
import { cn } from '@/lib/utils';
import useTeamMembers from '@/lib/APIs/hooks/useTeamMembers';
import Image from 'next/image';

export default function TeamSection(): JSX.Element {
  const locale = useLocale();
  const isRTL = locale === 'ar';
  const t = useTranslations('team');
  const sliderRef = useRef<HTMLDivElement>(null);

  const { teamMembers, error, isLoading } = useTeamMembers();

  const scrollLeft = () => {
    if (sliderRef.current) {
      sliderRef.current.scrollBy({ left: -300, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (sliderRef.current) {
      sliderRef.current.scrollBy({ left: 300, behavior: 'smooth' });
    }
  };

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
      <section className="py-16 bg-[#F3F3F3]">
        <div className="container mx-auto px-4 text-center">
          <p className="text-red-500">{t('error')}</p>
        </div>
      </section>
    );
  }

  const members = teamMembers.data;

  return (
    <section className="py-16 bg-[#F3F3F3]">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-3xl font-bold text-[#643F2E] mb-2">{t('title')}</h2>
          <p className="text-gray-600">{t('subtitle')}</p>
        </div>

        {members.length > 0 ? (
          <div className="relative max-w-5xl mx-auto">
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
              className="flex justify-center overflow-x-auto pb-6 hide-scrollbar snap-x gap-6"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              {members.map((member) => (
                <div key={member.id} className="flex-shrink-0 w-64 snap-start">
                  <div className="bg-[#643F2E] rounded-lg shadow-sm overflow-hidden transition-transform hover:scale-105 duration-300">
                    <div className="relative h-56 w-full">
                      {member.Profile ? (
                        <Image
                          src={`${process.env.NEXT_PUBLIC_STRAPI_URL}${member.Profile.formats.small?.url}`}
                          alt={member.Profile.alternativeText || `${member.FirstName} ${member.LastName}`}
                          fill
                          className="object-cover"
                          sizes="(max-width: 768px) 100vw, 256px"
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                          <div className="w-16 h-16 rounded-full bg-gray-300 flex items-center justify-center text-2xl text-gray-500">
                            {member.FirstName?.[0]}{member.LastName?.[0]}
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="p-4 text-center bg-[#F3F3F3]">
                      <h3 className="text-lg font-semibold text-[#643F2E]">
                        {member.FirstName} {member.LastName}
                      </h3>
                      <p className="text-gray-500 text-sm mb-3">
                        {t('position')}: {member.Position}
                      </p>
                      <div className="flex justify-center gap-3">
                        {member.WhatsappURL && (
                          <a
                            href={member.WhatsappURL}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label={`${t('whatsapp')} ${member.FirstName}`}
                            className="text-gray-400 hover:text-[#643F2E] transition-colors"
                          >
                            <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347zM12.05 21.785a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884a9.87 9.87 0 019.888 9.888c-.003 5.45-4.437 9.884-9.885 9.884z" />
                            </svg>
                          </a>
                        )}
                        {member.PhoneNumber && (
                          <a
                            href={`tel:${member.PhoneNumber}`}
                            aria-label={`${t('call')} ${member.FirstName}`}
                            className="text-gray-400 hover:text-[#643F2E] transition-colors"
                          >
                            <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                            </svg>
                          </a>
                        )}
                        {member.Email && (
                          <a
                            href={`mailto:${member.Email}`}
                            aria-label={`${t('email')} ${member.FirstName}`}
                            className="text-gray-400 hover:text-[#643F2E] transition-colors"
                          >
                            <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center">
            <p>{t('noTeamMembers')}</p>
          </div>
        )}
      </div>
    </section>
  );
}
