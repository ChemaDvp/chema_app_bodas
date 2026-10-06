import { useCallback, useEffect, useState } from 'react'
import { ImagePlus, Trash2, Video } from 'lucide-react'
import { supabase } from '../lib/supabase.js'

const bucket = 'contenido-publico'

export default function AdminMediaPage() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')

  const loadItems = useCallback(async () => {
    setLoading(true)
    const { data, error: queryError } = await supabase
      .from('media_items')
      .select('id, bucket_path, media_type, alt_text, position, active')
      .order('position')
    if (queryError) setError(`No se pudo cargar el contenido: ${queryError.message}`)
    else {
      setItems(data || [])
      setError('')
    }
    setLoading(false)
  }, [])

  useEffect(() => {
    void loadItems()
  }, [loadItems])

  async function upload(event) {
    const file = event.target.files?.[0]
    event.target.value = ''
    if (!file) return
    const isImage = file.type.startsWith('image/')
    const isVideo = file.type.startsWith('video/')
    if (!isImage && !isVideo) {
      setError('Solo se admiten imágenes o vídeos.')
      return
    }
    if (file.size > 50 * 1024 * 1024) {
      setError('El archivo no puede superar los 50 MB.')
      return
    }
    setUploading(true)
    setError('')
    const path = `${crypto.randomUUID()}-${file.name.replace(/[^\w.-]/g, '_')}`
    const { error: uploadError } = await supabase.storage.from(bucket).upload(path, file, {
      contentType: file.type,
      upsert: false,
    })
    if (uploadError) {
      setError(`No se pudo subir el archivo: ${uploadError.message}`)
      setUploading(false)
      return
    }
    const { error: insertError } = await supabase.from('media_items').insert({
      bucket_path: path,
      media_type: isImage ? 'image' : 'video',
      alt_text: file.name,
      position: items.length,
      active: true,
    })
    if (insertError) {
      const { error: cleanupError } = await supabase.storage.from(bucket).remove([path])
      setError(cleanupError
        ? `El archivo se subió, pero no se guardó en el catálogo y no se pudo retirar: ${insertError.message}; ${cleanupError.message}`
        : `El archivo no se guardó en el catálogo y se retiró del almacenamiento: ${insertError.message}`)
      setUploading(false)
      return
    }
    setNotice('Contenido subido y publicado para todas las parejas.')
    await loadItems()
    setUploading(false)
  }

  async function deleteItem(item) {
    setError('')
    const { error: deleteError } = await supabase.from('media_items').delete().eq('id', item.id)
    if (deleteError) {
      setError(`No se pudo quitar el contenido: ${deleteError.message}`)
      return
    }
    const { error: storageError } = await supabase.storage.from(bucket).remove([item.bucket_path])
    if (storageError) setError(`Se quitó del catálogo, pero no se pudo borrar el archivo: ${storageError.message}`)
    setItems((current) => current.filter((entry) => entry.id !== item.id))
  }

  return (
    <div className="space-y-6">
      <section className="flex flex-col justify-between gap-4 rounded-2xl bg-ink p-5 text-canvas shadow-card sm:flex-row sm:items-center sm:p-7">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[.14em] text-canvas/65">Contenido común</p>
          <h2 className="mt-2 font-display text-3xl">Inspiración para las parejas</h2>
          <p className="mt-2 text-sm text-canvas/75">Las imágenes y vídeos activos se muestran a todas las parejas.</p>
        </div>
        <label className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-xl bg-canvas px-4 py-3 text-sm font-semibold text-ink hover:bg-canvas/85">
          <ImagePlus size={17} />{uploading ? 'Subiendo…' : 'Subir archivo'}
          <input type="file" accept="image/*,video/*" onChange={upload} disabled={uploading} className="sr-only" />
        </label>
      </section>
      {error && <p role="alert" className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}
      {notice && <p role="status" className="rounded-xl bg-accent/10 px-4 py-3 text-sm text-ink">{notice}</p>}
      {loading ? <p className="rounded-xl border border-ink/10 bg-canvas p-8 text-center text-sm text-muted">Cargando contenido…</p> : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => {
            const { data: { publicUrl } } = supabase.storage.from(bucket).getPublicUrl(item.bucket_path)
            return <article key={item.id} className="overflow-hidden rounded-2xl border border-ink/10 bg-canvas shadow-card">
              {item.media_type === 'video'
                ? <video src={publicUrl} controls playsInline preload="metadata" className="aspect-video w-full bg-ink object-cover" />
                : <img src={publicUrl} alt={item.alt_text || ''} className="aspect-video w-full bg-accent/10 object-cover" />}
              <div className="flex items-center gap-3 p-4">
                {item.media_type === 'video' ? <Video size={16} className="text-accent" /> : <ImagePlus size={16} className="text-accent" />}
                <p className="min-w-0 flex-1 truncate text-xs text-muted">{item.alt_text || item.bucket_path}</p>
                <button onClick={() => deleteItem(item)} aria-label="Eliminar contenido" className="text-muted hover:text-red-700"><Trash2 size={16} /></button>
              </div>
            </article>
          })}
          {!items.length && <div className="rounded-2xl border border-dashed border-ink/20 bg-canvas px-5 py-10 text-center sm:col-span-2 lg:col-span-3"><ImagePlus size={24} className="mx-auto text-accent" /><p className="mt-3 font-semibold text-ink">Aún no hay contenido</p><p className="mt-1 text-sm text-muted">Sube fotografías o vídeos para que aparezcan en el inicio de las parejas.</p></div>}
        </div>
      )}
    </div>
  )
}
