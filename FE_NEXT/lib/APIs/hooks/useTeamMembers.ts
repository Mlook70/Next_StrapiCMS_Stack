'use client';

import { useLocale } from 'next-intl';
import useSWR from 'swr';
import { TeamMembersResponse } from '@/types';

interface UseTeamMembersOptions {
  query?: string;
  page?: number;
  pageSize?: number;
  isPaused?: boolean;
}

interface UseTeamMembersReturn {
  teamMembers: TeamMembersResponse;
  error: any;
  isLoading: boolean;
}

const useTeamMembers = (options: UseTeamMembersOptions = {}): UseTeamMembersReturn => {
  const locale = useLocale();
  const {
    query = '',
    page = 1,
    pageSize = 10,
    isPaused = false,
  } = options;

  const filterQuery = query
    ? `&filters[$or][0][FirstName][$containsi]=${query}&filters[$or][1][LastName][$containsi]=${query}&filters[$or][2][Position][$containsi]=${query}`
    : '';

  const paginationQuery = `&pagination[page]=${page}&pagination[pageSize]=${pageSize}`;

  const apiUrl = `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/team-members?populate=*${filterQuery}${paginationQuery}&locale=${locale}`;

  const fetcher = (url: string) => fetch(url).then((res) => res.json());

  const { data, error, isLoading } = useSWR<TeamMembersResponse>(
    isPaused ? null : apiUrl,
    fetcher,
    { revalidateOnFocus: false }
  );

  return {
    teamMembers: data || {
      data: [],
      meta: {
        pagination: {
          page: 1,
          pageSize: 10,
          pageCount: 1,
          total: 0,
        },
      },
    },
    error,
    isLoading,
  };
};

export default useTeamMembers;
