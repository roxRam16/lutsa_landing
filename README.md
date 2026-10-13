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

## Formulario de cotización y backend (`lutsa_core/`)

El formulario de la sección **70 KM · Cotización y contacto** se envía al API **LUTSA-CORE**
(FastAPI + MongoDB), que vive en [`lutsa_core/`](lutsa_core/README.md) dentro de este mismo repo.

```bash
# 1) Backend (otra terminal): API en http://localhost:8090 (Swagger en /docs)
cd lutsa_core
venv\Scripts\activate
docker compose up -d mongo        # MongoDB en el puerto 27037
python app.py

# 2) Landing
copy .env.example .env            # VITE_API_URL y VITE_RECAPTCHA_SITE_KEY
npm run dev
```

- **Validación** en el navegador (y de nuevo en el API): obligatorios nombre, correo, industria, servicio y
  tipo de operación; nombre/empresa/página web ≤ 150 caracteres, comentarios ≤ 500; se limpian `< >` y
  caracteres invisibles.
- **No soy un robot:** Google reCAPTCHA v2. Por defecto usa la clave de prueba de Google.
- **Éxito (200/201/204):** mensaje debajo del formulario y el formulario se limpia.
- **Producción:** define `VITE_API_URL` (URL pública del API) y `VITE_RECAPTCHA_SITE_KEY` **antes** de
  `npm run build`: se incrustan en el build.

## Secciones construidas

- Header
- ScrollTruckNav
- Sección Servicios
- Infraestructura y ubicación
- Operación integral y flujos operativos
- Capacidades y tipos de remolques
- Anclas de navegación para las siguientes secciones
- Cotización y contacto
