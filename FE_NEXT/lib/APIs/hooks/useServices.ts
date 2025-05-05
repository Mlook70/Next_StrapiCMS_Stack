'use client';

import useSWR from 'swr';
import { useLocale } from 'next-intl';
import { Service, ServicesResponse } from '@/types';

interface UseServicesOptions {
  query?: string;
  page?: number;
  pageSize?: number;
  isPaused?: boolean;
}

interface UseServicesReturn {
  services: ServicesResponse;
  error: any;
  isLoading: boolean;
}

const useServices = (options: UseServicesOptions = {}): UseServicesReturn => {
  const locale = useLocale();
  const { 
    query = '', 
    page = 1, 
    pageSize = 10,
    isPaused = false
  } = options;

  const filterQuery = query
    ? `&filters[$or][0][Title][$containsi]=${query}&filters[$or][1][Description][$containsi]=${query}`
    : '';

  const paginationQuery = `&pagination[page]=${page}&pagination[pageSize]=${pageSize}`;

  const apiUrl = `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/services?populate=*${filterQuery}${paginationQuery}&locale=${locale}`;

  const fetcher = (url: string) => fetch(url).then(res => res.json());

  const { data, error, isLoading } = useSWR<ServicesResponse>(
    isPaused ? null : apiUrl,
    fetcher,
    { revalidateOnFocus: false }
  );

  return {
    services: data || {
      data: [],
      meta: { pagination: { page: 1, pageSize: 10, pageCount: 1, total: 0 } },
    },
    error,
    isLoading,
  };
};

export default useServices;
