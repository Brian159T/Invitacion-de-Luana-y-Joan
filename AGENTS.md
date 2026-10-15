# AGENTS.md

Guía para agentes de IA que trabajen en este repositorio.

Contexto completo y detallado del proyecto: [`docs/CONTEXTO.md`](docs/CONTEXTO.md). Este archivo es el resumen operativo; ante cualquier duda, consulta el documento de contexto.

## Descripción del proyecto

Invitación web de boda para Luana y Joan (boda: sábado 19 de junio de 2027, Santa Susanna, Barcelona). Sitio de una sola página con secciones: hero, cuenta atrás, la boda, guía de Barcelona y regalos. La confirmación de asistencia (RSVP) se hace vía formulario de Google Forms. Las secciones FAQ, la galería y la tarjeta final RSVP ("Una última cosa") se eliminaron en esta fase.

La web es bilingüe (català por defecto e inglés) y el fondo es blanco en toda la web. Todo el contenido (texto, comentarios, commits) está en español; los textos visibles van en `TRANSLATIONS`.

## Stack

- React 19 + TypeScript (Vite)
- `lucide-react` para iconos (únicos): `Calendar`, `Gift`, `Plane`
- CSS plano (sin preprocesador ni CSS modules): `src/App.css` (estilos de la app) y `src/index.css` (base/plantilla original)
- Sin framework de test en el proyecto

## Fuentes tipográficas

- No se instala ni se descarga nada al repositorio: las fuentes se cargan vía `@import` en `App.css` (líneas iniciales) usando páginas de terceros que sirven las mismas familias con el nombre exacto.
- `Liontinela Realise` (títulos protagonistas: hero y logos de navbar y footer) y `Minion Pro` (fecha del hero) se importan desde `https://fonts.cdnfonts.com/css/liontinela-realise` y `https://fonts.cdnfonts.com/css/minion-pro`. Esto las descarga en caliente al abrir la web y **requiere conexión a internet**; sin conexión se usa la fuente de respaldo (`Playfair Display` / serif).
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
index.html                # HTML raíz (lang="ca"; favicon apunta al PNG de assets)
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

- `TRANSLATIONS` → `Record<Lang, Record<string, string>>` con las dos lenguas (`ca`, `en`), con `ca` como defecto en todos los fallbacks. Añadir siempre la misma clave en las dos.
- `useLanguage()` → hook que devuelve `{ lang, setLang, t }`; `t('clave')` traduce al idioma activo.
- Primer acceso sin idioma guardado → `LanguagePicker` (capa a pantalla completa que pide elegir). Después se cambia desde `LanguageSwitcher` (navbar y footer).
- Nombres propios no se traducen y van igual en las dos lenguas (LUANA & JOAN, Rome Hielos, Mas Juli, Mare de Déu de Gràcia, Pura Brasa, IBAN, Bizum…).
- Textos fuera de `TRANSLATIONS` (hardcodeados): botón `RSVP` (navbar) y la capa inicial del idioma. Detalle en `docs/CONTEXTO.md`.

### Sistema de "apilado" de secciones (CRÍTICO, no romper)

Dos tipos de sección que se "montan" unas sobre otras al hacer scroll, controlado por un `zIndex` global creciente que se pasa a mano en `App()`:

- `StackSection` → secciones cortas de un viewport que usan sticky real (hero, cuenta atrás, regalos). Se envuelven en `<div className="stack">`.
- `SlideSection` → secciones largas en flujo normal de scroll (la boda, Barcelona). El efecto de "montaje" es solo CSS (zIndex + esquina redondeada + sombra + solape negativo).

La secuencia de zIndex en `App()` es **1..5** en orden de aparición (hero → cuenta atrás → boda → Barcelona → regalos). Debe ser un contador único y global: no reiniciar por grupo, no duplicar, mantener el orden si se añaden secciones.

### Piezas clave

- `useReveal` / `Reveal` → animación fade + subida al hacer scroll (IntersectionObserver). Se puede pasar `delay` y `as` (`div` | `li`).
- `useStackCoverEffect` → calcula la cobertura de cada `.stack-section`. Solo se aplica a secciones de un viewport.
- `StickySplit` → cabecera fija + paneles laterales. Prop `reverse` alterna la posición. Usado por la boda y Barcelona.
- `useCountdown` / `Countdown` → cuenta atrás hacia `WEDDING_DATE`.
- `SignatureDivider` → trazo dorado con rombo, cierra el encabezado de cada bloque.
- QR de pagos de Regalos: imagen real `<img src={qrPagos} className="gift-qr">` (`./assets/Qr pagos.jpeg`), centrada (180 px).

Componentes eliminados en esta fase (no reintroducir sin motivo): `PhotoPairInline`, `Faq`, `RsvpCard` y la sección de galería. Las claves `faq.*`, `rsvp.*` y `galeria.*` siguen en `TRANSLATIONS` por si se restauran.

### Hero (configuración visual actual)

- Fondo de portada en **bucle** (dos versiones según el ancho de pantalla, en `HeroPhoto`, ambas con `object-fit: contain` = banner completo sin recortes):
  - Escritorio (>720px): `<video>` `heroVideo` → `./assets/Horizontal_Pajaros.mp4` (**3840×1268**, ~3:1, 5,8 MB), con `autoPlay muted loop playsInline` y **sin `controls`** (no se ven barra de reproducción ni botones). Al ser ~3:1 en un hero de pantalla completa se ve como una franja/banner centrado con blanco arriba y abajo.
  - Móvil (≤720px): `<img>` `heroGif` → `./assets/Vertical_Pajaros.gif` (**GIF animado 540×960**, 11,4 MB; los GIF bucleean solos). Se oculta/muestra con media queries en `.hero-media--desktop` / `.hero-media--mobile`. (Se renombró de `Vertical_Pajaros` a `Vertical_Pajaros.gif` para que TypeScript lo resuelva con los tipos de `vite/client`.)
  - El GIF de 11,4 MB es pesado para móvil; si se quiere aligerar, convertirlo a MP4 con ffmpeg (no instalado en este entorno) y pasarlo a `<video>` como el de escritorio.
- `.hero-image-wrap` es `absolute inset: 0` con flex centrado horizontal y **`align-items: flex-start`** (el medio queda pegado arriba, tocando el navbar, sin espacio entre uno y otro) y `.hero-media` ocupa `width/height: 100%` con `object-fit: contain`; sin zoom/escala al hacer scroll (no hay `transform: scale` ni JS que cambie su tamaño).
- El hero **no tiene ningún texto encima** (se eliminaron LUANA & JOAN, fecha, lugar y el botón RSVP; las claves `hero.*` siguen en `TRANSLATIONS` sin uso). El RSVP solo está en el navbar.
- El hero hereda de `.stack-section--interactive` un `transform: scale()` según `--cover`, pero `.stack-section--hero .stack-section__inner` lo anula con `transform: none` (además de `filter: none`) para que el medio no se mezcle ni escale.
- Imágenes antiguas del hero (`Pajaros areglados.jfif`, `Luana i Joan (1)-03.jpg.jpeg`) ya no se importan; siguen en `assets/` sin uso.

### Datos sensibles a completar (placeholders)

Varios campos son provisionales: teléfonos del footer (`+34 XXX XX XX XX`), hoteles recomendados y consejos de la guía de Barcelona. Regalos ya tiene los datos reales (Bizum `+34698697571`, cuenta Banc Sabadell `ES85 0081 0093 4400 0211 2515` y QR de pagos).

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