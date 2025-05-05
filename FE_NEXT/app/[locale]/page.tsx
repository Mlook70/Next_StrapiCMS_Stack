import HeroSection from '@/components/sections/HeroSection';
import ServicesSection from '@/components/sections/service/ServicesSection';
import TeamSection from '@/components/sections/TeamSection';
import ClientsSection from '@/components/sections/ClientsSection';

export default function Home() {
  return (
    <>
      <HeroSection />
      <ServicesSection />
      <TeamSection />
      <ClientsSection />
    </>
  );
}