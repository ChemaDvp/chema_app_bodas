import { useCallback, useEffect, useState } from 'react'
import { Download, FileText, Plus, Save, Trash2, Upload, Wallet } from 'lucide-react'
import SectionHeading from '../components/SectionHeading.jsx'
import { supabase } from '../lib/supabase.js'

const bucket = 'presupuestos'
const amountFields = [
  ['first_four_hours', 'Primeras 4h'],
  ['dj_equipment', 'Equipo Dj'],
  ['extra_hour', 'Hora extra'],
  ['reservation_deposit', 'Fianza reserva'],
  ['travel_expense', 'Gasto de desplazamiento'],
]
const emptyBudget = {
  first_four_hours: '',
  dj_equipment: '',
  extra_hour: '',
  reservation_deposit: '',
  travel_expense: '',
  pdf_path: null,
}

function currency(amount) {
  if (amount === null || amount === '' || amount === undefined) return 'No especificado'
  return new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(Number(amount))
}

export default function BudgetPage({ weddingId, user }) {
  const isAdmin = user?.role === 'admin'
  const [budget, setBudget] = useState(emptyBudget)
  const [notes, setNotes] = useState([])
  const [newNote, setNewNote] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')

  const loadBudget = useCallback(async () => {
    if (!weddingId) {
      setLoading(false)
      return
    }
    setLoading(true)
    const [budgetResult, notesResult] = await Promise.all([
      supabase.from('budgets').select('first_four_hours, dj_equipment, extra_hour, reservation_deposit, travel_expense, pdf_path').eq('wedding_id', weddingId).maybeSingle(),
      supabase.from('budget_notes').select('id, content, position').eq('wedding_id', weddingId).order('position'),
    ])
    if (budgetResult.error) setError(`No se pudo cargar el presupuesto: ${budgetResult.error.message}`)
    else setBudget(budgetResult.data || emptyBudget)
    if (notesResult.error) setError(`No se pudieron cargar los textos informativos: ${notesResult.error.message}`)
    else setNotes(notesResult.data || [])
    setLoading(false)
  }, [weddingId])

  useEffect(() => {
    void loadBudget()
  }, [loadBudget])

  async function saveBudget(event) {
    event.preventDefault()
    setSaving(true)
    setError('')
    const values = Object.fromEntries(amountFields.map(([key]) => [
      key,
      key === 'travel_expense' && budget[key] === '' ? null : Number(budget[key] || 0),
    ]))
    const { error: saveError } = await supabase.from('budgets').upsert({
      wedding_id: weddingId,
      ...values,
      pdf_path: budget.pdf_path || null,
      updated_at: new Date().toISOString(),
    })
    if (saveError) setError(`No se pudo guardar el presupuesto: ${saveError.message}`)
    else setNotice('Presupuesto guardado.')
    setSaving(false)
  }

  async function uploadPdf(event) {
    const file = event.target.files?.[0]
    event.target.value = ''
    if (!file) return
    if (file.type !== 'application/pdf') {
      setError('Selecciona un archivo PDF.')
      return
    }
    if (file.size > 15 * 1024 * 1024) {
      setError('El PDF no puede superar los 15 MB.')
      return
    }
    setUploading(true)
    setError('')
    const path = `${weddingId}/${Date.now()}-${file.name.replace(/[^\w.-]/g, '_')}`
    const { error: uploadError } = await supabase.storage.from(bucket).upload(path, file, { contentType: 'application/pdf', upsert: false })
    if (uploadError) {
      setError(`No se pudo subir el PDF: ${uploadError.message}`)
    } else {
      const previousPath = budget.pdf_path
      const { error: saveError } = await supabase.from('budgets').upsert({
        wedding_id: weddingId,
        ...Object.fromEntries(amountFields.map(([key]) => [key, key === 'travel_expense' && budget[key] === '' ? null : Number(budget[key] || 0)])),
        pdf_path: path,
        updated_at: new Date().toISOString(),
      })
      if (saveError) {
        const { error: cleanupError } = await supabase.storage.from(bucket).remove([path])
        setError(cleanupError
          ? `No se pudo asociar ni retirar el PDF: ${saveError.message}; ${cleanupError.message}`
          : `No se pudo asociar el PDF y se retiró el archivo subido: ${saveError.message}`)
      } else {
        setBudget((current) => ({ ...current, pdf_path: path }))
        setNotice('PDF actualizado.')
        if (previousPath) {
          const { error: cleanupError } = await supabase.storage.from(bucket).remove([previousPath])
          if (cleanupError) setError(`El nuevo PDF está guardado, pero no se pudo retirar la versión anterior: ${cleanupError.message}`)
        }
      }
    }
    setUploading(false)
  }

  async function downloadPdf() {
    if (!budget.pdf_path) return
    const downloadWindow = window.open('about:blank', '_blank')
    if (!downloadWindow) {
      setError('El navegador ha bloqueado la ventana de descarga. Permite ventanas emergentes e inténtalo de nuevo.')
      return
    }
    const { data, error: downloadError } = await supabase.storage.from(bucket).createSignedUrl(budget.pdf_path, 60)
    if (downloadError) {
      downloadWindow.close()
      setError(`No se pudo preparar la descarga: ${downloadError.message}`)
      return
    }
    downloadWindow.location.href = data.signedUrl
  }

  async function addNote(event) {
    event.preventDefault()
    const content = newNote.trim()
    if (!content) return
    const { data, error: insertError } = await supabase.from('budget_notes').insert({
      wedding_id: weddingId,
      content,
      position: notes.length,
    }).select('id, content, position').single()
    if (insertError) setError(`No se pudo añadir el texto: ${insertError.message}`)
    else {
      setNotes((current) => [...current, data])
      setNewNote('')
      setNotice('Texto informativo añadido.')
    }
  }

  async function deleteNote(note) {
    const { error: deleteError } = await supabase.from('budget_notes').delete().eq('id', note.id)
    if (deleteError) setError(`No se pudo eliminar el texto: ${deleteError.message}`)
    else setNotes((current) => current.filter((item) => item.id !== note.id))
  }

  if (!weddingId) return <p className="rounded-2xl border border-ink/10 bg-canvas p-6 text-sm text-muted">Selecciona una boda para consultar el presupuesto.</p>

  return (
    <div className="space-y-6">
      <section className="rounded-2xl bg-ink p-5 text-canvas shadow-card sm:p-7">
        <span className="flex items-center gap-2 text-xs text-canvas/75"><Wallet size={16} /> PRESUPUESTO DEL EVENTO</span>
        <h2 className="mt-3 font-display text-3xl">Todo claro, sin sorpresas</h2>
        <p className="mt-2 text-sm text-canvas/75">Consulta los conceptos acordados y la información del servicio.</p>
      </section>

      {error && <p role="alert" className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}
      {notice && <p role="status" className="rounded-xl bg-accent/10 px-4 py-3 text-sm text-ink">{notice}</p>}
      {loading ? <p className="rounded-2xl border border-ink/10 bg-canvas p-8 text-center text-sm text-muted">Cargando presupuesto…</p> : (
        <>
          <section className="rounded-2xl border border-ink/10 bg-canvas p-5 shadow-card sm:p-7">
            <SectionHeading title="Desglose del servicio" />
            {isAdmin ? (
              <form onSubmit={saveBudget}>
                <div className="grid gap-4 sm:grid-cols-2">
                  {amountFields.map(([key, label]) => (
                    <label key={key} className="text-xs font-medium text-muted">{label} (€)
                      <input type="number" min="0" step="0.01" value={budget[key] ?? ''} onChange={(event) => setBudget({ ...budget, [key]: event.target.value })} placeholder={key === 'travel_expense' ? 'Opcional' : '0,00'} className="mt-1.5 w-full rounded-lg border border-ink/15 bg-canvas px-3 py-3 text-sm text-ink outline-none focus:border-accent" />
                    </label>
                  ))}
                </div>
                <button disabled={saving} className="mt-5 inline-flex items-center gap-2 rounded-xl bg-accent px-5 py-3 text-sm font-semibold text-canvas disabled:opacity-60"><Save size={16} />{saving ? 'Guardando…' : 'Guardar importes'}</button>
              </form>
            ) : (
              <dl className="mt-4 divide-y divide-ink/10">
                {amountFields.map(([key, label]) => <div key={key} className="flex items-center justify-between gap-3 py-4"><dt className="text-sm text-muted">{label}</dt><dd className="text-right text-sm font-semibold text-ink">{currency(budget[key])}</dd></div>)}
              </dl>
            )}
          </section>

          <section className="rounded-2xl border border-ink/10 bg-canvas p-5 shadow-card sm:p-7">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <SectionHeading title="Documento de presupuesto" />
              {budget.pdf_path && <button onClick={downloadPdf} className="mb-4 inline-flex items-center gap-2 rounded-lg bg-accent px-3 py-2.5 text-xs font-semibold text-canvas"><Download size={15} /> Descargar PDF</button>}
            </div>
            {budget.pdf_path
              ? <p className="flex items-center gap-2 text-sm text-muted"><FileText size={17} className="text-accent" /> Presupuesto disponible para descarga.</p>
              : <p className="text-sm text-muted">Todavía no hay un documento subido.</p>}
            {isAdmin && <label className="mt-4 inline-flex cursor-pointer items-center gap-2 rounded-lg border border-ink/10 px-3 py-2.5 text-xs font-semibold text-ink hover:border-accent">
              <Upload size={15} />{uploading ? 'Subiendo…' : 'Subir o reemplazar PDF'}
              <input type="file" accept="application/pdf,.pdf" onChange={uploadPdf} disabled={uploading} className="sr-only" />
            </label>}
          </section>

          <section className="rounded-2xl border border-ink/10 bg-canvas p-5 shadow-card sm:p-7">
            <SectionHeading title="Información importante" />
            <div className="mt-2 divide-y divide-ink/10">
              {notes.map((note) => <div key={note.id} className="flex items-start gap-3 py-4"><p className="flex-1 whitespace-pre-line text-sm leading-6 text-muted">{note.content}</p>{isAdmin && <button aria-label="Eliminar texto" onClick={() => deleteNote(note)} className="text-muted hover:text-red-700"><Trash2 size={15} /></button>}</div>)}
              {notes.length === 0 && <p className="py-4 text-sm text-muted">No hay notas informativas.</p>}
            </div>
            {isAdmin && <form onSubmit={addNote} className="mt-4 space-y-3 border-t border-ink/10 pt-4">
              <label className="block text-xs font-medium text-muted">Añadir aclaración<textarea required maxLength={4000} rows={3} value={newNote} onChange={(event) => setNewNote(event.target.value)} placeholder="Condiciones del servicio, horarios, pagos..." className="mt-1.5 w-full rounded-lg border border-ink/15 bg-canvas px-3 py-3 text-sm text-ink outline-none focus:border-accent" /></label>
              <button className="inline-flex items-center gap-2 rounded-lg bg-accent/10 px-3 py-2.5 text-xs font-semibold text-accent"><Plus size={15} />Añadir texto</button>
            </form>}
          </section>
        </>
      )}
    </div>
  )
}
