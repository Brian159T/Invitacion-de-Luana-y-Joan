# AGENTS.md

Guía para agentes de IA que trabajen en este repositorio.

## Descripción del proyecto

Invitación web de boda para Luana y Joan (boda: sábado 19 de junio de 2027, Santa Susanna, Barcelona). Sitio de una sola página con secciones: hero, cuenta atrás, la boda, guía de Barcelona, regalos, galería, preguntas frecuentes y confirmación de asistencia (RSVP vía formulario de Google Forms).

La web es multilingüe (català, castellano e inglés) y el fondo es blanco en toda la web. Todo el contenido (texto, comentarios, commits) está en español; los textos visibles van en `TRANSLATIONS`.

## Stack

- React 19 + TypeScript (Vite)
- `lucide-react` para iconos (únicos): `Calendar`, `Gift`, `Camera`, `Plane`, `HelpCircle`
- CSS plano (sin preprocesador ni CSS modules): `src/App.css` (estilos de la app) y `src/index.css` (base/plantilla original)
- Sin framework de test en el proyecto

## Fuentes tipográficas

- No se instala ni se descarga nada al repositorio: las fuentes se cargan vía `@import` en `App.css` (líneas iniciales) usando páginas de terceros que sirven las mismas familias con el nombre exacto.
- `Liontinela Realise` (título del hero) y `Minion Pro` (fecha del hero) se importan desde `https://fonts.cdnfonts.com/css/liontinela-realise` y `https://fonts.cdnfonts.com/css/minion-pro`. Esto las descarga en caliente al abrir la web y **requiere conexión a internet**; sin conexión se usa la fuente de respaldo (`Playfair Display` / serif).
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
index.html                # HTML raíz (lang="en" aún sin actualizar)
vite.config.ts            # config Vite (solo plugin react)
eslint.config.js          # ESLint flat config
src/
  main.tsx                # entrada React (StrictMode)
  App.tsx                 # TODO el markup, contenido y lógica (solo allí)
  App.css                 # estilos de toda la web
  index.css               # estilos base de la plantilla
  assets/                 # imágenes (hero, L y J.png)
public/
  favicon.svg             # favicon
  icons.svg               # sprite de iconos (sin uso actual)
```

## Arquitectura de App.tsx

Todo vive en un único archivo `src/App.tsx` (704 líneas). Mantener esta organización: componentes, hooks y constantes en el mismo archivo, con bloques de comentarios `/* ==== ... ==== */` en español entre secciones.

### Configuración rápida (arriba del archivo)

- `RSVP_FORM_URL` → URL del formulario de Google Forms de confirmación.
- `WEDDING_DATE` → `new Date('2027-06-19T18:00:00')`, objetivo de la cuenta atrás.
- `LANG_STORAGE_KEY` → clave de `localStorage` donde se guarda el idioma elegido.

### Sistema de idiomas (contexto en `LanguageProvider`)

- `TRANSLATIONS` → `Record<Lang, Record<string, string>>` con las tres lenguas (`ca`, `es`, `en`). Añadir siempre la misma clave en las tres.
- `useLanguage()` → hook que devuelve `{ lang, setLang, t }`; `t('clave')` traduce al idioma activo.
- Primer acceso sin idioma guardado → `LanguagePicker` (capa a pantalla completa que pide elegir). Después se cambia desde `LanguageSwitcher` (navbar y footer).
- Componentes con textos propios (`Navbar`, `RsvpCard`, `Countdown`, `AppContent`) usan `useLanguage()` directamente; los nombres propios (LUANA & JOAN, IBAN, Bizum...) no se traducen.

### Sistema de "apilado" de secciones (CRÍTICO, no romper)

Dos tipos de sección que se "montan" unas sobre otras al hacer scroll, controlado por un `zIndex` global creciente que se pasa a mano en `App()`:

- `StackSection` → secciones cortas de un viewport que usan sticky real (hero, cuenta atrás, regalos, RSVP final). Se envuelven en `<div className="stack">`.
- `SlideSection` → secciones largas en flujo normal de scroll (la boda, Barcelona, galería, FAQ). El efecto de "montaje" es solo CSS (zIndex + esquina redondeada + sombra + solape negativo).

La secuencia de zIndex en `App()` es 1..8 en orden de aparición. Debe ser un contador único y global: no reiniciar por grupo, no duplicar, mantener el orden si se añaden secciones.

### Piezas clave

- `useReveal` / `Reveal` → animación fade + subida al hacer scroll (IntersectionObserver). Se puede pasar `delay` y `as` (`div` | `li`).
- `useStackCoverEffect` → calcula la cobertura de cada `.stack-section`. Solo se aplica a secciones de un viewport.
- `StickySplit` → cabecera fija + paneles laterales. Prop `reverse` alterna la posición. Usado por la boda, Barcelona, galería y FAQ.
- `useCountdown` / `Countdown` → cuenta atrás hacia `WEDDING_DATE`.
- `SignatureDivider` → trazo dorado con rombo, cierra el encabezado de cada bloque.
- `PhotoPairInline` → par de fotos; usa `.image-placeholder` con ids (`viernes-1`, `sabado-1`, `galeria-1`, etc.) donde se colocarán imágenes reales.
- `Faq` → elemento `<details>/<summary>`.
- `RsvpCard` → tarjeta de cierre con enlace a RSVP e IBAN.

### Datos sensibles a completar (placeholders)

Varios campos son provisionales: IBAN (`ESXX XXXX...`), Bizum (`600 000 000`), teléfonos del footer (`+34 XXX XX XX XX`), respuesta de FAQ sobre niños, hoteles recomendados y consejos de la guía de Barcelona.

## Convenciones de código

- Sangría de 2 espacios, comillas simples, punto y coma al final.
- Textos de UI en mayúsculas donde lo marque el diseño (títulos de sección) y en español.
- Nombres de clases CSS en BEM: `bloque__elemento` y modificadores `--` (p. ej. `stack-section__inner`, `stack-section--hero`).
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