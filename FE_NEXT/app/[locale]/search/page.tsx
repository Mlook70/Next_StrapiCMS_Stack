'use client';

import React, { useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';
import { cn } from '@/lib/utils';
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
import ServiceCard from '@/components/sections/service/ServiceCard';
import useServices from '@/lib/APIs/hooks/useServices';
import useTeamMembers from '@/lib/APIs/hooks/useTeamMembers';

export default function SearchPage(): JSX.Element {
  const locale = useLocale();
  const isRTL = locale === 'ar';
  const t = useTranslations('search');
  const tServices = useTranslations('services');
  
  const searchParams = useSearchParams();
  const router = useRouter();
  const dispatch = useAppDispatch();
  
  const query = useAppSelector(selectQuery);
  const activeTab = useAppSelector(selectActiveTab);
  const currentPage = useAppSelector(selectCurrentPage);
  const pageSize = useAppSelector(selectPageSize);

  useEffect(() => {
    const urlQuery = searchParams.get('q') || '';
    dispatch(setQuery(urlQuery));
  }, [searchParams, dispatch]);

  const {
    services: serviceData,
    error: serviceError,
    isLoading: serviceLoading
  } = useServices({
    query,
    page: currentPage,
    pageSize,
    isPaused: activeTab === 'team'
  });

  const {
    teamMembers: teamData,
    error: teamError,
    isLoading: teamLoading
  } = useTeamMembers({
    query,
    page: currentPage,
    pageSize,
    isPaused: activeTab === 'services'
  });

  const isLoading = 
    (activeTab === 'all' && (teamLoading || serviceLoading)) || 
    (activeTab === 'team' && teamLoading) || 
    (activeTab === 'services' && serviceLoading);

  const getActiveData = () => {
    if (activeTab === 'team') return teamData;
    if (activeTab === 'services') return serviceData;
    const teamPages = teamData?.meta.pagination.pageCount || 0;
    const servicePages = serviceData?.meta?.pagination?.pageCount || 0;
    return teamPages >= servicePages ? teamData : serviceData;
  };

  const activeData = getActiveData();
  const error = activeTab === 'team' ? teamError : activeTab === 'services' ? serviceError : (teamError || serviceError);
  const totalPages = activeData?.meta?.pagination?.pageCount || 1;

  const handleNextPage = () => dispatch(nextPage(totalPages));
  const handlePrevPage = () => dispatch(prevPage());
  const handlePageClick = (page: number) => dispatch(setCurrentPage(page));

  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 3;
    
    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      let startPage = Math.max(2, currentPage - 1);
      let endPage = Math.min(totalPages - 1, currentPage + 1);
      if (currentPage <= 2) endPage = 3;
      else if (currentPage >= totalPages - 1) startPage = totalPages - 2;
      if (startPage > 2) pages.push(null);
      for (let i = startPage; i <= endPage; i++) pages.push(i);
      if (endPage < totalPages - 1) pages.push(null);
      if (totalPages > 1) pages.push(totalPages);
    }

    return pages;
  };

  const hasTeamResults = teamData?.data && teamData.data.length > 0;
  const hasServiceResults = serviceData?.data && serviceData.data.length > 0;
  const hasResults = 
    (activeTab === 'all' && (hasTeamResults || hasServiceResults)) ||
    (activeTab === 'team' && hasTeamResults) || 
    (activeTab === 'services' && hasServiceResults);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-12" dir={isRTL ? 'rtl' : 'ltr'}>
        <div className="mb-8 flex justify-between items-center">
          <div>
            <button
              onClick={() => router.back()}
              className="flex items-center text-[#4B2615] mt-20 hover:text-[#643F2E] focus:outline-none"
            >
              {isRTL ? (
                <ChevronRight className="h-4 w-4 ml-1" />
              ) : (
                <ChevronLeft className="h-4 w-4 mr-1" />
              )}
              {t('back')}
            </button>
            {query ? (
              <p className="text-gray-600 mt-2">
                {t('resultsFor')} "<span className="font-medium">{query}</span>"
              </p>
            ) : (
              <p className="text-gray-600 mt-2">{t('allTeamsAndServices')}</p>
            )}
          </div>
        </div>

        <div className="mb-8 border-b border-gray-200">
          <div className={cn("flex", isRTL ? "space-x-reverse space-x-8" : "space-x-8")}>
            <button
              onClick={() => dispatch(setActiveTab('all'))}
              className={cn(
                "py-4 font-medium text-sm focus:outline-none",
                activeTab === 'all' ? "border-b-2 border-[#643F2E] text-[#643F2E]" : "text-gray-500 hover:text-gray-700"
              )}
            >
              {t('all')}
            </button>
            <button
              onClick={() => dispatch(setActiveTab('team'))}
              className={cn(
                "py-4 font-medium text-sm focus:outline-none",
                activeTab === 'team' ? "border-b-2 border-[#643F2E] text-[#643F2E]" : "text-gray-500 hover:text-gray-700"
              )}
            >
              {t('team')}
            </button>
            <button
              onClick={() => dispatch(setActiveTab('services'))}
              className={cn(
                "py-4 font-medium text-sm focus:outline-none",
                activeTab === 'services' ? "border-b-2 border-[#643F2E] text-[#643F2E]" : "text-gray-500 hover:text-gray-700"
              )}
            >
              {t('services')}
            </button>
          </div>
        </div>

        {isLoading && (
          <section className="py-20 min-h-[60vh] flex items-center justify-center">
            <div className="flex flex-col items-center">
              <Loader2 className="h-10 w-10 animate-spin text-[#643F2E]" />
              <p className="mt-4 text-gray-600">{t('loading')}</p>
            </div>
          </section>
        )}

        {error && !isLoading && (
          <div className="text-center py-16">
            <p className="text-red-500">{t('error')}</p>
          </div>
        )}

        {!isLoading && !error && (
          ((activeTab === 'all' && !hasTeamResults && !hasServiceResults) ||
           (activeTab === 'team' && !hasTeamResults) ||
           (activeTab === 'services' && !hasServiceResults)) && (
            <div className="text-center py-16">
              <p className="text-gray-600">{query ? t('noResults') : t('noTeamsOrServices')}</p>
            </div>
          )
        )}

        {!isLoading && !error && ['all', 'team'].includes(activeTab) && hasTeamResults && (
          <>
            {activeTab === 'all' && (
              <h2 className="text-2xl font-semibold text-[#643F2E] mb-6 mt-8">{t('teamMembers')}</h2>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {teamData.data.map((member) => (
                <div key={member.id} className="bg-white rounded-lg shadow-sm overflow-hidden transition-transform hover:scale-105 duration-300">
                  <div className="flex">
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
                    <div className="p-4">
                      <h3 className="text-lg font-semibold text-[#643F2E]">
                        {member.FirstName} {member.LastName}
                      </h3>
                      <p className="text-gray-500 text-sm">{member.Position}</p>
                      <div className="flex mt-2 space-x-3">
                        {member.Email && (
                          <a href={`mailto:${member.Email}`} className="text-gray-400 hover:text-[#643F2E]" aria-label={`Email ${member.FirstName}`}>
                            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                          </a>
                        )}
                        {member.PhoneNumber && (
                          <a href={`tel:${member.PhoneNumber}`} className="text-gray-400 hover:text-[#643F2E]" aria-label={`Call ${member.FirstName}`}>
                            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
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

        {!isLoading && !error && ['all', 'services'].includes(activeTab) && hasServiceResults && (
          <>
            {activeTab === 'all' && (
              <h2 className="text-2xl font-semibold text-[#643F2E] mb-6 mt-8">{t('services')}</h2>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {serviceData.data.map((service) => (
                <ServiceCard 
                  key={service.id} 
                  service={service} 
                  isRTL={isRTL} 
                  learnMoreText={tServices('learnMore')} 
                />
              ))}
            </div>
          </>
        )}

        {!isLoading && !error && hasResults && (
          <div className="mt-12 flex justify-center">
            <div className="flex items-center space-x-1">
              <button
                onClick={handlePrevPage}
                disabled={currentPage === 1}
                className={cn(
                  "p-2 rounded",
                  currentPage === 1 ? "text-gray-400 cursor-not-allowed" : "text-gray-600 hover:bg-gray-100"
                )}
                aria-label={t('prevPage')}
              >
                {isRTL ? <ChevronRight className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
              </button>

              {getPageNumbers().map((page, index) =>
                page === null ? (
                  <span key={`ellipsis-${index}`} className="px-2 py-1 text-gray-400">...</span>
                ) : (
                  <button
                    key={`page-${page}`}
                    onClick={() => handlePageClick(page)}
                    className={cn(
                      "px-3 py-1 rounded",
                      currentPage === page ? "bg-[#643F2E] text-white" : "text-gray-600 hover:bg-gray-100"
                    )}
                  >
                    {page}
                  </button>
                )
              )}

              <button
                onClick={handleNextPage}
                disabled={currentPage >= totalPages}
                className={cn(
                  "p-2 rounded",
                  currentPage >= totalPages ? "text-gray-400 cursor-not-allowed" : "text-gray-600 hover:bg-gray-100"
                )}
                aria-label={t('nextPage')}
              >
                {isRTL ? <ChevronLeft className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
