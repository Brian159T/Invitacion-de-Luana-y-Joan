# AGENTS.md

Guía para agentes de IA que trabajen en este repositorio.

Contexto completo y detallado del proyecto: [`docs/CONTEXTO.md`](docs/CONTEXTO.md). Este archivo es el resumen operativo; ante cualquier duda, consulta el documento de contexto.

## Descripción del proyecto

Invitación web de boda para Luana y Joan (boda: sábado 19 de junio de 2027, Santa Susanna, Barcelona). Sitio de una sola página con secciones: hero, cuenta atrás, la boda, guía de Barcelona, regalos y galería. La confirmación de asistencia (RSVP) se hace vía formulario de Google Forms. Las secciones FAQ y la tarjeta final RSVP ("Una última cosa") se eliminaron en esta fase.

La web es multilingüe (català, castellano e inglés) y el fondo es blanco en toda la web. Todo el contenido (texto, comentarios, commits) está en español; los textos visibles van en `TRANSLATIONS`.

## Stack

- React 19 + TypeScript (Vite)
- `lucide-react` para iconos (únicos): `Calendar`, `Gift`, `Camera`, `Plane`
- CSS plano (sin preprocesador ni CSS modules): `src/App.css` (estilos de la app) y `src/index.css` (base/plantilla original)
- Sin framework de test en el proyecto

## Fuentes tipográficas

- No se instala ni se descarga nada al repositorio: las fuentes se cargan vía `@import` en `App.css` (líneas iniciales) usando páginas de terceros que sirven las mismas familias con el nombre exacto.
- `Liontinela Realise` (títulos protagonistas: hero, script "Dos días para celebrarlo", logos de navbar y footer) y `Minion Pro` (fecha del hero) se importan desde `https://fonts.cdnfonts.com/css/liontinela-realise` y `https://fonts.cdnfonts.com/css/minion-pro`. Esto las descarga en caliente al abrir la web y **requiere conexión a internet**; sin conexión se usa la fuente de respaldo (`Playfair Display` / serif).
- Seguridad: las fuentes son archivos estáticos (woff/woff2), no ejecutan código en el servidor; la conexión es HTTPS. Los riesgos reales son de dependencia (si el CDN cae o es bloqueado por la red del usuario) y de privacidad (la IP/agente del visitante llega a ese servidor, igual que con Google Fonts).
- Licencias: `Minion Pro` es una fuente comercial de Adobe; los CDN la sirven a veces sin licencia clara. En este proyecto de boda (uso personal/no comercial) es aceptable, pero la alternativa 100% segura es el self-hosting: descargar los `.woff2/.woff` a `src/assets/fonts/` y declarar `@font-face` propio (así se elimina la dependencia y la fuga de datos, pero hay que reimportar los archivos cada vez que se cambie de CDN a local).

## Comandos

```bash
npm run dev       # servidor de desarrollo
npm run build     # tsc -b && vite build (build de producción)
npm run lint      # eslint .
npm run preview   # previsualizar el build
```

Siempre ejecutar `npm run lint` y `npm run build` después de tocar código.

## Estructura

```
index.html                # HTML raíz (lang="en" aún sin actualizar; favicon apunta al PNG de assets)
vite.config.ts            # config Vite (solo plugin react)
eslint.config.js          # ESLint flat config
docs/
  CONTEXTO.md             # contexto completo del proyecto (fuente de verdad)
src/
  main.tsx                # entrada React (StrictMode)
  App.tsx                 # TODO el markup, contenido y lógica (solo allí)
  App.css                 # estilos de toda la web
  index.css               # estilos base de la plantilla
  assets/                 # imágenes (hero, logos, favicon redondeado, etc.)
public/
  favicon.svg             # favicon original (sin uso actual: se usa assets/icono de la pestana redondeado.png)
  icons.svg               # sprite de iconos (sin uso actual)
```

## Arquitectura de App.tsx

Todo vive en un único archivo `src/App.tsx` (~1030 líneas). Mantener esta organización: componentes, hooks y constantes en el mismo archivo, con bloques de comentarios `/* ==== ... ==== */` en español entre secciones.

### Configuración rápida (arriba del archivo)

- `RSVP_FORM_URL` → URL del formulario de Google Forms de confirmación.
- `WEDDING_DATE` → `new Date('2027-06-19T18:00:00')`, objetivo de la cuenta atrás.
- `LANG_STORAGE_KEY` → clave de `localStorage` donde se guarda el idioma elegido.

### Sistema de idiomas (contexto en `LanguageProvider`)

- `TRANSLATIONS` → `Record<Lang, Record<string, string>>` con las tres lenguas (`ca`, `es`, `en`). Añadir siempre la misma clave en las tres.
- `useLanguage()` → hook que devuelve `{ lang, setLang, t }`; `t('clave')` traduce al idioma activo.
- Primer acceso sin idioma guardado → `LanguagePicker` (capa a pantalla completa que pide elegir). Después se cambia desde `LanguageSwitcher` (navbar y footer).
- Nombres propios no se traducen y van igual en las tres lenguas (LUANA & JOAN, Rome Hielos, Mas Juli, Mare de Déu de Gràcia, Pura Brasa, IBAN, Bizum…).

### Sistema de "apilado" de secciones (CRÍTICO, no romper)

Dos tipos de sección que se "montan" unas sobre otras al hacer scroll, controlado por un `zIndex` global creciente que se pasa a mano en `App()`:

- `StackSection` → secciones cortas de un viewport que usan sticky real (hero, cuenta atrás, regalos). Se envuelven en `<div className="stack">`.
- `SlideSection` → secciones largas en flujo normal de scroll (la boda, Barcelona, galería). El efecto de "montaje" es solo CSS (zIndex + esquina redondeada + sombra + solape negativo).

La secuencia de zIndex en `App()` es **1..6** en orden de aparición (hero → cuenta atrás → boda → Barcelona → regalos → galería). Debe ser un contador único y global: no reiniciar por grupo, no duplicar, mantener el orden si se añaden secciones.

### Piezas clave

- `useReveal` / `Reveal` → animación fade + subida al hacer scroll (IntersectionObserver). Se puede pasar `delay` y `as` (`div` | `li`).
- `useStackCoverEffect` → calcula la cobertura de cada `.stack-section`. Solo se aplica a secciones de un viewport.
- `StickySplit` → cabecera fija + paneles laterales. Prop `reverse` alterna la posición. Usado por la boda, Barcelona y galería.
- `useCountdown` / `Countdown` → cuenta atrás hacia `WEDDING_DATE`.
- `SignatureDivider` → trazo dorado con rombo, cierra el encabezado de cada bloque.
- Plaza para imagen QR: `.image-placeholder` con modificadores `--qr` (cuadrado, centrado) y `--gallery`. Ids actuales: `qr-regalos`, `qr-galeria`.

Componentes eliminados en esta fase (no reintroducir sin motivo): `PhotoPairInline`, `Faq`, `RsvpCard`. Las claves `faq.*` y `rsvp.*` siguen en `TRANSLATIONS` por si se restauran.

### Hero (configuración visual actual)

- Imagen de portada: `heroImage` → `./assets/Luana i Joan (1)-03.jpg.jpeg` (576×884, vertical). La imagen `Luana i Joan (1)-02.jpg.jpeg` existe en `assets` pero **no se usa** (fue imagen de tarjeta al pie, ya retirada).
- La imagen se muestra **estática y completa**: `.hero-image-wrap` es `absolute inset: 0` con flex centrado (ambos ejes) y `.hero-image` ocupa `width: 100% / height: 100%` con `object-fit: contain`, así la foto se ve entera, sin recortes, centrada y sin ningún efecto de zoom/escala al hacer scroll (no hay `transform: scale`, `animation-timeline: scroll()` ni JS que cambie su tamaño).
- Móvil aplica la misma regla (`object-fit: contain` en 88svh/82svh de alto del hero); no sobreescribir.
- El hero hereda de `.stack-section--interactive` un `transform: scale()` según `--cover`, pero `.stack-section--hero .stack-section__inner` lo anula con `transform: none` (además de `filter: none`) para que la imagen no se mezcle ni escale.
- **Resolución de la imagen (PENDIENTE, calidad):** `heroImage` es **576×884 px**, baja para un hero a pantalla completa (100svh). Con `object-fit: contain` se escala hacia arriba en pantallas grandes: aceptable en móvil y monitores 1x, pero **borrosa/pixelada en retina (2x) y 4K** (el alto nativo 884px está muy por debajo del píxel físico mostrado). Pendiente sustituirla por una versión de ≥1152×1768 px (idealmente >1800px de alto) manteniendo el nombre/import de `heroImage` para no tocar código.
- Texto del hero (LUANA & JOAN, fecha, lugar, botón RSVP) en color `#1a1a1a` con `text-shadow` blanco reforzado (título, `&` y lugar con `0 0 8px rgba(255, 255, 255, 0.95), 0 2px 6px rgba(255, 255, 255, 0.9)`; fecha y `.btn` con `0 0 4px rgba(255, 255, 255, 0.9)`), hardcodeado en `.hero__title`, `.hero__amp`, `.hero__date`, `.hero__place` y `.btn`.
- Título y fecha son pequeños y quedan pegados al pie de la imagen (`.hero__content` con `padding-bottom: 12px` en desktop, `16px` en móvil).
- El hero NO se oscurece al hacer scroll: `.stack-section--hero` tiene fondo `var(--bg)`, su `::after` con `opacity: 0` y su `.stack-section__inner` con `filter: none` (anulan el efecto de oscurecimiento del stack).

### Datos sensibles a completar (placeholders)

Varios campos son provisionales: IBAN (`ESXX XXXX...`), Bizum (`600 000 000`), teléfonos del footer (`+34 XXX XX XX XX`), hoteles recomendados y consejos de la guía de Barcelona, y las imágenes QR de Regalos y Galería (los placeholders `#qr-regalos` / `#qr-galeria` están listos para recibirlas).

## Convenciones de código

- Sangría de 2 espacios, comillas simples, punto y coma al final.
- Textos de UI en mayúsculas donde lo marque el diseño (títulos de sección) y en español.
- Nombres de clases CSS en BEM: `bloque__elemento` y modificadores `--` (p. ej. `stack-section__inner`, `stack-section--hero`, `image-placeholder--qr`).
- Variables CSS globales en `:root` de `App.css` (paleta: blanco `--bg`, cta `--cta`, oro `--gold`, etc.).
- Iconos lucide-react importados al inicio de `App.tsx` y usados con `size` y `strokeWidth` explícitos.
- Tipos explícitos con TypeScript; evitar `any` (solo existe uno en `Reveal`, `as as any`).
- Respeta `prefers-reduced-motion` (ya cubierto en CSS).
- No añadir comentarios innecesarios; si se añaden bloques explicativos, en español y con el formato `/* ==== ... ==== */`.
- No cambiar la font/estética existente salvo que se pida.

## Git

- Ramas: `main` (sincronizada con `origin/main`).
- Mensajes de commit en español, cortos y descriptivos (p. ej. "Mejorando el diseno parte 2").
- Solo hacer commit cuando el usuario lo pida.