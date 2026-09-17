import { useCallback } from 'react';
import { ContactoSection } from './components/ContactoSection';
import { Header } from './components/Header';
import { HeroServicios } from './components/HeroServicios';
import { PlaceholderSections } from './components/PlaceholderSections';
import { ScrollTruckNav } from './components/ScrollTruckNav';
import { ServiciosSection } from './components/ServiciosSection';

function App() {
  const scrollToContact = useCallback((): void => {
    document.getElementById('contacto')?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  return <div id="inicio" className="min-h-screen bg-[#121874]">
    <ScrollTruckNav />
    <main>
      <div className="relative"><Header onContact={scrollToContact} /><HeroServicios /></div>
      <ServiciosSection />
      <PlaceholderSections />
      <ContactoSection />
    </main>
  </div>;
}

export default App;
