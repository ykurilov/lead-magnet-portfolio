import { PROCESS_STEPS } from '../data/portfolioData'
import { SplitHeading } from './SplitHeading'
import { TiltCard } from './TiltCard'

export function ProcessSection() {
  return (
    <section
      id="process"
      className="relative border-t border-[#F2C094]/10 py-24 sm:py-32"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <p className="mb-3 font-mono text-[11px] uppercase tracking-[0.2em] text-[#E07A47]">
              03 · Архитектура запуска
            </p>
            <SplitHeading
              as="h2"
              segments={[
                { text: 'Как я запускаю ' },
                { text: 'живой лид-магнит', accent: true },
              ]}
              className="font-display text-3xl font-bold leading-[1.12] tracking-tight text-[#F5EFE6] sm:text-5xl"
            />
          </div>
          <p className="max-w-sm text-sm leading-relaxed text-[#A69D94]">
            Четыре понятных этапа от поиска сильной идеи до готового диалога, который приводит
            клиентов в ваш мессенджер.
          </p>
        </div>

        <div className="relative grid gap-5 sm:grid-cols-2 lg:grid-cols-4" data-reveal-group>
          {/* Connecting copper hairline on desktop */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute top-11 right-12 left-12 hidden h-px bg-gradient-to-r from-[#E07A47]/15 via-[#E07A47]/45 to-[#E07A47]/15 lg:block"
          />

          {PROCESS_STEPS.map((step) => (
            <TiltCard
              key={step.num}
              className="surface-obsidian flex flex-col rounded-[26px] p-6 backdrop-blur-xl hover:border-[#E07A47]/40"
            >
              <div className="flex items-center justify-between">
                <span className="font-editorial-accent text-4xl font-semibold leading-none text-[#E88B59]">
                  {step.num}
                </span>
                <span
                  aria-hidden="true"
                  className="h-2 w-2 rounded-full border border-[#E07A47] bg-[#0C0B0A]"
                />
              </div>

              <h3 className="mt-6 font-display text-base font-semibold leading-snug text-[#F5EFE6]">
                {step.title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-[#A69D94]">{step.text}</p>
            </TiltCard>
          ))}
        </div>
      </div>
    </section>
  )
}
