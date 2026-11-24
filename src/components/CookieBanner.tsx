import { Icon } from '@iconify/react'
import { useEffect, useState } from 'react'
import type { LegalDocId } from '../data/legalData'

export type CookieChoice = 'all' | 'essential'

const STORAGE_KEY = 'yk_cookie_consent_v1'

interface CookieBannerProps {
  forceOpenTick?: number
  onOpenLegalDoc: (doc: LegalDocId) => void
}

function readSavedChoice(): CookieChoice | null {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as { choice?: CookieChoice }
    if (parsed.choice === 'all' || parsed.choice === 'essential') {
      return parsed.choice
    }
    return null
  } catch {
    return null
  }
}

export function CookieBanner({ forceOpenTick = 0, onOpenLegalDoc }: CookieBannerProps) {
  const [visible, setVisible] = useState(false)
  const [currentChoice, setCurrentChoice] = useState<CookieChoice | null>(null)

  useEffect(() => {
    const saved = readSavedChoice()
    setCurrentChoice(saved)
    if (!saved) {
      setVisible(true)
    }
  }, [])

  useEffect(() => {
    if (forceOpenTick > 0) {
      setVisible(true)
    }
  }, [forceOpenTick])

  const handleSaveChoice = (choice: CookieChoice) => {
    try {
      window.localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          choice,
          updatedAt: new Date().toISOString(),
        }),
      )
    } catch {
      // Ignore storage failures in private browsing modes
    }
    setCurrentChoice(choice)
    setVisible(false)
  }

  if (!visible) return null

  return (
    <aside
      aria-label="Уведомление об использовании файлов cookie"
      className="fixed inset-x-3 bottom-3 z-40 sm:right-6 sm:bottom-6 sm:left-auto sm:w-full sm:max-w-md"
    >
      <div className="surface-obsidian relative overflow-hidden rounded-2xl p-4 shadow-[0_24px_60px_rgba(0,0,0,0.75)] backdrop-blur-xl sm:p-5">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-[#E07A47]/60 to-transparent"
        />

        <div className="flex items-start gap-3">
          <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border border-[#E07A47]/35 bg-[#E07A47]/12 text-[#E07A47]">
            <Icon icon="solar:shield-check-bold" className="h-4 w-4" aria-hidden="true" />
          </span>

          <div className="min-w-0 flex-1">
            <div className="flex items-center justify-between gap-2">
              <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-[#F2C094]">
                Файлы Cookie и конфиденциальность
              </p>
              {currentChoice && (
                <button
                  type="button"
                  onClick={() => setVisible(false)}
                  aria-label="Скрыть настройки cookie"
                  className="text-[#8E867E] transition-colors hover:text-[#F5EFE6]"
                >
                  <Icon icon="solar:close-circle-linear" className="h-4 w-4" aria-hidden="true" />
                </button>
              )}
            </div>

            <p className="mt-1.5 text-xs leading-relaxed text-[#BDB4AA]">
              Мы используем файлы cookie для корректной работы сайта и сохранения ваших
              настроек. Подробнее — в{' '}
              <button
                type="button"
                onClick={() => onOpenLegalDoc('cookies')}
                className="underline decoration-[#E07A47]/60 underline-offset-2 transition-colors hover:text-[#F2C094]"
              >
                Политике cookie
              </button>{' '}
              и{' '}
              <button
                type="button"
                onClick={() => onOpenLegalDoc('privacy')}
                className="underline decoration-[#E07A47]/60 underline-offset-2 transition-colors hover:text-[#F2C094]"
              >
                Политике обработки ПДн
              </button>
              .
            </p>

            <div className="mt-3.5 flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => handleSaveChoice('all')}
                className="btn-copper rounded-xl px-4 py-2 text-xs font-semibold"
              >
                Принять все
              </button>
              <button
                type="button"
                onClick={() => handleSaveChoice('essential')}
                className="rounded-xl border border-[#F2C094]/18 bg-[#12100E] px-3.5 py-2 text-xs font-medium text-[#D8CFC5] transition-colors hover:border-[#E07A47]/60 hover:text-[#F5EFE6]"
              >
                Только необходимые
              </button>
            </div>
          </div>
        </div>
      </div>
    </aside>
  )
}
