import { Icon } from '@iconify/react'
import { useEffect, useRef } from 'react'
import { LEGAL_DOCUMENTS, type LegalDocId } from '../data/legalData'

interface LegalModalProps {
  activeDoc: LegalDocId | null
  onSelectDoc: (doc: LegalDocId) => void
  onClose: () => void
}

const DOC_TABS: LegalDocId[] = ['privacy', 'consent', 'cookies']

export function LegalModal({ activeDoc, onSelectDoc, onClose }: LegalModalProps) {
  const closeRef = useRef<HTMLButtonElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!activeDoc) return
    closeRef.current?.focus()
    if (contentRef.current) {
      contentRef.current.scrollTop = 0
    }
  }, [activeDoc])

  useEffect(() => {
    if (!activeDoc) return
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [activeDoc, onClose])

  if (!activeDoc) return null

  const doc = LEGAL_DOCUMENTS[activeDoc]

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#060504]/80 p-3 backdrop-blur-md sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="legal-modal-title"
      onClick={onClose}
    >
      <div
        data-lenis-prevent
        className="surface-obsidian relative flex max-h-[88vh] w-full max-w-3xl flex-col overflow-hidden rounded-[26px] shadow-[0_32px_90px_rgba(0,0,0,0.8)]"
        onClick={(e) => e.stopPropagation()}
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-12 top-0 h-px bg-gradient-to-r from-transparent via-[#E07A47]/65 to-transparent"
        />

        {/* Header */}
        <div className="flex items-start justify-between gap-4 border-b border-[#F2C094]/12 bg-[#161310]/95 px-5 py-4 sm:px-7 sm:py-5">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#E07A47]">
              Правовая информация · Редакция от {doc.updatedAt}
            </p>
            <h3
              id="legal-modal-title"
              className="mt-1 font-display text-lg font-semibold leading-snug text-[#F5EFE6] sm:text-xl"
            >
              {doc.title}
            </h3>
          </div>

          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            aria-label="Закрыть документ"
            className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-[#F2C094]/15 bg-[#0C0B0A] text-[#A69D94] transition-colors hover:border-[#E07A47] hover:text-[#F5EFE6]"
          >
            <Icon icon="solar:close-square-linear" className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>

        {/* Document switch tabs */}
        <div
          role="tablist"
          aria-label="Юридические документы"
          className="flex flex-wrap gap-2 border-b border-[#F2C094]/10 bg-[#12100E] px-5 py-3 sm:px-7"
        >
          {DOC_TABS.map((id) => {
            const item = LEGAL_DOCUMENTS[id]
            const isActive = id === activeDoc
            return (
              <button
                key={id}
                type="button"
                role="tab"
                aria-selected={isActive}
                onClick={() => onSelectDoc(id)}
                className={`rounded-xl px-3.5 py-1.5 font-mono text-[11px] transition-colors ${
                  isActive
                    ? 'border border-[#E07A47]/60 bg-[#E07A47]/15 text-[#F2C094]'
                    : 'border border-[#F2C094]/12 bg-[#0C0B0A] text-[#A69D94] hover:border-[#F2C094]/30 hover:text-[#F5EFE6]'
                }`}
              >
                {item.shortLabel}
              </button>
            )
          })}
        </div>

        {/* Scrollable body */}
        <div
          ref={contentRef}
          className="flex-1 space-y-6 overflow-y-auto px-5 py-6 text-sm leading-relaxed text-[#CFC6BC] sm:px-7"
        >
          {doc.sections.map((section) => (
            <section key={section.heading} className="space-y-2.5">
              <h4 className="font-display text-base font-semibold text-[#F5EFE6]">
                {section.heading}
              </h4>
              {section.paragraphs.map((paragraph, idx) => (
                <p key={idx} className="text-[#BDB4AA]">
                  {paragraph}
                </p>
              ))}
              {section.bullets && (
                <ul className="space-y-2 pl-1">
                  {section.bullets.map((bullet, idx) => (
                    <li key={idx} className="flex items-start gap-2.5 text-[#BDB4AA]">
                      <span
                        aria-hidden="true"
                        className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#E07A47]"
                      />
                      <span>{bullet}</span>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          ))}
        </div>

        {/* Footer action */}
        <div className="flex items-center justify-end border-t border-[#F2C094]/10 bg-[#12100E] px-5 py-3.5 sm:px-7">
          <button
            type="button"
            onClick={onClose}
            className="btn-copper rounded-xl px-5 py-2 text-xs font-semibold"
          >
            Понятно, закрыть
          </button>
        </div>
      </div>
    </div>
  )
}
