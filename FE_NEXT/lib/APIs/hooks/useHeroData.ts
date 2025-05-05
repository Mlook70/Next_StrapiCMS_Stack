'use client';
import useSWR from 'swr';
import { useLocale } from 'next-intl';
import { HeroApiResponse } from '@/types';

const useHeroData = () => {
  const locale = useLocale();
  const apiUrl = `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/hero-slides?populate=*&locale=${locale}`;

  const fetcher = (url: string) => fetch(url).then(res => res.json());

  const { data, error, isLoading } = useSWR<HeroApiResponse>(apiUrl, fetcher, {
    revalidateOnFocus: false,
  });

  return {
    hero: data?.data[0] || null,
    error,
    isLoading,
  };
};

export default useHeroData;
