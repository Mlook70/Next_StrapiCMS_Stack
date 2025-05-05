'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Search, Menu, X, ChevronDown, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import SearchBar from '@/components/common/SearchBar';
import LanguageSwitcher from '@/components/common/LanguageSwitcher';
import useAppointmentForm from '../sections/appointment/useAppointmentForm';
import { useLocale, useTranslations } from 'next-intl';
import { usePathname } from 'next/navigation';
import useServices from '@/lib/APIs/hooks/useServices';
import { Service } from '@/types';

export default function Header() {
  const locale = useLocale();
  const isRTL = locale === 'ar';
  const t = useTranslations('header');
  const pathname = usePathname();
  const isHome = pathname === '/ar' || pathname === '/en';

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isServicesOpen, setIsServicesOpen] = useState(false);

  const { openAppointmentModal, AppointmentModal } = useAppointmentForm();
  const { services, error, isLoading } = useServices();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const toggleSearch = () => setIsSearchOpen(!isSearchOpen);
  const toggleServices = () => setIsServicesOpen(!isServicesOpen);

  useEffect(() => {
    if (isServicesOpen) {
      const closeDropdown = (e: MouseEvent) => {
        if (!(e.target as Element).closest('.services-dropdown')) {
          setIsServicesOpen(false);
        }
      };

      document.addEventListener('click', closeDropdown);
      return () => document.removeEventListener('click', closeDropdown);
    }
  }, [isServicesOpen]);

  const groupServices = (): Service[][] => {
    const columns = 4;
    const result: Service[][] = Array.from({ length: columns }, () => []);
    services.data.forEach((service, index) => {
      result[index % columns].push(service);
    });
    return result;
  };

  const groupedServices = groupServices();

  return (
    <>
      <header className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        (!isHome || isScrolled || isServicesOpen) ? 'bg-[#4B2615] shadow-lg' : 'bg-transparent',
        isRTL ? 'text-right' : 'text-left'
      )}>
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between md:justify-center">
            {/* Logo */}
            <Link href="/" className={cn("text-white text-xl font-bold flex items-center md:absolute md:left-4", isRTL ? "order-last" : "order-first")}>
              <span>Abdulmalek Akel</span>
            </Link>

            {/* Desktop Navigation */}
            <nav className={cn("hidden md:flex items-center justify-center", isRTL ? "space-x-reverse space-x-8" : "space-x-5")}>
              <Link href="/" className="text-white hover:text-gray-300 transition-colors px-2">{t('nav.home')}</Link>
              <Link href="/search" className="text-white hover:text-gray-300 transition-colors px-2">{t('nav.about')}</Link>

              <div className="relative group services-dropdown px-2">
                <button onClick={toggleServices} className={cn("flex items-center text-white hover:text-gray-300 transition-colors", isRTL ? "flex-row-reverse" : "")}>
                  {t('nav.services')} <ChevronDown className={cn("h-4 w-4", isRTL ? "mr-1" : "ml-1")} />
                </button>

                {isServicesOpen && (
                  <div className="absolute top-full transform -translate-x-1/2 bg-[#4B2615] text-white w-[1000px] py-8 px-8 rounded-b shadow-lg left-1/2">
                    {isLoading ? (
                      <div className="flex flex-col items-center py-6">
                        <Loader2 className="h-8 w-8 animate-spin text-white" />
                        <p className="mt-4 text-gray-300">{t('services.loading')}</p>
                      </div>
                    ) : error ? (
                      <div className="text-center p-6">
                        <p className="text-gray-300">{t('services.error')}</p>
                      </div>
                    ) : (
                      <>
                        <div className="grid grid-cols-4 gap-8">
                          {groupedServices.map((column, colIndex) => (
                            <div key={colIndex} className="space-y-4">
                              {column.map((service) => (
                                <Link
                                  key={service.id}
                                  href={`/services/${service.Slug || service.id}`}
                                  className="block hover:text-gray-300 transition-colors"
                                >
                                  {service.Title}
                                </Link>
                              ))}
                            </div>
                          ))}
                        </div>

                        <div className="mt-6 text-center">
                          <Link href="/services" className="inline-block text-gray-300 hover:text-white transition-colors border border-gray-300 px-6 py-2 rounded">
                            {t('services.readMore')}
                          </Link>
                        </div>
                      </>
                    )}
                  </div>
                )}
              </div>

              <Link href="/team" className="text-white hover:text-gray-300 transition-colors px-2">{t('nav.team')}</Link>
              <Link href="/search" className="text-white hover:text-gray-300 transition-colors px-2">{t('nav.blog')}</Link>
              <Link href="/contact" className="text-white hover:text-gray-300 transition-colors px-2">{t('nav.contact')}</Link>
            </nav>

            {/* Right Menu */}
            <div className={cn("flex items-center gap-4 md:absolute md:right-4", isRTL ? "flex-row-reverse" : "flex-row", isRTL ? "order-first" : "order-last")}>
              <LanguageSwitcher />

              {!isSearchOpen && (
                <button onClick={toggleSearch} className="text-white hover:text-gray-300 transition-colors px-1" aria-label={t('search.label')}>
                  <Search className="h-5 w-5" />
                </button>
              )}

              {isSearchOpen && (
                <div className="w-[280px]">
                  <SearchBar onClose={toggleSearch} minimal />
                </div>
              )}

              <button onClick={openAppointmentModal} className="hidden md:inline-block text-white border border-white hover:bg-white hover:text-[#4B2615] transition-colors px-6 py-2 rounded">
                {t('nav.appointment')}
              </button>

              <button onClick={toggleMenu} className="md:hidden text-white hover:text-gray-300 transition-colors" aria-label={t('menu.toggle')}>
                {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <div className="md:hidden mt-4 py-4 px-2 bg-[#4B2615] rounded shadow-lg">
              <nav className="flex flex-col space-y-4">
                <Link href="/" className="text-white hover:text-gray-300" onClick={() => setIsMenuOpen(false)}>{t('nav.home')}</Link>
                <Link href="/search" className="text-white hover:text-gray-300" onClick={() => setIsMenuOpen(false)}>{t('nav.about')}</Link>

                <button onClick={toggleServices} className={cn("flex items-center justify-between text-white hover:text-gray-300", isRTL ? "flex-row-reverse" : "")}>
                  {t('nav.services')} <ChevronDown className="h-4 w-4" />
                </button>

                {isServicesOpen && (
                  <div className={cn("pl-4 space-y-2", isRTL ? "pr-4 pl-0" : "pl-4")}>
                    {isLoading ? (
                      <div className={cn("flex items-center py-2", isRTL ? "flex-row-reverse" : "")}>
                        <Loader2 className={cn("h-4 w-4 animate-spin text-white", isRTL ? "ml-2" : "mr-2")} />
                        <span className="text-gray-300">{t('services.loading')}</span>
                      </div>
                    ) : error ? (
                      <p className="text-gray-300">{t('services.error')}</p>
                    ) : (
                      <>
                        {services.data.slice(0, 5).map((service) => (
                          <Link
                            key={service.id}
                            href={`/services/${service.Slug || service.id}`}
                            className="block text-white hover:text-gray-300"
                            onClick={() => setIsMenuOpen(false)}
                          >
                            {service.Title}
                          </Link>
                        ))}
                        <Link href="/services" className="block text-gray-300 hover:text-white" onClick={() => setIsMenuOpen(false)}>
                          {t('services.readMore')}
                        </Link>
                      </>
                    )}
                  </div>
                )}

                <Link href="/team" className="text-white hover:text-gray-300" onClick={() => setIsMenuOpen(false)}>{t('nav.team')}</Link>
                <Link href="/search" className="text-white hover:text-gray-300" onClick={() => setIsMenuOpen(false)}>{t('nav.blog')}</Link>
                <Link href="/contact" className="text-white hover:text-gray-300" onClick={() => setIsMenuOpen(false)}>{t('nav.contact')}</Link>
                <button onClick={() => { setIsMenuOpen(false); openAppointmentModal(); }} className="bg-white text-[#4B2615] hover:bg-gray-200 px-4 py-2 rounded text-center">
                  {t('nav.appointment')}
                </button>
                <div className="pt-2"><LanguageSwitcher /></div>
              </nav>
            </div>
          )}
        </div>
      </header>

      <AppointmentModal />
    </>
  );
}
