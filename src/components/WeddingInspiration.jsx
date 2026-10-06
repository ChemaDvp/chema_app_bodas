import { useEffect, useRef, useState } from 'react'
import { ArrowLeft, ArrowRight, Heart, Play, Sparkles } from 'lucide-react'
import SectionHeading from './SectionHeading.jsx'
import { supabase } from '../lib/supabase.js'

const bucket = 'contenido-publico'
const imageLayouts = ['col-span-2 row-span-2', 'col-span-2 row-span-1', 'col-span-1 row-span-1', 'col-span-1 row-span-1']

export default function WeddingInspiration() {
  const sliderRef = useRef(null)
  const [items, setItems] = useState([])

  useEffect(() => {
    let mounted = true

    async function loadMedia() {
      const { data, error } = await supabase
        .from('media_items')
        .select('id, bucket_path, media_type, alt_text, position')
        .eq('active', true)
        .order('position')
      if (mounted && !error) setItems(data || [])
    }

    void loadMedia()
    return () => {
      mounted = false
    }
  }, [])

  function moveSlider(direction) {
    const slider = sliderRef.current
    if (slider) slider.scrollBy({ left: direction * slider.clientWidth * 0.8, behavior: 'smooth' })
  }

  const images = items.filter((item) => item.media_type === 'image')
  const videos = items.filter((item) => item.media_type === 'video')
  if (!items.length) return null

  return (
    <section aria-label="Inspiración para bodas" className="space-y-8">
      {images.length > 0 && <div>
        <div className="mb-4 flex items-center justify-between gap-3">
          <div><p className="mb-1 flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[.15em] text-accent"><Sparkles size={12} /> IDEAS PARA VUESTRO GRAN DÍA</p><SectionHeading title="Un collage de momentos" /></div>
          <Heart aria-hidden="true" size={19} className="mb-4 shrink-0 text-accent" />
        </div>
        <div className="grid auto-rows-[120px] grid-cols-4 gap-2 overflow-hidden rounded-[22px] sm:auto-rows-[160px] sm:gap-3">
          {images.map((item, index) => {
            const { data: { publicUrl } } = supabase.storage.from(bucket).getPublicUrl(item.bucket_path)
            return <figure key={item.id} className={`group relative min-h-0 min-w-0 overflow-hidden rounded-xl bg-accent/10 sm:rounded-2xl ${imageLayouts[index % imageLayouts.length]}`}>
              <img src={publicUrl} alt={item.alt_text || 'Momento de una boda'} loading="lazy" className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
              {item.alt_text && <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink/75 to-transparent px-3 pb-3 pt-8 text-xs font-medium text-canvas">{item.alt_text}</figcaption>}
            </figure>
          })}
        </div>
      </div>}

      {videos.length > 0 && <div>
        <div className="mb-4 flex items-end justify-between gap-3">
          <div><p className="mb-1 flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[.15em] text-accent"><Play size={12} /> UN POQUITO DE INSPIRACIÓN</p><SectionHeading title="Historias para dar al play" /></div>
          <div className="mb-4 flex shrink-0 gap-2">
            <button type="button" aria-label="Ver vídeos anteriores" onClick={() => moveSlider(-1)} className="grid h-9 w-9 place-items-center rounded-full border border-ink/10 bg-canvas text-muted hover:border-accent hover:text-accent"><ArrowLeft size={16} /></button>
            <button type="button" aria-label="Ver más vídeos" onClick={() => moveSlider(1)} className="grid h-9 w-9 place-items-center rounded-full border border-ink/10 bg-canvas text-muted hover:border-accent hover:text-accent"><ArrowRight size={16} /></button>
          </div>
        </div>
        <div ref={sliderRef} aria-label="Carrusel de vídeos de bodas" className="hide-scrollbar flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth pb-3">
          {videos.map((item) => {
            const { data: { publicUrl } } = supabase.storage.from(bucket).getPublicUrl(item.bucket_path)
            return <article key={item.id} className="w-[82%] shrink-0 snap-start overflow-hidden rounded-2xl border border-ink/10 bg-canvas shadow-card sm:w-[48%] lg:w-[38%]">
              <video src={publicUrl} controls playsInline preload="metadata" aria-label={item.alt_text || 'Vídeo de boda'} className="aspect-video w-full bg-ink object-cover">Tu navegador no puede reproducir este vídeo.</video>
              {item.alt_text && <div className="p-4"><h3 className="text-sm font-semibold text-ink">{item.alt_text}</h3></div>}
            </article>
          })}
        </div>
        <p className="mt-1 text-[10px] text-muted">Desliza para descubrir más vídeos.</p>
      </div>}
    </section>
  )
}
