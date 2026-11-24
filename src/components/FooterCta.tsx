import { Icon } from '@iconify/react'
import { SITE_CONFIG } from '../data/portfolioData'
import { MagneticButton } from './MagneticButton'
import { SplitHeading } from './SplitHeading'

interface FooterCtaProps {
  onJumpToDialog: () => void
}

const CURRENT_YEAR = new Date().getFullYear()

const MESSENGER_ICONS: Record<string, string> = {
  telegram: 'solar:plain-bold',
  vk: 'solar:chat-square-like-bold',
  max: 'solar:chat-round-line-bold',
}

export function FooterCta({ onJumpToDialog }: FooterCtaProps) {
  return (
    <footer
      id="contact"
      className="relative border-t border-[#F2C094]/10 pt-24 pb-12 sm:pt-32"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="surface-obsidian relative overflow-hidden rounded-[32px] p-8 backdrop-blur-xl sm:p-12 lg:p-16">
          {/* Subtle copper hairline crown */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-16 top-0 h-px bg-gradient-to-r from-transparent via-[#E07A47]/65 to-transparent"
          />

          <div className="grid gap-10 lg:grid-cols-12 lg:items-center">
            <div className="lg:col-span-7">
              <p className="mb-3 font-mono text-[11px] uppercase tracking-[0.2em] text-[#E07A47]">
                Начать обсуждение
              </p>
              <SplitHeading
                as="h2"
                segments={[
                  { text: 'Хотите такой же живой лид-магнит ' },
                  { text: 'для своего бизнеса?', accent: true },
                ]}
                className="font-display text-3xl font-bold leading-[1.12] tracking-tight text-[#F5EFE6] sm:text-5xl"
              />
              <p className="mt-5 max-w-xl text-base leading-relaxed text-[#A69D94]">
                Проверьте идею в чате наверху или напишите мне — подберу 2 рабочих
                сценария под вашу нишу и подскажу формат запуска.
              </p>

              <div className="mt-8">
                <MagneticButton
                  type="button"
                  onClick={onJumpToDialog}
                  className="btn-copper inline-flex items-center gap-2.5 rounded-xl px-6 py-3.5 text-sm font-semibold"
                >
                  <span>Вернуться к ИИ-диалогу</span>
                  <Icon icon="solar:arrow-up-linear" className="h-4 w-4" aria-hidden="true" />
                </MagneticButton>
              </div>
            </div>

            <div className="space-y-3 lg:col-span-5" data-reveal-group>
              {SITE_CONFIG.messengers.map((m) => (
                <a
                  key={m.id}
                  href={m.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-reveal-card
                  className="group flex items-center justify-between rounded-2xl border border-[#F2C094]/12 bg-[#100E0C]/90 p-4 transition-all duration-300 hover:-translate-y-0.5 hover:border-[#E07A47]/60 hover:bg-[#171310]"
                >
                  <div className="flex items-center gap-3.5">
                    <span className="flex h-11 w-11 items-center justify-center rounded-xl border border-[#F2C094]/15 bg-[#181512] text-[#E07A47] transition-colors group-hover:border-[#E07A47]/60 group-hover:bg-[#E07A47]/12">
                      <Icon
                        icon={MESSENGER_ICONS[m.id] ?? 'solar:chat-round-dots-bold'}
                        className="h-5 w-5"
                        aria-hidden="true"
                      />
                    </span>
                    <div>
                      <p className="text-sm font-semibold text-[#F5EFE6] transition-colors group-hover:text-[#F2C094]">
                        {m.label}
                      </p>
                      <p className="font-mono text-xs text-[#8E867E]">{m.description}</p>
                    </div>
                  </div>
                  <Icon
                    icon="solar:arrow-right-up-linear"
                    className="h-5 w-5 text-[#8E867E] transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-[#E07A47]"
                    aria-hidden="true"
                  />
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-start justify-between gap-4 border-t border-[#F2C094]/10 pt-8 text-xs text-[#736B63] sm:flex-row sm:items-center">
          <p>
            © {CURRENT_YEAR} {SITE_CONFIG.authorName}. {SITE_CONFIG.role}.
          </p>
          <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-[#5F5852]">
            PDF → Кристалл живого диалога
          </p>
        </div>
      </div>
    </footer>
  )
}
