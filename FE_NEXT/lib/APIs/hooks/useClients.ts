'use client';

import { useLocale } from 'next-intl';
import useSWR from 'swr';
import { ClientsResponse } from '@/types';

const useClients = () => {
  const locale = useLocale();
  const apiUrl = `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/clients?populate=*&locale=${locale}`;

  const fetcher = (url: string) => fetch(url).then((res) => res.json());

  const { data, error, isLoading } = useSWR<ClientsResponse>(
    apiUrl,
    fetcher,
    { revalidateOnFocus: false }
  );

  return {
    clients: data?.data || [],
    error,
    isLoading,
  };
};

export default useClients;
