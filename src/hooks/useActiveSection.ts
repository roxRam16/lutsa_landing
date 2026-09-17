import { useEffect, useState } from 'react';

export function useActiveSection(sectionIds: string[]): string {
  const [activeSection, setActiveSection] = useState(sectionIds[0] ?? 'servicios');

  useEffect(() => {
    const sections = sectionIds.map((id: string) => document.getElementById(id)).filter(Boolean);
    const observer = new IntersectionObserver(
      (entries: IntersectionObserverEntry[]) => {
        const visible = entries.filter((entry) => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible[0]?.target.id) setActiveSection(visible[0].target.id);
      },
      { rootMargin: '-30% 0px -40% 0px', threshold: [0, 0.25, 0.5] },
    );
    sections.forEach((section: Element | null) => section && observer.observe(section));

    const handleScroll = () => {
      const scrollBottom = window.innerHeight + window.scrollY;
      const docHeight = document.documentElement.scrollHeight;
      if (scrollBottom >= docHeight - 80) {
        const lastId = sectionIds[sectionIds.length - 1];
        if (lastId) setActiveSection(lastId);
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      observer.disconnect();
      window.removeEventListener('scroll', handleScroll);
    };
  }, [sectionIds]);

  return activeSection;
}
