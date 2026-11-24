import { PROCESS_STEPS } from '../data/portfolioData'

export function ProcessSection() {
  return (
    <section
      id="process"
      className="border-t border-[#24242D] bg-[#09090B] py-20 sm:py-28"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10 max-w-2xl">
          <h2
            data-reveal-heading
            className="font-display text-2xl font-bold tracking-tight text-[#F4F4F5] sm:text-4xl"
          >
            Как я запускаю живой лид-магнит
          </h2>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4" data-reveal-group>
          {PROCESS_STEPS.map((step) => (
            <div
              key={step.num}
              data-reveal-card
              className="rounded-2xl border border-[#24242D] bg-[#111115] p-6"
            >
              <span className="font-mono text-2xl font-semibold text-[#B8FF3C]">
                {step.num}
              </span>
              <h3 className="mt-4 font-display text-base font-semibold leading-snug text-[#F4F4F5]">
                {step.title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-[#A1A1AA]">{step.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
