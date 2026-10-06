import { useState } from 'react'
import { Bell, ChevronDown, Disc3, Home, ListMusic, Wallet, UserRound } from 'lucide-react'
import DashboardPage from '../pages/DashboardPage.jsx'
import RequestsPage from '../pages/RequestsPage.jsx'
import WeddingPage from '../pages/WeddingPage.jsx'
import BudgetPage from '../pages/BudgetPage.jsx'
import AccountPage from '../pages/AccountPage.jsx'
import AdminWeddingsPage from '../pages/AdminWeddingsPage.jsx'
import AdminMediaPage from '../pages/AdminMediaPage.jsx'
import AdminWeddingWorkspace from '../pages/AdminWeddingWorkspace.jsx'

const coupleNavItems = [
  { id: 'home', label: 'Inicio', icon: Home },
  { id: 'requests', label: 'Peticiones', icon: ListMusic },
  { id: 'wedding', label: 'Mi boda', icon: WeddingRings },
  { id: 'budget', label: 'Presupuesto', icon: Wallet },
  { id: 'account', label: 'Cuenta', icon: UserRound },
]

const adminNavItems = [
  { id: 'weddings', label: 'Bodas', icon: WeddingRings },
  { id: 'media', label: 'Contenido', icon: CameraIcon },
  { id: 'account', label: 'Cuenta', icon: UserRound },
]

function CameraIcon({ size = 22, strokeWidth = 1.8, ...props }) {
  return <svg aria-hidden="true" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M14.5 4h-5L7.5 7H4a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3.5z" /><circle cx="12" cy="13" r="3" /></svg>
}

function WeddingRings({ size = 22, strokeWidth = 1.8, ...props }) {
  return (
    <svg
      aria-hidden="true"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <circle cx="9" cy="14" r="6.25" />
      <circle cx="15" cy="14" r="6.25" />
    </svg>
  )
}

const pageTitles = {
  weddings: ['Administración', 'Bodas'],
  media: ['Administración', 'Contenido común'],
  home: ['Tu espacio', 'Buenos días'],
  requests: ['La banda sonora', 'Peticiones'],
  wedding: ['Todo en su momento', 'Mi boda'],
  budget: ['Todo bajo control', 'Presupuesto'],
  account: ['Un poquito sobre vosotros', 'Cuenta'],
}

export default function DashboardLayout({ user, onLogout }) {
  const isAdmin = user.role === 'admin'
  const navItems = isAdmin ? adminNavItems : coupleNavItems
  const [activeTab, setActiveTab] = useState(isAdmin ? 'weddings' : 'home')
  const [selectedWedding, setSelectedWedding] = useState(null)
  const [notification, setNotification] = useState(false)
  const [titleEyebrow, title] = pageTitles[activeTab]
  const displayName = user.name || 'Alex'
  const firstName = displayName.split(' ')[0]

  const couplePage = {
    home: <DashboardPage user={user} weddingId={user.weddingId} onNavigate={setActiveTab} />,
    requests: <RequestsPage weddingId={user.weddingId} user={user} />,
    wedding: <WeddingPage weddingId={user.weddingId} user={user} />,
    budget: <BudgetPage weddingId={user.weddingId} user={user} />,
    account: <AccountPage user={user} onLogout={onLogout} />,
  }
  const page = isAdmin
    ? activeTab === 'account'
      ? <AccountPage user={user} onLogout={onLogout} />
      : activeTab === 'media'
        ? <AdminMediaPage />
        : selectedWedding
          ? <AdminWeddingWorkspace wedding={selectedWedding} user={user} onBack={() => setSelectedWedding(null)} />
          : <AdminWeddingsPage onManage={setSelectedWedding} />
    : couplePage[activeTab]

  return (
    <div className="min-h-screen bg-canvas">
      <header className="sticky top-0 z-30 border-b border-ink/10 bg-canvas/95 backdrop-blur-xl">
        <div className="mx-auto flex h-[72px] max-w-6xl items-center justify-between px-5 sm:px-8">
          <button onClick={() => { setActiveTab(isAdmin ? 'weddings' : 'home'); setSelectedWedding(null) }} className="flex items-center gap-2.5 text-ink">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-accent/10 text-accent"><Disc3 size={20} /></span>
            <span className="font-display text-xl tracking-wide">ritmo</span>
          </button>
          <div className="flex items-center gap-3">
            <button
              aria-label="Notificaciones"
              onClick={() => setNotification((value) => !value)}
              className="relative grid h-10 w-10 place-items-center rounded-full text-muted transition hover:bg-accent/10"
            >
              <Bell size={19} />
              <span className="absolute right-2 top-2 h-2 w-2 rounded-full border-2 border-canvas bg-accent" />
            </button>
            <button onClick={() => { setActiveTab('account'); setSelectedWedding(null) }} className="flex items-center gap-2 rounded-full p-1 pr-2 transition hover:bg-accent/10">
              <span className="grid h-9 w-9 place-items-center rounded-full bg-accent/15 text-xs font-semibold text-ink">
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
          <div className="absolute right-5 top-[62px] w-[min(320px,calc(100vw-40px))] rounded-2xl border border-ink/10 bg-canvas p-4 shadow-card sm:right-[calc((100vw-1152px)/2+32px)]">
            <p className="text-sm font-semibold">Todo al día ✨</p>
            <p className="mt-1 text-xs leading-5 text-muted">Te avisaremos cuando haya novedades de vuestra boda.</p>
          </div>
        )}
      </header>

      <div className="mx-auto max-w-6xl px-5 pb-28 pt-8 sm:px-8 sm:pt-10 lg:pb-32">
        <div className="mb-7">
          <p className="text-xs font-semibold uppercase tracking-[.16em] text-accent">{titleEyebrow}</p>
          <h1 className="mt-1.5 font-display text-3xl text-ink sm:text-[34px]">{title}{activeTab === 'home' ? `, ${firstName} ✨` : ''}</h1>
        </div>
        {page}
      </div>

      <nav aria-label="Navegación principal" className="safe-bottom fixed inset-x-0 bottom-0 z-40 border-t border-ink/10 bg-canvas/95 px-2 pt-2 backdrop-blur-xl">
        <div className="mx-auto flex max-w-2xl items-center justify-around">
          {navItems.map(({ id, label, icon: Icon }) => {
            const selected = activeTab === id
            return (
              <button
                key={id}
                type="button"
                aria-label={label}
                title={label}
                aria-current={selected ? 'page' : undefined}
                onClick={() => setActiveTab(id)}
                className={`grid h-12 w-12 place-items-center rounded-2xl transition sm:h-14 sm:w-14 ${selected ? 'bg-accent/10 text-accent' : 'text-muted hover:bg-accent/5 hover:text-ink'}`}
              >
                <Icon size={22} strokeWidth={selected ? 2.2 : 1.8} />
              </button>
            )
          })}
        </div>
      </nav>
    </div>
  )
}
