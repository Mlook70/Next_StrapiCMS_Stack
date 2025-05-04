'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/contexts/LanguageContext';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

// Define the types for service content structure based on the Strapi API response
interface ServiceContent {
  type: string;
  text?: string;
  children?: ServiceContent[];
}

// Define the type for service content item in the new structure
interface ServiceContentItem {
  id?: number;
  documentId?: string;
  Title: string;
  Desc?: string;
  Content: ServiceContent[] | null;
  createdAt?: string;
  updatedAt?: string;
  publishedAt?: string;
}

// Define the type for service data supporting both old and new structures
interface Service {
  id: number;
  documentId: string;
  Title: string;
  Slug?: string;
  Description: string;
  Icon?: string;
  Concoction?: string;
  createdAt?: string;
  updatedAt?: string;
  publishedAt?: string;
  // Support both new and legacy data structures
  service_contents?: ServiceContentItem[];
  Content?: ServiceContent[];
}

interface ServiceDetailsProps {
  service: Service;
}

export default function ServiceDetailsPage({ service }: ServiceDetailsProps) {
  const router = useRouter();
  const { t, isRTL } = useLanguage();
  
  const hasServiceContents = service && Array.isArray(service.service_contents) && service.service_contents.length > 0;
  const hasLegacyContent = service && Array.isArray(service.Content) && service.Content.length > 0;
  
  // Handler for the back button
  const handleBack = () => {
    router.back();
  };

  // Helper function to render content based on its type
  const renderContent = (content: ServiceContent[] | undefined | null = [], level = 0) => {
    if (!content || !Array.isArray(content)) {
      return null;
    }
    
    return content.map((item, index) => {
      if (!item) return null;
      
      if (item.type === 'paragraph') {
        if (item.children && item.children.length > 0) {
          return (
            <div key={index} className="mb-6">
              {renderContent(item.children, level + 1)}
            </div>
          );
        }
        return <p key={index} className="mb-4 text-gray-700">{item.text || ''}</p>;
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
      {/* White overlay with opacity */}
      <div className="min-h-screen bg-white bg-opacity-98">
        <div className="container mx-auto px-6 py-10 max-w-4xl">
          {/* Back Button - Direction aware */}
          <div className="mb-10">
            <button 
              onClick={handleBack}
              className={cn(
                "flex items-center text-gray-600 hover:text-gray-900",
                isRTL ? "flex-row-reverse" : ""
              )}
            >
              {isRTL ? (
                <ArrowRight className={cn("h-5 w-5", isRTL ? "ml-1" : "mr-1")} />
              ) : (
                <ArrowLeft className={cn("h-5 w-5", isRTL ? "ml-1" : "mr-1")} />
              )}
              {t('services.back')}
            </button>
          </div>

          {/* Header */}
          <h1 className={cn(
            "text-2xl font-bold text-[#4B2615] mb-8",
            isRTL ? "text-right" : "text-left"
          )}>
            {service.Title}
          </h1>

          {/* Description */}
          <p className={cn(
            "text-[#1E1E1E] mb-10 leading-relaxed text-sm",
            isRTL ? "text-right" : "text-left"
          )}>
            {service.Description}
          </p>

          {/* Service Content Sections - New Structure */}
          {hasServiceContents && service.service_contents && (
            <div className="mb-12">
              {service.service_contents.map((contentItem, index) => (
                <div key={contentItem.id || index} className="mb-8">
                  <h2 className={cn(
                    "text-lg font-semibold text-[#4B2615] mb-4",
                    isRTL ? "text-right" : "text-left"
                  )}>
                    {contentItem.Title}
                  </h2>
                  
                  {/* Start the vertical line with Desc and Content */}
                  <div className="flex">
                    <div className="w-1 bg-[#D9D9D9]"></div>
                    <div className="bg-white p-6 w-full">
                      {/* Section Description with bullet point */}
                      {contentItem.Desc && (
                        <div className={cn(
                          "flex items-start mb-4",
                          isRTL ? "flex-row-reverse" : ""
                        )}>
                          <div className={cn("min-w-4", isRTL ? "ml-2" : "mr-2", "mt-1")}>
                            <div className="w-2 h-2 bg-[#4B2615] rounded-full"></div>
                          </div>
                          <p className={cn(
                            "text-[#1E1E1E] leading-relaxed text-sm",
                            isRTL ? "text-right" : "text-left"
                          )}>
                            {contentItem.Desc}
                          </p>
                        </div>
                      )}

                      {/* Section Content */}
                      {contentItem.Content && contentItem.Content.length > 0 && (
                        <>
                          {contentItem.Content.map((contentBlock, blockIndex) => (
                            <div 
                              key={blockIndex} 
                              className={cn(
                                "flex items-start mb-4 last:mb-0",
                                isRTL ? "flex-row-reverse" : ""
                              )}
                            >
                              <div className={cn(
                                "text-gray-700 text-sm",
                                isRTL ? "text-right" : "text-left"
                              )}>
                                {renderContent([contentBlock])}
                              </div>
                            </div>
                          ))}
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Legacy Content Structure */}
          {!hasServiceContents && hasLegacyContent && service.Content && (
            <div className="mb-12">
              {/* Content Sections */}
              {service.Content.map((section, index) => {
                // Check if this is a container section with children
                if (section.type === 'paragraph' && section.children && section.children.length > 0) {
                  // Find a title or heading in the children if it exists
                  const titleChild = section.children.find(child => 
                    child.type === 'text' && child.text && child.text.length < 100
                  );
                  
                  const title = titleChild?.text || `Section ${index + 1}`;
                  
                  return (
                    <div key={index} className="mb-8">
                      <h2 className={cn(
                        "text-md font-semibold text-[#4B2615] mb-4",
                        isRTL ? "text-right" : "text-left"
                      )}>
                        {title}
                      </h2>
                      <div className="flex">
                        <div className="w-1 bg-[#D9D9D9]"></div>
                        <div className="bg-white p-6 w-full">
                          <div className={cn(
                            "flex items-start",
                            isRTL ? "flex-row-reverse" : ""
                          )}>
                            <div className={cn("min-w-4", isRTL ? "ml-2" : "mr-2", "mt-1")}>
                              <div className="w-2 h-2 bg-[#4B2615] rounded-full"></div>
                            </div>
                            <div className={cn(
                              "text-gray-700 text-sm",
                              isRTL ? "text-right" : "text-left"
                            )}>
                              {renderContent(
                                titleChild 
                                  ? section.children.filter(child => child !== titleChild) 
                                  : section.children
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                }
                
                // Default rendering for any other content type
                return (
                  <div key={index} className="mb-8">
                    {renderContent([section])}
                  </div>
                );
              })}
            </div>
          )}

          {/* No Content Message */}
          {!hasServiceContents && !hasLegacyContent && (
            <p className={cn(
              "text-gray-700 mb-4",
              isRTL ? "text-right" : "text-left"
            )}>
              {t('services.noContent')}
            </p>
          )}

          {/* Conclusion */}
          {service.Concoction ? (
            <p className={cn(
              "text-gray-700 leading-relaxed text-sm mt-10",
              isRTL ? "text-right" : "text-left"
            )}>
              {service.Concoction}
            </p>
          ) : (
            <p className={cn(
              "text-gray-700 leading-relaxed text-sm mt-10",
              isRTL ? "text-right" : "text-left"
            )}>
              {t('services.conclusion')}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}