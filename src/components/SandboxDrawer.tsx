import { Icon } from '@iconify/react'
import { useEffect, useRef, useState } from 'react'
import type { LeadMagnetConcept } from '../data/portfolioData'

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
  const [history, setHistory] = useState<DrawerMessage[]>([])
  const [isTyping, setIsTyping] = useState(false)
  const closeButtonRef = useRef<HTMLButtonElement>(null)
  const scrollAreaRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!concept) return
    setStepIndex(0)
    setIsTyping(false)
    setHistory([
      {
        id: `start-${concept.id}`,
        role: 'agent',
        text: concept.demoSteps[0]?.agentMessage ?? '',
      },
    ])
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
      className="fixed inset-0 z-50 flex justify-end bg-black/75 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="drawer-title"
      onClick={onClose}
    >
      <div
        className="flex h-full w-full max-w-lg flex-col border-l border-[#24242D] bg-[#09090B] shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-4 border-b border-[#24242D] bg-[#111115] px-5 py-4">
          <div>
            <span className="font-mono text-[11px] uppercase tracking-wider text-[#B8FF3C]">
              Тест-драйв на сайте · Без перехода
            </span>
            <h3
              id="drawer-title"
              className="mt-1 font-display text-base font-semibold text-[#F4F4F5]"
            >
              {concept.title}
            </h3>
          </div>

          <button
            ref={closeButtonRef}
            type="button"
            onClick={onClose}
            aria-label="Закрыть стенд"
            className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-[#24242D] bg-[#09090B] text-[#A1A1AA] transition-colors hover:border-[#B8FF3C] hover:text-[#F4F4F5]"
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
                    ? 'rounded-br-sm bg-[#B8FF3C] font-medium text-[#09090B]'
                    : 'rounded-bl-sm border border-[#24242D] bg-[#15151B] text-[#F4F4F5]'
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex justify-start">
              <div className="inline-flex items-center gap-1.5 rounded-2xl rounded-bl-sm border border-[#24242D] bg-[#15151B] px-4 py-3">
                <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-[#B8FF3C]" />
                <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-[#B8FF3C] [animation-delay:0.15s]" />
                <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-[#B8FF3C] [animation-delay:0.3s]" />
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
                  className="rounded-xl border border-[#2D2D38] bg-[#111115] px-4 py-3 text-left text-sm text-[#F4F4F5] transition-colors hover:border-[#B8FF3C] hover:text-[#B8FF3C]"
                >
                  {opt.label}
                </button>
              ))}
            </div>
          )}

          {!isTyping && currentStep?.isFinal && (
            <div className="mt-2 space-y-4">
              <div className="rounded-2xl border border-[#B8FF3C]/40 bg-[#B8FF3C]/10 p-4">
                <p className="font-mono text-[11px] uppercase tracking-wider text-[#B8FF3C]">
                  Итог для клиента
                </p>
                <p className="mt-1 font-display text-base font-semibold text-[#F4F4F5]">
                  {currentStep.resultTitle}
                </p>
                <p className="mt-2 text-sm leading-relaxed text-[#E4E4E7]">
                  {currentStep.resultSummary}
                </p>
              </div>

              <div className="rounded-xl border border-[#24242D] bg-[#111115] p-4">
                <p className="text-xs leading-relaxed text-[#A1A1AA]">
                  Демонстрация завершена. Этот стенд никуда не уводит — вы остались на сайте.
                  Хотите придумать такой же лид-магнит под ваш бизнес?
                </p>
                <div className="mt-3 flex flex-col gap-2 sm:flex-row">
                  <button
                    type="button"
                    onClick={onSwitchToMainDialog}
                    className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg bg-[#B8FF3C] px-4 py-2.5 text-xs font-semibold text-[#09090B] transition-colors hover:bg-[#CBFF6B]"
                  >
                    <span>Придумать свой в главном чате</span>
                    <Icon icon="solar:arrow-right-linear" className="h-4 w-4" aria-hidden="true" />
                  </button>
                  <button
                    type="button"
                    onClick={handleRestart}
                    className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-[#24242D] bg-[#09090B] px-3 py-2.5 text-xs font-medium text-[#A1A1AA] transition-colors hover:text-[#F4F4F5]"
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
