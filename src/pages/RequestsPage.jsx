import { useCallback, useEffect, useMemo, useState } from 'react'
import { Ban, Check, Heart, Music2, Plus, Search, Trash2 } from 'lucide-react'
import SectionHeading from '../components/SectionHeading.jsx'
import { supabase } from '../lib/supabase.js'

const songKinds = {
  must_play: { label: 'Imprescindible', icon: Heart },
  do_not_play: { label: 'No poner', icon: Ban },
}

export default function RequestsPage({ weddingId, user }) {
  const isAdmin = user?.role === 'admin'
  const [requests, setRequests] = useState([])
  const [filter, setFilter] = useState('active')
  const [query, setQuery] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [title, setTitle] = useState('')
  const [artist, setArtist] = useState('')
  const [kind, setKind] = useState('must_play')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')

  const loadSongs = useCallback(async () => {
    if (!weddingId) {
      setRequests([])
      setLoading(false)
      return
    }
    setLoading(true)
    const { data, error: queryError } = await supabase
      .from('songs')
      .select('id, title, artist, kind, status, created_at')
      .eq('wedding_id', weddingId)
      .order('created_at', { ascending: false })

    if (queryError) setError(`No se pudieron cargar las canciones: ${queryError.message}`)
    else {
      setRequests(data || [])
      setError('')
    }
    setLoading(false)
  }, [weddingId])

  useEffect(() => {
    void loadSongs()
  }, [loadSongs])

  const activeCount = requests.filter((song) => song.status !== 'rejected').length
  const filtered = useMemo(() => requests.filter((song) => {
    const matchesStatus = filter === 'all' || (filter === 'rejected' ? song.status === 'rejected' : song.status !== 'rejected')
    const matchesQuery = `${song.title} ${song.artist}`.toLowerCase().includes(query.toLowerCase())
    return matchesStatus && matchesQuery
  }), [filter, query, requests])

  async function addSong(event) {
    event.preventDefault()
    setSaving(true)
    setError('')
    const { error: insertError } = await supabase.from('songs').insert({
      wedding_id: weddingId,
      title: title.trim(),
      artist: artist.trim(),
      kind,
      added_by: user.id,
      status: 'pending',
    })
    if (insertError) {
      setError(insertError.message.includes('30 active songs')
        ? 'La lista ya tiene 30 canciones activas. Elimina alguna o espera a que el DJ rechace una.'
        : `No se pudo añadir la canción: ${insertError.message}`)
    } else {
      setTitle('')
      setArtist('')
      setShowForm(false)
      setNotice('Canción propuesta. El DJ revisará la petición.')
      await loadSongs()
    }
    setSaving(false)
  }

  async function deleteSong(song) {
    setError('')
    setNotice('')
    const { error: deleteError } = await supabase.from('songs').delete().eq('id', song.id)
    if (deleteError) setError(`No se pudo eliminar la canción: ${deleteError.message}`)
    else {
      setNotice('Canción eliminada de la lista.')
      await loadSongs()
    }
  }

  async function reviewSong(song, status) {
    setError('')
    const { error: updateError } = await supabase.from('songs').update({ status }).eq('id', song.id)
    if (updateError) setError(`No se pudo actualizar la petición: ${updateError.message}`)
    else {
      setNotice(status === 'rejected'
        ? `Se ha rechazado «${song.title}». Ya no ocupa espacio en la lista; el registro queda en el historial.`
        : `«${song.title}» está aceptada.`)
      await loadSongs()
    }
  }

  if (!weddingId) {
    return <p className="rounded-2xl border border-ink/10 bg-canvas p-6 text-sm text-muted">Selecciona una boda para gestionar sus canciones.</p>
  }

  return (
    <div className="grid gap-7 lg:grid-cols-[1fr_300px]">
      <div className="space-y-6">
        <section className="rounded-2xl bg-ink p-5 text-canvas sm:p-7">
          <span className="grid h-10 w-10 place-items-center rounded-xl bg-canvas/10 text-canvas"><Music2 size={20} /></span>
          <h2 className="mt-4 font-display text-2xl">{isAdmin ? 'Revisión de peticiones' : 'La banda sonora sois vosotros'}</h2>
          <p className="mt-2 max-w-lg text-sm leading-6 text-canvas/75">{isAdmin ? 'Acepta o rechaza las canciones propuestas. Las rechazadas salen de la lista activa.' : 'Añadid canciones que no pueden faltar o indicad cuáles preferís dejar fuera.'}</p>
          <div className="mt-5 flex flex-wrap gap-5 text-xs text-canvas/75">
            <span><b className="mr-1.5 text-canvas">{activeCount}/30</b> canciones activas</span>
            <span><b className="mr-1.5 text-canvas">{requests.filter((song) => song.status === 'pending').length}</b> pendientes</span>
          </div>
        </section>

        {error && <p role="alert" className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}
        {notice && <p role="status" className="rounded-xl bg-accent/10 px-4 py-3 text-sm text-ink">{notice}</p>}

        <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
          <div className="flex flex-wrap gap-2">
            {[['active', 'Activas'], ['all', 'Todas'], ['rejected', 'Rechazadas']].map(([value, label]) => (
              <button key={value} onClick={() => setFilter(value)} className={`rounded-full px-4 py-2 text-xs font-medium transition ${filter === value ? 'bg-accent text-canvas' : 'bg-canvas text-muted hover:bg-accent/10'}`}>{label}</button>
            ))}
          </div>
          <label className="flex items-center gap-2 rounded-xl border border-ink/10 bg-canvas px-3 py-2.5 text-muted focus-within:border-accent">
            <Search size={15} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Buscar canción" className="w-full bg-transparent text-xs text-ink outline-none placeholder:text-muted/75 sm:w-36" />
          </label>
        </div>

        <section className="overflow-hidden rounded-2xl border border-ink/10 bg-canvas shadow-card">
          <div className="flex items-center justify-between border-b border-ink/10 px-5 py-4">
            <SectionHeading title={isAdmin ? 'Lista de canciones' : 'Vuestras canciones'} />
            {!isAdmin && <button disabled={activeCount >= 30} onClick={() => setShowForm((value) => !value)} className="mb-4 flex items-center gap-1.5 rounded-lg bg-accent/10 px-3 py-2 text-xs font-semibold text-accent hover:bg-accent/15 disabled:cursor-not-allowed disabled:opacity-50"><Plus size={15} /> Añadir</button>}
          </div>
          {showForm && (
            <form onSubmit={addSong} className="grid gap-3 border-b border-ink/10 bg-accent/5 p-4 sm:grid-cols-[1fr_1fr_auto_auto] sm:items-end">
              <label className="text-[11px] font-medium text-muted">Canción<input required maxLength={160} value={title} onChange={(event) => setTitle(event.target.value)} placeholder="Nombre de la canción" className="mt-1.5 w-full rounded-lg border border-ink/15 bg-canvas px-3 py-2.5 text-xs text-ink outline-none focus:border-accent" /></label>
              <label className="text-[11px] font-medium text-muted">Artista<input required maxLength={160} value={artist} onChange={(event) => setArtist(event.target.value)} placeholder="Nombre del artista" className="mt-1.5 w-full rounded-lg border border-ink/15 bg-canvas px-3 py-2.5 text-xs text-ink outline-none focus:border-accent" /></label>
              <select value={kind} onChange={(event) => setKind(event.target.value)} className="rounded-lg border border-ink/15 bg-canvas px-3 py-2.5 text-xs text-ink outline-none"><option value="must_play">Imprescindible</option><option value="do_not_play">No poner</option></select>
              <button disabled={saving} className="rounded-lg bg-accent px-4 py-2.5 text-xs font-semibold text-canvas disabled:opacity-60">{saving ? 'Guardando…' : 'Guardar'}</button>
            </form>
          )}
          {loading ? <p className="px-5 py-8 text-center text-sm text-muted">Cargando canciones…</p> : (
            <div className="divide-y divide-ink/10">
              {filtered.map((song) => {
                const kindData = songKinds[song.kind] || songKinds.must_play
                const Icon = kindData.icon
                return (
                  <div key={song.id} className="flex flex-wrap items-center gap-3 px-4 py-4 sm:flex-nowrap sm:gap-4 sm:px-5">
                    <span className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl ${song.kind === 'do_not_play' ? 'border border-accent text-accent' : 'bg-accent/10 text-accent'}`}><Icon size={18} /></span>
                    <div className="min-w-0 flex-1"><p className="truncate text-sm font-semibold text-ink">{song.title}</p><p className="mt-1 truncate text-xs text-muted">{song.artist} · {kindData.label}</p></div>
                    <span className={`rounded-full px-2.5 py-1 text-[10px] font-medium ${song.status === 'approved' ? 'bg-green-100 text-green-800' : song.status === 'rejected' ? 'bg-red-100 text-red-800' : 'bg-accent/10 text-accent'}`}>{song.status === 'approved' ? 'Aceptada' : song.status === 'rejected' ? 'Rechazada' : 'Pendiente'}</span>
                    {isAdmin && song.status !== 'rejected' && (
                      <div className="flex gap-1">
                        {song.status !== 'approved' && <button aria-label={`Aceptar ${song.title}`} onClick={() => reviewSong(song, 'approved')} className="grid h-8 w-8 place-items-center rounded-lg text-green-700 hover:bg-green-50"><Check size={16} /></button>}
                        <button aria-label={`Rechazar ${song.title}`} onClick={() => reviewSong(song, 'rejected')} className="grid h-8 w-8 place-items-center rounded-lg text-red-700 hover:bg-red-50"><Ban size={16} /></button>
                      </div>
                    )}
                    {!isAdmin && <button aria-label={`Eliminar ${song.title}`} onClick={() => deleteSong(song)} className="grid h-8 w-8 place-items-center rounded-lg text-muted hover:bg-red-50 hover:text-red-700"><Trash2 size={15} /></button>}
                  </div>
                )
              })}
              {filtered.length === 0 && <p className="px-5 py-8 text-center text-sm text-muted">{filter === 'rejected' ? 'No hay canciones rechazadas.' : 'Aún no hay canciones en esta lista.'}</p>}
            </div>
          )}
        </section>
      </div>
      <aside className="h-fit rounded-2xl border border-ink/10 bg-canvas p-5 shadow-card">
        <h3 className="font-display text-xl text-ink">Lista musical</h3>
        <p className="mt-2 text-sm leading-6 text-muted">{isAdmin ? 'Al rechazar una canción se conserva el registro y se libera su espacio para nuevas propuestas.' : 'La lista permite hasta 30 canciones activas. Las rechazadas quedan notificadas en el historial y liberan espacio.'}</p>
      </aside>
    </div>
  )
}
