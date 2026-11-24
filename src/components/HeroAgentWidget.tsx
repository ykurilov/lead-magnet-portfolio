import { Icon } from '@iconify/react'
import { useEffect, useRef, useState } from 'react'
import { SITE_CONFIG } from '../data/portfolioData'

interface ChatMessage {
  id: string
  role: 'agent' | 'user'
  text: string
}

interface HeroAgentWidgetProps {
  externalPromptTrigger?: number
  onDialogPulse?: () => void
}

const QUICK_NICHES = [
  'Онлайн-школа или курс',
  'Эксперт / консалтинг',
  'Услуги или малый бизнес',
]

const NICHE_IDEAS: Record<string, { title: string; pitch: string }> = {
  'Онлайн-школа или курс': {
    title: 'ИИ-диагност «Точка старта» за 10 минут',
    pitch:
      'Вместо длинного чек-листа гость отвечает на 4 вопроса о своём опыте и сразу получает персональный маршрут обучения. А за первым практическим разбором переходит в ваш мессенджер.',
  },
  'Эксперт / консалтинг': {
    title: 'Калькулятор-аудит воронки в диалоге',
    pitch:
      'Вместо записи на холодный созвон клиент за 12 минут разбирает с ассистентом, где теряются заявки, и сам просит продолжить обсуждение с вами в личке.',
  },
  'Услуги или малый бизнес': {
    title: 'Умный подборщик решения под бюджет',
    pitch:
      'Вместо скучной формы «Оставьте телефон» ИИ-ассистент уточняет задачу и сроки, показывает 2–3 понятных варианта и переводит клиента в мессенджер за точной сметой.',
  },
}

export function HeroAgentWidget({
  externalPromptTrigger = 0,
  onDialogPulse,
}: HeroAgentWidgetProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'init-1',
      role: 'agent',
      text: 'Здравствуйте! Я живой лид-магнит Юрия. Давайте за пару минут подберём, какой интерактивный диалог вместо скучного PDF сработает именно в вашем бизнесе. Чем вы занимаетесь?',
    },
  ])
  const [stage, setStage] = useState<'niche' | 'goal' | 'done'>('niche')
  const [selectedNiche, setSelectedNiche] = useState<string>('')
  const [inputValue, setInputValue] = useState('')
  const [isTyping, setIsTyping] = useState(false)

  const scrollRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages, isTyping])

  useEffect(() => {
    if (externalPromptTrigger > 0) {
      inputRef.current?.focus()
    }
  }, [externalPromptTrigger])

  const appendAgentReply = (text: string, nextStage: 'niche' | 'goal' | 'done') => {
    setIsTyping(true)
    window.setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        { id: `agent-${Date.now()}`, role: 'agent', text },
      ])
      setStage(nextStage)
      setIsTyping(false)
      onDialogPulse?.()
    }, 420)
  }

  const handleUserSubmit = (rawText: string) => {
    const trimmed = rawText.trim()
    if (!trimmed || isTyping) return

    setMessages((prev) => [
      ...prev,
      { id: `user-${Date.now()}`, role: 'user', text: trimmed },
    ])
    setInputValue('')
    onDialogPulse?.()

    if (stage === 'niche') {
      setSelectedNiche(trimmed)
      appendAgentReply(
        `Понял, направление «${trimmed}». А что сейчас важнее всего для вашего клиента в первые 15 минут: понять, с чего начать, или сразу прикинуть бюджет и сроки?`,
        'goal',
      )
      return
    }

    if (stage === 'goal') {
      const idea = NICHE_IDEAS[selectedNiche] ?? {
        title: `ИИ-навигатор для ниши «${selectedNiche || 'вашего проекта'}»`,
        pitch:
          'Агент за 10–15 минут выясняет задачу человека, даёт ему первый ощутимый результат прямо в диалоге и мягко переводит в ваш мессенджер за деталями.',
      }
      appendAgentReply(
        `Готово! Для вас отлично подойдёт формат «${idea.title}». ${idea.pitch} Хотите докрутить сценарий под ваш трафик и посмотреть, как это работает вживую? Продолжим в удобном мессенджере:`,
        'done',
      )
      return
    }

    appendAgentReply(
      'Отлично! Чтобы обсудить реальный запуск под ваш проект, просто выберите удобный мессенджер ниже.',
      'done',
    )
  }

  const handleReset = () => {
    setIsTyping(false)
    setSelectedNiche('')
    setStage('niche')
    setInputValue('')
    setMessages([
      {
        id: 'init-reset',
        role: 'agent',
        text: 'Здравствуйте! Я живой лид-магнит Юрия. Давайте за пару минут подберём, какой интерактивный диалог вместо скучного PDF сработает именно в вашем бизнесе. Чем вы занимаетесь?',
      },
    ])
  }

  const currentStepNumber = stage === 'niche' ? 1 : 2

  return (
    <div
      id="live-dialog-anchor"
      className="surface-obsidian relative flex flex-col overflow-hidden rounded-[26px] backdrop-blur-xl"
    >
      {/* EMBED_DIALOG_SCRIPT_PLACEHOLDER: замените этот компонент-заглушку на ваш скрипт живого диалога */}

      {/* Subtle warm top highlight line */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-10 top-0 h-px bg-gradient-to-r from-transparent via-[#E07A47]/65 to-transparent"
      />

      {/* Top bar */}
      <div className="flex items-center justify-between border-b border-[#F2C094]/10 bg-[#171411]/90 px-4 py-3.5 sm:px-5">
        <div className="flex items-center gap-3">
          <div className="relative h-10 w-10 shrink-0">
            <img
              src={SITE_CONFIG.authorPortrait}
              alt={SITE_CONFIG.authorName}
              width={40}
              height={40}
              className="h-10 w-10 rounded-full border border-[#E07A47]/45 object-cover object-top"
            />
            <span className="absolute right-0 bottom-0 flex h-3 w-3">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#E07A47] opacity-70" />
              <span className="relative inline-flex h-3 w-3 rounded-full border-2 border-[#171411] bg-[#E07A47]" />
            </span>
          </div>
          <div>
            <p className="text-xs font-semibold text-[#F5EFE6] sm:text-sm">
              Генератор идеи лид-магнита
            </p>
            <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-[#A69D94]">
              Онлайн-подбор · Шаг {currentStepNumber} из 2
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleReset}
          title="Начать диалог заново"
          aria-label="Начать диалог заново"
          className="inline-flex items-center gap-1.5 rounded-xl border border-[#F2C094]/12 bg-[#0F0D0C] px-2.5 py-1.5 font-mono text-[11px] text-[#A69D94] transition-colors hover:border-[#E07A47]/50 hover:text-[#F5EFE6]"
        >
          <Icon icon="solar:restart-linear" className="h-3.5 w-3.5" aria-hidden="true" />
          <span className="hidden sm:inline">Сброс</span>
        </button>
      </div>

      {/* Messages area */}
      <div
        ref={scrollRef}
        className="flex h-[325px] flex-col gap-3 overflow-y-auto px-4 py-4 sm:h-[365px] sm:px-5"
      >
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[88%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                msg.role === 'user'
                  ? 'rounded-br-sm bg-gradient-to-br from-[#E58350] to-[#CE6838] font-medium text-[#0C0B0A] shadow-[0_8px_24px_-10px_rgba(224,122,71,0.55)]'
                  : 'rounded-bl-sm border border-[#F2C094]/10 bg-[#1B1714]/95 text-[#F5EFE6]'
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex justify-start">
            <div className="inline-flex items-center gap-1.5 rounded-2xl rounded-bl-sm border border-[#F2C094]/10 bg-[#1B1714] px-4 py-3">
              <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-[#E07A47]" />
              <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-[#E07A47] [animation-delay:0.15s]" />
              <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-[#E07A47] [animation-delay:0.3s]" />
            </div>
          </div>
        )}

        {/* Quick suggestions */}
        {!isTyping && stage === 'niche' && (
          <div className="mt-1 flex flex-wrap gap-2">
            {QUICK_NICHES.map((niche) => (
              <button
                key={niche}
                type="button"
                onClick={() => handleUserSubmit(niche)}
                className="rounded-xl border border-[#F2C094]/15 bg-[#12100E] px-3.5 py-2 text-left text-xs text-[#E8DFD5] transition-all hover:border-[#E07A47]/70 hover:bg-[#1D1815] hover:text-[#F2C094]"
              >
                {niche}
              </button>
            ))}
          </div>
        )}

        {!isTyping && stage === 'goal' && (
          <div className="mt-1 flex flex-wrap gap-2">
            {[
              'Понять, с чего начать и где узкое место',
              'Сразу прикинуть бюджет и решение',
            ].map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => handleUserSubmit(option)}
                className="rounded-xl border border-[#F2C094]/15 bg-[#12100E] px-3.5 py-2 text-left text-xs text-[#E8DFD5] transition-all hover:border-[#E07A47]/70 hover:bg-[#1D1815] hover:text-[#F2C094]"
              >
                {option}
              </button>
            ))}
          </div>
        )}

        {!isTyping && stage === 'done' && (
          <div className="mt-2 rounded-2xl border border-[#E07A47]/35 bg-[#E07A47]/8 p-3.5">
            <p className="mb-2.5 font-mono text-[10px] uppercase tracking-[0.16em] text-[#F2C094]">
              Продолжить диалог в мессенджере
            </p>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
              {SITE_CONFIG.messengers.map((m) => (
                <a
                  key={m.id}
                  href={m.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-[#F2C094]/15 bg-[#12100E] px-3 py-2 text-xs font-semibold text-[#F5EFE6] transition-all hover:border-[#E07A47] hover:text-[#F2C094]"
                >
                  <span>{m.label}</span>
                  <Icon
                    icon="solar:arrow-right-up-linear"
                    className="h-3.5 w-3.5"
                    aria-hidden="true"
                  />
                </a>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Input form */}
      <form
        onSubmit={(e) => {
          e.preventDefault()
          handleUserSubmit(inputValue)
        }}
        className="flex items-center gap-2 border-t border-[#F2C094]/10 bg-[#100E0C]/95 p-3"
      >
        <label htmlFor="hero-dialog-input" className="sr-only">
          Ваш ответ ассистенту
        </label>
        <input
          id="hero-dialog-input"
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Напишите вашу нишу или вопрос..."
          className="flex-1 rounded-xl border border-[#F2C094]/12 bg-[#171412] px-3.5 py-2.5 text-sm text-[#F5EFE6] placeholder-[#736B63] transition-colors focus:border-[#E07A47] focus:outline-none"
        />
        <button
          type="submit"
          disabled={!inputValue.trim() || isTyping}
          aria-label="Отправить сообщение"
          className="btn-copper inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl disabled:cursor-not-allowed disabled:opacity-35 disabled:shadow-none"
        >
          <Icon icon="solar:plain-bold" className="h-4 w-4" aria-hidden="true" />
        </button>
      </form>
    </div>
  )
}
