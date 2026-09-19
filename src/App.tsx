import { Plane, Calendar, Gift, Camera, HelpCircle } from 'lucide-react'
import './App.css'
import heroImage from './assets/Luana i Joan (1)-03.jpg.jpeg'
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'

/* ============================================================
   CONFIGURACIÓN RÁPIDA
   ============================================================ */

const RSVP_FORM_URL = 'https://docs.google.com/forms/d/e/1FAIpQLSftqVzloPmw7Er1bijvI-xNuqiw6Wy4-QE4uirZZqajDnWT2w/viewform?usp=publish-editor'
const WEDDING_DATE = new Date('2027-06-19T18:00:00')
const LANG_STORAGE_KEY = 'invitacion-idioma'

/* ============================================================
   IDIOMA — traducciones (català / castellano / english)
   -> La web se muestra en tres idiomas. En cada carga o recarga
      de la página se muestra una capa a pantalla completa pidiendo
      al usuario que elija; la última elección se guarda en
      localStorage y se preaplica (solo al contenido que queda por
      detrás). Además se puede cambiar en cualquier momento desde
      la navbar o el footer.
   ============================================================ */

type Lang = 'ca' | 'es' | 'en'

const TRANSLATIONS: Record<Lang, Record<string, string>> = {
  es: {
    'nav.boda': 'La boda',
    'nav.barcelona': 'Barcelona',
    'nav.regalos': 'Regalos',
    'nav.galeria': 'Galería',
    'nav.preguntas': 'Preguntas',
    'nav.rsvp': 'Confirmar asistencia',
    'hero.date': 'Sábado 19 de Junio, 2027',
    'countdown.title': 'PREPARAD LAS GANAS, ESTO EMPIEZA EN…',
    'countdown.dias': 'Días',
    'countdown.horas': 'Horas',
    'countdown.minutos': 'Minutos',
    'countdown.segundos': 'Segundos',
    'boda.eyebrow': '18 y 19 de Junio de 2027',
    'boda.title': 'LA BODA',
    'boda.script': 'Dos días para celebrarlo',
    'boda.viernes.eyebrow': 'Viernes 18 de Junio',
    'boda.viernes.title': 'Comida con la familia',
    'boda.fecha': 'Fecha:',
    'boda.horario': 'Horario:',
    'boda.lugar': 'Lugar:',
    'boda.ubicacion': 'Ubicación',
    'boda.web': 'Web',
    'boda.dresscode': 'Dress code:',
    'boda.viernes.fechaValue': 'viernes 18 de Junio de 2027',
    'boda.viernes.horarioValue': '12h aperitivo · 14h comida',
    'boda.viernes.lugarValue': 'Mas Juli',
    'boda.viernes.dressValue': 'Casual — Semi-formal',
    'boda.sabado.eyebrow': 'Sábado 19 de Junio',
    'boda.sabado.title': 'Ceremonia y banquete',
    'boda.ceremonia': 'Ceremonia:',
    'boda.ceremoniaValue': 'Mare de Déu de Gràcia — 08398 Santa Susanna, Barcelona · 18h',
    'boda.banquete': 'Banquete:',
    'boda.banqueteValue': 'Pura Brasa, Pineda de Mar',
    'boda.horarios': 'Horarios:',
    'boda.horariosValue':
      'Ceremonia 18h · Aperitivo 20h · Cena 21h · Fiesta hasta las 03:00h',
    'boda.sabado.dressValue': 'Etiqueta (Black Tie)',
    'barcelona.eyebrow': 'Guía para invitados',
    'barcelona.title': 'BARCELONA',
    'barcelona.script': 'Todo lo que necesitáis si venís de fuera',
    'guide.comoLlegar': 'Cómo llegar',
    'guide.comoLlegar.text':
      'Información sobre cómo llegar desde el aeropuerto y moverse por la ciudad en transporte público.',
    'guide.transporte': 'Transporte público →',
    'guide.dormir': 'Dónde dormir',
    'guide.dormir.text': 'Hoteles recomendados cerca de la ceremonia y del banquete.',
    'guide.dormir.todo': '(Añadir aquí vuestros hoteles recomendados)',
    'guide.comer': 'Dónde comer',
    'guide.comer.text': 'Una selección de restaurantes para todos los gustos.',
    'guide.michelin': 'Guía Michelin Barcelona →',
    'guide.visitar': 'Qué visitar (2-3 días)',
    'guide.visitar.text': 'Itinerarios pensados para aprovechar una escapada corta.',
    'guide.itinerarios': 'Itinerarios en Barcelona →',
    'guide.playas': 'Playas',
    'guide.playas.text': 'Las mejores playas de la ciudad y alrededores.',
    'guide.mar': 'Mar y playas →',
    'guide.cosas': 'Cosas para hacer',
    'guide.cosas.text': 'Ideas y planes por si os quedáis unos días más.',
    'guide.descubrir': 'Descubrir Barcelona →',
    'guide.consejos': 'Consejos rápidos',
    'guide.consejos.text':
      'Efectivo, taxis, clima… Aquí podéis añadir cualquier consejo útil para vuestros invitados antes de que lleguen.',
    'regalos.title': 'REGALOS',
    'regalos.text1':
      'Lo más importante para nosotros es compartir este día con vosotros.',
    'regalos.text2':
      'Si además queréis ayudarnos a empezar nuestra nueva aventura, podéis hacerlo mediante una aportación a nuestra luna de miel.',
    'regalos.iban': 'IBAN',
    'regalos.bizum': 'Bizum',
    'galeria.eyebrow': 'Nuestros momentos',
    'galeria.title': 'GALERÍA',
    'galeria.script': 'Un vistazo a nuestra historia',
    'faq.eyebrow': 'Dudas frecuentes',
    'faq.title': 'PREGUNTAS',
    'faq.script': 'Todo lo que necesitáis saber',
    'faq.companiero.q': '¿Puedo llevar acompañante?',
    'faq.companiero.a':
      'Indicadlo en el formulario de confirmación de asistencia; si tenéis dudas, escribidnos directamente.',
    'faq.dieta.q': '¿Hay opciones para restricciones alimentarias?',
    'faq.dieta.a':
      'Sí, podréis indicarlo en el formulario de RSVP y lo tendremos en cuenta con el catering.',
    'faq.ninos.q': '¿Se admiten niños?',
    'faq.ninos.a': '(Completad esta respuesta según vuestra decisión).',
    'faq.autobus.q': '¿Cómo llego si no tengo coche?',
    'faq.autobus.a':
      'Consultad la sección de Barcelona para información sobre transporte; también organizaremos un servicio de autobús (a confirmar).',
    'rsvp.eyebrow': 'Una última cosa',
    'rsvp.confirm': 'CONFIRMAR ASISTENCIA',
    'rsvp.sub': 'El mejor regalo es vuestra compañía',
    'rsvp.note':
      'Pero si queréis contribuir a nuestra nueva etapa juntos, podéis hacerlo aquí:',
    'footer.contacto': 'Contacto',
  },
  ca: {
    'nav.boda': "El casament",
    'nav.barcelona': 'Barcelona',
    'nav.regalos': 'Regals',
    'nav.galeria': 'Galeria',
    'nav.preguntas': 'Preguntes',
    'nav.rsvp': "Confirma l'assistència",
    'hero.date': 'Dissabte 19 de juny, 2027',
    'countdown.title': 'PREPAREU LES GANES, AIXÒ COMENÇA EN…',
    'countdown.dias': 'Dies',
    'countdown.horas': 'Hores',
    'countdown.minutos': 'Minuts',
    'countdown.segundos': 'Segons',
    'boda.eyebrow': '18 i 19 de juny de 2027',
    'boda.title': 'EL CASAMENT',
    'boda.script': 'Dos dies per celebrar-ho',
    'boda.viernes.eyebrow': 'Divendres 18 de juny',
    'boda.viernes.title': 'Dinar amb la família',
    'boda.fecha': 'Data:',
    'boda.horario': 'Horari:',
    'boda.lugar': 'Lloc:',
    'boda.ubicacion': 'Ubicació',
    'boda.web': 'Web',
    'boda.dresscode': 'Dress code:',
    'boda.viernes.fechaValue': 'divendres 18 de juny de 2027',
    'boda.viernes.horarioValue': '12h aperitiu · 14h dinar',
    'boda.viernes.lugarValue': 'Mas Juli',
    'boda.viernes.dressValue': 'Casual — Semi-formal',
    'boda.sabado.eyebrow': 'Dissabte 19 de juny',
    'boda.sabado.title': 'Cerimònia i banquet',
    'boda.ceremonia': 'Cerimònia:',
    'boda.ceremoniaValue':
      'Mare de Déu de Gràcia — 08398 Santa Susanna, Barcelona · 18h',
    'boda.banquete': 'Banquet:',
    'boda.banqueteValue': 'Pura Brasa, Pineda de Mar',
    'boda.horarios': 'Horaris:',
    'boda.horariosValue':
      'Cerimònia 18h · Aperitiu 20h · Sopar 21h · Festa fins a les 03:00h',
    'boda.sabado.dressValue': 'Etiqueta (Black Tie)',
    'barcelona.eyebrow': 'Guia per a convidats',
    'barcelona.title': 'BARCELONA',
    'barcelona.script': 'Tot el que necessiteu si veniu de fora',
    'guide.comoLlegar': 'Com arribar',
    'guide.comoLlegar.text':
      "Informació sobre com arribar des de l'aeroport i moure's per la ciutat amb transport públic.",
    'guide.transporte': 'Transport públic →',
    'guide.dormir': 'On dormir',
    'guide.dormir.text': 'Hotels recomanats a prop de la cerimònia i del banquet.',
    'guide.dormir.todo': '(Afegiu aquí els vostres hotels recomanats)',
    'guide.comer': 'On menjar',
    'guide.comer.text': 'Una selecció de restaurants per a tots els gustos.',
    'guide.michelin': 'Guia Michelin Barcelona →',
    'guide.visitar': 'Què visitar (2-3 dies)',
    'guide.visitar.text':
      'Itineraris pensats per aprofitar una escapada curta.',
    'guide.itinerarios': 'Itineraris a Barcelona →',
    'guide.playas': 'Platges',
    'guide.playas.text': 'Les millors platges de la ciutat i voltants.',
    'guide.mar': 'Mar i platges →',
    'guide.cosas': 'Coses a fer',
    'guide.cosas.text': 'Idees i plans per si us quedeu uns dies més.',
    'guide.descubrir': 'Descobrir Barcelona →',
    'guide.consejos': 'Consells ràpids',
    'guide.consejos.text':
      'Efectiu, taxis, clima… Aquí podeu afegir qualsevol consell útil per als vostres convidats abans que arribin.',
    'regalos.title': 'REGALS',
    'regalos.text1':
      'El més important per a nosaltres és compartir aquest dia amb vosaltres.',
    'regalos.text2':
      'Si a més ens voleu ajudar a començar la nostra nova aventura, ho podeu fer mitjançant una aportació al nostre viatge de noces.',
    'regalos.iban': 'IBAN',
    'regalos.bizum': 'Bizum',
    'galeria.eyebrow': 'Els nostres moments',
    'galeria.title': 'GALERIA',
    'galeria.script': "Un cop d'ull a la nostra història",
    'faq.eyebrow': 'Dubtes freqüents',
    'faq.title': 'PREGUNTES',
    'faq.script': 'Tot el que necessiteu saber',
    'faq.companiero.q': 'Puc portar acompanyant?',
    'faq.companiero.a':
      "Indiqueu-ho al formulari de confirmació d'assistència; si teniu dubtes, escriviu-nos directament.",
    'faq.dieta.q': 'Hi ha opcions per a restriccions alimentàries?',
    'faq.dieta.a':
      'Sí, ho podreu indicar al formulari de RSVP i ho tindrem en compte amb el càtering.',
    'faq.ninos.q': "S'hi admeten nens?",
    'faq.ninos.a': '(Completeu aquesta resposta segons la vostra decisió).',
    'faq.autobus.q': 'Com hi arribo si no tinc cotxe?',
    'faq.autobus.a':
      "Consulteu la secció de Barcelona per a informació sobre transport; també organitzarem un servei d'autobús (a confirmar).",
    'rsvp.eyebrow': 'Una darrera cosa',
    'rsvp.confirm': "CONFIRMA L'ASSISTÈNCIA",
    'rsvp.sub': 'El millor regal és la vostra companyia',
    'rsvp.note':
      'Però si voleu contribuir a la nostra nova etapa junts, ho podeu fer aquí:',
    'footer.contacto': 'Contacte',
  },
  en: {
    'nav.boda': 'The Wedding',
    'nav.barcelona': 'Barcelona',
    'nav.regalos': 'Gifts',
    'nav.galeria': 'Gallery',
    'nav.preguntas': 'FAQ',
    'nav.rsvp': 'Confirm attendance',
    'hero.date': 'Saturday 19 June, 2027',
    'countdown.title': 'GET READY, IT ALL STARTS IN…',
    'countdown.dias': 'Days',
    'countdown.horas': 'Hours',
    'countdown.minutos': 'Minutes',
    'countdown.segundos': 'Seconds',
    'boda.eyebrow': '18 and 19 June 2027',
    'boda.title': 'THE WEDDING',
    'boda.script': 'Two days of celebration',
    'boda.viernes.eyebrow': 'Friday 18 June',
    'boda.viernes.title': 'Family lunch',
    'boda.fecha': 'Date:',
    'boda.horario': 'Schedule:',
    'boda.lugar': 'Venue:',
    'boda.ubicacion': 'Location',
    'boda.web': 'Website',
    'boda.dresscode': 'Dress code:',
    'boda.viernes.fechaValue': 'Friday 18 June 2027',
    'boda.viernes.horarioValue': '12pm drinks · 2pm lunch',
    'boda.viernes.lugarValue': 'Mas Juli',
    'boda.viernes.dressValue': 'Casual — Semi-formal',
    'boda.sabado.eyebrow': 'Saturday 19 June',
    'boda.sabado.title': 'Ceremony & banquet',
    'boda.ceremonia': 'Ceremony:',
    'boda.ceremoniaValue':
      'Mare de Déu de Gràcia Church — 08398 Santa Susanna, Barcelona · 6pm',
    'boda.banquete': 'Banquet:',
    'boda.banqueteValue': 'Pura Brasa, Pineda de Mar',
    'boda.horarios': 'Timings:',
    'boda.horariosValue':
      'Ceremony 6pm · Drinks 8pm · Dinner 9pm · Party until 3am',
    'boda.sabado.dressValue': 'Formal (Black Tie)',
    'barcelona.eyebrow': 'Guest guide',
    'barcelona.title': 'BARCELONA',
    'barcelona.script': 'Everything you need if you are coming from afar',
    'guide.comoLlegar': 'Getting here',
    'guide.comoLlegar.text':
      'How to get here from the airport and how to get around the city on public transport.',
    'guide.transporte': 'Public transport →',
    'guide.dormir': 'Where to stay',
    'guide.dormir.text': 'Recommended hotels near the ceremony and the banquet.',
    'guide.dormir.todo': '(Add your recommended hotels here)',
    'guide.comer': 'Where to eat',
    'guide.comer.text': 'A selection of restaurants for every taste.',
    'guide.michelin': 'Michelin Guide Barcelona →',
    'guide.visitar': 'What to visit (2-3 days)',
    'guide.visitar.text': 'Itineraries planned for a short getaway.',
    'guide.itinerarios': 'Barcelona itineraries →',
    'guide.playas': 'Beaches',
    'guide.playas.text': 'The best beaches in the city and surroundings.',
    'guide.mar': 'Sea & beaches →',
    'guide.cosas': 'Things to do',
    'guide.cosas.text': 'Ideas and plans if you are staying a few more days.',
    'guide.descubrir': 'Discover Barcelona →',
    'guide.consejos': 'Quick tips',
    'guide.consejos.text':
      'Cash, taxis, weather… Add any useful tips for your guests before they arrive here.',
    'regalos.title': 'GIFTS',
    'regalos.text1':
      'The most important thing for us is sharing this day with you.',
    'regalos.text2':
      'And if you would like to help us start our new adventure, you can do so with a contribution to our honeymoon.',
    'regalos.iban': 'IBAN',
    'regalos.bizum': 'Bizum',
    'galeria.eyebrow': 'Our moments',
    'galeria.title': 'GALLERY',
    'galeria.script': 'A glimpse of our story',
    'faq.eyebrow': 'Frequently asked questions',
    'faq.title': 'FAQ',
    'faq.script': 'Everything you need to know',
    'faq.companiero.q': 'Can I bring a guest?',
    'faq.companiero.a':
      'Let us know on the RSVP form; if you have any questions, write to us directly.',
    'faq.dieta.q': 'Are there options for dietary restrictions?',
    'faq.dieta.a':
      'Yes, you can mention it on the RSVP form and we will arrange it with the caterer.',
    'faq.ninos.q': 'Are children welcome?',
    'faq.ninos.a': '(Complete this answer as you decide).',
    'faq.autobus.q': 'How do I get there without a car?',
    'faq.autobus.a':
      'Check the Barcelona section for transport information; we will also arrange a coach service (to be confirmed).',
    'rsvp.eyebrow': 'One last thing',
    'rsvp.confirm': 'CONFIRM ATTENDANCE',
    'rsvp.sub': 'The best gift is your company',
    'rsvp.note':
      'But if you would like to contribute to our new chapter together, you can do so here:',
    'footer.contacto': 'Contact',
  },
}

type LanguageContextValue = {
  lang: Lang
  setLang: (lang: Lang) => void
  t: (key: string) => string
}

const LanguageContext = createContext<LanguageContextValue>({
  lang: 'es',
  setLang: () => undefined,
  t: (key) => key,
})

function useLanguage() {
  return useContext(LanguageContext)
}

function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang | null>(() => {
    const saved = localStorage.getItem(LANG_STORAGE_KEY)
    return saved === 'ca' || saved === 'es' || saved === 'en' ? saved : 'es'
  })
  const [pickerOpen, setPickerOpen] = useState(true)

  const setLang = useCallback((next: Lang) => {
    localStorage.setItem(LANG_STORAGE_KEY, next)
    setLangState(next)
  }, [])

  const t = useCallback(
    (key: string) => TRANSLATIONS[lang ?? 'es'][key] ?? key,
    [lang],
  )

  return (
    <LanguageContext.Provider value={{ lang: lang ?? 'es', setLang, t }}>
      {pickerOpen && (
        <LanguagePicker
          onSelect={(next) => {
            setLang(next)
            setPickerOpen(false)
          }}
        />
      )}
      {children}
    </LanguageContext.Provider>
  )
}

/* ============================================================
   COMPONENTE: selector de idioma inicial (pantalla completa)
   ============================================================ */

function LanguagePicker({ onSelect }: { onSelect: (lang: Lang) => void }) {
  const options: { id: Lang; label: string }[] = [
    { id: 'ca', label: 'Català' },
    { id: 'es', label: 'Castellano' },
    { id: 'en', label: 'English' },
  ]

  return (
    <div className="language-overlay" role="dialog" aria-modal="true" aria-label="Idioma">
      <div className="language-overlay__card">
        <p className="language-overlay__title">¿Qué idioma prefieres?</p>
        <p className="language-overlay__sub">
          Quin idioma prefereixes? · Which language do you prefer?
        </p>
        <div className="language-overlay__options">
          {options.map((o) => (
            <button
              key={o.id}
              type="button"
              className="language-overlay__option"
              onClick={() => onSelect(o.id)}
            >
              {o.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

/* ============================================================
   COMPONENTE: selector de idioma compacto (navbar / footer)
   ============================================================ */

function LanguageSwitcher({ className = '' }: { className?: string }) {
  const { lang, setLang } = useLanguage()
  const options: { id: Lang; label: string }[] = [
    { id: 'ca', label: 'CAT' },
    { id: 'es', label: 'ESP' },
    { id: 'en', label: 'ENG' },
  ]

  return (
    <div className={`language-switcher ${className}`}>
      {options.map((o) => (
        <button
          key={o.id}
          type="button"
          className={`language-switcher__option${lang === o.id ? ' language-switcher__option--active' : ''}`}
          aria-pressed={lang === o.id}
          onClick={() => setLang(o.id)}
        >
          {o.label}
        </button>
      ))}
    </div>
  )
}

/* ============================================================
   HOOK: revelar elementos al hacer scroll (fade + subida)
   ============================================================ */

function useReveal<T extends HTMLElement>(threshold = 0.15) {
  const ref = useRef<T | null>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const node = ref.current
    if (!node) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          observer.unobserve(node)
        }
      },
      { threshold, rootMargin: '0px 0px -8% 0px' },
    )

    observer.observe(node)
    return () => observer.disconnect()
  }, [threshold])

  return { ref, visible }
}

function Reveal({
  children,
  delay = 0,
  className = '',
  as = 'div',
}: {
  children: React.ReactNode
  delay?: number
  className?: string
  as?: 'div' | 'li'
}) {
  const { ref, visible } = useReveal<HTMLDivElement>()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const Tag = as as any
  return (
    <Tag
      ref={ref}
      className={`reveal ${visible ? 'is-visible' : ''} ${className}`}
      style={{ transitionDelay: visible ? `${delay}ms` : '0ms' }}
    >
      {children}
    </Tag>
  )
}

/* ============================================================
   HOOK: efecto de "apilado" (stack) al hacer scroll
   -> Solo se aplica a las secciones cortas (un viewport):
      hero, cuenta atrás, regalos y rsvp final. Recorre esas
      .stack-section y, con un único listener de scroll
      (throttled con rAF), calcula cuánto se ha "cubierto" cada
      una (0 → 1) a medida que la siguiente sube por detrás. Ese
      valor se expone como variable CSS --cover para animar cada
      panel en CSS.
   ============================================================ */

function useStackCoverEffect() {
  useEffect(() => {
    const sections = Array.from(
      document.querySelectorAll<HTMLElement>('.stack-section'),
    )
    if (!sections.length) return

    let ticking = false

    const update = () => {
      const vh = window.innerHeight
      sections.forEach((el) => {
        const rect = el.getBoundingClientRect()
        const scrolledPast = Math.min(Math.max(-rect.top, 0), vh)
        const cover = scrolledPast / vh
        el.style.setProperty('--cover', cover.toFixed(3))
      })
      ticking = false
    }

    const onScroll = () => {
      if (!ticking) {
        ticking = true
        requestAnimationFrame(update)
      }
    }

    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [])
}

/* ============================================================
   COMPONENTE: StackSection
   -> SOLO para secciones cortas de un viewport (hero, cuenta
      atrás, regalos, rsvp). Usan sticky real: quedan "clavadas"
      mientras la siguiente las cubre. Como ninguna mide más de
      100vh, nunca esconden contenido.
      El zIndex se pasa desde App() como un contador GLOBAL y
      creciente para toda la página (no se reinicia por sección),
      así el orden de "quién cubre a quién" es siempre correcto
      sin importar si la sección anterior/siguiente es de este
      tipo o una <SlideSection>.
   ============================================================ */

function StackSection({
  id,
  zIndex,
  interactive = false,
  className = '',
  children,
}: {
  id?: string
  zIndex: number
  interactive?: boolean
  className?: string
  children: React.ReactNode
}) {
  return (
    <section
      id={id}
      className={`stack-section ${interactive ? 'stack-section--interactive' : ''} ${className}`}
      style={{ zIndex }}
    >
      <div className="stack-section__inner">{children}</div>
    </section>
  )
}

/* ============================================================
   COMPONENTE: SlideSection
   -> Para las secciones largas (La Boda, Barcelona, Galería,
      FAQ). A propósito NO usan sticky/freeze: quedan en flujo
      normal de scroll para que TODO su contenido sea siempre
      alcanzable, sin importar cuánto mida.
      La sensación de "deslizarse y montarse encima" de la
      sección anterior se logra solo con CSS: un zIndex global
      creciente (mismo contador que <StackSection>), una esquina
      superior redondeada, una sombra proyectada hacia arriba y
      un leve solape negativo (ver .slide-section en App.css).
      Así, al hacer scroll, cada sección "sube" visualmente y
      cubre el borde inferior de la anterior — mismo lenguaje
      visual que la cuenta atrás — pero nada queda oculto ni
      atrapado detrás de una fijación que no se libera.
   ============================================================ */

function SlideSection({
  id,
  zIndex,
  className = '',
  children,
}: {
  id?: string
  zIndex: number
  className?: string
  children: React.ReactNode
}) {
  return (
    <section id={id} className={`slide-section ${className}`} style={{ zIndex }}>
      {children}
    </section>
  )
}

/* ============================================================
   COMPONENTE: StickySplit
   ============================================================ */

function StickySplit({
  sticky,
  panels,
  reverse = false,
}: {
  sticky: React.ReactNode
  panels: React.ReactNode[]
  reverse?: boolean
}) {
  return (
    <div className={`sticky-split ${reverse ? 'sticky-split--reverse' : ''}`}>
      <div className="sticky-split__sticky">
        <Reveal className="sticky-split__sticky-inner" as="div">
          {sticky}
        </Reveal>
      </div>

      <div className="sticky-split__scroll">
        {panels.map((panel, i) => (
          <div className="sticky-split__panel" key={i}>
            <Reveal>{panel}</Reveal>
          </div>
        ))}
      </div>
    </div>
  )
}

/* ============================================================
   COMPONENTE: SignatureDivider
   -> Elemento firma: un trazo dorado fino con un rombo en el
      centro. Marca el cierre del encabezado de cada bloque.
   ============================================================ */

function SignatureDivider() {
  return <span className="signature-divider" aria-hidden="true" />
}

/* ============================================================
   COMPONENTE: HeroPhoto
   ============================================================ */

function HeroPhoto() {
  return (
    <div className="hero-image-wrap">
      <img src={heroImage} alt="Luana y Joan" className="hero-image" />
    </div>
  )
}

function PhotoPairInline({ idA, idB }: { idA: string; idB: string }) {
  return (
    <div className="photo-pair-inline">
      <div className="image-placeholder" id={idA}>
        <span>Foto {idA}</span>
      </div>
      <div className="image-placeholder" id={idB}>
        <span>Foto {idB}</span>
      </div>
    </div>
  )
}

/* ============================================================
   COMPONENTE: RsvpCard
   ============================================================ */

function RsvpCard() {
  const { t } = useLanguage()

  return (
    <div className="cta-card">
      <p className="cta-card__eyebrow">{t('rsvp.eyebrow')}</p>
      <h3 className="cta-card__title">
        <a href={RSVP_FORM_URL} target="_blank" rel="noreferrer">
          {t('rsvp.confirm')}
        </a>
      </h3>
      <p className="cta-card__sub">{t('rsvp.sub')}</p>
      <p className="cta-card__note">{t('rsvp.note')}</p>
      <p className="cta-card__iban">ESXX XXXX XXXX XXXX XXXX XXXX</p>
    </div>
  )
}

/* ============================================================
   COMPONENTE: cuenta atrás
   ============================================================ */

function useCountdown(target: Date) {
  const [timeLeft, setTimeLeft] = useState(() => target.getTime() - Date.now())

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft(target.getTime() - Date.now())
    }, 1000)
    return () => clearInterval(interval)
  }, [target])

  return useMemo(() => {
    const clamped = Math.max(timeLeft, 0)
    const totalSeconds = Math.floor(clamped / 1000)
    const days = Math.floor(totalSeconds / 86400)
    const hours = Math.floor((totalSeconds % 86400) / 3600)
    const minutes = Math.floor((totalSeconds % 3600) / 60)
    const seconds = totalSeconds % 60
    return { days, hours, minutes, seconds }
  }, [timeLeft])
}

function Countdown() {
  const { t } = useLanguage()
  const { days, hours, minutes, seconds } = useCountdown(WEDDING_DATE)
  const pad = (n: number) => n.toString().padStart(2, '0')

  return (
    <div className="countdown">
      <div className="countdown__item">
        <span className="countdown__number">{pad(days)}</span>
        <span className="countdown__label">{t('countdown.dias')}</span>
      </div>
      <span className="countdown__colon">:</span>
      <div className="countdown__item">
        <span className="countdown__number">{pad(hours)}</span>
        <span className="countdown__label">{t('countdown.horas')}</span>
      </div>
      <span className="countdown__colon">:</span>
      <div className="countdown__item">
        <span className="countdown__number">{pad(minutes)}</span>
        <span className="countdown__label">{t('countdown.minutos')}</span>
      </div>
      <span className="countdown__colon">:</span>
      <div className="countdown__item">
        <span className="countdown__number">{pad(seconds)}</span>
        <span className="countdown__label">{t('countdown.segundos')}</span>
      </div>
    </div>
  )
}

/* ============================================================
   COMPONENTE: FAQ
   ============================================================ */

function Faq({ question, answer }: { question: string; answer: string }) {
  return (
    <details className="faq-item">
      <summary>{question}</summary>
      <p>{answer}</p>
    </details>
  )
}

/* ============================================================
   NAVBAR
   ============================================================ */

function Navbar() {
  const { t } = useLanguage()

  return (
    <header className="navbar">
      <a className="navbar__logo" href="#inicio" aria-label="Luana y Joan">
        L+J
      </a>

      <nav className="navbar__links">
        <a href="#boda">{t('nav.boda')}</a>
        <a href="#barcelona">{t('nav.barcelona')}</a>
        <a href="#regalos">{t('nav.regalos')}</a>
        <a href="#galeria">{t('nav.galeria')}</a>
        <a href="#faq">{t('nav.preguntas')}</a>
      </nav>

      <div className="navbar__right">
        <LanguageSwitcher className="navbar__lang" />
        <a className="navbar__rsvp" href={RSVP_FORM_URL} target="_blank" rel="noreferrer">
          {t('nav.rsvp')}
        </a>
      </div>
    </header>
  )
}

/* ============================================================
   APP
   -> El zIndex de cada sección (corta o larga) se pasa a mano,
      creciendo de 1 a 8 en el mismo orden en que aparecen en la
      página. Es importante que sea un contador ÚNICO y GLOBAL
      (no reiniciado por grupo) para que el "montado" visual de
      unas secciones sobre otras sea siempre consistente.
   ============================================================ */

function AppContent() {
  useStackCoverEffect()
  const { t } = useLanguage()

  return (
    <>
      <Navbar />

      <div className="stack">
        {/* HERO */}
        <StackSection id="inicio" zIndex={1} interactive className="stack-section--hero">
          <section className="hero">
            <HeroPhoto />

            <div className="hero__content">
              <Reveal>
                <h1 className="hero__title">
                  LUANA <span className="hero__amp">&amp;</span> JOAN
                </h1>
              </Reveal>

              <Reveal delay={200}>
                <p className="hero__date">{t('hero.date')}</p>
              </Reveal>

              <Reveal delay={350}>
                <p className="hero__place">Santa Susanna · Barcelonaaa</p>
              </Reveal>

              <Reveal delay={500}>
                <a className="btn btn--cta" href={RSVP_FORM_URL} target="_blank" rel="noreferrer">
                  RSVP
                </a>
              </Reveal>
            </div>
          </section>
        </StackSection>

        {/* CUENTA ATRÁS */}
        <StackSection id="cuenta-atras" zIndex={2} interactive className="stack-section--center">
          <Reveal>
            <h2 className="section__title">{t('countdown.title')}</h2>
            <SignatureDivider />
          </Reveal>
          <Reveal delay={150} className="content-card countdown-card">
            <Countdown />
          </Reveal>
        </StackSection>
      </div>

      {/* LA BODA — flujo normal: se recorre entera con scroll, y
          se "monta" visualmente sobre la cuenta atrás gracias al
          zIndex mayor + esquina redondeada + sombra (ver App.css) */}
      <SlideSection id="boda" zIndex={3}>
        <StickySplit
          sticky={
            <>
              <p className="sticky-split__eyebrow">{t('boda.eyebrow')}</p>
              <h2 className="section__title">{t('boda.title')}</h2>
              <SignatureDivider />
              <p className="section__script">{t('boda.script')}</p>
            </>
          }
          panels={[
            <div className="content-card day-card">
              <p className="section__eyebrow">
                <Calendar className="eyebrow-icon" size={16} strokeWidth={2} />
                {t('boda.viernes.eyebrow')}
              </p>
              <h3 className="section__subtitle">{t('boda.viernes.title')}</h3>
              <ul className="info-list">
                <li>
                  <strong>{t('boda.fecha')}</strong> {t('boda.viernes.fechaValue')}
                </li>
                <li>
                  <strong>{t('boda.horario')}</strong> {t('boda.viernes.horarioValue')}
                </li>
                <li>
                  <strong>{t('boda.lugar')}</strong> {t('boda.viernes.lugarValue')} —{' '}
                  <a href="https://maps.app.goo.gl/AtnPNJaFwYZtAXqk7" target="_blank" rel="noreferrer">
                    {t('boda.ubicacion')}
                  </a>{' '}
                  ·{' '}
                  <a href="https://www.masjuli.com/" target="_blank" rel="noreferrer">
                    {t('boda.web')}
                  </a>
                </li>
                <li>
                  <strong>{t('boda.dresscode')}</strong> {t('boda.viernes.dressValue')}
                </li>
              </ul>
              <PhotoPairInline idA="viernes-1" idB="viernes-2" />
            </div>,

            <div className="content-card day-card">
              <p className="section__eyebrow">
                <Calendar className="eyebrow-icon" size={16} strokeWidth={2} />
                {t('boda.sabado.eyebrow')}
              </p>
              <h3 className="section__subtitle">{t('boda.sabado.title')}</h3>
              <ul className="info-list">
                <li>
                  <strong>{t('boda.ceremonia')}</strong>{' '}
                  {t('boda.ceremoniaValue')} —{' '}
                  <a href="https://maps.app.goo.gl/Sayn9kWy1gSqSJXD7" target="_blank" rel="noreferrer">
                    {t('boda.ubicacion')}
                  </a>
                </li>
                <li>
                  <strong>{t('boda.banquete')}</strong> {t('boda.banqueteValue')} —{' '}
                  <a href="https://maps.app.goo.gl/G3Tbx11tWSBvgKnK8" target="_blank" rel="noreferrer">
                    {t('boda.ubicacion')}
                  </a>{' '}
                  · 20h aperitivo · 21h cena
                </li>
                <li>
                  <strong>{t('boda.dresscode')}</strong> {t('boda.sabado.dressValue')}
                </li>
                <li>
                  <strong>{t('boda.horarios')}</strong> {t('boda.horariosValue')}
                </li>
              </ul>
              <PhotoPairInline idA="sabado-1" idB="sabado-2" />
            </div>,
          ]}
        />
      </SlideSection>

      {/* BARCELONA — flujo normal: se recorre entera con scroll */}
      <SlideSection id="barcelona" zIndex={4}>
        <StickySplit
          reverse
          sticky={
            <>
              <p className="sticky-split__eyebrow">{t('barcelona.eyebrow')}</p>
              <h2 className="section__title">
                <Plane className="title-icon" size={32} strokeWidth={1.75} />
                {t('barcelona.title')}
              </h2>
              <SignatureDivider />
              <p className="section__script">{t('barcelona.script')}</p>
            </>
          }
          panels={[
            <div className="guide-panel">
              <h4>{t('guide.comoLlegar')}</h4>
              <p>{t('guide.comoLlegar.text')}</p>
              <a href="https://thisisbarcelona.com/getting-around-the-city" target="_blank" rel="noreferrer">
                {t('guide.transporte')}
              </a>
            </div>,
            <div className="guide-panel">
              <h4>{t('guide.dormir')}</h4>
              <p>{t('guide.dormir.text')}</p>
              <span className="guide-card__todo">{t('guide.dormir.todo')}</span>
            </div>,
            <div className="guide-panel">
              <h4>{t('guide.comer')}</h4>
              <p>{t('guide.comer.text')}</p>
              <a href="https://guide.michelin.com/es/es/catalunya/barcelona/restaurantes" target="_blank" rel="noreferrer">
                {t('guide.michelin')}
              </a>
            </div>,
            <div className="guide-panel">
              <h4>{t('guide.visitar')}</h4>
              <p>{t('guide.visitar.text')}</p>
              <a href="https://thisisbarcelona.com/es/itinerarios" target="_blank" rel="noreferrer">
                {t('guide.itinerarios')}
              </a>
            </div>,
            <div className="guide-panel">
              <h4>{t('guide.playas')}</h4>
              <p>{t('guide.playas.text')}</p>
              <a href="https://thisisbarcelona.com/sea-and-mountains/sea-and-beaches" target="_blank" rel="noreferrer">
                {t('guide.mar')}
              </a>
            </div>,
            <div className="guide-panel">
              <h4>{t('guide.cosas')}</h4>
              <p>{t('guide.cosas.text')}</p>
              <a href="https://thisisbarcelona.com/es" target="_blank" rel="noreferrer">
                {t('guide.descubrir')}
              </a>
            </div>,
            <div className="guide-panel">
              <h4>{t('guide.consejos')}</h4>
              <p>{t('guide.consejos.text')}</p>
            </div>,
          ]}
        />
      </SlideSection>

      <div className="stack">
        {/* REGALOS */}
        <StackSection id="regalos" zIndex={5} interactive className="stack-section--center">
          <Reveal>
            <h2 className="section__title">
              <Gift className="title-icon" size={32} strokeWidth={1.75} />
              {t('regalos.title')}
            </h2>
            <SignatureDivider />
          </Reveal>

          <Reveal delay={150} className="content-card">
            <p className="gift-text">{t('regalos.text1')}</p>
            <p className="gift-text">{t('regalos.text2')}</p>

            <div className="gift-box">
              <div className="gift-box__item">
                <span className="gift-box__label">{t('regalos.iban')}</span>
                <span className="gift-box__value">ESXX XXXX XXXX XXXX XXXX XXXX</span>
              </div>
              <div className="gift-box__item">
                <span className="gift-box__label">{t('regalos.bizum')}</span>
                <span className="gift-box__value">600 000 000</span>
              </div>
            </div>
          </Reveal>
        </StackSection>
      </div>

      {/* GALERÍA — flujo normal: se recorre entera con scroll */}
      <SlideSection id="galeria" zIndex={6}>
        <StickySplit
          sticky={
            <>
              <p className="sticky-split__eyebrow">{t('galeria.eyebrow')}</p>
              <h2 className="section__title">
                <Camera className="title-icon" size={32} strokeWidth={1.75} />
                {t('galeria.title')}
              </h2>
              <SignatureDivider />
              <p className="section__script">{t('galeria.script')}</p>
            </>
          }
          panels={[
            <PhotoPairInline idA="galeria-1" idB="galeria-2" />,
            <PhotoPairInline idA="galeria-3" idB="galeria-4" />,
            <PhotoPairInline idA="galeria-5" idB="galeria-6" />,
          ]}
        />
      </SlideSection>

      {/* FAQ — flujo normal: se recorre entera con scroll */}
      <SlideSection id="faq" zIndex={7}>
        <StickySplit
          reverse
          sticky={
            <>
              <p className="sticky-split__eyebrow">{t('faq.eyebrow')}</p>
              <h2 className="section__title">
                <HelpCircle className="title-icon" size={32} strokeWidth={1.75} />
                {t('faq.title')}
              </h2>
              <SignatureDivider />
              <p className="section__script">{t('faq.script')}</p>
            </>
          }
          panels={[
            <Faq question={t('faq.companiero.q')} answer={t('faq.companiero.a')} />,
            <Faq question={t('faq.dieta.q')} answer={t('faq.dieta.a')} />,
            <Faq question={t('faq.ninos.q')} answer={t('faq.ninos.a')} />,
            <Faq question={t('faq.autobus.q')} answer={t('faq.autobus.a')} />,
          ]}
        />
      </SlideSection>

      <div className="stack">
        {/* RSVP FINAL */}
        <StackSection id="rsvp" zIndex={8} interactive className="stack-section--center">
          <Reveal>
            <RsvpCard />
          </Reveal>
        </StackSection>
      </div>

      {/* FOOTER (fuera del stack, no se apila) */}
      <footer className="footer">
        <div className="footer__logo">L+J</div>

        <nav className="footer__links">
          <a href="#boda">{t('nav.boda')}</a>
          <a href="#barcelona">{t('nav.barcelona')}</a>
          <a href="#regalos">{t('nav.regalos')}</a>
          <a href="#galeria">{t('nav.galeria')}</a>
          <a href="#faq">{t('nav.preguntas')}</a>
        </nav>

        <LanguageSwitcher className="footer__lang" />

        <div className="footer__contact">
          <p>{t('footer.contacto')}</p>
          <p>Luana +34 XXX XX XX XX</p>
          <p>Joan +34 XXX XX XX XX</p>
          <p>luanayjoan@gmail.com</p>
        </div>

        <p className="footer__copy">© 2027 Luana &amp; Joan</p>
      </footer>
    </>
  )
}

function App() {
  return (
    <LanguageProvider>
      <AppContent />
    </LanguageProvider>
  )
}

export default App