import { useState } from 'react'
import { Bell, ChevronDown, Disc3, Heart, Home, ListMusic, Wallet, UserRound } from 'lucide-react'
import DashboardPage from '../pages/DashboardPage.jsx'
import RequestsPage from '../pages/RequestsPage.jsx'
import WeddingPage from '../pages/WeddingPage.jsx'
import BudgetPage from '../pages/BudgetPage.jsx'
import AccountPage from '../pages/AccountPage.jsx'

const navItems = [
  { id: 'home', label: 'Inicio', icon: Home },
  { id: 'requests', label: 'Peticiones', icon: ListMusic },
  { id: 'wedding', label: 'Mi boda', icon: Heart },
  { id: 'budget', label: 'Presupuesto', icon: Wallet },
  { id: 'account', label: 'Cuenta', icon: UserRound },
]

const pageTitles = {
  home: ['Tu espacio', 'Buenos días'],
  requests: ['La banda sonora', 'Peticiones'],
  wedding: ['Todo en su momento', 'Mi boda'],
  budget: ['Todo bajo control', 'Presupuesto'],
  account: ['Un poquito sobre vosotros', 'Cuenta'],
}

export default function DashboardLayout({ user, onLogout }) {
  const [activeTab, setActiveTab] = useState('home')
  const [notification, setNotification] = useState(false)
  const [titleEyebrow, title] = pageTitles[activeTab]
  const displayName = user.name || 'Alex'
  const firstName = displayName.split(' ')[0]

  const page = {
    home: <DashboardPage user={user} onNavigate={setActiveTab} />,
    requests: <RequestsPage />,
    wedding: <WeddingPage />,
    budget: <BudgetPage />,
    account: <AccountPage user={user} onLogout={onLogout} />,
  }[activeTab]

  return (
    <div className="min-h-screen bg-canvas">
      <header className="sticky top-0 z-30 border-b border-[#eceaf1] bg-white/90 backdrop-blur-xl">
        <div className="mx-auto flex h-[72px] max-w-6xl items-center justify-between px-5 sm:px-8">
          <button onClick={() => setActiveTab('home')} className="flex items-center gap-2.5 text-ink">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-lilac-light text-lilac"><Disc3 size={20} /></span>
            <span className="font-display text-xl tracking-wide">ritmo</span>
          </button>
          <div className="flex items-center gap-3">
            <button
              aria-label="Notificaciones"
              onClick={() => setNotification((value) => !value)}
              className="relative grid h-10 w-10 place-items-center rounded-full text-[#777486] transition hover:bg-[#f5f3fa]"
            >
              <Bell size={19} />
              <span className="absolute right-2 top-2 h-2 w-2 rounded-full border-2 border-white bg-[#e69b83]" />
            </button>
            <button onClick={() => setActiveTab('account')} className="flex items-center gap-2 rounded-full p-1 pr-2 transition hover:bg-[#f5f3fa]">
              <span className="grid h-9 w-9 place-items-center rounded-full bg-[#e9e4f7] text-xs font-semibold text-[#6654b9]">
                {displayName.split(' ').map((part) => part[0]).slice(0, 2).join('').toUpperCase()}
              </span>
              <span className="hidden text-left sm:block">
                <span className="block text-xs font-semibold text-ink">{displayName}</span>
                <span className="block text-[10px] text-muted">Tu espacio</span>
              </span>
              <ChevronDown size={14} className="hidden text-muted sm:block" />
            </button>
          </div>
        </div>
        {notification && (
          <div className="absolute right-5 top-[62px] w-[min(320px,calc(100vw-40px))] rounded-2xl border border-[#eeeaf6] bg-white p-4 shadow-card sm:right-[calc((100vw-1152px)/2+32px)]">
            <p className="text-sm font-semibold">Todo al día ✨</p>
            <p className="mt-1 text-xs leading-5 text-muted">Te avisaremos cuando haya novedades de vuestra boda.</p>
          </div>
        )}
      </header>

      <div className="mx-auto max-w-6xl px-5 pb-28 pt-8 sm:px-8 sm:pt-10 lg:pb-32">
        <div className="mb-7">
          <p className="text-xs font-semibold uppercase tracking-[.16em] text-lilac">{titleEyebrow}</p>
          <h1 className="mt-1.5 font-display text-3xl text-ink sm:text-[34px]">{title}{activeTab === 'home' ? `, ${firstName} ✨` : ''}</h1>
        </div>
        {page}
      </div>

      <nav aria-label="Navegación principal" className="safe-bottom fixed inset-x-0 bottom-0 z-40 border-t border-[#eceaf1] bg-white/95 px-2 pt-2 backdrop-blur-xl">
        <div className="mx-auto flex max-w-2xl items-center justify-around">
          {navItems.map(({ id, label, icon: Icon }) => {
            const selected = activeTab === id
            return (
              <button
                key={id}
                aria-current={selected ? 'page' : undefined}
                onClick={() => setActiveTab(id)}
                className={`flex min-w-[58px] flex-col items-center gap-1 rounded-xl px-2 py-1.5 text-[10px] font-medium transition sm:min-w-[76px] sm:text-xs ${selected ? 'text-lilac' : 'text-[#aaa7b4] hover:text-[#6e6a7c]'}`}
              >
                <span className={`grid h-7 w-10 place-items-center rounded-full transition ${selected ? 'bg-lilac-light' : ''}`}>
                  <Icon size={19} strokeWidth={selected ? 2.3 : 1.8} />
                </span>
                {label}
              </button>
            )
          })}
        </div>
      </nav>
    </div>
  )
}
