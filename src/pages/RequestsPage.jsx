import { useState } from 'react'
import { Ban, Check, Heart, Music2, Plus, Search, Sparkles } from 'lucide-react'
import SectionHeading from '../components/SectionHeading.jsx'
import { initialRequests } from '../data/demoData.js'

export default function RequestsPage() {
  const [requests, setRequests] = useState(initialRequests)
  const [filter, setFilter] = useState('Todas')
  const [query, setQuery] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [title, setTitle] = useState('')
  const [artist, setArtist] = useState('')
  const [kind, setKind] = useState('Imprescindible')
  const filters = ['Todas', 'Imprescindible', 'Prohibida']
  const filtered = requests.filter((song) => {
    const matchesFilter = filter === 'Todas' || song.kind === filter
    const matchesQuery = `${song.title} ${song.artist}`.toLowerCase().includes(query.toLowerCase())
    return matchesFilter && matchesQuery
  })

  function addSong(event) {
    event.preventDefault()
    setRequests((current) => [{ title: title.trim(), artist: artist.trim(), kind, tag: kind === 'Prohibida' ? 'No poner' : 'Nueva petición', done: false }, ...current])
    setTitle('')
    setArtist('')
    setShowForm(false)
  }

  return (
    <div className="grid gap-7 lg:grid-cols-[1fr_300px]">
      <div className="space-y-6">
        <section className="rounded-2xl bg-ink p-5 text-canvas sm:p-7">
          <span className="grid h-10 w-10 place-items-center rounded-xl bg-canvas/10 text-canvas"><Music2 size={20} /></span>
          <h2 className="mt-4 font-display text-2xl">La banda sonora sois vosotros</h2>
          <p className="mt-2 max-w-lg text-sm leading-6 text-canvas/75">Cuéntanos qué canciones no pueden faltar y cuáles preferís dejar fuera de la pista.</p>
          <div className="mt-5 flex gap-5 text-xs text-canvas/75">
            <span><b className="mr-1.5 text-canvas">{requests.filter((song) => song.kind === 'Imprescindible').length}</b> imprescindibles</span>
            <span><b className="mr-1.5 text-canvas">{requests.filter((song) => song.kind === 'Prohibida').length}</b> prohibidas</span>
          </div>
        </section>
        <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
          <div className="flex gap-2">
            {filters.map((item) => <button key={item} onClick={() => setFilter(item)} className={`rounded-full px-4 py-2 text-xs font-medium transition ${filter === item ? 'bg-accent text-canvas' : 'bg-canvas text-muted hover:bg-accent/10'}`}>{item}</button>)}
          </div>
          <label className="flex items-center gap-2 rounded-xl border border-ink/10 bg-canvas px-3 py-2.5 text-muted focus-within:border-accent">
            <Search size={15} />
            <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Buscar canción" className="w-full bg-transparent text-xs text-ink outline-none placeholder:text-muted/75 sm:w-36" />
          </label>
        </div>
        <div className="overflow-hidden rounded-2xl border border-ink/10 bg-canvas shadow-card">
          <div className="flex items-center justify-between border-b border-ink/10 px-5 py-4">
            <SectionHeading title="Vuestras canciones" />
            <button onClick={() => setShowForm((value) => !value)} className="mb-4 flex items-center gap-1.5 rounded-lg bg-accent/10 px-3 py-2 text-xs font-semibold text-accent hover:bg-accent/15"><Plus size={15} /> Añadir</button>
          </div>
          {showForm && (
            <form onSubmit={addSong} className="grid gap-3 border-b border-ink/10 bg-accent/5 p-4 sm:grid-cols-[1fr_1fr_auto_auto] sm:items-end">
              <label className="text-[11px] font-medium text-muted">Canción<input required value={title} onChange={(event) => setTitle(event.target.value)} placeholder="Nombre de la canción" className="mt-1.5 w-full rounded-lg border border-ink/15 bg-canvas px-3 py-2.5 text-xs text-ink outline-none focus:border-accent" /></label>
              <label className="text-[11px] font-medium text-muted">Artista<input required value={artist} onChange={(event) => setArtist(event.target.value)} placeholder="Nombre del artista" className="mt-1.5 w-full rounded-lg border border-ink/15 bg-canvas px-3 py-2.5 text-xs text-ink outline-none focus:border-accent" /></label>
              <select value={kind} onChange={(event) => setKind(event.target.value)} className="rounded-lg border border-ink/15 bg-canvas px-3 py-2.5 text-xs text-ink outline-none"><option>Imprescindible</option><option>Prohibida</option></select>
              <button className="rounded-lg bg-accent px-4 py-2.5 text-xs font-semibold text-canvas">Guardar</button>
            </form>
          )}
          <div className="divide-y divide-ink/10">
            {filtered.map((song) => {
              const forbidden = song.kind === 'Prohibida'
              return (
                <div key={`${song.title}-${song.artist}`} className="flex items-center gap-3 px-4 py-4 sm:gap-4 sm:px-5">
                  <span className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl ${forbidden ? 'border border-accent text-accent' : 'bg-accent/10 text-accent'}`}>{forbidden ? <Ban size={18} /> : <Heart size={18} />}</span>
                  <div className="min-w-0 flex-1"><p className="truncate text-sm font-semibold text-ink">{song.title}</p><p className="mt-1 truncate text-xs text-muted">{song.artist}</p></div>
                  <span className={`hidden rounded-full px-2.5 py-1 text-[10px] font-medium sm:block ${forbidden ? 'border border-accent/30 text-accent' : 'bg-accent/10 text-accent'}`}>{song.tag}</span>
                  {song.done ? <span className="grid h-7 w-7 place-items-center rounded-full bg-accent/10 text-accent"><Check size={15} /></span> : <span className="h-2 w-2 rounded-full bg-muted/25" />}
                </div>
              )
            })}
            {filtered.length === 0 && <p className="px-5 py-8 text-center text-sm text-muted">No hay canciones que coincidan con la búsqueda.</p>}
          </div>
        </div>
      </div>
      <aside className="h-fit rounded-2xl border border-ink/10 bg-canvas p-5 shadow-card">
        <span className="grid h-10 w-10 place-items-center rounded-xl bg-accent/10 text-accent"><Sparkles size={19} /></span>
        <h3 className="mt-4 font-display text-xl text-ink">Una idea bonita</h3>
        <p className="mt-2 text-sm leading-6 text-muted">Elegid una canción que os recuerde a vuestra primera cita. Ese momento siempre emociona.</p>
        <div className="mt-5 rounded-xl bg-accent/10 p-3 text-xs leading-5 text-muted">💡 Podéis añadir peticiones hasta 2 semanas antes de la boda.</div>
      </aside>
    </div>
  )
}
