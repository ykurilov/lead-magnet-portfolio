import { Icon } from '@iconify/react'
import { useEffect, useRef, useState } from 'react'
import { SITE_CONFIG, type LeadMagnetConcept } from '../data/portfolioData'

interface SandboxDrawerProps {
  concept: LeadMagnetConcept | null
  onClose: () => void
  onSwitchToMainDialog: () => void
}

interface DrawerMessage {
  id: string
  role: 'agent' | 'user'
  text: string
}

export function SandboxDrawer({
  concept,
  onClose,
  onSwitchToMainDialog,
}: SandboxDrawerProps) {
  const [stepIndex, setStepIndex] = useState(0)
  const [history, setHistory] = useState<DrawerMessage[]>(() =>
    concept
      ? [
          {
            id: `start-${concept.id}`,
            role: 'agent',
            text: concept.demoSteps[0]?.agentMessage ?? '',
          },
        ]
      : [],
  )
  const [isTyping, setIsTyping] = useState(false)
  const closeButtonRef = useRef<HTMLButtonElement>(null)
  const scrollAreaRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!concept) return
    closeButtonRef.current?.focus()
  }, [concept])

  useEffect(() => {
    if (!concept) return
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [concept, onClose])

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight
    }
  }, [history, isTyping])

  if (!concept) return null

  const currentStep = concept.demoSteps[stepIndex]

  const handleChooseOption = (reply: string, nextIndex: number) => {
    if (isTyping) return
    setHistory((prev) => [
      ...prev,
      { id: `user-${Date.now()}`, role: 'user', text: reply },
    ])
    setIsTyping(true)

    window.setTimeout(() => {
      const nextStep = concept.demoSteps[nextIndex]
      if (nextStep) {
        setHistory((prev) => [
          ...prev,
          { id: `agent-${Date.now()}`, role: 'agent', text: nextStep.agentMessage },
        ])
        setStepIndex(nextIndex)
      }
      setIsTyping(false)
    }, 380)
  }

  const handleRestart = () => {
    setIsTyping(false)
    setStepIndex(0)
    setHistory([
      {
        id: `restart-${Date.now()}`,
        role: 'agent',
        text: concept.demoSteps[0]?.agentMessage ?? '',
      },
    ])
  }

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end bg-[#070605]/75 backdrop-blur-md"
      role="dialog"
      aria-modal="true"
      aria-labelledby="drawer-title"
      onClick={onClose}
    >
      <div
        className="flex h-full w-full max-w-lg flex-col border-l border-[#F2C094]/15 bg-[#0E0C0B] shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-4 border-b border-[#F2C094]/12 bg-[#161310] px-5 py-4">
          <div className="flex items-start gap-3">
            <img
              src={SITE_CONFIG.authorPortrait}
              alt={SITE_CONFIG.authorName}
              width={40}
              height={40}
              className="mt-0.5 h-10 w-10 shrink-0 rounded-full border border-[#E07A47]/45 object-cover object-top"
            />
            <div>
              <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-[#E07A47]">
                Тест-драйв на сайте · Без перехода
              </span>
              <h3
                id="drawer-title"
                className="mt-1 font-display text-base font-semibold leading-snug text-[#F5EFE6]"
              >
                {concept.title}
              </h3>
            </div>
          </div>

          <button
            ref={closeButtonRef}
            type="button"
            onClick={onClose}
            aria-label="Закрыть стенд"
            className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-[#F2C094]/15 bg-[#0E0C0B] text-[#A69D94] transition-colors hover:border-[#E07A47] hover:text-[#F5EFE6]"
          >
            <Icon icon="solar:close-square-linear" className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>

        {/* Dialog Area */}
        <div
          ref={scrollAreaRef}
          className="flex flex-1 flex-col gap-3 overflow-y-auto px-5 py-5"
        >
          {history.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[88%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                  msg.role === 'user'
                    ? 'rounded-br-sm bg-gradient-to-br from-[#E58350] to-[#CE6838] font-medium text-[#0C0B0A]'
                    : 'rounded-bl-sm border border-[#F2C094]/10 bg-[#1A1613] text-[#F5EFE6]'
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex justify-start">
              <div className="inline-flex items-center gap-1.5 rounded-2xl rounded-bl-sm border border-[#F2C094]/10 bg-[#1A1613] px-4 py-3">
                <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-[#E07A47]" />
                <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-[#E07A47] [animation-delay:0.15s]" />
                <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-[#E07A47] [animation-delay:0.3s]" />
              </div>
            </div>
          )}

          {!isTyping && currentStep?.options && (
            <div className="mt-2 flex flex-col gap-2">
              {currentStep.options.map((opt) => (
                <button
                  key={opt.label}
                  type="button"
                  onClick={() => handleChooseOption(opt.reply, opt.nextIndex)}
                  className="rounded-xl border border-[#F2C094]/15 bg-[#151210] px-4 py-3 text-left text-sm text-[#F5EFE6] transition-all hover:border-[#E07A47]/70 hover:bg-[#1D1815] hover:text-[#F2C094]"
                >
                  {opt.label}
                </button>
              ))}
            </div>
          )}

          {!isTyping && currentStep?.isFinal && (
            <div className="mt-2 space-y-4">
              <div className="rounded-2xl border border-[#E07A47]/40 bg-[#E07A47]/10 p-4">
                <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-[#F2C094]">
                  Итог для клиента
                </p>
                <p className="mt-1.5 font-display text-base font-semibold text-[#F5EFE6]">
                  {currentStep.resultTitle}
                </p>
                <p className="mt-2 text-sm leading-relaxed text-[#E8DFD5]">
                  {currentStep.resultSummary}
                </p>
              </div>

              <div className="rounded-2xl border border-[#F2C094]/12 bg-[#151210] p-4">
                <p className="text-xs leading-relaxed text-[#A69D94]">
                  Демонстрация завершена. Этот стенд никуда не уводит — вы остались на сайте.
                  Хотите придумать такой же лид-магнит под ваш бизнес?
                </p>
                <div className="mt-3.5 flex flex-col gap-2 sm:flex-row">
                  <button
                    type="button"
                    onClick={onSwitchToMainDialog}
                    className="btn-copper inline-flex flex-1 items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-xs font-semibold"
                  >
                    <span>Придумать свой в главном чате</span>
                    <Icon icon="solar:arrow-right-linear" className="h-4 w-4" aria-hidden="true" />
                  </button>
                  <button
                    type="button"
                    onClick={handleRestart}
                    className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-[#F2C094]/15 bg-[#0E0C0B] px-3.5 py-2.5 text-xs font-medium text-[#A69D94] transition-colors hover:border-[#E07A47]/50 hover:text-[#F5EFE6]"
                  >
                    <Icon icon="solar:restart-linear" className="h-4 w-4" aria-hidden="true" />
                    <span>Ещё раз</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
