import { useCallback, useEffect, useState } from 'react'
import { CalendarDays, Clock3, MapPin, Plus, Save, Trash2 } from 'lucide-react'
import SectionHeading from '../components/SectionHeading.jsx'
import { supabase } from '../lib/supabase.js'

const emptyMoment = { event_time: '', title: '', description: '' }

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

export default function WeddingPage({ weddingId, user }) {
  const isAdmin = user?.role === 'admin'
  const [wedding, setWedding] = useState(null)
  const [moments, setMoments] = useState([])
  const [form, setForm] = useState(emptyMoment)
  const [editing, setEditing] = useState(false)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')

  const loadWedding = useCallback(async () => {
    if (!weddingId) {
      setLoading(false)
      return
    }
    setLoading(true)
    const [weddingResult, scheduleResult] = await Promise.all([
      supabase.from('weddings').select('id, partner_names, wedding_date, venue, location, description').eq('id', weddingId).single(),
      supabase.from('wedding_schedule_items').select('id, event_time, title, description').eq('wedding_id', weddingId).order('event_time'),
    ])
    if (weddingResult.error) setError(`No se pudo cargar la boda: ${weddingResult.error.message}`)
    else setWedding(weddingResult.data)
    if (scheduleResult.error) setError(`No se pudo cargar el cronograma: ${scheduleResult.error.message}`)
    else setMoments(scheduleResult.data || [])
    setLoading(false)
  }, [weddingId])

  useEffect(() => {
    void loadWedding()
  }, [loadWedding])

  async function saveWedding(event) {
    event.preventDefault()
    setSaving(true)
    setError('')
    const values = {
      partner_names: wedding.partner_names.trim(),
      wedding_date: wedding.wedding_date || null,
      venue: wedding.venue.trim() || null,
      location: wedding.location.trim() || null,
      description: wedding.description.trim() || null,
    }
    const { error: saveError } = await supabase.from('weddings').update(values).eq('id', weddingId)
    if (saveError) setError(`No se pudo guardar la información: ${saveError.message}`)
    else {
      setWedding({ ...wedding, ...values })
      setEditing(false)
      setNotice('Información de la boda actualizada.')
    }
    setSaving(false)
  }

  async function addMoment(event) {
    event.preventDefault()
    setSaving(true)
    setError('')
    const { data, error: insertError } = await supabase.from('wedding_schedule_items').insert({
      wedding_id: weddingId,
      event_time: form.event_time,
      title: form.title.trim(),
      description: form.description.trim() || null,
      position: moments.length,
    }).select('id, event_time, title, description').single()
    if (insertError) setError(`No se pudo añadir el momento: ${insertError.message}`)
    else {
      setMoments((current) => [...current, data].sort((a, b) => a.event_time.localeCompare(b.event_time)))
      setForm(emptyMoment)
      setNotice('Momento añadido al cronograma.')
    }
    setSaving(false)
  }

  async function deleteMoment(moment) {
    const { error: deleteError } = await supabase.from('wedding_schedule_items').delete().eq('id', moment.id)
    if (deleteError) setError(`No se pudo eliminar el momento: ${deleteError.message}`)
    else setMoments((current) => current.filter((item) => item.id !== moment.id))
  }

  if (!weddingId) return <p className="rounded-2xl border border-ink/10 bg-canvas p-6 text-sm text-muted">Selecciona una boda para consultar su información.</p>
  if (loading) return <p className="rounded-2xl border border-ink/10 bg-canvas p-8 text-center text-sm text-muted">Cargando información de la boda…</p>
  if (!wedding) return <p role="alert" className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error || 'No se encontró la boda.'}</p>

  return (
    <div className="grid gap-7 lg:grid-cols-[1fr_310px]">
      <section className="rounded-2xl border border-ink/10 bg-canvas p-5 shadow-card sm:p-7">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-accent">{formatDate(wedding.wedding_date)}</p>
            {editing
              ? <form id="wedding-form" onSubmit={saveWedding} className="mt-5 space-y-3">
                <label className="block text-xs font-medium text-muted">Nombres<input required maxLength={160} value={wedding.partner_names} onChange={(event) => setWedding({ ...wedding, partner_names: event.target.value })} className="mt-1.5 w-full rounded-lg border border-ink/15 bg-canvas px-3 py-2.5 text-sm text-ink" /></label>
                <label className="block text-xs font-medium text-muted">Fecha<input type="date" value={wedding.wedding_date || ''} onChange={(event) => setWedding({ ...wedding, wedding_date: event.target.value })} className="mt-1.5 w-full rounded-lg border border-ink/15 bg-canvas px-3 py-2.5 text-sm text-ink" /></label>
                <label className="block text-xs font-medium text-muted">Lugar<input maxLength={200} value={wedding.venue || ''} onChange={(event) => setWedding({ ...wedding, venue: event.target.value })} className="mt-1.5 w-full rounded-lg border border-ink/15 bg-canvas px-3 py-2.5 text-sm text-ink" /></label>
                <label className="block text-xs font-medium text-muted">Localidad<input maxLength={200} value={wedding.location || ''} onChange={(event) => setWedding({ ...wedding, location: event.target.value })} className="mt-1.5 w-full rounded-lg border border-ink/15 bg-canvas px-3 py-2.5 text-sm text-ink" /></label>
                <label className="block text-xs font-medium text-muted">Información adicional<textarea maxLength={4000} rows={4} value={wedding.description || ''} onChange={(event) => setWedding({ ...wedding, description: event.target.value })} className="mt-1.5 w-full rounded-lg border border-ink/15 bg-canvas px-3 py-2.5 text-sm text-ink" /></label>
                <button disabled={saving} className="inline-flex items-center gap-2 rounded-lg bg-accent px-4 py-2.5 text-xs font-semibold text-canvas"><Save size={15} />Guardar</button>
                <button type="button" onClick={() => { setEditing(false); void loadWedding() }} className="ml-2 rounded-lg border border-ink/10 px-4 py-2.5 text-xs text-muted">Cancelar</button>
              </form>
              : <h2 className="mt-2 font-display text-2xl text-ink sm:text-3xl">{wedding.partner_names}</h2>}
          </div>
          {isAdmin && !editing && <button onClick={() => setEditing(true)} className="rounded-lg bg-accent/10 px-3 py-2 text-xs font-semibold text-accent">Editar boda</button>}
        </div>
        <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2 border-b border-ink/10 pb-5 text-xs text-muted">
          {(wedding.venue || wedding.location) && <span className="flex items-center gap-1.5"><MapPin size={14} />{[wedding.venue, wedding.location].filter(Boolean).join(' · ')}</span>}
          {wedding.wedding_date && <span className="flex items-center gap-1.5"><CalendarDays size={14} />{formatDate(wedding.wedding_date)}</span>}
        </div>
        {wedding.description && <p className="whitespace-pre-line py-5 text-sm leading-6 text-muted">{wedding.description}</p>}

        <div className="mt-6">
          <SectionHeading title="Cronograma del evento" />
          {isAdmin && <form onSubmit={addMoment} className="mb-5 grid gap-3 rounded-xl bg-accent/5 p-4 sm:grid-cols-[auto_1fr_1.5fr_auto] sm:items-end">
            <label className="text-[11px] font-medium text-muted">Hora<input required type="time" value={form.event_time} onChange={(event) => setForm({ ...form, event_time: event.target.value })} className="mt-1.5 block rounded-lg border border-ink/15 bg-canvas px-3 py-2.5 text-xs text-ink" /></label>
            <label className="text-[11px] font-medium text-muted">Momento<input required maxLength={160} value={form.title} onChange={(event) => setForm({ ...form, title: event.target.value })} placeholder="Ceremonia" className="mt-1.5 w-full rounded-lg border border-ink/15 bg-canvas px-3 py-2.5 text-xs text-ink" /></label>
            <label className="text-[11px] font-medium text-muted">Detalle<input maxLength={500} value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} placeholder="Música de entrada y salida" className="mt-1.5 w-full rounded-lg border border-ink/15 bg-canvas px-3 py-2.5 text-xs text-ink" /></label>
            <button disabled={saving} aria-label="Añadir momento" className="grid h-9 w-9 place-items-center rounded-lg bg-accent text-canvas"><Plus size={17} /></button>
          </form>}
          <div className="divide-y divide-ink/10">
            {moments.map((moment) => <div key={moment.id} className="flex items-center gap-4 py-4">
              <span className="flex items-center gap-1.5 text-xs font-semibold tabular-nums text-muted"><Clock3 size={14} />{moment.event_time.slice(0, 5)}</span>
              <div className="min-w-0 flex-1"><p className="text-sm font-semibold text-ink">{moment.title}</p>{moment.description && <p className="mt-1 text-xs text-muted">{moment.description}</p>}</div>
              {isAdmin && <button aria-label={`Eliminar ${moment.title}`} onClick={() => deleteMoment(moment)} className="text-muted hover:text-red-700"><Trash2 size={15} /></button>}
            </div>)}
            {moments.length === 0 && <p className="py-5 text-sm text-muted">El cronograma todavía no está disponible.</p>}
          </div>
        </div>
        {error && <p role="alert" className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}
        {notice && <p role="status" className="mt-4 rounded-xl bg-accent/10 px-4 py-3 text-sm text-ink">{notice}</p>}
      </section>
      <aside className="h-fit rounded-2xl bg-accent/10 p-5">
        <h3 className="font-display text-xl text-ink">El gran día</h3>
        <p className="mt-2 text-sm leading-6 text-muted">Aquí se refleja la información y el horario que el DJ ha preparado para vuestra boda.</p>
      </aside>
    </div>
  )
}
