// i18n.ts
import {getRequestConfig} from 'next-intl/server';

export const locales = ['en', 'ar'] as const;
export type Locale = (typeof locales)[number];

// This is the default locale used when no locale matches
export const defaultLocale: Locale = 'en';

// Helper function to get messages for a locale with error handling
export async function getMessages(locale: string) {
  // If locale is undefined, use the default locale
  const validLocale = locale || defaultLocale;
  
  try {
    // Check if the locale is valid
    if (!locales.includes(validLocale as Locale)) {
      console.warn(`Locale ${validLocale} is not supported, falling back to ${defaultLocale}`);
      return (await import(`./messages/${defaultLocale}.json`)).default;
    }
    
    // Try to import the messages for the locale
    return (await import(`./messages/${validLocale}.json`)).default;
  } catch (error) {
    console.error(`Error loading messages for locale ${validLocale}:`, error);
    
    // Fallback to default locale if there's an error
    try {
      return (await import(`./messages/${defaultLocale}.json`)).default;
    } catch (fallbackError) {
      console.error(`Error loading fallback messages:`, fallbackError);
      // Return empty object as a last resort
      return {};
    }
  }
}

export default getRequestConfig(async ({locale}) => {
  // Ensure locale is defined before passing it to getMessages
  const resolvedLocale = locale || defaultLocale;
  
  // Load messages for the requested locale
  const messages = await getMessages(resolvedLocale);
  
  return {
    messages,
    locale: resolvedLocale // Explicitly return the resolved locale
  };
});