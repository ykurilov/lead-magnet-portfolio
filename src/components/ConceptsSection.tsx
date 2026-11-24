import { Icon } from '@iconify/react'
import { LEAD_MAGNET_CONCEPTS, type LeadMagnetConcept } from '../data/portfolioData'

interface ConceptsSectionProps {
  onOpenDemo: (concept: LeadMagnetConcept) => void
}

export function ConceptsSection({ onOpenDemo }: ConceptsSectionProps) {
  return (
    <section
      id="concepts"
      className="border-t border-[#24242D] bg-[#0D0D11] py-20 sm:py-28"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10 max-w-2xl">
          <h2
            data-reveal-heading
            className="font-display text-2xl font-bold tracking-tight text-[#F4F4F5] sm:text-4xl"
          >
            Попробуйте сами — глазами клиента
          </h2>
        </div>

        <div className="grid gap-6 lg:grid-cols-3" data-reveal-group>
          {LEAD_MAGNET_CONCEPTS.map((concept) => (
            <article
              key={concept.id}
              data-reveal-card
              className="flex flex-col justify-between rounded-2xl border border-[#24242D] bg-[#111115] p-6 transition-colors hover:border-[#B8FF3C]/50"
            >
              <div>
                <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
                  <span className="rounded-md border border-[#B8FF3C]/30 bg-[#B8FF3C]/10 px-2.5 py-1 font-mono text-[11px] font-medium text-[#B8FF3C]">
                    {concept.badge}
                  </span>
                  <span className="font-mono text-[11px] text-[#A1A1AA]">
                    {concept.format} · {concept.duration}
                  </span>
                </div>

                <h3 className="font-display text-lg font-semibold leading-snug text-[#F4F4F5]">
                  {concept.title}
                </h3>

                <p className="mt-2 font-mono text-xs text-[#A1A1AA]">{concept.replaces}</p>

                {/* Live mini chat preview */}
                <div className="mt-5 space-y-2 rounded-xl border border-[#24242D] bg-[#09090B] p-3.5">
                  {concept.previewMessages.map((msg, idx) => (
                    <div
                      key={idx}
                      className={`rounded-lg px-3 py-2 text-xs leading-relaxed ${
                        msg.role === 'user'
                          ? 'ml-6 bg-[#24242D] text-[#F4F4F5]'
                          : 'mr-4 border border-[#24242D] bg-[#15151B] text-[#D4D4D8]'
                      }`}
                    >
                      {msg.text}
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-6 border-t border-[#24242D] pt-4">
                <button
                  type="button"
                  onClick={() => onOpenDemo(concept)}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-[#B8FF3C] bg-[#B8FF3C]/10 px-4 py-3 text-sm font-semibold text-[#B8FF3C] transition-colors hover:bg-[#B8FF3C] hover:text-[#09090B]"
                >
                  <Icon
                    icon="solar:chat-round-dots-bold"
                    className="h-4 w-4"
                    aria-hidden="true"
                  />
                  <span>Попробовать диалог</span>
                </button>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
