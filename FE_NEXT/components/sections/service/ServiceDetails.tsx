"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTranslations } from 'next-intl';

interface ServiceContent {
  type: string;
  text?: string;
  children?: ServiceContent[];
}

interface ServiceContentItem {
  id?: number;
  documentId?: string;
  Title: string;
  Desc?: string;
  Content: ServiceContent[] | null;
}

interface Service {
  id: number;
  documentId: string;
  Title: string;
  Slug?: string;
  Description: string;
  Icon?: string;
  Concoction?: string;
  service_contents?: ServiceContentItem[];
  Content?: ServiceContent[];
}

interface ServiceDetailsProps {
  service: Service;
}

export default function ServiceDetailsPage({ service }: ServiceDetailsProps) {
  const router = useRouter();
  const t = useTranslations();

  const hasServiceContents = Array.isArray(service.service_contents) && service.service_contents.length > 0;
  const hasLegacyContent = Array.isArray(service.Content) && service.Content.length > 0;

  const handleBack = () => router.back();

  const renderContent = (content: ServiceContent[] | undefined | null = [], level = 0) => {
    if (!content || !Array.isArray(content)) return null;

    return content.map((item, index) => {
      if (!item) return null;

      if (item.type === 'paragraph') {
        return (
          <div key={index} className="mb-6">
            {renderContent(item.children, level + 1)}
          </div>
        );
      }

      if (item.type === 'text') {
        return <span key={index}>{item.text || ''}</span>;
      }

      return null;
    });
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center"
      style={{
        backgroundImage: 'url(/services-bg.png)',
        backgroundSize: '100%',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'top center',
      }}
    >
      <div className="min-h-screen bg-white bg-opacity-98">
        <div className="container mx-auto px-6 py-10 max-w-4xl">
          <div>
            <div className="mb-10">
              <button
                onClick={handleBack}
                className="flex items-center text-gray-600 hover:text-gray-900"
              >
                <ArrowLeft className="h-5 w-5 mr-1" />
                {t('services.back')}
              </button>
            </div>

            <h1 className="text-2xl font-bold text-[#4B2615] mb-8">
              {service.Title}
            </h1>

            <p className="text-[#1E1E1E] mb-10 leading-relaxed text-sm">
              {service.Description}
            </p>

            {hasServiceContents && (
              <div className="mb-12">
                {service.service_contents!.map((contentItem, index) => (
                  <div key={contentItem.id || index} className="mb-8">
                    <h2 className="text-lg font-semibold text-[#4B2615] mb-4">
                      {contentItem.Title}
                    </h2>
                    <div className="flex">
                      <div className="w-1 bg-[#D9D9D9] mr-6" />
                      <div className="bg-white p-6 w-full">
                        {contentItem.Desc && (
                          <div className="flex flex-row items-start mb-4">
                            <div className="ml-2 mt-1">
                              <div className="w-2 h-2 bg-[#4B2615] rounded-full"></div>
                            </div>
                            <p className="text-[#1E1E1E] leading-relaxed text-sm">
                              {contentItem.Desc}
                            </p>
                          </div>
                        )}
                        {contentItem.Content?.length && (
                          contentItem.Content.map((contentBlock, blockIndex) => (
                            <div
                              key={blockIndex}
                              className="flex flex-row items-start mb-4 last:mb-0"
                            >
                              <div className="text-gray-700 text-sm">
                                {renderContent([contentBlock])}
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
            {!hasServiceContents && hasLegacyContent && (
              <div className="mb-12">
                {service.Content!.map((section, index) => {
                  const titleChild = section.children?.find(
                    child => child.type === 'text' && child.text && child.text.length < 100
                  );

                  const title = titleChild?.text || `Section ${index + 1}`;

                  return (
                    <div key={index} className="mb-8">
                      <h2 className="text-md font-semibold text-[#4B2615] mb-4">
                        {title}
                      </h2>
                      <div className="flex">
                        <div className="w-1 bg-[#D9D9D9] mr-6" />
                        <div className="bg-white p-6 w-full">
                          <div className="flex flex-row items-start">
                            <div className="ml-2 mt-1">
                              <div className="w-2 h-2 bg-[#4B2615] rounded-full"></div>
                            </div>
                            <div className="text-gray-700 text-sm">
                              {renderContent(
                                titleChild
                                  ? section.children?.filter(child => child !== titleChild)
                                  : section.children
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
            {!hasServiceContents && !hasLegacyContent && (
              <p className="text-gray-700 mb-4">
                {t('services.noContent')}
              </p>
            )}
            <p className="text-gray-700 leading-relaxed text-sm mt-10">
              {service.Concoction || t('services.conclusion')}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
