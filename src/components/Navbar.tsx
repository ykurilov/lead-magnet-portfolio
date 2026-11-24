import { Icon } from '@iconify/react'
import { useState } from 'react'
import { SITE_CONFIG } from '../data/portfolioData'

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

  const handleLinkClick = () => {
    setMobileOpen(false)
  }

  return (
    <header className="sticky top-0 z-40 border-b border-[#24242D]/80 bg-[#09090B]/85 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <a
          href="#top"
          className="group flex items-center gap-3 text-sm font-medium tracking-tight text-[#F4F4F5]"
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#24242D] bg-[#111115] font-mono text-xs font-semibold text-[#B8FF3C] transition-colors group-hover:border-[#B8FF3C]">
            YK
          </span>
          <span className="flex flex-col leading-tight">
            <span className="font-display text-xs font-semibold uppercase tracking-wider text-[#F4F4F5] sm:text-sm">
              {SITE_CONFIG.authorName}
            </span>
            <span className="font-mono text-[10px] uppercase tracking-widest text-[#A1A1AA]">
              Живые лид-магниты
            </span>
          </span>
        </a>

        <nav aria-label="Основная навигация" className="hidden items-center gap-7 md:flex">
          {NAV_LINKS.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="text-sm text-[#A1A1AA] transition-colors hover:text-[#F4F4F5]"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onJumpToDialog}
            className="inline-flex items-center gap-2 rounded-lg bg-[#B8FF3C] px-4 py-2 text-xs font-semibold text-[#09090B] transition-transform hover:bg-[#CBFF6B] active:scale-[0.98] sm:text-sm"
          >
            <span>Придумать идею</span>
            <Icon icon="solar:arrow-right-linear" className="h-4 w-4" aria-hidden="true" />
          </button>

          <button
            type="button"
            onClick={() => setMobileOpen((prev) => !prev)}
            aria-expanded={mobileOpen}
            aria-label={mobileOpen ? 'Закрыть меню' : 'Открыть меню'}
            className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-[#24242D] bg-[#111115] text-[#F4F4F5] md:hidden"
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
          className="border-t border-[#24242D] bg-[#09090B] px-4 py-4 md:hidden"
        >
          <ul className="flex flex-col gap-3">
            {NAV_LINKS.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  onClick={handleLinkClick}
                  className="block rounded-lg px-3 py-2 text-sm text-[#A1A1AA] transition-colors hover:bg-[#111115] hover:text-[#F4F4F5]"
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
