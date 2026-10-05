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
        <section className="rounded-2xl bg-[#302848] p-5 text-white sm:p-7">
          <span className="grid h-10 w-10 place-items-center rounded-xl bg-white/10 text-[#d3c7fa]"><Music2 size={20} /></span>
          <h2 className="mt-4 font-display text-2xl">La banda sonora sois vosotros</h2>
          <p className="mt-2 max-w-lg text-sm leading-6 text-[#cbc6d8]">Cuéntanos qué canciones no pueden faltar y cuáles preferís dejar fuera de la pista.</p>
          <div className="mt-5 flex gap-5 text-xs text-[#ddd8e9]">
            <span><b className="mr-1.5 text-white">{requests.filter((song) => song.kind === 'Imprescindible').length}</b> imprescindibles</span>
            <span><b className="mr-1.5 text-white">{requests.filter((song) => song.kind === 'Prohibida').length}</b> prohibidas</span>
          </div>
        </section>
        <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
          <div className="flex gap-2">
            {filters.map((item) => <button key={item} onClick={() => setFilter(item)} className={`rounded-full px-4 py-2 text-xs font-medium transition ${filter === item ? 'bg-lilac text-white' : 'bg-white text-[#777287] hover:bg-lilac-light'}`}>{item}</button>)}
          </div>
          <label className="flex items-center gap-2 rounded-xl border border-[#efedf3] bg-white px-3 py-2.5 text-muted focus-within:border-lilac">
            <Search size={15} />
            <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Buscar canción" className="w-full bg-transparent text-xs text-ink outline-none placeholder:text-[#aaa7b4] sm:w-36" />
          </label>
        </div>
        <div className="overflow-hidden rounded-2xl border border-[#efedf3] bg-white shadow-card">
          <div className="flex items-center justify-between border-b border-[#f0eef4] px-5 py-4">
            <SectionHeading title="Vuestras canciones" />
            <button onClick={() => setShowForm((value) => !value)} className="mb-4 flex items-center gap-1.5 rounded-lg bg-lilac-light px-3 py-2 text-xs font-semibold text-lilac hover:bg-[#e5dffa]"><Plus size={15} /> Añadir</button>
          </div>
          {showForm && (
            <form onSubmit={addSong} className="grid gap-3 border-b border-[#f0eef4] bg-[#fbfaff] p-4 sm:grid-cols-[1fr_1fr_auto_auto] sm:items-end">
              <label className="text-[11px] font-medium text-[#777287]">Canción<input required value={title} onChange={(event) => setTitle(event.target.value)} placeholder="Nombre de la canción" className="mt-1.5 w-full rounded-lg border border-[#e9e7ef] bg-white px-3 py-2.5 text-xs text-ink outline-none focus:border-lilac" /></label>
              <label className="text-[11px] font-medium text-[#777287]">Artista<input required value={artist} onChange={(event) => setArtist(event.target.value)} placeholder="Nombre del artista" className="mt-1.5 w-full rounded-lg border border-[#e9e7ef] bg-white px-3 py-2.5 text-xs text-ink outline-none focus:border-lilac" /></label>
              <select value={kind} onChange={(event) => setKind(event.target.value)} className="rounded-lg border border-[#e9e7ef] bg-white px-3 py-2.5 text-xs text-ink outline-none"><option>Imprescindible</option><option>Prohibida</option></select>
              <button className="rounded-lg bg-lilac px-4 py-2.5 text-xs font-semibold text-white">Guardar</button>
            </form>
          )}
          <div className="divide-y divide-[#f3f1f6]">
            {filtered.map((song) => {
              const forbidden = song.kind === 'Prohibida'
              return (
                <div key={`${song.title}-${song.artist}`} className="flex items-center gap-3 px-4 py-4 sm:gap-4 sm:px-5">
                  <span className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl ${forbidden ? 'bg-[#fbeaec] text-[#ce7181]' : 'bg-lilac-light text-lilac'}`}>{forbidden ? <Ban size={18} /> : <Heart size={18} />}</span>
                  <div className="min-w-0 flex-1"><p className="truncate text-sm font-semibold text-ink">{song.title}</p><p className="mt-1 truncate text-xs text-muted">{song.artist}</p></div>
                  <span className={`hidden rounded-full px-2.5 py-1 text-[10px] font-medium sm:block ${forbidden ? 'bg-[#fff1f2] text-[#c8697b]' : 'bg-[#f0edf9] text-[#7966c3]'}`}>{song.tag}</span>
                  {song.done ? <span className="grid h-7 w-7 place-items-center rounded-full bg-[#e9f5ec] text-[#5d9b72]"><Check size={15} /></span> : <span className="h-2 w-2 rounded-full bg-[#e5e1ed]" />}
                </div>
              )
            })}
            {filtered.length === 0 && <p className="px-5 py-8 text-center text-sm text-muted">No hay canciones que coincidan con la búsqueda.</p>}
          </div>
        </div>
      </div>
      <aside className="h-fit rounded-2xl border border-[#efedf3] bg-white p-5 shadow-card">
        <span className="grid h-10 w-10 place-items-center rounded-xl bg-[#fff2e4] text-[#cb9451]"><Sparkles size={19} /></span>
        <h3 className="mt-4 font-display text-xl text-ink">Una idea bonita</h3>
        <p className="mt-2 text-sm leading-6 text-muted">Elegid una canción que os recuerde a vuestra primera cita. Ese momento siempre emociona.</p>
        <div className="mt-5 rounded-xl bg-[#f8f6fc] p-3 text-xs leading-5 text-[#777287]">💡 Podéis añadir peticiones hasta 2 semanas antes de la boda.</div>
      </aside>
    </div>
  )
}
