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

export function HeroAgentWidget({ externalPromptTrigger = 0 }: HeroAgentWidgetProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'init-1',
      role: 'agent',
      text: 'Привет! Я живой лид-магнит Юрия. Давай за пару минут придумаем, какой интерактивный диалог вместо скучного PDF сработает именно в твоём бизнесе. Чем ты занимаешься?',
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

    if (stage === 'niche') {
      setSelectedNiche(trimmed)
      appendAgentReply(
        `Понял, направление «${trimmed}». А что сейчас важнее всего для твоего клиента в первые 15 минут: понять, с чего начать, или сразу прикинуть бюджет и сроки?`,
        'goal',
      )
      return
    }

    if (stage === 'goal') {
      const idea = NICHE_IDEAS[selectedNiche] ?? {
        title: `ИИ-навигатор для ниши «${selectedNiche || 'твоего проекта'}»`,
        pitch:
          'Агент за 10–15 минут выясняет задачу человека, даёт ему первый ощутимый результат прямо в диалоге и мягко переводит в твой мессенджер за деталями.',
      }
      appendAgentReply(
        `Готово! Для тебя отлично подойдёт формат «${idea.title}». ${idea.pitch} Хочешь докрутить сценарий под твой трафик и увидеть, как это выглядит в деле? Продолжим в удобном мессенджере:`,
        'done',
      )
      return
    }

    appendAgentReply(
      'Отлично! Этот прототип показывает саму механику. Чтобы обсудить реальный запуск под твой проект, просто нажми на любую кнопку мессенджера ниже.',
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
        text: 'Привет! Я живой лид-магнит Юрия. Давай за пару минут придумаем, какой интерактивный диалог вместо скучного PDF сработает именно в твоём бизнесе. Чем ты занимаешься?',
      },
    ])
  }

  return (
    <div
      id="live-dialog-anchor"
      className="relative flex flex-col overflow-hidden rounded-2xl border border-[#24242D] bg-[#111115] shadow-2xl"
    >
      {/* EMBED_DIALOG_SCRIPT_PLACEHOLDER: замените этот компонент-заглушку на ваш скрипт живого диалога */}

      {/* Top bar */}
      <div className="flex items-center justify-between border-b border-[#24242D] bg-[#15151B] px-4 py-3 sm:px-5">
        <div className="flex items-center gap-3">
          <span className="relative flex h-2.5 w-2.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#B8FF3C] opacity-75" />
            <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-[#B8FF3C]" />
          </span>
          <div>
            <p className="text-xs font-semibold text-[#F4F4F5] sm:text-sm">
              Генератор идеи лид-магнита
            </p>
            <p className="font-mono text-[10px] uppercase tracking-wider text-[#A1A1AA]">
              Прототип · Заглушка до подключения скрипта
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleReset}
          title="Начать диалог заново"
          aria-label="Начать диалог заново"
          className="inline-flex items-center gap-1.5 rounded-lg border border-[#24242D] bg-[#09090B] px-2.5 py-1.5 font-mono text-[11px] text-[#A1A1AA] transition-colors hover:border-[#3F3F4E] hover:text-[#F4F4F5]"
        >
          <Icon icon="solar:restart-linear" className="h-3.5 w-3.5" aria-hidden="true" />
          <span className="hidden sm:inline">Сброс</span>
        </button>
      </div>

      {/* Messages area */}
      <div
        ref={scrollRef}
        className="flex h-[320px] flex-col gap-3 overflow-y-auto px-4 py-4 sm:h-[360px] sm:px-5"
      >
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[88%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                msg.role === 'user'
                  ? 'rounded-br-sm bg-[#B8FF3C] font-medium text-[#09090B]'
                  : 'rounded-bl-sm border border-[#24242D] bg-[#18181F] text-[#F4F4F5]'
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex justify-start">
            <div className="inline-flex items-center gap-1.5 rounded-2xl rounded-bl-sm border border-[#24242D] bg-[#18181F] px-4 py-3">
              <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-[#B8FF3C]" />
              <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-[#B8FF3C] [animation-delay:0.15s]" />
              <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-[#B8FF3C] [animation-delay:0.3s]" />
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
                className="rounded-xl border border-[#2D2D38] bg-[#09090B] px-3 py-2 text-left text-xs text-[#F4F4F5] transition-colors hover:border-[#B8FF3C] hover:text-[#B8FF3C]"
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
                className="rounded-xl border border-[#2D2D38] bg-[#09090B] px-3 py-2 text-left text-xs text-[#F4F4F5] transition-colors hover:border-[#B8FF3C] hover:text-[#B8FF3C]"
              >
                {option}
              </button>
            ))}
          </div>
        )}

        {!isTyping && stage === 'done' && (
          <div className="mt-2 rounded-xl border border-[#B8FF3C]/30 bg-[#B8FF3C]/5 p-3">
            <p className="mb-2.5 font-mono text-[11px] uppercase tracking-wider text-[#B8FF3C]">
              Продолжить диалог в мессенджере
            </p>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
              {SITE_CONFIG.messengers.map((m) => (
                <a
                  key={m.id}
                  href={m.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-[#24242D] bg-[#09090B] px-3 py-2 text-xs font-semibold text-[#F4F4F5] transition-colors hover:border-[#B8FF3C] hover:text-[#B8FF3C]"
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
        className="flex items-center gap-2 border-t border-[#24242D] bg-[#09090B] p-3"
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
          placeholder="Напишите свою нишу или вопрос..."
          className="flex-1 rounded-xl border border-[#24242D] bg-[#111115] px-3.5 py-2.5 text-sm text-[#F4F4F5] placeholder-[#71717A] transition-colors focus:border-[#B8FF3C] focus:outline-none"
        />
        <button
          type="submit"
          disabled={!inputValue.trim() || isTyping}
          aria-label="Отправить сообщение"
          className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#B8FF3C] text-[#09090B] transition-colors hover:bg-[#CBFF6B] disabled:cursor-not-allowed disabled:opacity-40"
        >
          <Icon icon="solar:plain-bold" className="h-4 w-4" aria-hidden="true" />
        </button>
      </form>
    </div>
  )
}
