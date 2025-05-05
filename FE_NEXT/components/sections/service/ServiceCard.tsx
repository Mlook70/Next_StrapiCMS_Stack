'use client';

import React from 'react';
import Link from 'next/link';
import { Scale, Building, Gavel, Rocket } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Service } from '@/types';

interface ServiceCardProps {
  service: Service;
  isRTL: boolean;
  learnMoreText: string;
}

const ServiceCard: React.FC<ServiceCardProps> = ({ service, isRTL, learnMoreText }) => {
  const getIcon = (iconName: string): React.ReactNode => {
    switch (iconName) {
      case 'Scale': return <Scale className="h-8 w-8" />;
      case 'Building': return <Building className="h-8 w-8" />;
      case 'Gavel': return <Gavel className="h-8 w-8" />;
      case 'Rocket': return <Rocket className="h-8 w-8" />;
      default: return <Scale className="h-8 w-8" />;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 transition-transform hover:scale-105 duration-300">
      {service?.Icon && (
        <div className="text-[#643F2E] mb-4">
          {getIcon(service.Icon)}
        </div>
      )}
      <h3 className={cn(
        "text-xl font-semibold text-[#643F2E] mb-3",
        isRTL ? "text-right" : "text-left"
      )}>
        {service?.Title || 'Service'}
      </h3>
      <p className={cn(
        "text-gray-600 mb-4 line-clamp-3",
        isRTL ? "text-right" : "text-left"
      )}>
        {service?.Description || 'No description available'}
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
          {learnMoreText}
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
            className={cn('h-4 w-4', isRTL ? 'mr-1 rotate-180' : 'ml-1')}
          >
            <path d="M5 12h14" />
            <path d="m12 5 7 7-7 7" />
          </svg>
        </Link>
      </div>
    </div>
  );
};

export default ServiceCard;