'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Facebook, Twitter, Linkedin } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';
import { cn } from '@/lib/utils';

export default function Footer() {
  const locale = useLocale();
  const isRTL = locale === 'ar';
  const t = useTranslations('footer');

  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const currentYear = new Date().getFullYear();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setErrorMessage(t('email.error'));
      return;
    }

    setSubmitted(true);
    setErrorMessage('');
    setEmail('');

    setTimeout(() => setSubmitted(false), 3000);
  };

  return (
    <footer className={cn('bg-[#4B2615] text-white text-sm', isRTL ? 'text-right' : 'text-left')}>
      {/* Top grid layout */}
      <div className="container mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-10">
        {/* Column 1 — Logo and description */}
        <div>
          <h2 className="font-bold text-lg mb-2">company logo</h2>
          <p className="text-gray-300">{t('companyDescription')}</p>
        </div>

        {/* Column 2 — Quick Links */}
        <div>
          <h3 className="font-semibold text-base mb-3">{t('quickLinks')}</h3>
          <ul className="space-y-1 text-gray-300">
            <li><Link href="/about">{t('about')}</Link></li>
            <li><Link href="/strategy">{t('strategy')}</Link></li>
            <li><Link href="/advantages">{t('advantages')}</Link></li>
            <li><Link href="/social-responsibility">{t('social')}</Link></li>
            <li><Link href="/services">{t('services')}</Link></li>
          </ul>
        </div>

        {/* Column 3 — Contact Info */}
        <div>
          <h3 className="font-semibold text-base mb-3">{t('contactUs')}</h3>
          <ul className="text-gray-300 space-y-1">
            <li>Business Avenue 123</li>
            <li>Dubai, United Arab Emirates</li>
            <li>{t('phone')}: +971 4 123 4567</li>
            <li>{t('email.label')}: info@alsaifpartners.com</li>
          </ul>
        </div>

        {/* Column 4 — Newsletter + Social */}
        <div className="flex flex-col gap-4">
          <form onSubmit={handleSubmit} className="flex">
            <input
              type="email"
              placeholder={t('email.placeholder')}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-white text-[#4B2615] text-sm px-4 py-2 rounded-l w-full placeholder-gray-500"
            />
            <button
              type="submit"
              className="bg-[#321710] hover:bg-[#29140e] text-white text-sm px-4 py-2 rounded-r"
            >
              {t('subscribeButton')}
            </button>
          </form>

          {errorMessage && <p className="text-red-400 text-xs">{errorMessage}</p>}
          {submitted && <p className="text-green-400 text-xs">{t('subscribeSuccess')}</p>}

          <div className="flex gap-4 items-center text-gray-300">
            <span>{t('contacts')}</span>
            <a href="#"><Facebook className="h-5 w-5" /></a>
            <a href="#"><Twitter className="h-5 w-5" /></a>
            <a href="#"><Linkedin className="h-5 w-5" /></a>
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-[#5a3a2c]" />

      {/* Bottom row: Left copyright – Right form + icons (Figma accurate) */}
      <div className="container mx-auto px-4 py-6 flex flex-col md:flex-row items-center justify-between gap-6">
        {/* Left: Copyright */}
        <div className="text-gray-400 text-sm">
          &copy; {currentYear} {t('copyright')}
        </div>

        {/* Right: Legal Links */}
        <div className="flex gap-6 text-sm text-gray-300">
          <Link href="/terms">{t('terms')}</Link>
          <Link href="/privacy">{t('privacy')}</Link>
          <Link href="/cookies">{t('cookies')}</Link>
        </div>
      </div>
    </footer>
  );
}
