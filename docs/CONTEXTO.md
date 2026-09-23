# Contexto del proyecto — Invitación de Luana y Joan

Documento de referencia con todo el contexto de la web de invitación de boda de **Luana y Joan** (boda: sábado 19 de junio de 2027, Santa Susanna, Barcelona). Este documento es la fuente de verdad sobre el proyecto; `AGENTS.md` lo enlaza y resume lo esencial para trabajar con IA.

## 1. Resumen

- Web de **una sola página** con fondo blanco en toda la web.
- Multilingüe: **català (ca), castellano (es) e inglés (en)**. El idioma se elige al primer acceso (capa a pantalla completa) y se cambia desde la navbar o el footer; la elección se guarda en `localStorage`.
- Todo el contenido técnico (textos de código, comentarios, commits, docs) está en **español**; los textos visibles para el usuario viven en `TRANSLATIONS`.
- Confirmación de asistencia (RSVP) vía **formulario de Google Forms** (`RSVP_FORM_URL`).

## 2. Estado actual de las secciones

El sitio se compone (en orden, con su `zIndex`, contador global único 1..6):

| # | zIndex | Sección | Tipo | Contenido |
|---|--------|---------|------|-----------|
| 1 | 1 | `#inicio` (hero) | `StackSection` | Foto de portada estática + LUANA & JOAN + fecha + lugar + botón RSVP |
| 2 | 2 | `#cuenta-atras` | `StackSection` | Cuenta atrás hacia el `WEDDING_DATE` |
| 3 | 3 | `#boda` | `SlideSection` | Dos tarjetas: viernes (Almuerzo Rome Hielos) y sábado (ceremonia y banquete). Sin fotos |
| 4 | 4 | `#barcelona` | `SlideSection` | Guía de invitados (cómo llegar, dormir, comer, visitar, playas, cosas, consejos) |
| 5 | 5 | `#regalos` | `StackSection` | Texto + IBAN/Bizum + **placeholder QR** (`#qr-regalos`) |
| 6 | 6 | `#galeria` | `SlideSection` | Solamente un **placeholder QR** centrado (`#qr-galeria`) |

Fuera del stack (no se apila): `<footer>` con logo "LJ", enlaces, selector de idioma y contactos.

> **Eliminadas en esta fase:** la sección de Preguntas (FAQ, era zIndex 7) y la tarjeta final RSVP "Una última cosa / Confirmar asistencia" (era zIndex 8). La galería ya no tiene fotos. Regalos ya no tiene fotos; solo texto, datos bancarios y espacio para QR.

### Decisiones recientes (pueden invertirse si se pide)

- **Logo navbar**: texto `L J` (con espacio no separable) con la fuente **Liontinela Realise**, sin círculo ni borde, tamaño 18px.
- **Logo footer**: `LJ` con **Liontinela Realise**.
- **"Dos días para celebrarlo"** (script de La Boda) usa la clase `section__script--liona` → **Liontinela Realise**.
- **Rome Hielos** se trata como **nombre propio**: no se traduce ni se sustituye (es: "Almuerzo Rome Hielos", ca: "Dinar Rome Hielos", en: "Lunch Rome Hielos").
- **Favicon**: `icono de la pestana redondeado.png` (en `src/assets`, generado con esquinas redondeadas y transparencia, ~108px de radio sobre 712×434). Se referenció en `index.html`. Se eliminó `src/assets/vite.svg`.

## 3. Stack

- React 19 + TypeScript (Vite).
- `lucide-react` para iconos — actualmente importados: `Calendar`, `Gift`, `Camera`, `Plane` (se eliminó `HelpCircle` con la sección FAQ).
- CSS plano (sin preprocesador ni CSS modules): `src/App.css` (estilos de la app) y `src/index.css` (base/plantilla original).
- Sin framework de test en el proyecto.

## 4. Fuentes tipográficas

- No se instala ni descarga nada al repositorio. Las fuentes se cargan vía `@import` en las primeras líneas de `App.css`.
- Google Fonts (familias base): `Playfair Display`, `Cormorant Garamond`, `Dancing Script`.
- `fonts.cdnfonts.com` (familias con nombre exacto):
  - `Liontinela Realise` — títulos protagonistas: hero (LUANA & JOAN), script "Dos días para celebrarlo", logos navbar y footer.
  - `Minion Pro` — fecha del hero.
- **Requiere conexión a internet**: si el CDN cae o se bloquea, se usa la fuente de respaldo (`Playfair Display` / serif).
- Seguridad: ficheros estáticos (woff/woff2), sin ejecución de código, HTTPS. Riesgos reales: dependencia del CDN y privacidad (IP/agente del visitante llega al servidor, igual que Google Fonts).
- Licencias: `Minion Pro` es comercial (Adobe); los CDN a veces la sirven sin licencia clara. Aceptable en este proyecto de boda (uso personal/no comercial). Alternativa 100% segura: self-hosting en `src/assets/fonts/` con `@font-face` propio.

### Mapa de familias CSS

| Variable / uso | Familia |
|----------------|---------|
| `--font-display` | Playfair Display |
| `--font-body` | Cormorant Garamond (cuerpo general, `body`) |
| `--font-script` | Dancing Script |
| Título hero (`--liona`) | Liontinela Realise |
| Fecha hero | Minion Pro |

## 5. Estructura de archivos

```
index.html                  # HTML raíz (lang="en" aún sin actualizar)
vite.config.ts              # config Vite (solo plugin react)
eslint.config.js            # ESLint flat config
AGENTS.md                   # guía rápida para agentes de IA (enlaza este doc)
docs/
  CONTEXTO.md               # este documento (contexto completo del proyecto)
src/
  main.tsx                  # entrada React (StrictMode)
  App.tsx                   # TODO el markup, contenido y lógica (solo allí; ~1030 líneas)
  App.css                   # estilos de toda la web (~980 líneas)
  index.css                 # estilos base de la plantilla
  assets/                   # imágenes (hero, logos, favicon, etc.)
public/
  favicon.svg               # favicon original (sin uso actual: se usa el PNG de assets)
  icons.svg                 # sprite de iconos (sin uso actual)
```

Assets disponibles (no todos en uso): `heroImage` (`Luana i Joan (1)-03.jpg.jpeg`, usada en el hero), `Luana i Joan (1)-02.jpg.jpeg` (retirada), `luana y joan mayor resolucion.jfif` (+2), `hero.png`, `L y J.png`, `L Y J NAV.jfif`, `Luana i Joan formulario.jpeg`, `pajaros areglados*.jfif`, `react.svg`, `icono de la pestana.jpeg` (origen del favicon), `icono de la pestana redondeado.png` (favicon actual).

## 6. Arquitectura de App.tsx

Todo vive en un único archivo `src/App.tsx` (~1030 líneas). Organización obligatoria: componentes, hooks y constantes en el mismo archivo, separados con bloques de comentarios `/* ==== ... ==== */` en español.

### Configuración rápida (arriba del archivo)

- `RSVP_FORM_URL` → URL del formulario de Google Forms de confirmación.
- `WEDDING_DATE` → `new Date('2027-06-19T18:00:00')`, objetivo de la cuenta atrás.
- `LANG_STORAGE_KEY` → clave de `localStorage` con el idioma elegido.

### Sistema de idiomas (`LanguageProvider`)

- `TRANSLATIONS` → `Record<Lang, Record<string, string>>` con `ca`, `es`, `en`. Añadir siempre la misma clave en las tres lenguas.
- `useLanguage()` → `{ lang, setLang, t }`; `t('clave')` traduce al idioma activo.
- Primer acceso sin idioma guardado → `LanguagePicker` (capa a pantalla completa). Después se cambia desde `LanguageSwitcher` (navbar y footer).
- Nombres propios no se traducen y van igual en las tres lenguas (LUANA & JOAN, Rome Hielos, Mas Juli, Mare de Déu de Gràcia, Pura Brasa, IBAN, Bizum…).

### Sistema de "apilado" de secciones (CRÍTICO, no romper)

Dos tipos de sección que se "montan" unas sobre otras al hacer scroll, controlado por un `zIndex` global creciente que se pasa a mano en `App()`:

- `StackSection` → secciones cortas de un viewport con sticky real (hero, cuenta atrás, regalos). Se envuelven en `<div className="stack">`.
- `SlideSection` → secciones largas en flujo normal de scroll (la boda, Barcelona, galería). El efecto de "montaje" es solo CSS (zIndex + esquina redondeada + sombra + solape negativo).

La secuencia de `zIndex` en `App()` es **1..6** en orden de aparición. Debe ser un contador único y global: no reiniciar por grupo, no duplicar, mantener el orden si se añaden secciones.

### Piezas clave

- `useReveal` / `Reveal` → animación fade + subida al hacer scroll (IntersectionObserver). Props `delay` y `as` (`div` | `li`).
- `useStackCoverEffect` → calcula la cobertura de cada `.stack-section`. Solo se aplica a secciones de un viewport.
- `StickySplit` → cabecera fija + paneles laterales. Prop `reverse` alterna la posición. Usado por la boda, Barcelona y galería.
- `useCountdown` / `Countdown` → cuenta atrás hacia `WEDDING_DATE`.
- `SignatureDivider` → trazo dorado con rombo, cierra el encabezado de cada bloque.
- Placer para imagen (QR): elemento `.image-placeholder` con modificadores `--qr` (cuadrado 180×180 centrado) y `--gallery` (más ancho, centrado). Ids actuales: `qr-regalos`, `qr-galeria`.

Componentes eliminados en esta fase (no reintroducir sin motivo): `PhotoPairInline`, `Faq`, `RsvpCard`. Claves de traducción `faq.*` y `rsvp.*` siguen existiendo en `TRANSLATIONS` por si se restauran.

### Hero (configuración visual actual)

- Imagen de portada: `heroImage` → `./assets/Luana i Joan (1)-03.jpg.jpeg` (576×884, vertical).
- Se muestra **estática y completa**: `.hero-image-wrap` es `absolute inset: 0` con flex centrado (ambos ejes) y `.hero-image` con `width/height: 100%` y `object-fit: contain`. Sin recortes ni zoom al hacer scroll.
- El hero hereda de `.stack-section--interactive` un `transform: scale()` según `--cover`, pero `.stack-section--hero .stack-section__inner` lo anula (`transform: none` y `filter: none`) para que la imagen no se mezcle ni escale.
- **PENDIENTE (resolución):** 576×884 es baja para 100svh; con `object-fit: contain` se escala hacia arriba y se ve borrosa en retina (2x) y 4K. Sustituir por versión ≥1152×1768 px (ideal >1800px de alto) manteniendo el nombre/import de `heroImage`.
- Texto del hero en `#1a1a1a` con `text-shadow` blanco reforzado (título, `&` y lugar: `0 0 8px rgba(255,255,255,0.95), 0 2px 6px rgba(255,255,255,0.9)`; fecha y `.btn`: `0 0 4px rgba(255,255,255,0.9)`). Hardcodeado en `.hero__title`, `.hero__amp`, `.hero__date`, `.hero__place` y `.btn`.
- Título y fecha pegados al pie de la imagen (`.hero__content` con `padding-bottom: 12px` desktop, `16px` móvil).
- El hero NO se oscurece al hacer scroll (fondo `var(--bg)`, `::after` con `opacity: 0`, `.stack-section__inner` con `filter: none`).
- Typo conocido: el lugar del hero muestra "Santa Susanna · Barcelonaaa" (App.tsx, `.hero__place`, hardcodeado, no traducido).

## 7. Datos sensibles pendientes de completar (placeholders)

- IBAN: `ESXX XXXX XXXX XXXX XXXX XXXX`
- Bizum: `600 000 000`
- Teléfonos del footer: `+34 XXX XX XX XX`
- Hoteles recomendados y consejos de la guía de Barcelona
- Imágenes QR de Regalos y Galería (los placeholders están listos: `#qr-regalos`, `#qr-galeria`)

## 8. Comandos

```bash
npm run dev       # servidor de desarrollo
npm run build     # tsc -b && vite build (build de producción)
npm run lint      # eslint .
npm run preview   # previsualizar el build
```

Siempre ejecutar `npm run lint` y `npm run build` después de tocar código.

## 9. Convenciones de código

- Sangría de 2 espacios, comillas simples, punto y coma al final.
- Textos de UI en mayúsculas donde lo marque el diseño (títulos de sección) y en español.
- Clases CSS en BEM: `bloque__elemento` y modificadores `--` (p. ej. `stack-section__inner`, `stack-section--hero`, `image-placeholder--qr`).
- Variables CSS globales en `:root` de `App.css` (paleta: `--bg`, `--cta`, `--gold`, etc.).
- Iconos lucide-react importados al inicio de `App.tsx`, usados con `size` y `strokeWidth` explícitos.
- Tipos explícitos con TypeScript; evitar `any` (solo existe uno en `Reveal`, `as as any`).
- Respeta `prefers-reduced-motion` (cubierto en CSS).
- No añadir comentarios innecesarios; bloques explicativos en español con formato `/* ==== ... ==== */`.
- No cambiar la estética/fuentes existentes salvo que se pida.

## 10. Git

- Rama: `main` (sincronizada con `origin/main`).
- Mensajes de commit en español, cortos y descriptivos.
- Solo hacer commit cuando el usuario lo pida.