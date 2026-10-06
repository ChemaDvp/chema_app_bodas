import { useEffect, useState } from 'react'
import { ArrowRight, CalendarDays, Clock3, MapPin, Music2, Sparkles, Wallet } from 'lucide-react'
import SectionHeading from '../components/SectionHeading.jsx'
import WeddingInspiration from '../components/WeddingInspiration.jsx'
import { supabase } from '../lib/supabase.js'

function daysUntil(date) {
  if (!date) return null
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const weddingDate = new Date(`${date}T00:00:00`)
  return Math.ceil((weddingDate - today) / (1000 * 60 * 60 * 24))
}

function formatDate(date) {
  if (!date) return 'Fecha pendiente'
  return new Intl.DateTimeFormat('es-ES', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(new Date(`${date}T00:00:00Z`))
}

export default function DashboardPage({ user, weddingId, onNavigate }) {
  const [wedding, setWedding] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const firstName = user.name?.split(' ')[0] || 'pareja'
  const remainingDays = daysUntil(wedding?.wedding_date)

  useEffect(() => {
    let mounted = true
    async function loadWedding() {
      const { data, error: queryError } = await supabase
        .from('weddings')
        .select('id, partner_names, wedding_date, venue, location, description')
        .eq('id', weddingId)
        .single()
      if (!mounted) return
      if (queryError) setError(`No se pudo cargar la boda: ${queryError.message}`)
      else setWedding(data)
      setLoading(false)
    }
    if (weddingId) void loadWedding()
    else setLoading(false)
    return () => {
      mounted = false
    }
  }, [weddingId])

  if (loading) return <p className="rounded-2xl border border-ink/10 bg-canvas p-8 text-center text-sm text-muted">Cargando vuestra boda…</p>

  return (
    <div className="space-y-8">
      {error && <p role="alert" className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}
      {wedding && <section className="relative overflow-hidden rounded-[26px] bg-ink p-6 text-canvas shadow-card sm:p-8">
        <div className="absolute -right-10 -top-24 h-64 w-64 rounded-full bg-accent/20 blur-3xl" />
        <div className="relative">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-canvas/15 bg-canvas/10 px-3 py-1.5 text-[11px] font-medium"><Sparkles size={13} /> VUESTRA BODA</span>
          <h2 className="mt-4 font-display text-3xl sm:text-4xl">{wedding.partner_names}</h2>
          {(wedding.venue || wedding.location) && <p className="mt-2 flex items-center gap-1.5 text-sm text-canvas/75"><MapPin size={15} />{[wedding.venue, wedding.location].filter(Boolean).join(' · ')}</p>}
          <div className="mt-6 flex flex-wrap gap-2">
            <span className="inline-flex items-center gap-2 rounded-xl bg-canvas/10 px-3 py-2 text-xs font-medium"><CalendarDays size={15} />{formatDate(wedding.wedding_date)}</span>
            {remainingDays !== null && <span className="inline-flex items-center gap-2 rounded-xl bg-canvas/10 px-3 py-2 text-xs font-medium"><Clock3 size={15} />{remainingDays > 0 ? `Quedan ${remainingDays} días` : remainingDays === 0 ? '¡Es hoy!' : '¡Enhorabuena por vuestra boda!'}</span>}
          </div>
        </div>
      </section>}

      <WeddingInspiration />

      <section>
        <SectionHeading title="Vuestro espacio" />
        <div className="grid gap-3 sm:grid-cols-3">
          {[
            ['requests', Music2, 'Vuestras canciones', 'Añadid peticiones a la lista musical'],
            ['wedding', CalendarDays, 'Información de la boda', 'Consultad el horario y los detalles'],
            ['budget', Wallet, 'Presupuesto', 'Revisad el presupuesto y descargad el PDF'],
          ].map(([tab, Icon, title, detail]) => <button key={tab} onClick={() => onNavigate(tab)} className="flex items-center gap-4 rounded-2xl border border-ink/10 bg-canvas p-4 text-left shadow-card transition hover:border-accent/50">
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-accent/10 text-accent"><Icon size={19} /></span>
            <span className="min-w-0 flex-1"><span className="block text-sm font-semibold text-ink">{title}</span><span className="mt-1 block text-xs leading-5 text-muted">{detail}</span></span>
            <ArrowRight size={16} className="text-muted" />
          </button>)}
        </div>
      </section>

      <p className="text-center text-xs text-muted">¡Qué bonito lo que estáis preparando, {firstName}! <Sparkles size={13} className="inline text-accent" /></p>
    </div>
  )
}
