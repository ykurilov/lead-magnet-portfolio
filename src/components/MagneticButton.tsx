import { type ButtonHTMLAttributes, type MouseEvent, useRef, useState } from 'react'

interface MagneticButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  strength?: number
}

function canUseMagnetic(): boolean {
  if (typeof window === 'undefined') return false
  return (
    window.matchMedia('(pointer: fine)').matches &&
    !window.matchMedia('(prefers-reduced-motion: reduce)').matches
  )
}

/**
 * Tactile button with subtle magnetic pull on fine pointers.
 * Degrades cleanly to standard CSS interaction on touch or reduced-motion.
 */
export function MagneticButton({
  strength = 6,
  className = '',
  children,
  onMouseMove,
  onMouseLeave,
  ...rest
}: MagneticButtonProps) {
  const buttonRef = useRef<HTMLButtonElement>(null)
  const [enabled] = useState<boolean>(canUseMagnetic)

  const handleMove = (event: MouseEvent<HTMLButtonElement>) => {
    onMouseMove?.(event)
    if (!enabled || !buttonRef.current || rest.disabled) return
    const rect = buttonRef.current.getBoundingClientRect()
    const dx = ((event.clientX - rect.left) / rect.width - 0.5) * strength * 2
    const dy = ((event.clientY - rect.top) / rect.height - 0.5) * strength * 2
    buttonRef.current.style.transform = `translate3d(${dx.toFixed(1)}px, ${dy.toFixed(1)}px, 0)`
  }

  const handleLeave = (event: MouseEvent<HTMLButtonElement>) => {
    onMouseLeave?.(event)
    if (!enabled || !buttonRef.current) return
    buttonRef.current.style.transform = 'translate3d(0, 0, 0)'
  }

  return (
    <button
      ref={buttonRef}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      className={className}
      {...rest}
    >
      {children}
    </button>
  )
}
