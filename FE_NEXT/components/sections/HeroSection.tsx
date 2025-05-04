'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useLocale, useTranslations } from 'next-intl';
import { fetchHeroData, getFullMediaUrl } from '@/lib/heroApi';

// Define proper TypeScript interfaces
interface SlideData {
  id: number;
  media: string;
  type: 'video' | 'image';
  altText: string;
  ctaLink: string;
}

export default function HeroSection() {
  const locale = useLocale();
  const isRTL = locale === 'ar';
  const t = useTranslations();
  const [activeSlide, setActiveSlide] = useState(0);
  const [slides, setSlides] = useState<SlideData[]>([]);
  const [avatarImage, setAvatarImage] = useState<string | null>(null);
  const [avatarAlt, setAvatarAlt] = useState<string>('Avatar');
  const [loading, setLoading] = useState(true);
  
  // Predefined CTA links - you might want to fetch these from the CMS too
  const ctaLinks = ['/contact', '/about', '/services'];
  
  // Fetch data from Strapi
  useEffect(() => {
    async function loadHeroData() {
      try {
        const heroData = await fetchHeroData(locale);
        
        if (heroData) {
          // Create slide data from the media items with proper typing
          const slideData: SlideData[] = [
            { 
              id: 1, 
              media: getFullMediaUrl(heroData.Media1.url),
              type: heroData.Media1.mime.startsWith('video/') ? 'video' : 'image',
              altText: heroData.AltMedia1 || 'Media 1',
              ctaLink: ctaLinks[0]
            },
            { 
              id: 2, 
              media: getFullMediaUrl(heroData.Media2.url),
              type: heroData.Media2.mime.startsWith('video/') ? 'video' : 'image',
              altText: heroData.AltMedia2 || 'Media 2',
              ctaLink: ctaLinks[1]
            },
            { 
              id: 3, 
              media: getFullMediaUrl(heroData.Media3.url),
              type: heroData.Media3.mime.startsWith('video/') ? 'video' : 'image',
              altText: heroData.AltMedia3 || 'Media 3',
              ctaLink: ctaLinks[2]
            }
          ];
          
          setSlides(slideData);
          
          // Set avatar image
          setAvatarImage(getFullMediaUrl(heroData.Avatar.url));
          setAvatarAlt(heroData.AltAvatar || 'Avatar');
        }
      } catch (error) {
        console.error('Failed to fetch hero data:', error);
      } finally {
        setLoading(false);
      }
    }
    
    loadHeroData();
  }, [locale]);
  
  // Auto-rotate slides
  useEffect(() => {
    if (slides.length === 0) return;
    
    const interval = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % slides.length);
    }, 6000);
    
    return () => clearInterval(interval);
  }, [slides]);
  
  const nextSlide = () => {
    if (slides.length === 0) return;
    setActiveSlide((prev) => (prev + 1) % slides.length);
  };
  
  const prevSlide = () => {
    if (slides.length === 0) return;
    setActiveSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };
  
  const goToSlide = (index: number) => {
    setActiveSlide(index);
  };

  // Show loading state while fetching data
  if (loading) {
    return (
      <section className="py-20 min-h-[90vh] flex items-center justify-center">
        <div className="flex flex-col items-center">
          <Loader2 className="h-52 w-52 animate-spin text-[#643F2E]" />
          <p className="mt-4 text-gray-600">{t('hero.loading')}</p>
        </div>
      </section>
    );
  }

  // Return empty div if no slides are available
  if (slides.length === 0) {
    return <div className="h-screen"></div>;
  }

  return (
    <section className="relative h-screen">
      {/* Slides */}
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          className={cn(
            'absolute inset-0 transition-opacity duration-1000',
            activeSlide === index ? 'opacity-100' : 'opacity-0 pointer-events-none'
          )}
        >
          {/* Media with overlay */}
          <div className="absolute inset-0">
            {slide.type === 'video' ? (
              <video
                className="absolute inset-0 w-full h-full object-cover filter grayscale"
                src={slide.media}
                autoPlay
                muted
                loop
                playsInline
                aria-label={slide.altText}
              />
            ) : (
              <div 
                className="absolute inset-0 bg-cover bg-center filter grayscale"
                style={{ 
                  backgroundImage: `url(${slide.media})`,
                  backgroundPosition: 'center',
                  backgroundSize: 'cover'
                }}
                role="img"
                aria-label={slide.altText}
              />
            )}
            <div className="absolute inset-0 bg-[#643F2E] bg-opacity-30" />
          </div>
          
          {/* Content */}
          <div className="relative h-full container mx-auto px-4 flex items-center">
            <div className={cn(
              'ml-16 max-w-xl space-y-6',
              isRTL ? 'mr-16 text-right ml-auto' : 'text-left'
            )}>
              <h1 className="text-xl md:text-2xl lg:text-4xl font-bold text-white">
                {t('hero.title')}
              </h1>
              <p className="text-xl text-gray-200">
                {t('hero.subtitle')}
              </p>
              <div>
                <Link 
                  href={slide.ctaLink} 
                  className="inline-block bg-white text-[#643F2E] hover:bg-gray-200 transition-colors px-6 py-3 rounded font-medium"
                >
                  {t('hero.cta')}
                </Link>
              </div>
            </div>
            
            {/* Avatar image - positioned according to language direction */}
            {avatarImage && (
              <div className={cn(
                'absolute top-1/2 -translate-y-1/2',
                isRTL ? 'left-4 md:left-12 lg:left-24' : 'right-4 md:right-12 lg:right-24'
              )}>
                <div className="relative bg-[#643F2E] h-40 w-40 md:h-60 md:w-60 lg:w-[374px] lg:h-[374px] overflow-hidden rounded-md">
                  <Image 
                    src={avatarImage}
                    alt={avatarAlt}
                    fill
                    className="object-cover"
                    priority
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      ))}
      
      {/* Navigation arrows */}
      <button
        onClick={isRTL ? nextSlide : prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-[#643F2E] bg-opacity-50 hover:bg-opacity-70 text-white p-2 rounded-full transition-colors z-10"
        aria-label={t('hero.prevSlide')}
      >
        <ChevronLeft className="h-6 w-6" />
      </button>
      <button
        onClick={isRTL ? prevSlide : nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-[#643F2E] bg-opacity-50 hover:bg-opacity-70 text-white p-2 rounded-full transition-colors z-10"
        aria-label={t('hero.nextSlide')}
      >
        <ChevronRight className="h-6 w-6" />
      </button>
      
      {/* Indicators */}
      <div
          className={cn(
            "absolute bottom-8 left-0 right-0 flex justify-center z-10",
            isRTL ? "space-x-reverse space-x-2" : "space-x-2"
          )}
        >
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={cn(
              'w-3 h-3 rounded-full transition-colors',
              activeSlide === index ? 'bg-white' : 'bg-white bg-opacity-50 hover:bg-opacity-75'
            )}
            aria-label={t('hero.goToSlide', { number: index + 1 })}
          />
        ))}
      </div>
    </section>
  );
}