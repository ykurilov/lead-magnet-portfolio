import { useEffect, useRef } from 'react'

const PHASES = [
  { threshold: 0.22, code: '01', label: 'Плоский PDF-лист' },
  { threshold: 0.48, code: '02', label: 'Распад документа' },
  { threshold: 0.78, code: '03', label: 'Кристалл диалога' },
  { threshold: 1.01, code: '04', label: 'Нейросвязь с клиентом' },
]

interface ScrollProgressHudProps {
  progressRef: React.MutableRefObject<number>
}

/**
 * Top hairline progress bar + discreet 3D narrative phase telemetry.
 * Reads scroll progress via lightweight rAF polling only on scroll events (no React re-renders).
 */
export function ScrollProgressHud({ progressRef }: ScrollProgressHudProps) {
  const barRef = useRef<HTMLDivElement>(null)
  const codeRef = useRef<HTMLSpanElement>(null)
  const labelRef = useRef<HTMLSpanElement>(null)
  const percentRef = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    let rafId = 0

    const syncHud = () => {
      rafId = 0
      const maxScroll = Math.max(
        1,
        document.documentElement.scrollHeight - window.innerHeight,
      )
      const p = Math.min(1, Math.max(0, window.scrollY / maxScroll))
      progressRef.current = p

      if (barRef.current) {
        barRef.current.style.transform = `scaleX(${p.toFixed(4)})`
      }

      const activePhase = PHASES.find((phase) => p < phase.threshold) ?? PHASES[PHASES.length - 1]
      if (codeRef.current && codeRef.current.textContent !== activePhase.code) {
        codeRef.current.textContent = activePhase.code
      }
      if (labelRef.current && labelRef.current.textContent !== activePhase.label) {
        labelRef.current.textContent = activePhase.label
      }
      if (percentRef.current) {
        percentRef.current.textContent = `${Math.round(p * 100)}%`
      }
    }

    const onScroll = () => {
      if (!rafId) {
        rafId = window.requestAnimationFrame(syncHud)
      }
    }

    syncHud()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll, { passive: true })

    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      if (rafId) window.cancelAnimationFrame(rafId)
    }
  }, [progressRef])

  return (
    <>
      {/* Top hairline copper scroll progress */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-x-0 top-0 z-50 h-[2px] bg-[#241E1A]/60"
      >
        <div
          ref={barRef}
          className="h-full w-full origin-left bg-gradient-to-r from-[#8E4B2B] via-[#E07A47] to-[#F2C094]"
          style={{ transform: 'scaleX(0)' }}
        />
      </div>

      {/* Discreet 3D transformation phase HUD on large screens */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed right-5 bottom-5 z-30 hidden items-center gap-3 rounded-full border border-[#F2C094]/15 bg-[#12100E]/80 px-3.5 py-2 backdrop-blur-md xl:flex"
      >
        <span className="h-1.5 w-1.5 rounded-full bg-[#E07A47] shadow-[0_0_8px_#E07A47]" />
        <span ref={codeRef} className="font-mono text-[10px] font-semibold text-[#E07A47]">
          01
        </span>
        <span className="h-3 w-px bg-[#F2C094]/15" />
        <span
          ref={labelRef}
          className="font-mono text-[10px] uppercase tracking-widest text-[#C4BAB0]"
        >
          Плоский PDF-лист
        </span>
        <span
          ref={percentRef}
          className="w-7 text-right font-mono text-[10px] text-[#736B63]"
        >
          0%
        </span>
      </div>
    </>
  )
}
