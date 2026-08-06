import { useEffect, useMemo, useRef, useState } from 'react'
import { Plane, Calendar, Gift, Camera, HelpCircle } from 'lucide-react'
import './App.css'
import heroImage from './assets/L y J.png'

/* ============================================================
   CONFIGURACIÓN RÁPIDA
   ============================================================ */

// 🔗 Cuando tengas el formulario listo, pega aquí el enlace
const RSVP_FORM_URL = 'https://docs.google.com/forms/d/e/1FAIpQLSftqVzloPmw7Er1bijvI-xNuqiw6Wy4-QE4uirZZqajDnWT2w/viewform?usp=publish-editor'

// 📅 Fecha y hora objetivo para la cuenta atrás (ceremonia)
const WEDDING_DATE = new Date('2027-06-19T18:00:00')

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
      { threshold, rootMargin: '0px 0px -8% 0px' }
    )

    observer.observe(node)
    return () => observer.disconnect()
  }, [threshold])

  return { ref, visible }
}

/** Envoltorio genérico: aplica la clase "reveal" + "is-visible" */
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
   COMPONENTE: StickySplit
   -> Columna izquierda: se queda fija (position: sticky)
   -> Columna derecha: una serie de "paneles" que van subiendo
      y apareciendo a medida que el usuario hace scroll, mientras
      la izquierda permanece estática.
   ============================================================ */

function StickySplit({
  id,
  sticky,
  panels,
  reverse = false,
}: {
  id?: string
  sticky: React.ReactNode
  panels: React.ReactNode[]
  reverse?: boolean
}) {
  return (
    <section
      id={id}
      className={`sticky-split ${reverse ? 'sticky-split--reverse' : ''}`}
    >
      <div className="sticky-split__sticky">
        <div className="sticky-split__sticky-inner">{sticky}</div>
      </div>

      <div className="sticky-split__scroll">
        {panels.map((panel, i) => (
          <div className="sticky-split__panel" key={i}>
            <Reveal>{panel}</Reveal>
          </div>
        ))}
      </div>
    </section>
  )
}

/* ============================================================
   COMPONENTE: HeroPhoto
   -> Foto real de portada (L y J.png). Ocupa el ancho completo
      de la pantalla al inicio del scroll, con altura adaptable
      (vh) para verse bien en móvil, y un degradado inferior
      para que el texto sea legible.
   ============================================================ */

function HeroPhoto() {
  return (
    <div className="hero-image-wrap">
      <img src={heroImage} alt="Luana y Joan" className="hero-image" />
    </div>
  )
}

/* Par de fotos "planas", pensado para ir DENTRO de un panel de StickySplit */
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
   -> Tarjeta final de "Una última cosa / CONFIRMAR ASISTENCIA".
   ============================================================ */

function RsvpCard() {
  return (
    <div className="cta-card">
      <p className="cta-card__eyebrow">Una última cosa</p>
      <h3 className="cta-card__title">
        <a href={RSVP_FORM_URL} target="_blank" rel="noreferrer">
          CONFIRMAR ASISTENCIA
        </a>
      </h3>
      <p className="cta-card__sub">El mejor regalo es vuestra compañía</p>
      <p className="cta-card__note">
        Pero si queréis contribuir a nuestra nueva etapa juntos, podéis
        hacerlo aquí:
      </p>
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
  const { days, hours, minutes, seconds } = useCountdown(WEDDING_DATE)
  const pad = (n: number) => n.toString().padStart(2, '0')

  return (
    <div className="countdown">
      <div className="countdown__item">
        <span className="countdown__number">{pad(days)}</span>
        <span className="countdown__label">Días</span>
      </div>
      <span className="countdown__colon">:</span>
      <div className="countdown__item">
        <span className="countdown__number">{pad(hours)}</span>
        <span className="countdown__label">Horas</span>
      </div>
      <span className="countdown__colon">:</span>
      <div className="countdown__item">
        <span className="countdown__number">{pad(minutes)}</span>
        <span className="countdown__label">Minutos</span>
      </div>
      <span className="countdown__colon">:</span>
      <div className="countdown__item">
        <span className="countdown__number">{pad(seconds)}</span>
        <span className="countdown__label">Segundos</span>
      </div>
    </div>
  )
}

/* ============================================================
   COMPONENTE: FAQ (acordeón simple con <details>)
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
  return (
    <header className="navbar">
      <a className="navbar__logo" href="#inicio" aria-label="Luana y Joan">
        L+J
      </a>

      <nav className="navbar__links">
        <a href="#boda">La boda</a>
        <a href="#barcelona">Barcelona</a>
        <a href="#regalos">Regalos</a>
        <a href="#galeria">Galería</a>
        <a href="#faq">Preguntas</a>
      </nav>

      <a className="navbar__rsvp" href={RSVP_FORM_URL} target="_blank" rel="noreferrer">
        Confirmar asistencia
      </a>
    </header>
  )
}

/* ============================================================
   APP
   ============================================================ */

function App() {
  return (
    <>
      <Navbar />

      {/* ---------------------------------------------------- */}
      {/* HERO — foto grande al inicio + nombres/fecha/lugar    */}
      {/* ---------------------------------------------------- */}
      <section id="inicio" className="hero">
        <HeroPhoto />

        <div className="hero__content">
          <Reveal>
            <h1 className="hero__title">
              LUANA <span className="hero__amp">&amp;</span> JOAN
            </h1>
          </Reveal>

          <Reveal delay={200}>
            <p className="hero__date">Sábado 19 de Junio, 2027</p>
          </Reveal>

          <Reveal delay={350}>
            <p className="hero__place">Santa Susanna · Barcelona</p>
          </Reveal>

          <Reveal delay={500}>
            <a className="btn btn--cta" href={RSVP_FORM_URL} target="_blank" rel="noreferrer">
              RSVP
            </a>
          </Reveal>
        </div>
      </section>

      {/* ---------------------------------------------------- */}
      {/* CUENTA ATRÁS */}
      {/* ---------------------------------------------------- */}
      <section id="cuenta-atras" className="section section--center">
        <Reveal>
          <h2 className="section__title">PREPARAD LAS GANAS, ESTO EMPIEZA EN…</h2>
        </Reveal>
        <Reveal delay={150}>
          <Countdown />
        </Reveal>
      </section>

      {/* ---------------------------------------------------- */}
      {/* LA BODA — sticky: título fijo / scroll: viernes + sábado */}
      {/* ---------------------------------------------------- */}
      <StickySplit
        id="boda"
        sticky={
          <>
            <p className="sticky-split__eyebrow">18 y 19 de Junio de 2027</p>
            <h2 className="section__title">LA BODA</h2>
            <p className="section__script">Dos días para celebrarlo</p>
          </>
        }
        panels={[
          // Panel 1 — Viernes 18
          <div>
            <p className="section__eyebrow">
              <Calendar className="eyebrow-icon" size={16} strokeWidth={2} />
              Viernes 18 de Junio
            </p>
            <h3 className="section__subtitle">Comida con la familia</h3>
            <ul className="info-list">
              <li>
                <strong>Fecha:</strong> viernes 18 de Junio de 2027
              </li>
              <li>
                <strong>Horario:</strong> 12h aperitivo · 14h comida
              </li>
              <li>
                <strong>Lugar:</strong> Mas Juli —{' '}
                <a href="https://maps.app.goo.gl/AtnPNJaFwYZtAXqk7" target="_blank" rel="noreferrer">
                  Ubicación
                </a>{' '}
                ·{' '}
                <a href="https://www.masjuli.com/" target="_blank" rel="noreferrer">
                  Web
                </a>
              </li>
              <li>
                <strong>Dress code:</strong> Casual — Semi-formal
              </li>
            </ul>
            <PhotoPairInline idA="viernes-1" idB="viernes-2" />
          </div>,

          // Panel 2 — Sábado 19
          <div>
            <p className="section__eyebrow">
              <Calendar className="eyebrow-icon" size={16} strokeWidth={2} />
              Sábado 19 de Junio
            </p>
            <h3 className="section__subtitle">Ceremonia y banquete</h3>
            <ul className="info-list">
              <li>
                <strong>Ceremonia:</strong> Mare de Déu de Gràcia — 08398
                Santa Susanna, Barcelona · 18h —{' '}
                <a href="https://maps.app.goo.gl/Sayn9kWy1gSqSJXD7" target="_blank" rel="noreferrer">
                  Ubicación
                </a>
              </li>
              <li>
                <strong>Banquete:</strong> Pura Brasa, Pineda de Mar —{' '}
                <a href="https://maps.app.goo.gl/G3Tbx11tWSBvgKnK8" target="_blank" rel="noreferrer">
                  Ubicación
                </a>{' '}
                · 20h aperitivo · 21h cena
              </li>
              <li>
                <strong>Dress code:</strong> Etiqueta (Black Tie)
              </li>
              <li>
                <strong>Horarios:</strong> Ceremonia 18h · Aperitivo 20h ·
                Cena 21h · Fiesta hasta las 03:00h
              </li>
            </ul>
            <PhotoPairInline idA="sabado-1" idB="sabado-2" />
          </div>,
        ]}
      />

      {/* ---------------------------------------------------- */}
      {/* BARCELONA — sticky: intro / scroll: cada tema de la guía */}
      {/* ---------------------------------------------------- */}
      <StickySplit
        id="barcelona"
        reverse
        sticky={
          <>
            <p className="sticky-split__eyebrow">Guía para invitados</p>
            <h2 className="section__title">
              <Plane className="title-icon" size={32} strokeWidth={1.75} />
              BARCELONA
            </h2>
            <p className="section__script">
              Todo lo que necesitáis si venís de fuera
            </p>
          </>
        }
        panels={[
          <div className="guide-panel">
            <h4>Cómo llegar</h4>
            <p>
              Información sobre cómo llegar desde el aeropuerto y moverse
              por la ciudad en transporte público.
            </p>
            <a href="https://thisisbarcelona.com/getting-around-the-city" target="_blank" rel="noreferrer">
              Transporte público →
            </a>
          </div>,
          <div className="guide-panel">
            <h4>Dónde dormir</h4>
            <p>Hoteles recomendados cerca de la ceremonia y del banquete.</p>
            <span className="guide-card__todo">
              (Añadir aquí vuestros hoteles recomendados)
            </span>
          </div>,
          <div className="guide-panel">
            <h4>Dónde comer</h4>
            <p>Una selección de restaurantes para todos los gustos.</p>
            <a href="https://guide.michelin.com/es/es/catalunya/barcelona/restaurantes" target="_blank" rel="noreferrer">
              Guía Michelin Barcelona →
            </a>
          </div>,
          <div className="guide-panel">
            <h4>Qué visitar (2-3 días)</h4>
            <p>Itinerarios pensados para aprovechar una escapada corta.</p>
            <a href="https://thisisbarcelona.com/es/itinerarios" target="_blank" rel="noreferrer">
              Itinerarios en Barcelona →
            </a>
          </div>,
          <div className="guide-panel">
            <h4>Playas</h4>
            <p>Las mejores playas de la ciudad y alrededores.</p>
            <a href="https://thisisbarcelona.com/sea-and-mountains/sea-and-beaches" target="_blank" rel="noreferrer">
              Mar y playas →
            </a>
          </div>,
          <div className="guide-panel">
            <h4>Cosas para hacer</h4>
            <p>Ideas y planes por si os quedáis unos días más.</p>
            <a href="https://thisisbarcelona.com/es" target="_blank" rel="noreferrer">
              Descubrir Barcelona →
            </a>
          </div>,
          <div className="guide-panel">
            <h4>Consejos rápidos</h4>
            <p>
              Efectivo, taxis, clima… Aquí podéis añadir cualquier consejo
              útil para vuestros invitados antes de que lleguen.
            </p>
          </div>,
        ]}
      />

      {/* ---------------------------------------------------- */}
      {/* REGALOS */}
      {/* ---------------------------------------------------- */}
      <section id="regalos" className="section section--center">
        <Reveal>
          <h2 className="section__title">
            <Gift className="title-icon" size={32} strokeWidth={1.75} />
            REGALOS
          </h2>
        </Reveal>

        <Reveal delay={150} className="gift-text">
          <p>Lo más importante para nosotros es compartir este día con vosotros.</p>
          <p>
            Si además queréis ayudarnos a empezar nuestra nueva aventura,
            podéis hacerlo mediante una aportación a nuestra luna de miel.
          </p>
        </Reveal>

        <Reveal delay={300} className="gift-box">
          <div className="gift-box__item">
            <span className="gift-box__label">IBAN</span>
            <span className="gift-box__value">ESXX XXXX XXXX XXXX XXXX XXXX</span>
          </div>
          <div className="gift-box__item">
            <span className="gift-box__label">Bizum</span>
            <span className="gift-box__value">600 000 000</span>
          </div>
        </Reveal>
      </section>

      {/* ---------------------------------------------------- */}
      {/* GALERÍA — sticky: título / scroll: pares de fotos */}
      {/* ---------------------------------------------------- */}
      <StickySplit
        id="galeria"
        sticky={
          <>
            <p className="sticky-split__eyebrow">Nuestros momentos</p>
            <h2 className="section__title">
              <Camera className="title-icon" size={32} strokeWidth={1.75} />
              GALERÍA
            </h2>
            <p className="section__script">Un vistazo a nuestra historia</p>
          </>
        }
        panels={[
          <PhotoPairInline idA="galeria-1" idB="galeria-2" />,
          <PhotoPairInline idA="galeria-3" idB="galeria-4" />,
          <PhotoPairInline idA="galeria-5" idB="galeria-6" />,
        ]}
      />

      {/* ---------------------------------------------------- */}
      {/* FAQ — sticky: título / scroll: cada pregunta */}
      {/* ---------------------------------------------------- */}
      <StickySplit
        id="faq"
        reverse
        sticky={
          <>
            <p className="sticky-split__eyebrow">Dudas frecuentes</p>
            <h2 className="section__title">
              <HelpCircle className="title-icon" size={32} strokeWidth={1.75} />
              PREGUNTAS
            </h2>
            <p className="section__script">Todo lo que necesitáis saber</p>
          </>
        }
        panels={[
          <Faq
            question="¿Puedo llevar acompañante?"
            answer="Indicadlo en el formulario de confirmación de asistencia; si tenéis dudas, escribidnos directamente."
          />,
          <Faq
            question="¿Hay opciones para restricciones alimentarias?"
            answer="Sí, podréis indicarlo en el formulario de RSVP y lo tendremos en cuenta con el catering."
          />,
          <Faq
            question="¿Se admiten niños?"
            answer="(Completad esta respuesta según vuestra decisión)."
          />,
          <Faq
            question="¿Cómo llego si no tengo coche?"
            answer="Consultad la sección de Barcelona para información sobre transporte; también organizaremos un servicio de autobús (a confirmar)."
          />,
        ]}
      />

      {/* ---------------------------------------------------- */}
      {/* RSVP FINAL — "Una última cosa", al final del scroll,   */}
      {/* justo antes del footer.                                */}
      {/* ---------------------------------------------------- */}
      <section id="rsvp" className="section section--center rsvp-section">
        <Reveal>
          <RsvpCard />
        </Reveal>
      </section>

      {/* ---------------------------------------------------- */}
      {/* FOOTER */}
      {/* ---------------------------------------------------- */}
      <footer className="footer">
        <div className="footer__logo">L+J</div>

        <nav className="footer__links">
          <a href="#boda">La boda</a>
          <a href="#barcelona">Barcelona</a>
          <a href="#regalos">Regalos</a>
          <a href="#galeria">Galería</a>
          <a href="#faq">Preguntas</a>
        </nav>

        <div className="footer__contact">
          <p>Contacto</p>
          <p>Luana +34 XXX XX XX XX</p>
          <p>Joan +34 XXX XX XX XX</p>
          <p>luanayjoan@gmail.com</p>
        </div>

        <p className="footer__copy">© 2027 Luana &amp; Joan</p>
      </footer>
    </>
  )
}

export default App