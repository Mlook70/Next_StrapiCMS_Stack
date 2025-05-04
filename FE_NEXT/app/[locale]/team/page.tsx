import React from 'react';
import TeamSection from '@/components/sections/TeamSection';

export default function TeamPage() {
  return (
    <div className="pt-24 pb-16">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl md:text-4xl font-bold text-[#643F2E] mb-8">Our Team</h1>
        <TeamSection />
      </div>
    </div>
  );
};
