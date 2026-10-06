import { useEffect, useState } from 'react'
import { CalendarDays, MapPin, Pencil, Plus, Save, X } from 'lucide-react'
import { supabase } from '../lib/supabase.js'

const emptyForm = {
  partner_names: '',
  wedding_date: '',
  venue: '',
  location: '',
  description: '',
}

function formatDate(date) {
  if (!date) return 'Fecha pendiente'
  return new Intl.DateTimeFormat('es-ES', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(new Date(`${date}T00:00:00Z`))
}

export default function AdminWeddingsPage({ onManage }) {
  const [weddings, setWeddings] = useState([])
  const [form, setForm] = useState(emptyForm)
  const [editingId, setEditingId] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')

  useEffect(() => {
    let mounted = true

    async function loadWeddings() {
      setLoading(true)
      const { data, error: queryError } = await supabase
        .from('weddings')
        .select('id, partner_names, wedding_date, venue, location, description')
        .order('wedding_date', { ascending: true, nullsFirst: false })

      if (!mounted) return
      if (queryError) {
        setError(`No se pudieron cargar las bodas: ${queryError.message}`)
      } else {
        setWeddings(data || [])
        setError('')
      }
      setLoading(false)
    }

    void loadWeddings()
    return () => {
      mounted = false
    }
  }, [])

  function startCreate() {
    setForm(emptyForm)
    setEditingId(null)
    setNotice('')
    setError('')
    setShowForm(true)
  }

  function startEdit(wedding) {
    setForm({
      partner_names: wedding.partner_names,
      wedding_date: wedding.wedding_date || '',
      venue: wedding.venue || '',
      location: wedding.location || '',
      description: wedding.description || '',
    })
    setEditingId(wedding.id)
    setNotice('')
    setError('')
    setShowForm(true)
  }

  function cancelEdit() {
    setShowForm(false)
    setEditingId(null)
    setForm(emptyForm)
  }

  async function saveWedding(event) {
    event.preventDefault()
    setSaving(true)
    setError('')
    setNotice('')

    const values = {
      partner_names: form.partner_names.trim(),
      wedding_date: form.wedding_date || null,
      venue: form.venue.trim() || null,
      location: form.location.trim() || null,
      description: form.description.trim() || null,
    }

    let savedWedding
    if (editingId) {
      const { error: updateError } = await supabase
        .from('weddings')
        .update(values)
        .eq('id', editingId)

      if (updateError) {
        setError(`No se pudo guardar la boda: ${updateError.message}`)
        setSaving(false)
        return
      }
      savedWedding = { id: editingId, ...values }
    } else {
      const { data, error: insertError } = await supabase
        .from('weddings')
        .insert(values)
        .select('id, partner_names, wedding_date, venue, location, description')
        .single()

      if (insertError) {
        setError(`No se pudo crear la boda: ${insertError.message}`)
        setSaving(false)
        return
      }
      savedWedding = data
    }

    setWeddings((current) => {
      const updated = editingId
        ? current.map((wedding) => wedding.id === editingId ? savedWedding : wedding)
        : [...current, savedWedding]
      return updated.sort((a, b) => (a.wedding_date || '9999-12-31').localeCompare(b.wedding_date || '9999-12-31'))
    })
    setNotice(editingId ? 'Los datos de la boda se han guardado.' : 'La boda se ha creado.')
    setShowForm(false)
    setEditingId(null)
    setForm(emptyForm)
    setSaving(false)
  }

  return (
    <div className="space-y-6">
      <section className="flex flex-col justify-between gap-4 rounded-2xl bg-ink p-5 text-canvas shadow-card sm:flex-row sm:items-center sm:p-7">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[.14em] text-canvas/65">Panel de administración</p>
          <h2 className="mt-2 font-display text-3xl">Gestión de bodas</h2>
          <p className="mt-2 text-sm text-canvas/75">Organiza la información de cada evento desde un solo lugar.</p>
        </div>
        <button onClick={startCreate} className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-canvas px-4 py-3 text-sm font-semibold text-ink transition hover:bg-canvas/85">
          <Plus size={17} /> Nueva boda
        </button>
      </section>

      {error && <p role="alert" className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}
      {notice && <p role="status" className="rounded-xl bg-accent/10 px-4 py-3 text-sm text-ink">{notice}</p>}

      {showForm && (
        <form onSubmit={saveWedding} className="space-y-4 rounded-2xl border border-ink/10 bg-canvas p-5 shadow-card sm:p-7">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h3 className="font-display text-2xl text-ink">{editingId ? 'Editar boda' : 'Crear boda'}</h3>
              <p className="mt-1 text-xs text-muted">Los campos con * son obligatorios.</p>
            </div>
            <button type="button" onClick={cancelEdit} aria-label="Cancelar" className="grid h-9 w-9 place-items-center rounded-lg text-muted hover:bg-accent/10 hover:text-ink"><X size={18} /></button>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="text-xs font-medium text-muted sm:col-span-2">Nombres de la pareja *<input required maxLength={160} value={form.partner_names} onChange={(event) => setForm({ ...form, partner_names: event.target.value })} placeholder="Clara y Álvaro" className="mt-1.5 w-full rounded-lg border border-ink/15 bg-canvas px-3 py-3 text-sm text-ink outline-none focus:border-accent" /></label>
            <label className="text-xs font-medium text-muted">Fecha<input type="date" value={form.wedding_date} onChange={(event) => setForm({ ...form, wedding_date: event.target.value })} className="mt-1.5 w-full rounded-lg border border-ink/15 bg-canvas px-3 py-3 text-sm text-ink outline-none focus:border-accent" /></label>
            <label className="text-xs font-medium text-muted">Lugar<input maxLength={200} value={form.venue} onChange={(event) => setForm({ ...form, venue: event.target.value })} placeholder="Finca o espacio" className="mt-1.5 w-full rounded-lg border border-ink/15 bg-canvas px-3 py-3 text-sm text-ink outline-none focus:border-accent" /></label>
            <label className="text-xs font-medium text-muted sm:col-span-2">Localidad<input maxLength={200} value={form.location} onChange={(event) => setForm({ ...form, location: event.target.value })} placeholder="Málaga" className="mt-1.5 w-full rounded-lg border border-ink/15 bg-canvas px-3 py-3 text-sm text-ink outline-none focus:border-accent" /></label>
            <label className="text-xs font-medium text-muted sm:col-span-2">Información adicional<textarea maxLength={4000} rows={4} value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} placeholder="Detalles relevantes para el evento" className="mt-1.5 w-full resize-y rounded-lg border border-ink/15 bg-canvas px-3 py-3 text-sm text-ink outline-none focus:border-accent" /></label>
          </div>
          <button disabled={saving} className="inline-flex items-center gap-2 rounded-xl bg-accent px-5 py-3 text-sm font-semibold text-canvas transition hover:bg-ink disabled:cursor-not-allowed disabled:opacity-60">
            <Save size={16} /> {saving ? 'Guardando…' : editingId ? 'Guardar cambios' : 'Crear boda'}
          </button>
        </form>
      )}

      <section className="space-y-3">
        {loading && <p className="rounded-xl border border-ink/10 bg-canvas px-5 py-8 text-center text-sm text-muted">Cargando bodas…</p>}
        {!loading && weddings.length === 0 && !error && (
          <div className="rounded-2xl border border-dashed border-ink/20 bg-canvas px-5 py-10 text-center">
            <CalendarDays size={24} className="mx-auto text-accent" />
            <p className="mt-3 font-semibold text-ink">Todavía no hay bodas</p>
            <p className="mt-1 text-sm text-muted">Crea la primera para empezar a organizar la información.</p>
          </div>
        )}
        {weddings.map((wedding) => (
          <article key={wedding.id} className="flex flex-col gap-4 rounded-2xl border border-ink/10 bg-canvas p-4 shadow-card sm:flex-row sm:items-center sm:p-5">
            <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-accent/10 text-accent"><CalendarDays size={20} /></span>
            <div className="min-w-0 flex-1">
              <h3 className="truncate font-semibold text-ink">{wedding.partner_names}</h3>
              <p className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted">
                <span>{formatDate(wedding.wedding_date)}</span>
                {(wedding.venue || wedding.location) && <span className="inline-flex items-center gap-1"><MapPin size={12} />{[wedding.venue, wedding.location].filter(Boolean).join(' · ')}</span>}
              </p>
            </div>
            <div className="flex gap-2">
              <button onClick={() => onManage(wedding)} className="inline-flex items-center justify-center gap-2 rounded-lg bg-accent px-3 py-2.5 text-xs font-semibold text-canvas transition hover:bg-ink">
                Gestionar
              </button>
              <button onClick={() => startEdit(wedding)} className="inline-flex items-center justify-center gap-2 rounded-lg border border-ink/10 px-3 py-2.5 text-xs font-semibold text-ink transition hover:border-accent hover:text-accent">
                <Pencil size={14} /> Editar
              </button>
            </div>
          </article>
        ))}
      </section>
    </div>
  )
}
