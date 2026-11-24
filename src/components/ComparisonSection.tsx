import { Icon } from '@iconify/react'
import { COMPARISON_ITEMS } from '../data/portfolioData'

export function ComparisonSection() {
  return (
    <section
      id="comparison"
      className="border-t border-[#24242D] bg-[#09090B] py-20 sm:py-28"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 max-w-3xl">
          <p className="mb-3 font-mono text-xs uppercase tracking-widest text-[#B8FF3C]">
            // Смена формата
          </p>
          <h2
            data-reveal-heading
            className="font-display text-2xl font-bold tracking-tight text-[#F4F4F5] sm:text-4xl"
          >
            Почему старые лид-магниты больше не читают
          </h2>
          <p className="mt-4 text-base leading-relaxed text-[#A1A1AA] sm:text-lg">
            Люди устали от длинных гайдов и записей вебинаров «посмотрю на выходных».
            Живой лид-магнит даёт человеку быструю пользу за 15 минут в разговоре — и
            именно поэтому он с радостью переходит в ваш мессенджер.
          </p>
        </div>

        <div className="grid gap-4 lg:grid-cols-2" data-reveal-group>
          {COMPARISON_ITEMS.map((item) => (
            <article
              key={item.aspect}
              data-reveal-card
              className="group rounded-2xl border border-[#24242D] bg-[#111115] p-6 transition-colors hover:border-[#3A3A48]"
            >
              <div className="mb-4 flex items-center justify-between">
                <span className="font-mono text-xs uppercase tracking-wider text-[#A1A1AA]">
                  {item.aspect}
                </span>
                <Icon
                  icon="solar:bolt-linear"
                  className="h-4 w-4 text-[#B8FF3C] opacity-70 transition-opacity group-hover:opacity-100"
                  aria-hidden="true"
                />
              </div>

              <div className="space-y-3">
                <div className="rounded-xl border border-[#24242D] bg-[#09090B] p-3.5">
                  <div className="mb-1 flex items-center gap-2 font-mono text-[11px] uppercase tracking-wider text-[#71717A]">
                    <Icon icon="solar:close-circle-linear" className="h-4 w-4" aria-hidden="true" />
                    <span>Как было (PDF / вебинар)</span>
                  </div>
                  <p className="text-sm text-[#A1A1AA]">{item.oldWay}</p>
                </div>

                <div className="rounded-xl border border-[#B8FF3C]/25 bg-[#B8FF3C]/5 p-3.5">
                  <div className="mb-1 flex items-center gap-2 font-mono text-[11px] uppercase tracking-wider text-[#B8FF3C]">
                    <Icon icon="solar:check-circle-bold" className="h-4 w-4" aria-hidden="true" />
                    <span>Живой лид-магнит</span>
                  </div>
                  <p className="text-sm font-medium text-[#F4F4F5]">{item.liveWay}</p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
