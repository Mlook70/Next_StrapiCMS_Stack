import '../globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ThemeProvider } from '@/contexts/ThemeContext';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import HeroSection from '@/components/sections/HeroSection';
import ReduxProvider from '@/providers/ReduxProvider';
import { notFound } from 'next/navigation';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, locales } from '@/i18n';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Al Saif & Partners - Legal & Consulting Services',
  description: 'Professional legal and consulting services for individuals and businesses',
};

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params: { locale }
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  // Validate that the incoming `locale` parameter is valid
  if (!locales.includes(locale as any)) {
    notFound();
  }

  // Load messages for the current locale
  const messages = await getMessages(locale);

  // Get the direction based on the locale
  const dir = locale === 'ar' ? 'rtl' : 'ltr';

  return (
    <html lang={locale} dir={dir}>
      <body className={inter.className}>
        <ReduxProvider>
          <NextIntlClientProvider locale={locale} messages={messages}>
            <ThemeProvider>
              <div className="flex min-h-screen flex-col">
                <Header />
                <main className="flex-grow bg-[#F3F3F3]">{children}</main>
                <Footer />
              </div>
            </ThemeProvider>
          </NextIntlClientProvider>
        </ReduxProvider>
      </body>
    </html>
  );
}