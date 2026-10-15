# Contexto del proyecto — Invitación de Luana y Joan

Documento de referencia con todo el contexto de la web de invitación de boda de **Luana y Joan** (boda: sábado 19 de junio de 2027, Santa Susanna, Barcelona). Este documento es la fuente de verdad sobre el proyecto; `AGENTS.md` lo enlaza y resume lo esencial para trabajar con IA.

## 1. Resumen

- Web de **una sola página** con fondo blanco en toda la web.
- Multilingüe: **català (ca) e inglés (en)**, con el catalán como idioma por defecto. El idioma se elige al primer acceso (capa a pantalla completa) y se cambia desde la navbar o el footer; la elección se guarda en `localStorage`.
- Todo el contenido técnico (textos de código, comentarios, commits, docs) está en **español**; los textos visibles para el usuario viven en `TRANSLATIONS`.
- Confirmación de asistencia (RSVP) vía **formulario de Google Forms** (`RSVP_FORM_URL`).

## 2. Estado actual de las secciones

El sitio se compone (en orden, con su `zIndex`, contador global único 1..5):

| # | zIndex | Sección | Tipo | Contenido |
|---|--------|---------|------|-----------|
| 1 | 1 | `#inicio` (hero) | `StackSection` | Vídeo/GIF de portada en bucle, **sin texto encima**, pegado al navbar |
| 2 | 2 | `#cuenta-atras` | `StackSection` | Cuenta atrás hacia el `WEDDING_DATE` |
| 3 | 3 | `#boda` | `SlideSection` | Dos tarjetas: viernes (Almuerzo Rome Hielos) y sábado (ceremonia y banquete). Sin fotos |
| 4 | 4 | `#barcelona` | `SlideSection` | Guía de invitados (cómo llegar, dormir, comer, visitar, playas, cosas, consejos) |
| 5 | 5 | `#regalos` | `StackSection` | Texto + Bizum + cuenta + **QR de pagos real** (`Qr pagos.jpeg`) |

Fuera del stack (no se apila): `<footer>` con logo "LJ", enlaces, selector de idioma y contactos.

> **Eliminadas en esta fase:** la sección de Preguntas (FAQ, era zIndex 7), la tarjeta final RSVP "Una última cosa / Confirmar asistencia" (era zIndex 8) y la galería (era zIndex 6).

### Decisiones recientes (pueden invertirse si se pide)

- **Logo navbar**: texto `L J` (con espacio no separable) con la fuente **Liontinela Realise**, sin círculo ni borde, tamaño 18px.
- **Logo footer**: `LJ` con **Liontinela Realise**.
- **Script "Dos días para celebrarlo"** de La Boda: **eliminado** en esta fase (las claves `boda.script` siguen en `TRANSLATIONS` por si se restaura; la clase `.section__script--liona` se borró del CSS).
- **Rome Hielos** se trata como **nombre propio**: no se traduce ni se sustituye (ca: "Dinar Rome Hielos", en: "Lunch Rome Hielos").
- **Traducciones verificadas**: todas las claves tienen las dos lenguas (ca/en) y los nombres propios (Mas Juli, Mare de Déu de Gràcia, Pura Brasa, Rome Hielos) se mantienen intactos. El castellano se eliminó; el catalán es el idioma por defecto (`'ca'` en todos los fallbacks, `lang="ca"` en `index.html`).
- **Favicon**: `icono de la pestana redondeado.png` (en `src/assets`, generado con esquinas redondeadas y transparencia, ~108px de radio sobre 712×434). Se referenció en `index.html`. Se eliminó `src/assets/vite.svg`.
- **Fuente Source Serif 4**: las tres fechas de La Boda (eyebrow fija "18 i 19 de juny de 2027" y eyebrows de las tarjetas "Divendres 18 de juny" / "Dissabte 19 de juny") usan **Source Serif 4**, instalada por npm (`@fontsource/source-serif-4`, subsets `latin-400` y `latin-600` importados en `src/main.tsx`) y aplicada en `App.css` bajo `#boda`. Es auto-hospedada (sin CDN).
- **Regalos sin efecto de apilado**: por ser la última sección antes del footer, no lleva `interactive`, es `position: static`, sin sombra y sin oscurecimiento (`stack-section--no-effect`). El footer le sigue en flujo normal.

## 3. Stack

- React 19 + TypeScript (Vite).
- `lucide-react` para iconos — actualmente importados: `Calendar`, `Gift`, `Plane` (se eliminaron `HelpCircle` con la sección FAQ y `Camera` con la galería).
- CSS plano (sin preprocesador ni CSS modules): `src/App.css` (estilos de la app) y `src/index.css` (base/plantilla original).
- Sin framework de test en el proyecto.

## 4. Fuentes tipográficas

- No se instala ni descarga nada al repositorio. Las fuentes se cargan vía `@import` en las primeras líneas de `App.css`.
- Google Fonts (familias base): `Playfair Display`, `Cormorant Garamond`, `Dancing Script`.
- `fonts.cdnfonts.com` (familias con nombre exacto):
  - `Liontinela Realise` — títulos protagonistas: hero (LUANA & JOAN), script "Dos días para celebrarlo", logos navbar y footer.
  - `Minion Pro` — fecha del hero.
- **Requiere conexión a internet**: si el CDN cae o se bloquea, se usa la fuente de respaldo (`Playfair Display` / serif).
- **Origen**: no están en el repositorio ni se instalaron manualmente; se cargan en tiempo de ejecución desde un CDN de terceros (equivalente a Google Fonts en cuanto a modelo de carga).
- **Seguridad / ¿ejecutan código?** **No, en ninguna forma**: los `.woff/.woff2` son glicofos estáticos que el navegador solo renderiza; no hay scripts, macros ni ejecución. Conexión HTTPS.
- **Riesgos reales** (no son "ejecución", pero existen): (1) dependencia — si el CDN cae o la red lo bloquea, se usa el respaldo y el aspecto cambia; (2) privacidad — la IP y el agente del visitante llegan a ese servidor; (3) licencia poco clara.
- Licencias: `Minion Pro` es comercial (Adobe); los CDN a veces la sirven sin licencia clara. Aceptable en este proyecto de boda (uso personal/no comercial). Alternativa 100% segura y sin fugas: **self-hosting** descargando los `.woff2/.woff` a `src/assets/fonts/` y declarando `@font-face` propios.

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
index.html                  # HTML raíz (lang="ca"; favicon apunta al PNG de assets)
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

Assets disponibles (no todos en uso): `Pajaros areglados.jfif` (hero en escritorio), `Luana i Joan (1)-03.jpg.jpeg` (hero en móvil), `Luana i Joan (1)-02.jpg.jpeg` (retirada), `luana y joan mayor resolucion.jfif` (+2), `hero.png`, `L y J.png`, `L Y J NAV.jfif`, `Luana i Joan formulario.jpeg`, `pajaros areglados2.jfif`/`3` (sin uso), `react.svg`, `icono de la pestana.jpeg` (origen del favicon), `icono de la pestana redondeado.png` (favicon actual).

## 6. Arquitectura de App.tsx

Todo vive en un único archivo `src/App.tsx` (~1030 líneas). Organización obligatoria: componentes, hooks y constantes en el mismo archivo, separados con bloques de comentarios `/* ==== ... ==== */` en español.

### Configuración rápida (arriba del archivo)

- `RSVP_FORM_URL` → URL del formulario de Google Forms de confirmación.
- `WEDDING_DATE` → `new Date('2027-06-19T18:00:00')`, objetivo de la cuenta atrás.
- `LANG_STORAGE_KEY` → clave de `localStorage` con el idioma elegido.

### Sistema de idiomas (`LanguageProvider`)

- `TRANSLATIONS` → `Record<Lang, Record<string, string>>` con `ca` y `en`. Añadir siempre la misma clave en las dos lenguas.
- `useLanguage()` → `{ lang, setLang, t }`; `t('clave')` traduce al idioma activo.
- Primer acceso sin idioma guardado → `LanguagePicker` (capa a pantalla completa). Después se cambia desde `LanguageSwitcher` (navbar y footer).
- Nombres propios no se traducen y van igual en las dos lenguas (LUANA & JOAN, Rome Hielos, Mas Juli, Mare de Déu de Gràcia, Pura Brasa, IBAN, Bizum…).

**Cómo se aplican las traducciones:** cada texto visible importante tiene su clave en las dos lenguas; si el usuario elige `ca` o `en` (en el picker inicial o el switcher), la elección se guarda en `localStorage` (`LANG_STORAGE_KEY`) y `t('clave')` devuelve el valor del idioma activo en cada render.

**Textos que quedan fuera de `TRANSLATIONS` (hardcodeados, a propósito):**
- Nombres propios (LUANA & JOAN, Roma Hielos, Mas Juli, IBAN, Bizum, teléfonos del footer…).
- Textos idénticos en las dos lenguas: botón `RSVP`, selector de idioma (CAT/ENG).
- Sin idioma gestionado: la capa inicial "Quin idioma prefereixes? / Which language do you prefer?" (muestra las dos).
- **Verificado:** `hero.date` era correcta (19/06/2027 cae en sábado), pero la clave quedó **sin uso** al eliminarse todo el texto del hero.

### Sistema de "apilado" de secciones (CRÍTICO, no romper)

Dos tipos de sección que se "montan" unas sobre otras al hacer scroll, controlado por un `zIndex` global creciente que se pasa a mano en `App()`:

- `StackSection` → secciones cortas de un viewport con sticky real (hero, cuenta atrás, regalos). Se envuelven en `<div className="stack">`.
- `SlideSection` → secciones largas en flujo normal de scroll (la boda, Barcelona). El efecto de "montaje" es solo CSS (zIndex + esquina redondeada + sombra + solape negativo).

La secuencia de `zIndex` en `App()` es **1..5** en orden de aparición. Debe ser un contador único y global: no reiniciar por grupo, no duplicar, mantener el orden si se añaden secciones.

**Regalos (`stack-section--no-effect`)** es la excepción: por ser la última sección antes del footer no lleva `interactive`, es `position: static`, sin sombra y con el `::after` de oscurecimiento anulado; no se "clava" al hacer scroll.

### Piezas clave

- `useReveal` / `Reveal` → animación fade + subida al hacer scroll (IntersectionObserver). Props `delay` y `as` (`div` | `li`).
- `useStackCoverEffect` → calcula la cobertura de cada `.stack-section`. Solo se aplica a secciones de un viewport.
- `StickySplit` → cabecera fija + paneles laterales. Prop `reverse` alterna la posición. Usado por la boda y Barcelona.
- `useCountdown` / `Countdown` → cuenta atrás hacia `WEDDING_DATE`.
- `SignatureDivider` → trazo dorado con rombo, cierra el encabezado de cada bloque.
- QR de pagos de Regalos: imagen real `.gift-qr` → `<img src={qrPagos}>` (`./assets/Qr pagos.jpeg`), centrada, 180 px de ancho.

Componentes eliminados en esta fase (no reintroducir sin motivo): `PhotoPairInline`, `Faq`, `RsvpCard` y la sección de galería. Claves de traducción `faq.*`, `rsvp.*` y `galeria.*` siguen existiendo en `TRANSLATIONS` por si se restauran.

### Hero (configuración visual actual)

- Fondo de portada en **bucle** (dos versiones por ancho de pantalla, en `HeroPhoto`):
  - Escritorio (>720px): `<video>` `heroVideo` → `./assets/Horizontal_Pajaros.mp4` (**3840×1268**, ~3:1, 5,8 MB) con `autoPlay muted loop playsInline` y **sin `controls`**. `.hero-media` con `width: 100%; height: auto` (respeta relación) y el wrap `align-items: flex-start`: el vídeo queda pegado al navbar, **sin banda blanca arriba** (el blanco queda debajo).
  - Móvil (≤720px): `<img>` `heroGif` → `./assets/Vertical_Pajaros.gif` (**GIF animado 540×960**, 11,4 MB; los GIF bucleean solos). `width/height: 100%` + `object-fit: cover`: ocupa toda la pantalla de lado a lado (sin bandas laterales, con recorte proporcional). Alternados con media queries (`.hero-media--desktop` / `.hero-media--mobile`). El archivo se renombró de `Vertical_Pajaros` (sin extensión) a `Vertical_Pajaros.gif`.
  - El GIF de 11,4 MB es pesado para móvil; para aligerarlo haría falta convertirlo a MP4 con ffmpeg (no instalado en este entorno).
- Clave del ajuste: **no** usar `height: 100%` + `object-fit: contain` en el hero (la caja ocupa todo el alto y `contain` centra el medio dentro → bandas blancas). Escritorio: `height: auto`. Móvil: `height: 100%` + `cover`.
- `.hero-image-wrap` es `absolute inset: 0` con flex centrado horizontal y `align-items: flex-start` (el medio queda arriba, pegado al navbar) y `.hero-media` con `width: 100%` y `height: auto` (escritorio) / `height: 100%` + `cover` (móvil). Sin zoom al hacer scroll.
- **Sin texto encima**: se eliminaron LUANA & JOAN, fecha, lugar y el botón RSVP del hero (las claves `hero.*` siguen en `TRANSLATIONS` sin uso; el RSVP solo está en el navbar).
- El hero hereda de `.stack-section--interactive` un `transform: scale()` según `--cover`, pero `.stack-section--hero .stack-section__inner` lo anula (`transform: none` y `filter: none`) para que el medio no se mezcle ni escale.
- Las imágenes antiguas del hero (`Pajaros areglados.jfif`, `Luana i Joan (1)-03.jpg.jpeg`) ya no se importan.
- El hero NO se oscurece al hacer scroll (fondo `var(--bg)`, `::after` con `opacity: 0`, `.stack-section__inner` con `filter: none`).

## 7. Datos sensibles pendientes de completar (placeholders)

- Teléfonos del footer: `+34 XXX XX XX XX`
- Hoteles recomendados y consejos de la guía de Barcelona

Regalos ya tiene los datos reales: Bizum `+34698697571`, cuenta Banc Sabadell `ES85 0081 0093 4400 0211 2515` y QR de pagos (`src/assets/Qr pagos.jpeg`).

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