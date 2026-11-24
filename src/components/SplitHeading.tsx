interface HeadingSegment {
  text: string
  accent?: boolean
}

interface SplitHeadingProps {
  as?: 'h1' | 'h2' | 'h3'
  segments: HeadingSegment[]
  className?: string
  hero?: boolean
}

/**
 * Accessible word-by-word animated heading.
 * Screen readers receive the full unsplit sentence via sr-only text,
 * while visual spans are marked aria-hidden="true" for GSAP reveal choreography.
 */
export function SplitHeading({
  as: Tag = 'h2',
  segments,
  className = '',
  hero = false,
}: SplitHeadingProps) {
  const fullText = segments.map((s) => s.text).join('')

  return (
    <Tag
      className={className}
      {...(hero ? { 'data-hero-heading': '' } : { 'data-reveal-heading': '' })}
    >
      <span className="sr-only">{fullText}</span>
      <span aria-hidden="true">
        {segments.map((segment, segIndex) => {
          const tokens = segment.text.split(/(\s+)/)
          return tokens.map((token, tokenIndex) => {
            if (/^\s+$/.test(token)) {
              return <span key={`${segIndex}-sp-${tokenIndex}`}>{token}</span>
            }
            if (!token) return null
            return (
              <span
                key={`${segIndex}-w-${tokenIndex}`}
                className="inline-block overflow-hidden align-top py-[0.12em] -my-[0.12em]"
              >
                <span
                  data-split-word=""
                  className={
                    segment.accent
                      ? 'font-editorial-accent inline-block text-[1.12em] font-semibold leading-[1.02] text-[#E88B59]'
                      : 'inline-block'
                  }
                >
                  {token}
                </span>
              </span>
            )
          })
        })}
      </span>
    </Tag>
  )
}
