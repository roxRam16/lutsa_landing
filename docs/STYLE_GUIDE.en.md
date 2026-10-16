# Style and maintenance guide — LUTSA Transportes (frontend)

[🇪🇸 Español](GUIA_DE_ESTILO.md) · 🇺🇸 English

Rules so anyone can change or add content without breaking the design. If anything here stops being true,
**fix it here in the same change**.

## 1. Where things live

| What | Where |
|---|---|
| Texts (Spanish and English) | `src/i18n/translations.ts` — one key per section: `hero`, `about`, `services`, `industries`, `ecosystem`, `certifications`, `quote` |
| URLs and SEO per language | `src/i18n/routes.ts` |
| A page section | `src/components/<Name>Section.tsx` (+ its CSS in `src/styles/<name>.css`) |
| Pieces shared by several sections | `src/components/` (`DesktopLines.tsx`, `quote/…`) and `src/hooks/` (`useAutoFlip`, …) |
| **Brand colors** | `tailwind.config.js` → `theme.extend.colors.brand` (single source) |
| Common base (fonts, focus, buttons) | `src/index.css` |
| Images | `public/sectionNN/` (WebP; SVG for icons). Unused ones go to `archivo/` |
| Design references (not published) | `docs/referencias/` |

## 2. Code rules

1. **Section = component + its own CSS.** The section `id` matches `routes.ts` (`servicios`, `industrias`…).
2. **Classes named per element** (`section__element`: `svc__sign`, `ind__bar`, `cert__card`). Tailwind classes give the
   **mobile and tablet** design; the section CSS gives the **desktop (≥1280 px)** replica, so it lives inside
   `@media (min-width: 1280px)` and outside `@layer` (so it wins over Tailwind).
3. **Colors**: use `text-brand-navy`, `bg-brand-orange`… (TSX) or `theme('colors.brand.navy')` (CSS). Do not write loose
   hex values for brand colors. If a color is missing, **add it to `brand`** instead of hard-coding it.
4. **Desktop measurements**: always `calc(var(--u) * N)`, where `N` is the design's pixels and
   `--u = 100cqw / design width`. That way the section scales the same on any wide screen.
5. **Texts**: never inside the component; always in `translations.ts`, in `es` **and** `en`. Line lists
   (`['Conectamos', 'puertos']`) mark the desktop design's line breaks and are rendered with `<DesktopLines />`
   (on mobile and tablet the text just flows).
6. **A desktop change must not move mobile, and vice versa**: mobile/tablet-only tweaks use `max-sm:` or
   `below-xl:` (mobile + tablet, defined in `tailwind.config.js`).
7. Formatting: `.editorconfig` (UTF-8, 2 spaces). Comments in Spanish, short, explaining the *why*.

## 3. Responsive and accessibility (required in every new section)

| Rule | Value |
|---|---|
| Breakpoints | mobile < 640 · tablet 640–1279 · desktop ≥ 1280 (`xl`) · side km bar from 1024 (`lg`) |
| Reading text (paragraphs, lists) | **≥ 14 px** on mobile and tablet (≥ 16 px for long paragraphs) |
| Very short labels (km, counters) | ≥ 10 px, only when space does not allow more |
| Touch targets (buttons, links, fields) | **≥ 44 px** tall |
| Form fields | **16 px** text (prevents iPhone auto-zoom) and 48 px height |
| Content | centered, side margins ≥ 24 px, no horizontal scroll |
| Cards | 1 column on mobile (max 24 rem), 2 on tablet; padding ≥ 24 px |
| Images | descriptive `alt` (or `alt=""` if decorative), `width`/`height`, and `loading="lazy"` when below the fold |
| Motion | respect `prefers-reduced-motion` (the hooks already do) |
| Contrast | normal text ≥ 4.5 : 1 |
| Focus | visible with keyboard (global rule in `index.css`) |

## 4. How to add a section

1. Texts in `translations.ts` (`es` and `en`), new key.
2. `src/components/NameSection.tsx` with `<section id="…">`; the desktop block in `src/styles/name.css`.
3. Import the CSS in `src/main.tsx` **after** `index.css`.
4. Register the route and SEO in `routes.ts` (`SECTION_IDS`, `SLUGS`, `SEO`) and its stop in `ScrollTruckNav.tsx`.
5. Add it in `App.tsx`. Run `npm run check` and review at 390, 768 and 1920 px.

## 5. Checks before delivering

```bash
npm run check        # types (tsc) + same content in Spanish and English (scripts/check-i18n.mjs)
npm run build        # compiles, validates i18n and generates one page per route + sitemap
```

Visual review: open `npm run preview` and test 390 px (mobile), 768 px (tablet), 1024 px, 1536 px and 1920 px,
in Spanish and English, with no horizontal scroll and no clipped text.
