import { useEffect, useState } from 'react';

export function useActiveSection(sectionIds: string[]): string {
  const [activeSection, setActiveSection] = useState(sectionIds[0] ?? 'servicios');

  useEffect(() => {
    const handler = () => {
      const scrollPos = window.scrollY + window.innerHeight * 0.4;
      const docHeight = document.documentElement.scrollHeight;
      const scrollBottom = window.innerHeight + window.scrollY;

      // Si llegamos al final de la página, activar la última sección
      if (scrollBottom >= docHeight - 80) {
        const lastId = sectionIds[sectionIds.length - 1];
        if (lastId) {
          setActiveSection(lastId);
          return;
        }
      }

      // Encontrar la sección cuya parte superior está más cerca por encima del punto de detección
      let current = sectionIds[0];
      for (const id of sectionIds) {
        const el = document.getElementById(id);
        if (!el) continue;
        const top = el.getBoundingClientRect().top + window.scrollY;
        if (top <= scrollPos) {
          current = id;
        } else {
          break;
        }
      }
      setActiveSection(current);
    };

    handler();
    window.addEventListener('scroll', handler, { passive: true });
    window.addEventListener('resize', handler);
    return () => {
      window.removeEventListener('scroll', handler);
      window.removeEventListener('resize', handler);
    };
  }, [sectionIds]);

  return activeSection;
}
