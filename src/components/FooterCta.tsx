import { Icon } from '@iconify/react'
import { SITE_CONFIG } from '../data/portfolioData'

interface FooterCtaProps {
  onJumpToDialog: () => void
}

const MESSENGER_ICONS: Record<string, string> = {
  telegram: 'solar:plain-bold',
  vk: 'solar:chat-square-like-bold',
  max: 'solar:chat-round-line-bold',
}

export function FooterCta({ onJumpToDialog }: FooterCtaProps) {
  return (
    <footer
      id="contact"
      className="border-t border-[#24242D] bg-[#0D0D11] pt-20 pb-12 sm:pt-28"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-[#24242D] bg-[#111115] p-8 sm:p-12 lg:p-16">
          <div className="grid gap-10 lg:grid-cols-12 lg:items-center">
            <div className="lg:col-span-7">
              <p className="mb-3 font-mono text-xs uppercase tracking-widest text-[#B8FF3C]">
                // Обсудить проект
              </p>
              <h2
                data-reveal-heading
                className="font-display text-2xl font-bold tracking-tight text-[#F4F4F5] sm:text-4xl"
              >
                Хотите такой же живой лид-магнит для своего бизнеса?
              </h2>
              <p className="mt-4 max-w-xl text-base leading-relaxed text-[#A1A1AA]">
                Можете прямо сейчас вернуться к ИИ-ассистенту наверху и сгенерировать
                идею, либо написать мне напрямую в удобный мессенджер — разберём вашу
                задачу без лишней воды.
              </p>

              <div className="mt-7">
                <button
                  type="button"
                  onClick={onJumpToDialog}
                  className="inline-flex items-center gap-2 rounded-xl bg-[#B8FF3C] px-5 py-3 text-sm font-semibold text-[#09090B] transition-colors hover:bg-[#CBFF6B]"
                >
                  <span>Вернуться к ИИ-диалогу</span>
                  <Icon icon="solar:arrow-up-linear" className="h-4 w-4" aria-hidden="true" />
                </button>
              </div>
            </div>

            <div className="space-y-3 lg:col-span-5">
              <div className="rounded-xl border border-[#B8FF3C]/25 bg-[#B8FF3C]/5 p-3.5">
                <p className="font-mono text-[11px] uppercase tracking-wider text-[#B8FF3C]">
                  Первый шаг без обязательств
                </p>
                <p className="mt-1 text-xs leading-relaxed text-[#E4E4E7]">
                  Напишите вашу нишу — предложу 2 рабочие идеи живого лид-магнита и
                  подскажу формат запуска.
                </p>
              </div>
              <p className="pt-1 font-mono text-xs uppercase tracking-wider text-[#A1A1AA]">
                Написать в личные сообщения:
              </p>
              {SITE_CONFIG.messengers.map((m) => (
                <a
                  key={m.id}
                  href={m.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center justify-between rounded-2xl border border-[#24242D] bg-[#09090B] p-4 transition-colors hover:border-[#B8FF3C]"
                >
                  <div className="flex items-center gap-3.5">
                    <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#24242D] bg-[#111115] text-[#B8FF3C] transition-colors group-hover:border-[#B8FF3C]">
                      <Icon
                        icon={MESSENGER_ICONS[m.id] ?? 'solar:chat-round-dots-bold'}
                        className="h-5 w-5"
                        aria-hidden="true"
                      />
                    </span>
                    <div>
                      <p className="text-sm font-semibold text-[#F4F4F5] group-hover:text-[#B8FF3C]">
                        {m.label}
                      </p>
                      <p className="text-xs text-[#A1A1AA]">{m.description}</p>
                    </div>
                  </div>
                  <Icon
                    icon="solar:arrow-right-up-linear"
                    className="h-5 w-5 text-[#A1A1AA] transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-[#B8FF3C]"
                    aria-hidden="true"
                  />
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-start justify-between gap-4 border-t border-[#24242D] pt-8 text-xs text-[#71717A] sm:flex-row sm:items-center">
          <p>
            © {new Date().getFullYear()} {SITE_CONFIG.authorName}. {SITE_CONFIG.role}.
          </p>
          <p className="font-mono">{SITE_CONFIG.cityTag}</p>
        </div>
      </div>
    </footer>
  )
}
