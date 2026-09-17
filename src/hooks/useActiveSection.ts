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
      { rootMargin: '-35% 0px -45% 0px', threshold: [0.1, 0.35, 0.6] },
    );
    sections.forEach((section: Element | null) => section && observer.observe(section));
    return () => observer.disconnect();
  }, [sectionIds]);

  return activeSection;
}
