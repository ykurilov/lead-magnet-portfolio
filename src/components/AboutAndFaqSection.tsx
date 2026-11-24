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
        <div className="grid gap-12 lg:grid-cols-12 lg:items-start">
          {/* Author column */}
          <div className="lg:col-span-5" data-reveal-group>
            <div
              data-reveal-card
              className="rounded-3xl border border-[#24242D] bg-[#111115] p-6 sm:p-8"
            >
              <div className="mb-5 flex items-center gap-4">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-[#B8FF3C]/40 bg-[#B8FF3C]/10 font-display text-lg font-bold text-[#B8FF3C]">
                  YK
                </div>
                <div>
                  <p className="font-mono text-[11px] uppercase tracking-widest text-[#B8FF3C]">
                    // Кто разрабатывает
                  </p>
                  <h2 className="font-display text-xl font-bold text-[#F4F4F5]">
                    {SITE_CONFIG.authorName}
                  </h2>
                </div>
              </div>

              <p className="text-sm leading-relaxed text-[#D4D4D8] sm:text-base">
                Проектирую и запускаю живые лид-магниты и анти-лендинги на базе ИИ под
                ключ: от поиска идеи и сценария до встраивания на сайт и связки с
                Telegram, ВКонтакте или MAX.
              </p>

              <ul className="mt-6 space-y-3 border-t border-[#24242D] pt-5 text-sm text-[#A1A1AA]">
                <li className="flex items-start gap-2.5">
                  <Icon
                    icon="solar:check-circle-bold"
                    className="mt-0.5 h-4 w-4 shrink-0 text-[#B8FF3C]"
                    aria-hidden="true"
                  />
                  <span>Фокус на одном: чтобы диалог давал пользу и переводил в мессенджер</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <Icon
                    icon="solar:check-circle-bold"
                    className="mt-0.5 h-4 w-4 shrink-0 text-[#B8FF3C]"
                    aria-hidden="true"
                  />
                  <span>Живой человеческий тон без канцелярита и «воды»</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <Icon
                    icon="solar:check-circle-bold"
                    className="mt-0.5 h-4 w-4 shrink-0 text-[#B8FF3C]"
                    aria-hidden="true"
                  />
                  <span>Встраивается как на ваш сайт, так и прямо в мессенджеры</span>
                </li>
              </ul>
            </div>
          </div>

          {/* FAQ column */}
          <div className="lg:col-span-7">
            <p className="mb-3 font-mono text-xs uppercase tracking-widest text-[#B8FF3C]">
              // Частые вопросы
            </p>
            <h2
              data-reveal-heading
              className="font-display text-2xl font-bold tracking-tight text-[#F4F4F5] sm:text-3xl"
            >
              Что обычно спрашивают перед стартом
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
