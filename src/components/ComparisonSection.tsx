import { Icon } from '@iconify/react'
import { COMPARISON_ITEMS } from '../data/portfolioData'

export function ComparisonSection() {
  return (
    <section
      id="comparison"
      className="border-t border-[#24242D] bg-[#09090B] py-20 sm:py-28"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2
          data-reveal-heading
          className="mb-10 max-w-3xl font-display text-2xl font-bold tracking-tight text-[#F4F4F5] sm:text-4xl"
        >
          Почему старые PDF больше не работают
        </h2>

        <div
          data-reveal-group
          className="overflow-hidden rounded-2xl border border-[#24242D] bg-[#111115]"
        >
          {/* Table header */}
          <div className="hidden grid-cols-12 border-b border-[#24242D] bg-[#15151B] px-6 py-4 font-mono text-xs uppercase tracking-wider lg:grid">
            <div className="col-span-2 text-[#71717A]">Этап</div>
            <div className="col-span-5 flex items-center gap-2 text-[#A1A1AA]">
              <Icon icon="solar:close-circle-linear" className="h-4 w-4" aria-hidden="true" />
              <span>Обычный PDF и форма</span>
            </div>
            <div className="col-span-5 flex items-center gap-2 text-[#B8FF3C]">
              <Icon icon="solar:check-circle-bold" className="h-4 w-4" aria-hidden="true" />
              <span>Живой ИИ-диалог</span>
            </div>
          </div>

          <div className="divide-y divide-[#24242D]">
            {COMPARISON_ITEMS.map((item) => (
              <div
                key={item.aspect}
                data-reveal-card
                className="grid gap-3 p-5 sm:p-6 lg:grid-cols-12 lg:items-center lg:gap-6"
              >
                <div className="font-mono text-xs uppercase tracking-wider text-[#A1A1AA] lg:col-span-2">
                  {item.aspect}
                </div>
                <div className="text-sm leading-relaxed text-[#A1A1AA] lg:col-span-5">
                  <span className="mb-1 block font-mono text-[11px] uppercase text-[#71717A] lg:hidden">
                    Обычный PDF:
                  </span>
                  {item.oldWay}
                </div>
                <div className="rounded-xl border border-[#B8FF3C]/20 bg-[#B8FF3C]/5 p-3 text-sm font-medium leading-relaxed text-[#F4F4F5] lg:col-span-5 lg:border-0 lg:bg-transparent lg:p-0">
                  <span className="mb-1 block font-mono text-[11px] uppercase text-[#B8FF3C] lg:hidden">
                    Живой диалог:
                  </span>
                  {item.liveWay}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
