'use client';

import React, { useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';
import useSWR from 'swr';
import { fetcher } from '@/lib/api';
import { cn } from '@/lib/utils';
import { TeamMember, Service, TeamMembersResponse, ServicesResponse } from '@/types';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { 
  setQuery, 
  setActiveTab, 
  setCurrentPage,
  nextPage,
  prevPage,
  selectQuery,
  selectActiveTab,
  selectCurrentPage,
  selectPageSize
} from '@/store/slices/searchSlice';

export default function SearchPage(): JSX.Element {
  const locale = useLocale();
  const isRTL = locale === 'ar';
  const t = useTranslations('search');
  const tServices = useTranslations('services');
  
  const searchParams = useSearchParams();
  const router = useRouter();
  const dispatch = useAppDispatch();
  
  // Get Redux state
  const query = useAppSelector(selectQuery);
  const activeTab = useAppSelector(selectActiveTab);
  const currentPage = useAppSelector(selectCurrentPage);
  const pageSize = useAppSelector(selectPageSize);
  
  // Sync query from URL to Redux state when component mounts or URL changes
  useEffect(() => {
    const urlQuery = searchParams.get('q') || '';
    dispatch(setQuery(urlQuery));
  }, [searchParams, dispatch]);
  

  // Fetch team members based on active tab
  const { 
    data: teamData, 
    error: teamError, 
    isLoading: teamLoading 
  } = useSWR<TeamMembersResponse>(
    `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/team-members?populate=*${query ? `&filters[$or][0][FirstName][$containsi]=${query}&filters[$or][1][LastName][$containsi]=${query}&filters[$or][2][Position][$containsi]=${query}` : ''}&pagination[page]=${currentPage}&pagination[pageSize]=${pageSize}&locale=${locale}`,
    fetcher,
    { 
      revalidateOnFocus: false,
      // Only fetch if tab is all or team
      isPaused: () => activeTab === 'services'
    }
  );

  // Fetch services based on active tab
  const { 
    data: serviceData, 
    error: serviceError, 
    isLoading: serviceLoading 
  } = useSWR<ServicesResponse>(
    `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/services?populate=*${query ? `&filters[$or][0][Title][$containsi]=${query}&filters[$or][1][Description][$containsi]=${query}` : ''}&pagination[page]=${currentPage}&pagination[pageSize]=${pageSize}&locale=${locale}`,
    fetcher,
    {
      revalidateOnFocus: false,
      // Only fetch if tab is all or services
      isPaused: () => activeTab === 'team'
    }
  );

  // Combined loading state based on active tab
  const isLoading = 
    (activeTab === 'all' && (teamLoading || serviceLoading)) || 
    (activeTab === 'team' && teamLoading) || 
    (activeTab === 'services' && serviceLoading);
  
  // Get the appropriate data based on active tab for pagination
  const getActiveData = () => {
    if (activeTab === 'team') return teamData;
    if (activeTab === 'services') return serviceData;
    
    // For 'all' tab, use the tab with more pages for pagination
    const teamPages = teamData?.meta.pagination.pageCount || 0;
    const servicePages = serviceData?.meta.pagination.pageCount || 0;
    return teamPages >= servicePages ? teamData : serviceData;
  };
  
  const activeData = getActiveData();
  const error = activeTab === 'team' ? teamError : activeTab === 'services' ? serviceError : (teamError || serviceError);

  // Pagination controls
  const totalPages = activeData?.meta.pagination.pageCount || 1;
  
  const handleNextPage = () => {
    dispatch(nextPage(totalPages));
  };
  
  const handlePrevPage = () => {
    dispatch(prevPage());
  };

  const handlePageClick = (page: number) => {
    dispatch(setCurrentPage(page));
  };

  // Generate page numbers for pagination
  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 3;
    
    if (totalPages <= maxVisiblePages) {
      // Show all pages if we have few pages
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always include first page
      pages.push(1);
      
      // Calculate middle pages
      let startPage = Math.max(2, currentPage - 1);
      let endPage = Math.min(totalPages - 1, currentPage + 1);
      
      // Adjust if we're at the beginning or end
      if (currentPage <= 2) {
        endPage = 3;
      } else if (currentPage >= totalPages - 1) {
        startPage = totalPages - 2;
      }
      
      // Add ellipsis if needed
      if (startPage > 2) {
        pages.push(null); // null represents ellipsis
      }
      
      // Add middle pages
      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }
      
      // Add ellipsis if needed
      if (endPage < totalPages - 1) {
        pages.push(null); // null represents ellipsis
      }
      
      // Always include last page
      if (totalPages > 1) {
        pages.push(totalPages);
      }
    }
    
    return pages;
  };

  // Check if there are results for each type
  const hasTeamResults = teamData?.data && teamData.data.length > 0;
  const hasServiceResults = serviceData?.data && serviceData.data.length > 0;
  
  // Determine if there are any results to show based on active tab
  const hasResults = 
    (activeTab === 'all' && (hasTeamResults || hasServiceResults)) ||
    (activeTab === 'team' && hasTeamResults) || 
    (activeTab === 'services' && hasServiceResults);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">

        {/* Results section */}
        <div className="mb-8 flex justify-between items-center">
          <div className={cn(
            "flex items-center",
            isRTL ? "flex-row-reverse" : "flex-row"
          )}>
            <Link href="/" className={cn(
              "flex items-center text-gray-500 hover:text-[#643F2E]",
              isRTL ? "ml-4 flex-row-reverse" : "mr-4"
            )}>
              <ChevronLeft className={cn(
                "h-4 w-4",
                isRTL ? "ml-1 rotate-180" : "mr-1"
              )} />
              {t('back')}
            </Link>
            {query ? (
              <p className="text-gray-600">
                {t('resultsFor')} "<span className="font-medium">{query}</span>"
              </p>
            ) : (
              <p className="text-gray-600">
                {t('allTeamsAndServices')}
              </p>
            )}
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-8 border-b border-gray-200">
          <div className={cn(
            "flex",
            isRTL ? "space-x-reverse space-x-8 justify-end" : "space-x-8"
          )}>
            <button
              onClick={() => dispatch(setActiveTab('all'))}
              className={cn(
                "py-4 font-medium text-sm focus:outline-none",
                activeTab === 'all' 
                  ? "border-b-2 border-[#643F2E] text-[#643F2E]" 
                  : "text-gray-500 hover:text-gray-700"
              )}
            >
              {t('all')}
            </button>
            <button
              onClick={() => dispatch(setActiveTab('team'))}
              className={cn(
                "py-4 font-medium text-sm focus:outline-none",
                activeTab === 'team' 
                  ? "border-b-2 border-[#643F2E] text-[#643F2E]" 
                  : "text-gray-500 hover:text-gray-700"
              )}
            >
              {t('team')}
            </button>
            <button
              onClick={() => dispatch(setActiveTab('services'))}
              className={cn(
                "py-4 font-medium text-sm focus:outline-none",
                activeTab === 'services' 
                  ? "border-b-2 border-[#643F2E] text-[#643F2E]" 
                  : "text-gray-500 hover:text-gray-700"
              )}
            >
              {t('services')}
            </button>
          </div>
        </div>

        {/* Loading state */}
        {isLoading && (
          <section className="py-20 min-h-[60vh] flex items-center justify-center">
            <div className="flex flex-col items-center">
              <Loader2 className="h-10 w-10 animate-spin text-[#643F2E]" />
              <p className="mt-4 text-gray-600">{t('loading')}</p>
            </div>
          </section>
        )}

        {/* Error state */}
        {error && !isLoading && (
          <div className="text-center py-16">
            <p className="text-red-500">{t('error')}</p>
          </div>
        )}

        {/* No results */}
        {!isLoading && !error && (
          ((activeTab === 'all' && !hasTeamResults && !hasServiceResults) ||
           (activeTab === 'team' && !hasTeamResults) ||
           (activeTab === 'services' && !hasServiceResults)) && (
            <div className="text-center py-16">
              <p className="text-gray-600">{query ? t('noResults') : t('noTeamsOrServices')}</p>
            </div>
          )
        )}

        {/* Team Members Results - Show for All and Team tabs */}
        {!isLoading && !error && ['all', 'team'].includes(activeTab) && hasTeamResults && (
          <>
            {activeTab === 'all' && (
              <h2 className={cn(
                "text-2xl font-semibold text-[#643F2E] mb-6 mt-8",
                isRTL ? "text-right" : "text-left"
              )}>
                {t('teamMembers')}
              </h2>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {teamData.data.map((member) => (
                <div key={member.id} className="bg-white rounded-lg shadow-sm overflow-hidden transition-transform hover:scale-105 duration-300">
                  <div className={cn(
                    "flex",
                    isRTL ? "flex-row-reverse" : "flex-row"
                  )}>
                    <div className="relative h-24 w-24 flex-shrink-0">
                      {member.Profile ? (
                        <Image
                          src={`${process.env.NEXT_PUBLIC_STRAPI_URL}${member.Profile.formats.thumbnail?.url}`}
                          alt={member.Profile.alternativeText || `${member.FirstName} ${member.LastName}`}
                          fill
                          className="object-cover"
                          sizes="96px"
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                          <div className="text-xl text-gray-500">
                            {member.FirstName?.[0]}{member.LastName?.[0]}
                          </div>
                        </div>
                      )}
                    </div>
                    <div className={cn(
                      "p-4",
                      isRTL ? "text-right" : "text-left"
                    )}>
                      <h3 className="text-lg font-semibold text-[#643F2E]">
                        {member.FirstName} {member.LastName}
                      </h3>
                      <p className="text-gray-500 text-sm">
                        {member.Position}
                      </p>
                      <div className={cn(
                        "flex mt-2",
                        isRTL ? "space-x-reverse space-x-3 justify-end" : "space-x-3"
                      )}>
                        {member.Email && (
                          <a
                            href={`mailto:${member.Email}`}
                            className="text-gray-400 hover:text-[#643F2E] transition-colors"
                            aria-label={`Email ${member.FirstName}`}
                          >
                            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" xmlns="http://www.w3.org/2000/svg">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                            </svg>
                          </a>
                        )}
                        {member.PhoneNumber && (
                          <a
                            href={`tel:${member.PhoneNumber}`}
                            className="text-gray-400 hover:text-[#643F2E] transition-colors"
                            aria-label={`Call ${member.FirstName}`}
                          >
                            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" xmlns="http://www.w3.org/2000/svg">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
                            </svg>
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Services Results - Show for All and Services tabs */}
        {!isLoading && !error && ['all', 'services'].includes(activeTab) && hasServiceResults && (
          <>
            {activeTab === 'all' && (
              <h2 className={cn(
                "text-2xl font-semibold text-[#643F2E] mb-6 mt-8",
                isRTL ? "text-right" : "text-left"
              )}>
                {t('services')}
              </h2>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {serviceData.data.map((service) => (
                <div
                  key={service.id}
                  className="bg-white rounded-lg shadow-md p-6 transition-transform hover:scale-105 duration-300"
                >
                  <h3 className={cn(
                    "text-xl font-semibold text-[#643F2E] mb-3",
                    isRTL ? "text-right" : "text-left"
                  )}>
                    {service.Title || 'Service'}
                  </h3>
                  <p className={cn(
                    "text-gray-600 mb-4 line-clamp-3",
                    isRTL ? "text-right" : "text-left"
                  )}>
                    {service.Description || 'No description available'}
                  </p>
                  <div className={cn(
                    "flex",
                    isRTL ? "justify-end" : "justify-start"
                  )}>
                    <Link
                      href={`/services/${service.Slug || service.id}`}
                      className={cn(
                        "text-[#643F2E] hover:text-[#4d2416] font-medium inline-flex items-center",
                        isRTL ? "flex-row-reverse" : "flex-row"
                      )}
                    >
                      {tServices('learnMore')}
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className={cn(
                          'h-4 w-4',
                          isRTL ? 'mr-1 rotate-180' : 'ml-1'
                        )}
                      >
                        <path d="M5 12h14" />
                        <path d="m12 5 7 7-7 7" />
                      </svg>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Pagination - Only show if there are results */}
        {!isLoading && !error && hasResults && (
          <div className="mt-12 flex justify-center">
            <div className="flex items-center space-x-1">
              <button
                onClick={handlePrevPage}
                disabled={currentPage === 1}
                className={cn(
                  "p-2 rounded",
                  currentPage === 1 
                    ? "text-gray-400 cursor-not-allowed" 
                    : "text-gray-600 hover:bg-gray-100"
                )}
                aria-label={isRTL ? t('nextPage') : t('prevPage')}
              >
                <ChevronLeft className={cn(
                  "h-5 w-5",
                  isRTL && "rotate-180"
                )} />
              </button>
              
              {getPageNumbers().map((page, index) => (
                page === null ? (
                  <span key={`ellipsis-${index}`} className="px-2 py-1 text-gray-400">...</span>
                ) : (
                  <button
                    key={`page-${page}`}
                    onClick={() => handlePageClick(page)}
                    className={cn(
                      "px-3 py-1 rounded",
                      currentPage === page
                        ? "bg-[#643F2E] text-white"
                        : "text-gray-600 hover:bg-gray-100"
                    )}
                  >
                    {page}
                  </button>
                )
              ))}
              
              <button
                onClick={handleNextPage}
                disabled={currentPage >= totalPages}
                className={cn(
                  "p-2 rounded",
                  currentPage >= totalPages
                    ? "text-gray-400 cursor-not-allowed"
                    : "text-gray-600 hover:bg-gray-100"
                )}
                aria-label={isRTL ? t('prevPage') : t('nextPage')}
              >
                <ChevronRight className={cn(
                  "h-5 w-5",
                  isRTL && "rotate-180"
                )} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}