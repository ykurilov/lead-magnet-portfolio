import { Icon } from '@iconify/react'
import { COMPARISON_ITEMS } from '../data/portfolioData'
import { SplitHeading } from './SplitHeading'

export function ComparisonSection() {
  return (
    <section
      id="comparison"
      className="relative border-t border-[#F2C094]/10 py-24 sm:py-32"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <p className="mb-3 font-mono text-[11px] uppercase tracking-[0.2em] text-[#E07A47]">
              01 · Распад старого формата
            </p>
            <SplitHeading
              as="h2"
              segments={[
                { text: 'Почему старые PDF больше ' },
                { text: 'не работают', accent: true },
              ]}
              className="font-display text-3xl font-bold leading-[1.12] tracking-tight text-[#F5EFE6] sm:text-5xl"
            />
          </div>
          <p className="max-w-sm text-sm leading-relaxed text-[#A69D94]">
            Плоский файл требует усилий ещё до первой пользы. Живой диалог включается в задачу
            клиента с первой минуты.
          </p>
        </div>

        <div
          data-reveal-group
          className="surface-obsidian overflow-hidden rounded-[28px] backdrop-blur-xl"
        >
          {/* Table header */}
          <div className="hidden grid-cols-12 border-b border-[#F2C094]/10 bg-[#171411]/85 px-7 py-4.5 font-mono text-[11px] uppercase tracking-[0.16em] lg:grid">
            <div className="col-span-2 text-[#736B63]">Этап</div>
            <div className="col-span-5 flex items-center gap-2 text-[#8F877F]">
              <Icon icon="solar:document-text-linear" className="h-4 w-4" aria-hidden="true" />
              <span>Обычный PDF и форма</span>
            </div>
            <div className="col-span-5 flex items-center gap-2 text-[#F2C094]">
              <Icon
                icon="solar:stars-minimalistic-bold"
                className="h-4 w-4 text-[#E07A47]"
                aria-hidden="true"
              />
              <span>Живой ИИ-диалог</span>
            </div>
          </div>

          <div className="divide-y divide-[#F2C094]/10">
            {COMPARISON_ITEMS.map((item, idx) => (
              <div
                key={item.aspect}
                data-reveal-card
                className="group grid gap-4 p-5 transition-colors duration-300 hover:bg-[#1B1714]/70 sm:p-7 lg:grid-cols-12 lg:items-center lg:gap-8"
              >
                <div className="flex items-center gap-3 lg:col-span-2">
                  <span className="font-mono text-[11px] text-[#E07A47]/75">
                    0{idx + 1}
                  </span>
                  <span className="font-mono text-xs uppercase tracking-[0.12em] text-[#B6ADA4]">
                    {item.aspect}
                  </span>
                </div>

                <div className="text-sm leading-relaxed text-[#8E867E] transition-colors group-hover:text-[#A69D94] lg:col-span-5">
                  <span className="mb-1.5 flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-wider text-[#736B63] lg:hidden">
                    <Icon icon="solar:close-circle-linear" className="h-3.5 w-3.5" aria-hidden="true" />
                    Обычный PDF
                  </span>
                  {item.oldWay}
                </div>

                <div className="relative rounded-2xl border border-[#E07A47]/25 bg-[#E07A47]/[0.06] p-3.5 text-sm font-medium leading-relaxed text-[#F5EFE6] transition-colors group-hover:border-[#E07A47]/45 lg:col-span-5 lg:border-l lg:border-t-0 lg:border-r-0 lg:border-b-0 lg:rounded-none lg:bg-transparent lg:py-1 lg:pr-0 lg:pl-6">
                  <span className="mb-1.5 flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-wider text-[#E07A47] lg:hidden">
                    <Icon icon="solar:check-circle-bold" className="h-3.5 w-3.5" aria-hidden="true" />
                    Живой диалог
                  </span>
                  <span className="flex items-start gap-2.5">
                    <Icon
                      icon="solar:check-circle-bold"
                      className="mt-0.5 hidden h-4 w-4 shrink-0 text-[#E07A47] lg:inline-block"
                      aria-hidden="true"
                    />
                    <span>{item.liveWay}</span>
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
