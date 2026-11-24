import { Icon } from '@iconify/react'
import { useState } from 'react'
import { FAQ_ITEMS, SITE_CONFIG } from '../data/portfolioData'

export function AboutAndFaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  return (
    <section
      id="faq"
      className="border-t border-[#24242D] bg-[#0D0D11] py-20 sm:py-28"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-12 lg:items-start">
          {/* Author column */}
          <div className="lg:col-span-5" data-reveal-group>
            <div
              data-reveal-card
              className="rounded-3xl border border-[#24242D] bg-[#111115] p-6 sm:p-8"
            >
              <div className="mb-4 flex items-center gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-[#B8FF3C]/40 bg-[#B8FF3C]/10 font-display text-base font-bold text-[#B8FF3C]">
                  YK
                </div>
                <div>
                  <h2 className="font-display text-xl font-bold text-[#F4F4F5]">
                    {SITE_CONFIG.authorName}
                  </h2>
                  <p className="text-xs text-[#A1A1AA]">
                    Разработчик живых лид-магнитов
                  </p>
                </div>
              </div>

              <p className="text-sm leading-relaxed text-[#D4D4D8] sm:text-base">
                Проектирую и запускаю живые ИИ-диалоги под ключ: от идеи и характера
                ассистента до встраивания на ваш сайт и связки с Telegram, ВКонтакте или MAX.
              </p>
            </div>
          </div>

          {/* FAQ column */}
          <div className="lg:col-span-7">
            <h2
              data-reveal-heading
              className="font-display text-2xl font-bold tracking-tight text-[#F4F4F5] sm:text-3xl"
            >
              Частые вопросы
            </h2>

            <div className="mt-6 space-y-3" data-reveal-group>
              {FAQ_ITEMS.map((item, idx) => {
                const isOpen = openIndex === idx
                return (
                  <div
                    key={item.question}
                    data-reveal-card
                    className="overflow-hidden rounded-2xl border border-[#24242D] bg-[#111115]"
                  >
                    <button
                      type="button"
                      aria-expanded={isOpen}
                      onClick={() => setOpenIndex(isOpen ? null : idx)}
                      className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left transition-colors hover:bg-[#17171D]"
                    >
                      <span className="text-sm font-semibold text-[#F4F4F5] sm:text-base">
                        {item.question}
                      </span>
                      <Icon
                        icon={
                          isOpen
                            ? 'solar:minus-circle-linear'
                            : 'solar:add-circle-linear'
                        }
                        className="h-5 w-5 shrink-0 text-[#B8FF3C]"
                        aria-hidden="true"
                      />
                    </button>
                    {isOpen && (
                      <div className="border-t border-[#24242D] px-5 py-4 text-sm leading-relaxed text-[#A1A1AA]">
                        {item.answer}
                      </div>
                    )}
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
