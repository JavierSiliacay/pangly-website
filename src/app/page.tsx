// src/app/page.tsx
import { Navbar } from '@/components/Navbar';
import { Hero } from '@/components/Hero';
import { InteractiveDemo } from '@/components/InteractiveDemo';
import { FeatureTour } from '@/components/FeatureTour';
import { SecurityComparison } from '@/components/SecurityComparison';
import { SideloadGuide } from '@/components/SideloadGuide';
import { FaqSection } from '@/components/FaqSection';
import { Footer } from '@/components/Footer';
import { getSlotStatus } from '@/lib/slotStorage';

export const dynamic = 'force-dynamic';

export default async function Home() {
  const slotStatus = getSlotStatus();

  return (
    <main style={{ minHeight: '100vh', backgroundColor: '#F5F1EB', color: '#292524' }}>
      <Navbar initialSlots={slotStatus.totalClaimed} />
      <Hero initialSlots={slotStatus.totalClaimed} />
      <InteractiveDemo />
      <FeatureTour />
      <SecurityComparison />
      <SideloadGuide />
      <FaqSection />
      <Footer />
    </main>
  );
}
