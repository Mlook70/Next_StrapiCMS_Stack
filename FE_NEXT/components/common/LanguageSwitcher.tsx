// 3. Updated LanguageSwitcher Component (for more precise URL handling)
'use client';

import { useLocale, useTranslations } from 'next-intl';
import { useRouter, usePathname } from 'next/navigation';
import { locales } from '@/i18n';
import { useState } from 'react';
import { cn } from '@/lib/utils';

export default function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const t = useTranslations('navigation');
  const [isOpen, setIsOpen] = useState(false);
  const isRTL = locale === 'ar';

  const handleChangeLocale = (newLocale: string) => {
    // Get the path segments
    const segments = pathname.split('/').filter(Boolean);
    
    // The first segment should be the current locale
    if (segments.length > 0 && locales.includes(segments[0] as typeof locales[number])) {
      segments[0] = newLocale;
    } else {
      // If no locale found, just prepend the new locale
      segments.unshift(newLocale);
    }
    
    // Construct the new path
    const newPath = `/${segments.join('/')}`;
    
    router.replace(newPath);
    setIsOpen(false);
  };

  return (
    <div className="relative inline-block text-left">
      <div>
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="text-white hover:text-gray-300 transition-colors"
          id="language-menu"
          aria-expanded={isOpen}
          aria-haspopup="true"
        >
          {locale === 'en' ? 'EN' : 'AR'}
        </button>
      </div>

      {isOpen && (
        <div
          className={cn(
            "origin-top-right absolute mt-2 w-24 rounded-md shadow-lg bg-[#4B2615] ring-1 ring-black ring-opacity-5",
            isRTL ? "right-0" : "left-0"
          )}
          role="menu"
          aria-orientation="vertical"
          aria-labelledby="language-menu"
        >
          <div className="py-1" role="none">
            {locales.map((l) => (
              <button
                key={l}
                className={`${
                  locale === l ? 'bg-[#3a1d10] text-white' : 'text-gray-300'
                } block w-full text-left px-4 py-2 text-sm hover:bg-[#3a1d10]`}
                role="menuitem"
                onClick={() => handleChangeLocale(l)}
              >
                {l === 'en' ? 'English' : 'العربية'}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}