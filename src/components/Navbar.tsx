import { Icon } from '@iconify/react'
import { useEffect, useState } from 'react'
import { SITE_CONFIG } from '../data/portfolioData'
import { MagneticButton } from './MagneticButton'

interface NavbarProps {
  onJumpToDialog: () => void
}

const NAV_LINKS = [
  { href: '#comparison', label: 'Почему живые' },
  { href: '#concepts', label: 'Примеры' },
  { href: '#process', label: 'Как это работает' },
  { href: '#contact', label: 'Контакты' },
]

export function Navbar({ onJumpToDialog }: NavbarProps) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 24)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const handleLinkClick = () => {
    setMobileOpen(false)
  }

  return (
    <header
      className={`sticky top-0 z-40 transition-colors duration-300 ${
        scrolled
          ? 'border-b border-[#F2C094]/12 bg-[#0C0B0A]/85 backdrop-blur-xl'
          : 'border-b border-transparent bg-[#0C0B0A]/45 backdrop-blur-md'
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-2 px-4 py-3.5 sm:px-6 sm:py-4 lg:px-8">
        <a
          href="#top"
          className="group flex min-w-0 items-center gap-3 text-sm font-medium tracking-tight text-[#F5EFE6]"
        >
          {/* Minimalist geometric crystal brand mark (authored vector, not initials) */}
          <span className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-[#F2C094]/20 bg-[#151210] transition-all duration-300 group-hover:border-[#E07A47]/70 group-hover:shadow-[0_0_20px_-4px_rgba(224,122,71,0.5)]">
            <svg
              viewBox="0 0 28 28"
              fill="none"
              className="h-5 w-5 transition-transform duration-500 group-hover:rotate-45"
              aria-hidden="true"
            >
              <path
                d="M14 3L24 14L14 25L4 14L14 3Z"
                stroke="#E07A47"
                strokeWidth="1.6"
                strokeLinejoin="round"
              />
              <path
                d="M14 3V25M4 14H24"
                stroke="#F2C094"
                strokeOpacity="0.45"
                strokeWidth="1.1"
              />
              <circle cx="14" cy="14" r="2.2" fill="#F2C094" />
            </svg>
          </span>
          <span className="flex min-w-0 flex-col leading-tight">
            <span className="truncate font-display text-xs font-semibold tracking-wide text-[#F5EFE6] sm:text-sm">
              {SITE_CONFIG.authorName}
            </span>
            <span className="truncate font-mono text-[9px] uppercase tracking-[0.18em] text-[#A69D94] sm:text-[10px]">
              Живые лид-магниты
            </span>
          </span>
        </a>

        <nav aria-label="Основная навигация" className="hidden items-center gap-8 md:flex">
          {NAV_LINKS.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="group relative py-1 text-sm text-[#A69D94] transition-colors hover:text-[#F5EFE6]"
            >
              <span>{item.label}</span>
              <span
                aria-hidden="true"
                className="absolute inset-x-0 -bottom-0.5 h-px origin-left scale-x-0 bg-gradient-to-r from-[#E07A47] to-[#F2C094] transition-transform duration-300 group-hover:scale-x-100"
              />
            </a>
          ))}
        </nav>

        <div className="flex shrink-0 items-center gap-2 sm:gap-3">
          <MagneticButton
            type="button"
            onClick={onJumpToDialog}
            className="btn-copper inline-flex items-center gap-1.5 whitespace-nowrap rounded-xl px-3.5 py-2 text-xs font-semibold sm:gap-2 sm:px-4.5 sm:py-2.5 sm:text-sm"
          >
            <span className="sm:hidden">Подобрать</span>
            <span className="hidden sm:inline">Придумать идею</span>
            <Icon icon="solar:arrow-right-linear" className="h-4 w-4" aria-hidden="true" />
          </MagneticButton>

          <button
            type="button"
            onClick={() => setMobileOpen((prev) => !prev)}
            aria-expanded={mobileOpen}
            aria-label={mobileOpen ? 'Закрыть меню' : 'Открыть меню'}
            className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-[#F2C094]/15 bg-[#141210] text-[#F5EFE6] transition-colors hover:border-[#E07A47]/60 md:hidden"
          >
            <Icon
              icon={mobileOpen ? 'solar:close-square-linear' : 'solar:hamburger-menu-linear'}
              className="h-5 w-5"
              aria-hidden="true"
            />
          </button>
        </div>
      </div>

      {mobileOpen && (
        <nav
          aria-label="Мобильная навигация"
          className="border-t border-[#F2C094]/12 bg-[#0C0B0A]/95 px-4 py-4 backdrop-blur-xl md:hidden"
        >
          <ul className="flex flex-col gap-2">
            {NAV_LINKS.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  onClick={handleLinkClick}
                  className="block rounded-xl px-3.5 py-2.5 text-sm text-[#A69D94] transition-colors hover:bg-[#171412] hover:text-[#F5EFE6]"
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </header>
  )
}
