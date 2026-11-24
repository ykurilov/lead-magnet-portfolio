import { Icon } from '@iconify/react'
import { useState } from 'react'
import { FAQ_ITEMS, SITE_CONFIG } from '../data/portfolioData'
import { SplitHeading } from './SplitHeading'
import { TiltCard } from './TiltCard'

export function AboutAndFaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  return (
    <section
      id="faq"
      className="relative border-t border-[#F2C094]/10 py-24 sm:py-32"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-12 lg:items-start lg:gap-12">
          {/* Author editorial portrait card */}
          <div className="lg:col-span-5" data-reveal-group>
            <TiltCard
              maxTilt={3.2}
              className="surface-obsidian overflow-hidden rounded-[30px] backdrop-blur-xl hover:border-[#E07A47]/40"
            >
              <div className="relative aspect-[4/5] w-full overflow-hidden bg-[#12100E]">
                <img
                  src={SITE_CONFIG.authorPortrait}
                  alt={`${SITE_CONFIG.authorName} — разработчик живых лид-магнитов`}
                  loading="lazy"
                  decoding="async"
                  className="h-full w-full object-cover object-top transition-transform duration-700 hover:scale-[1.025]"
                />
                {/* Editorial bottom gradient blending portrait into card body */}
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-[#141210] via-[#141210]/65 to-transparent"
                />
                <div className="absolute right-6 bottom-5 left-6 flex items-end justify-between gap-3">
                  <div>
                    <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#F2C094]">
                      Автор и разработчик
                    </p>
                    <h2 className="mt-1 font-display text-2xl font-bold tracking-tight text-[#F5EFE6]">
                      {SITE_CONFIG.authorName}
                    </h2>
                  </div>
                  <span className="rounded-full border border-[#F2C094]/25 bg-[#0C0B0A]/75 px-3 py-1 font-mono text-[10px] uppercase tracking-wider text-[#E88B59] backdrop-blur-md">
                    Под ключ
                  </span>
                </div>
              </div>

              <div className="border-t border-[#F2C094]/10 p-6 sm:p-7">
                <p className="text-sm leading-relaxed text-[#D8CFC5] sm:text-base">
                  Проектирую и запускаю живые ИИ-диалоги под ключ: от идеи и характера
                  ассистента до встраивания на ваш сайт и связки с Telegram, ВКонтакте или MAX.
                </p>
              </div>
            </TiltCard>
          </div>

          {/* FAQ column */}
          <div className="lg:col-span-7 lg:pt-4">
            <p className="mb-3 font-mono text-[11px] uppercase tracking-[0.2em] text-[#E07A47]">
              04 · Вопросы перед стартом
            </p>
            <SplitHeading
              as="h2"
              segments={[
                { text: 'Частые ' },
                { text: 'вопросы', accent: true },
              ]}
              className="font-display text-3xl font-bold leading-[1.12] tracking-tight text-[#F5EFE6] sm:text-5xl"
            />

            <div className="mt-8 space-y-3.5" data-reveal-group>
              {FAQ_ITEMS.map((item, idx) => {
                const isOpen = openIndex === idx
                const panelId = `faq-panel-${idx}`
                return (
                  <div
                    key={item.question}
                    data-reveal-card
                    className={`surface-obsidian overflow-hidden rounded-2xl transition-colors duration-300 backdrop-blur-xl ${
                      isOpen ? 'border-[#E07A47]/40' : 'hover:border-[#F2C094]/25'
                    }`}
                  >
                    <button
                      type="button"
                      aria-expanded={isOpen}
                      aria-controls={panelId}
                      onClick={() => setOpenIndex(isOpen ? null : idx)}
                      className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left transition-colors hover:bg-[#1B1714]/60"
                    >
                      <span className="text-sm font-semibold text-[#F5EFE6] sm:text-base">
                        {item.question}
                      </span>
                      <Icon
                        icon={
                          isOpen
                            ? 'solar:minus-circle-linear'
                            : 'solar:add-circle-linear'
                        }
                        className="h-5 w-5 shrink-0 text-[#E07A47] transition-transform duration-300"
                        aria-hidden="true"
                      />
                    </button>
                    <div
                      id={panelId}
                      className="accordion-content"
                      data-open={isOpen ? 'true' : 'false'}
                    >
                      <div>
                        <div className="border-t border-[#F2C094]/10 px-6 py-4.5 text-sm leading-relaxed text-[#B6ADA4]">
                          {item.answer}
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
