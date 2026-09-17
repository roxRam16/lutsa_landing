# LUTSA Transportes

Landing page de una sola página para LUTSA Transportes, empresa de logística y transporte en Veracruz. El sitio presenta la propuesta de valor, infraestructura, operación, capacidades y tipos de remolque con una navegación visual por kilómetros.

## Stack

- React + TypeScript
- Vite
- Tailwind CSS
- Google Fonts: Exo 2 y Roboto Condensed

## Estructura de carpetas

```text
src/
├── components/
│   ├── CapacidadesRemolques.tsx
│   ├── ContactoSection.tsx
│   ├── Header.tsx
│   ├── HeroServicios.tsx
│   ├── InfraestructuraUbicacion.tsx
│   ├── OperacionFlujos.tsx
│   ├── PlaceholderSections.tsx
│   ├── ScrollTruckNav.tsx
│   ├── ServiciosSection.tsx
│   └── hooks/
├── hooks/
│   ├── useActiveSection.ts
│   └── useScrollProgress.ts
├── App.tsx
├── index.css
└── main.tsx
public/
└── seccion01/ (fondos, remolques e iconos sincronizados)
```

## Cómo correr el proyecto localmente

```bash
npm install
npm run dev
```

## Secciones construidas

- Header
- ScrollTruckNav
- Sección Servicios
- Infraestructura y ubicación
- Operación integral y flujos operativos
- Capacidades y tipos de remolques
- Anclas de navegación para las siguientes secciones
- Cotización y contacto
