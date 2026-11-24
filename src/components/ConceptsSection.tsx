import { Icon } from '@iconify/react'
import { LEAD_MAGNET_CONCEPTS, type LeadMagnetConcept } from '../data/portfolioData'
import { SplitHeading } from './SplitHeading'
import { TiltCard } from './TiltCard'

interface ConceptsSectionProps {
  onOpenDemo: (concept: LeadMagnetConcept) => void
}

export function ConceptsSection({ onOpenDemo }: ConceptsSectionProps) {
  return (
    <section
      id="concepts"
      className="relative border-t border-[#F2C094]/10 py-24 sm:py-32"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <p className="mb-3 font-mono text-[11px] uppercase tracking-[0.2em] text-[#E07A47]">
              02 · Кристалл живого диалога
            </p>
            <SplitHeading
              as="h2"
              segments={[
                { text: 'Попробуйте сами — ' },
                { text: 'глазами клиента', accent: true },
              ]}
              className="font-display text-3xl font-bold leading-[1.12] tracking-tight text-[#F5EFE6] sm:text-5xl"
            />
          </div>
          <p className="max-w-sm text-sm leading-relaxed text-[#A69D94]">
            Нажмите на любой сценарий: откроется выдвижная песочница прямо на странице, никуда
            уходить не придётся.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-3" data-reveal-group>
          {LEAD_MAGNET_CONCEPTS.map((concept) => (
            <TiltCard
              key={concept.id}
              as="article"
              className="surface-obsidian flex flex-col justify-between rounded-[26px] p-6 backdrop-blur-xl hover:border-[#E07A47]/45"
            >
              <div>
                <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
                  <span className="rounded-full border border-[#E07A47]/35 bg-[#E07A47]/12 px-3 py-1 font-mono text-[11px] font-medium text-[#F2C094]">
                    {concept.badge}
                  </span>
                  <span className="font-mono text-[11px] text-[#A69D94]">
                    {concept.format} · {concept.duration}
                  </span>
                </div>

                <h3 className="font-display text-lg font-semibold leading-snug text-[#F5EFE6]">
                  {concept.title}
                </h3>

                <p className="mt-2 font-mono text-xs text-[#8E867E]">{concept.replaces}</p>

                {/* Live mini chat preview */}
                <div className="mt-5 space-y-2.5 rounded-2xl border border-[#F2C094]/10 bg-[#0D0C0A]/90 p-3.5">
                  {concept.previewMessages.map((msg, idx) => (
                    <div
                      key={idx}
                      className={`rounded-xl px-3 py-2 text-xs leading-relaxed ${
                        msg.role === 'user'
                          ? 'ml-6 border border-[#E07A47]/30 bg-[#E07A47]/14 text-[#F5EFE6]'
                          : 'mr-4 border border-[#F2C094]/8 bg-[#181512] text-[#D8CFC5]'
                      }`}
                    >
                      {msg.text}
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-6 border-t border-[#F2C094]/10 pt-4">
                <button
                  type="button"
                  onClick={() => onOpenDemo(concept)}
                  className="group inline-flex w-full items-center justify-center gap-2 rounded-xl border border-[#E07A47]/55 bg-[#E07A47]/10 px-4 py-3 text-sm font-semibold text-[#F2C094] transition-all duration-300 hover:border-[#E07A47] hover:bg-[#E07A47] hover:text-[#0C0B0A] hover:shadow-[0_12px_28px_-10px_rgba(224,122,71,0.55)]"
                >
                  <Icon
                    icon="solar:chat-round-dots-bold"
                    className="h-4 w-4 transition-transform duration-300 group-hover:scale-110"
                    aria-hidden="true"
                  />
                  <span>Попробовать диалог</span>
                </button>
              </div>
            </TiltCard>
          ))}
        </div>
      </div>
    </section>
  )
}
