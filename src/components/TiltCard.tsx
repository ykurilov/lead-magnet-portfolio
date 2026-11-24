import { type MouseEvent, type ReactNode, useRef, useState } from 'react'

interface TiltCardProps {
  children: ReactNode
  className?: string
  maxTilt?: number
  as?: 'div' | 'article'
  revealCard?: boolean
}

function canUseTilt(): boolean {
  if (typeof window === 'undefined') return false
  return (
    window.matchMedia('(pointer: fine)').matches &&
    !window.matchMedia('(prefers-reduced-motion: reduce)').matches
  )
}

/**
 * Tactile 3D-perspective card with cursor-following copper edge sheen.
 * Automatically disables tilt on touch/coarse pointers and under prefers-reduced-motion.
 */
export function TiltCard({
  children,
  className = '',
  maxTilt = 4.5,
  as: Tag = 'div',
  revealCard = true,
}: TiltCardProps) {
  const cardRef = useRef<HTMLDivElement>(null)
  const [interactive] = useState<boolean>(canUseTilt)

  const handleMouseMove = (event: MouseEvent<HTMLDivElement>) => {
    if (!interactive || !cardRef.current) return
    const rect = cardRef.current.getBoundingClientRect()
    const px = (event.clientX - rect.left) / rect.width
    const py = (event.clientY - rect.top) / rect.height

    const rotateY = (px - 0.5) * maxTilt * 2
    const rotateX = (0.5 - py) * maxTilt * 2

    cardRef.current.style.setProperty('--glow-x', `${(px * 100).toFixed(1)}%`)
    cardRef.current.style.setProperty('--glow-y', `${(py * 100).toFixed(1)}%`)
    cardRef.current.style.transform = `perspective(960px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translate3d(0, -2px, 0)`
  }

  const handleMouseLeave = () => {
    if (!interactive || !cardRef.current) return
    cardRef.current.style.transform = 'perspective(960px) rotateX(0deg) rotateY(0deg) translate3d(0, 0, 0)'
  }

  return (
    <Tag
      ref={cardRef}
      {...(revealCard ? { 'data-reveal-card': '' } : {})}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`tilt-card ${className}`}
    >
      {children}
    </Tag>
  )
}
