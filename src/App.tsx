import { Icon } from '@iconify/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from 'lenis'
import { useEffect, useRef, useState } from 'react'
import { AboutAndFaqSection } from './components/AboutAndFaqSection'
import { ComparisonSection } from './components/ComparisonSection'
import { ConceptsSection } from './components/ConceptsSection'
import { CookieBanner, readSavedCookieChoice } from './components/CookieBanner'
import { FooterCta } from './components/FooterCta'
import { HeroAgentWidget } from './components/HeroAgentWidget'
import { LegalModal } from './components/LegalModal'
import { Navbar } from './components/Navbar'
import { PdfToCrystalScene } from './components/PdfToCrystalScene'
import { ProcessSection } from './components/ProcessSection'
import { SandboxDrawer } from './components/SandboxDrawer'
import { ScrollProgressHud } from './components/ScrollProgressHud'
import { SplitHeading } from './components/SplitHeading'
import type { LegalDocId } from './data/legalData'
import { SITE_CONFIG, type LeadMagnetConcept } from './data/portfolioData'

gsap.registerPlugin(ScrollTrigger)

export function App() {
  const [activeConcept, setActiveConcept] = useState<LeadMagnetConcept | null>(null)
  const [activeLegalDoc, setActiveLegalDoc] = useState<LegalDocId | null>(null)
  const [cookieBannerOpen, setCookieBannerOpen] = useState(
    () => readSavedCookieChoice() === null,
  )
  const [dialogFocusTick, setDialogFocusTick] = useState(0)
  const [scenePulse, setScenePulse] = useState(0)
  const rootRef = useRef<HTMLDivElement>(null)
  const lenisRef = useRef<Lenis | null>(null)
  const scrollProgressRef = useRef(0)

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches

    if (prefersReducedMotion) {
      return
    }

    const lenis = new Lenis({
      duration: 1.15,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    })
    lenisRef.current = lenis

    lenis.on('scroll', ScrollTrigger.update)

    const updateLenis = (time: number) => {
      lenis.raf(time * 1000)
    }

    gsap.ticker.add(updateLenis)
    gsap.ticker.lagSmoothing(0)

    const ctx = gsap.context(() => {
      // Hero word-by-word choreography
      const heroWords = gsap.utils.toArray<HTMLElement>('[data-hero-heading] [data-split-word]')
      if (heroWords.length > 0) {
        gsap.from(heroWords, {
          yPercent: 112,
          opacity: 0,
          duration: 0.85,
          stagger: 0.042,
          ease: 'power3.out',
          clearProps: 'transform,opacity',
        })
      }

      // Hero supporting copy & widget stagger
      gsap.from('[data-hero-stagger]', {
        y: 26,
        opacity: 0,
        duration: 0.78,
        delay: 0.14,
        stagger: 0.09,
        ease: 'power3.out',
        clearProps: 'transform,opacity',
      })

      // Section headings word-by-word reveal
      gsap.utils.toArray<HTMLElement>('[data-reveal-heading]').forEach((heading) => {
        const words = heading.querySelectorAll('[data-split-word]')
        if (words.length > 0) {
          gsap.from(words, {
            yPercent: 108,
            opacity: 0,
            duration: 0.75,
            stagger: 0.038,
            ease: 'power3.out',
            clearProps: 'transform,opacity',
            scrollTrigger: {
              trigger: heading,
              start: 'top 87%',
              once: true,
            },
          })
        } else {
          gsap.from(heading, {
            y: 24,
            opacity: 0,
            duration: 0.7,
            ease: 'power2.out',
            clearProps: 'transform,opacity',
            scrollTrigger: {
              trigger: heading,
              start: 'top 87%',
              once: true,
            },
          })
        }
      })

      // Card groups stagger reveal
      gsap.utils.toArray<HTMLElement>('[data-reveal-group]').forEach((group) => {
        const cards = group.querySelectorAll('[data-reveal-card]')
        if (cards.length === 0) return

        gsap.from(cards, {
          y: 28,
          opacity: 0,
          duration: 0.68,
          stagger: 0.09,
          ease: 'power2.out',
          clearProps: 'transform,opacity',
          scrollTrigger: {
            trigger: group,
            start: 'top 84%',
            once: true,
          },
        })
      })
    }, rootRef)

    // Refresh ScrollTrigger measurements once editorial fonts settle
    let cancelled = false
    if ('fonts' in document) {
      document.fonts.ready.then(() => {
        if (!cancelled) {
          ScrollTrigger.refresh()
        }
      })
    }

    // Smooth anchor navigation through Lenis so the 3D PDF-to-crystal morph plays fluidly
    const handleAnchorClick = (event: MouseEvent) => {
      const target = (event.target as HTMLElement | null)?.closest('a[href^="#"]')
      if (!target) return
      const href = target.getAttribute('href')
      if (!href || href === '#') return
      const dest = document.querySelector(href)
      if (!dest) return
      event.preventDefault()
      lenis.scrollTo(dest as HTMLElement, { offset: -72, duration: 1.3 })
    }

    document.addEventListener('click', handleAnchorClick)

    return () => {
      cancelled = true
      document.removeEventListener('click', handleAnchorClick)
      ctx.revert()
      gsap.ticker.remove(updateLenis)
      lenis.destroy()
      lenisRef.current = null
    }
  }, [])

  // Pause Lenis while drawer or legal modal is open
  useEffect(() => {
    if (!lenisRef.current) return
    if (activeConcept || activeLegalDoc) {
      lenisRef.current.stop()
    } else {
      lenisRef.current.start()
    }
  }, [activeConcept, activeLegalDoc])

  const scrollToMainDialog = () => {
    const target = document.getElementById('live-dialog-anchor')
    if (target) {
      if (lenisRef.current) {
        lenisRef.current.scrollTo(target, { offset: -96 })
      } else {
        target.scrollIntoView({ behavior: 'smooth', block: 'center' })
      }
    }
    setDialogFocusTick((prev) => prev + 1)
    setScenePulse((prev) => prev + 1)
  }

  const handleOpenDemo = (concept: LeadMagnetConcept) => {
    setActiveConcept(concept)
    setScenePulse((prev) => prev + 1)
  }

  const handleSwitchFromDrawerToMain = () => {
    setActiveConcept(null)
    window.setTimeout(() => {
      scrollToMainDialog()
    }, 80)
  }

  return (
    <div id="top" ref={rootRef} className="relative min-h-screen bg-[#0C0B0A] text-[#F5EFE6]">
      {/* Fixed interactive Three.js 3D scene: Flat PDF -> Disintegration Vortex -> Living Dialogue Crystal */}
      <PdfToCrystalScene pulseSignal={scenePulse} />

      {/* Top progress line + subtle 3D stage telemetry */}
      <ScrollProgressHud progressRef={scrollProgressRef} />

      <div className="relative z-10">
        <Navbar onJumpToDialog={scrollToMainDialog} />

        <main>
          {/* HERO — Editorial Anti-landing with live lead-magnet prototype */}
          <section className="bg-atelier-grid relative overflow-hidden pt-10 pb-24 sm:pt-16 sm:pb-32">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="grid gap-10 lg:grid-cols-12 lg:items-center lg:gap-12">
                <div className="lg:col-span-6">
                  <div
                    data-hero-stagger
                    className="mb-5 inline-flex items-center gap-2.5 rounded-full border border-[#F2C094]/18 bg-[#151210]/85 px-3.5 py-1.5 backdrop-blur-md"
                  >
                    <span className="h-1.5 w-1.5 rounded-full bg-[#E07A47] shadow-[0_0_8px_#E07A47]" />
                    <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#D8CFC5]">
                      Живые ИИ-лид-магниты · Анти-лендинг
                    </span>
                  </div>

                  <SplitHeading
                    as="h1"
                    hero
                    segments={[
                      { text: 'Хватит сливать трафик в PDF. ' },
                      {
                        text: 'Приводите тёплых лидов через живой ИИ-диалог',
                        accent: true,
                      },
                    ]}
                    className="font-display text-3xl font-bold leading-[1.1] tracking-tight text-[#F5EFE6] sm:text-5xl lg:text-[54px]"
                  />

                  <p
                    data-hero-stagger
                    className="mt-5 max-w-xl text-base leading-relaxed text-[#B6ADA4] sm:mt-6 sm:text-lg"
                  >
                    За 15 минут разговора на сайте или в мессенджере ассистент помогает
                    клиенту решить проблему и переводит в ваш Telegram, ВК или MAX уже
                    готовым к покупке
                  </p>

                  <div
                    data-hero-stagger
                    className="mt-7 hidden flex-wrap items-center gap-2.5 sm:flex"
                  >
                    <span className="font-mono text-xs text-[#8E867E]">Написать напрямую:</span>
                    {SITE_CONFIG.messengers.map((m) => (
                      <a
                        key={m.id}
                        href={m.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 rounded-xl border border-[#F2C094]/15 bg-[#151210]/85 px-3.5 py-2 font-mono text-xs text-[#E8DFD5] backdrop-blur-md transition-all hover:border-[#E07A47]/70 hover:text-[#F2C094]"
                      >
                        <span>{m.label}</span>
                        <Icon
                          icon="solar:arrow-right-up-linear"
                          className="h-3.5 w-3.5 text-[#E07A47]"
                          aria-hidden="true"
                        />
                      </a>
                    ))}
                  </div>

                  {/* Subtle scroll cue inviting user to watch the PDF transform into a 3D crystal */}
                  <div
                    data-hero-stagger
                    className="mt-10 hidden items-center gap-3 text-[#8E867E] lg:flex"
                  >
                    <a
                      href="#comparison"
                      className="group inline-flex items-center gap-2.5 font-mono text-[11px] uppercase tracking-[0.16em] transition-colors hover:text-[#F2C094]"
                    >
                      <span className="flex h-7 w-7 items-center justify-center rounded-full border border-[#F2C094]/20 bg-[#151210]/80 transition-colors group-hover:border-[#E07A47]">
                        <Icon
                          icon="solar:arrow-down-linear"
                          className="h-3.5 w-3.5 text-[#E07A47]"
                          aria-hidden="true"
                        />
                      </span>
                      <span>Листайте — смотрите, как PDF распадается в живой диалог</span>
                    </a>
                  </div>
                </div>

                <div className="lg:col-span-6" data-hero-stagger>
                  <HeroAgentWidget
                    externalPromptTrigger={dialogFocusTick}
                    onDialogPulse={() => setScenePulse((prev) => prev + 1)}
                    onOpenLegalDoc={(doc) => setActiveLegalDoc(doc)}
                  />
                  <div className="mt-4 flex flex-wrap items-center justify-between gap-2 rounded-2xl border border-[#F2C094]/12 bg-[#141210]/90 px-4 py-3 backdrop-blur-md sm:hidden">
                    <span className="font-mono text-[11px] text-[#A69D94]">
                      Написать в личку:
                    </span>
                    <div className="flex items-center gap-2">
                      {SITE_CONFIG.messengers.map((m) => (
                        <a
                          key={m.id}
                          href={m.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="rounded-lg border border-[#F2C094]/15 bg-[#0C0B0A] px-2.5 py-1 font-mono text-[11px] text-[#F5EFE6]"
                        >
                          {m.label}
                        </a>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <ComparisonSection />
          <ConceptsSection onOpenDemo={handleOpenDemo} />
          <ProcessSection />
          <AboutAndFaqSection />
        </main>

        <FooterCta
          onJumpToDialog={scrollToMainDialog}
          onOpenLegalDoc={(doc) => setActiveLegalDoc(doc)}
          onOpenCookieSettings={() => setCookieBannerOpen(true)}
        />
      </div>

      <SandboxDrawer
        key={activeConcept?.id ?? 'closed'}
        concept={activeConcept}
        onClose={() => setActiveConcept(null)}
        onSwitchToMainDialog={handleSwitchFromDrawerToMain}
      />

      <LegalModal
        activeDoc={activeLegalDoc}
        onSelectDoc={(doc) => setActiveLegalDoc(doc)}
        onClose={() => setActiveLegalDoc(null)}
      />

      <CookieBanner
        isOpen={cookieBannerOpen}
        onDismiss={() => setCookieBannerOpen(false)}
        onOpenLegalDoc={(doc) => setActiveLegalDoc(doc)}
      />
    </div>
  )
}

export default App
