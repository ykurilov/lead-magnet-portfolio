import { Icon } from '@iconify/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from 'lenis'
import { useEffect, useRef, useState } from 'react'
import { AboutAndFaqSection } from './components/AboutAndFaqSection'
import { ComparisonSection } from './components/ComparisonSection'
import { ConceptsSection } from './components/ConceptsSection'
import { FooterCta } from './components/FooterCta'
import { HeroAgentWidget } from './components/HeroAgentWidget'
import { Navbar } from './components/Navbar'
import { ProcessSection } from './components/ProcessSection'
import { SandboxDrawer } from './components/SandboxDrawer'
import { SITE_CONFIG, type LeadMagnetConcept } from './data/portfolioData'

gsap.registerPlugin(ScrollTrigger)

export function App() {
  const [activeConcept, setActiveConcept] = useState<LeadMagnetConcept | null>(null)
  const [dialogFocusTick, setDialogFocusTick] = useState(0)
  const rootRef = useRef<HTMLDivElement>(null)
  const lenisRef = useRef<Lenis | null>(null)

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches

    if (prefersReducedMotion) {
      return
    }

    const lenis = new Lenis({
      duration: 1.05,
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
      // Hero intro choreography
      gsap.from('[data-hero-stagger]', {
        y: 22,
        opacity: 0,
        duration: 0.7,
        stagger: 0.08,
        ease: 'power3.out',
        clearProps: 'transform,opacity',
      })

      // Section headings reveal
      gsap.utils.toArray<HTMLElement>('[data-reveal-heading]').forEach((heading) => {
        gsap.from(heading, {
          y: 24,
          opacity: 0,
          duration: 0.65,
          ease: 'power2.out',
          clearProps: 'transform,opacity',
          scrollTrigger: {
            trigger: heading,
            start: 'top 86%',
            once: true,
          },
        })
      })

      // Card groups stagger
      gsap.utils.toArray<HTMLElement>('[data-reveal-group]').forEach((group) => {
        const cards = group.querySelectorAll('[data-reveal-card]')
        if (cards.length === 0) return

        gsap.from(cards, {
          y: 26,
          opacity: 0,
          duration: 0.6,
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

    return () => {
      ctx.revert()
      gsap.ticker.remove(updateLenis)
      lenis.destroy()
      lenisRef.current = null
    }
  }, [])

  // Pause Lenis while drawer is open
  useEffect(() => {
    if (!lenisRef.current) return
    if (activeConcept) {
      lenisRef.current.stop()
    } else {
      lenisRef.current.start()
    }
  }, [activeConcept])

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
  }

  const handleSwitchFromDrawerToMain = () => {
    setActiveConcept(null)
    window.setTimeout(() => {
      scrollToMainDialog()
    }, 80)
  }

  return (
    <div id="top" ref={rootRef} className="min-h-screen bg-[#09090B] text-[#F4F4F5]">
      <Navbar onJumpToDialog={scrollToMainDialog} />

      <main>
        {/* HERO — Anti-landing with live lead-magnet prototype */}
        <section className="bg-tech-grid relative overflow-hidden pt-10 pb-20 sm:pt-16 sm:pb-28">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid gap-10 lg:grid-cols-12 lg:items-center lg:gap-12">
              <div className="lg:col-span-6">
                <div
                  data-hero-stagger
                  className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#24242D] bg-[#111115] px-3.5 py-1.5"
                >
                  <span className="h-2 w-2 rounded-full bg-[#B8FF3C]" />
                  <span className="font-mono text-[11px] uppercase tracking-wider text-[#D4D4D8]">
                    Анти-лендинг · Живые лид-магниты
                  </span>
                </div>

                <h1
                  data-hero-stagger
                  className="font-display text-3xl font-bold leading-[1.12] tracking-tight text-[#F4F4F5] sm:text-5xl lg:text-[50px]"
                >
                  Хватит сливать трафик в PDF.{' '}
                  <span className="text-[#B8FF3C]">
                    Приводите тёплых лидов через живой ИИ-диалог.
                  </span>
                </h1>

                <p
                  data-hero-stagger
                  className="mt-4 max-w-xl text-base leading-relaxed text-[#A1A1AA] sm:mt-5 sm:text-lg"
                >
                  За 15 минут разговора на сайте или в мессенджере ассистент помогает
                  клиенту решить проблему — и переводит в ваш Telegram, ВК или MAX уже
                  готовым к покупке.
                </p>

                <div
                  data-hero-stagger
                  className="mt-6 hidden grid-cols-1 gap-3 sm:grid sm:grid-cols-3"
                >
                  <div className="rounded-xl border border-[#24242D] bg-[#111115] p-3.5">
                    <p className="font-mono text-xs text-[#B8FF3C]">10–15 минут</p>
                    <p className="mt-1 text-xs text-[#D4D4D8]">
                      Быстрый приятный результат в диалоге
                    </p>
                  </div>
                  <div className="rounded-xl border border-[#24242D] bg-[#111115] p-3.5">
                    <p className="font-mono text-xs text-[#B8FF3C]">2 формата</p>
                    <p className="mt-1 text-xs text-[#D4D4D8]">
                      Анти-лендинг на сайте или сразу в боте
                    </p>
                  </div>
                  <div className="rounded-xl border border-[#24242D] bg-[#111115] p-3.5">
                    <p className="font-mono text-xs text-[#B8FF3C]">Тёплый лид</p>
                    <p className="mt-1 text-xs text-[#D4D4D8]">
                      Сам переходит в Telegram, ВК или MAX
                    </p>
                  </div>
                </div>

                <div
                  data-hero-stagger
                  className="mt-5 hidden flex-wrap items-center gap-3 sm:mt-7 sm:flex"
                >
                  <a
                    href="#concepts"
                    className="inline-flex items-center gap-2 rounded-xl border border-[#24242D] bg-[#111115] px-4 py-2.5 text-sm font-medium text-[#F4F4F5] transition-colors hover:border-[#B8FF3C] hover:text-[#B8FF3C]"
                  >
                    <span>Посмотреть примеры</span>
                    <Icon
                      icon="solar:arrow-down-linear"
                      className="h-4 w-4"
                      aria-hidden="true"
                    />
                  </a>

                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs text-[#71717A]">Личка:</span>
                    {SITE_CONFIG.messengers.map((m) => (
                      <a
                        key={m.id}
                        href={m.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="rounded-lg border border-[#24242D] bg-[#111115] px-3 py-1.5 font-mono text-xs text-[#D4D4D8] transition-colors hover:border-[#B8FF3C] hover:text-[#B8FF3C]"
                      >
                        {m.label}
                      </a>
                    ))}
                  </div>
                </div>
              </div>

              <div className="lg:col-span-6" data-hero-stagger>
                <HeroAgentWidget externalPromptTrigger={dialogFocusTick} />
              </div>
            </div>
          </div>
        </section>

        <ComparisonSection />
        <ConceptsSection onOpenDemo={(concept) => setActiveConcept(concept)} />
        <ProcessSection />
        <AboutAndFaqSection />
      </main>

      <FooterCta onJumpToDialog={scrollToMainDialog} />

      <SandboxDrawer
        concept={activeConcept}
        onClose={() => setActiveConcept(null)}
        onSwitchToMainDialog={handleSwitchFromDrawerToMain}
      />
    </div>
  )
}

export default App
