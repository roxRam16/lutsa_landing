# Guía de estilo y mantenimiento — LUTSA Transportes (frontend)

🇪🇸 Español · [🇺🇸 English](STYLE_GUIDE.en.md)

Reglas para que cualquier persona pueda cambiar o agregar contenido sin romper el diseño. Si algo de esta
guía deja de ser cierto, **se corrige aquí en el mismo cambio**.

## 1. Dónde vive cada cosa

| Qué | Dónde |
|---|---|
| Textos (español e inglés) | `src/i18n/translations.ts` — una clave por sección: `hero`, `about`, `services`, `industries`, `ecosystem`, `certifications`, `quote` |
| URLs y SEO por idioma | `src/i18n/routes.ts` |
| Una sección de la página | `src/components/<Nombre>Section.tsx` (+ su CSS en `src/styles/<nombre>.css`) |
| Piezas que usan varias secciones | `src/components/` (`DesktopLines.tsx`, `quote/…`) y `src/hooks/` (`useAutoFlip`, …) |
| **Colores de marca** | `tailwind.config.js` → `theme.extend.colors.brand` (única fuente) |
| Base común (fuentes, foco, botones) | `src/index.css` |
| Imágenes | `public/seccionNN/` (WebP; SVG para íconos). Las que no se usan van a `archivo/` |
| Referencias de diseño (no se publican) | `docs/referencias/` |

## 2. Reglas de código

1. **Sección = componente + CSS propio.** El `id` de la sección es el mismo de `routes.ts` (`servicios`, `industrias`…).
2. **Clases con nombre por elemento** (`sección__elemento`: `svc__sign`, `ind__bar`, `cert__card`). Las clases de
   Tailwind dan el diseño de **celular y tablet**; el CSS de la sección da la réplica de **escritorio (≥1280 px)**
   y por eso va dentro de `@media (min-width: 1280px)` y fuera de `@layer` (así gana a Tailwind).
3. **Colores**: usa `text-brand-navy`, `bg-brand-orange`… (TSX) o `theme('colors.brand.navy')` (CSS). No escribas
   hex sueltos para los colores de marca. Si falta un color, se **agrega a `brand`**, no se escribe en el componente.
4. **Medidas de escritorio**: siempre `calc(var(--u) * N)`, donde `N` son los píxeles del diseño y
   `--u = 100cqw / ancho del diseño`. Así la sección escala igual en cualquier pantalla ancha.
5. **Textos**: nunca dentro del componente; siempre en `translations.ts`, en `es` **y** en `en`. Las listas de líneas
   (`['Conectamos', 'puertos']`) marcan los saltos del diseño de escritorio y se pintan con `<DesktopLines />`
   (en celular y tablet el texto fluye solo).
6. **Un cambio en escritorio no debe mover el celular y al revés**: los ajustes solo para celular/tablet usan
   `max-sm:` o `below-xl:` (celular + tablet, definido en `tailwind.config.js`).
7. Formato: `.editorconfig` (UTF-8, 2 espacios). Comentarios en español, breves y del **porqué**.

## 3. Responsivo y accesibilidad (obligatorio en cada sección nueva)

| Regla | Valor |
|---|---|
| Puntos de quiebre | celular < 640 · tablet 640–1279 · escritorio ≥ 1280 (`xl`) · barra de km lateral desde 1024 (`lg`) |
| Texto de lectura (párrafos, listas) | **≥ 14 px** en celular y tablet (≥ 16 px en párrafos largos) |
| Etiquetas muy cortas (km, contador) | ≥ 10 px, solo si el espacio no permite más |
| Áreas táctiles (botones, enlaces, campos) | **≥ 44 px** de alto |
| Campos de formulario | texto de **16 px** (evita el zoom automático de iPhone) y alto 48 px |
| Contenido | centrado, con márgenes laterales ≥ 24 px, sin scroll horizontal |
| Tarjetas | 1 columna en celular (máx. 24 rem), 2 en tablet; relleno ≥ 24 px |
| Imágenes | `alt` descriptivo (o `alt=""` si son decorativas), `width`/`height` y `loading="lazy"` si están fuera de la primera pantalla |
| Movimiento | respetar `prefers-reduced-motion` (los hooks ya lo hacen) |
| Contraste | texto normal ≥ 4.5 : 1 |
| Foco | visible con teclado (regla global en `index.css`) |

## 4. Cómo agregar una sección

1. Textos en `translations.ts` (`es` y `en`), clave nueva.
2. `src/components/NombreSection.tsx` con `<section id="…">`; en `src/styles/nombre.css` el bloque de escritorio.
3. Importa el CSS en `src/main.tsx` **después** de `index.css`.
4. Registra la ruta y el SEO en `routes.ts` (`SECTION_IDS`, `SLUGS`, `SEO`) y su parada en `ScrollTruckNav.tsx`.
5. Súmala en `App.tsx`. Corre `npm run check` y revisa a 390, 768 y 1920 px.

## 5. Comprobaciones antes de entregar

```bash
npm run check        # tipos (tsc) + mismo contenido en español e inglés (scripts/check-i18n.mjs)
npm run build        # compila, valida i18n y genera una página por ruta + sitemap
```

Revisión visual: abrir `npm run preview` y probar 390 px (celular), 768 px (tablet), 1024 px, 1536 px y 1920 px,
en español e inglés, sin scroll horizontal y sin texto cortado.
