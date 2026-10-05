import { useRef } from 'react'
import { ArrowLeft, ArrowRight, Heart, Play, Sparkles } from 'lucide-react'
import SectionHeading from './SectionHeading.jsx'

const weddingPhotos = [
  {
    src: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=85',
    alt: 'Ceremonia de boda al aire libre entre flores',
    layout: 'col-span-2 row-span-2',
    caption: 'Un día para recordar',
  },
  {
    src: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=800&q=80',
    alt: 'Celebración de boda bajo guirnaldas de luz',
    layout: 'col-span-1 row-span-1',
    caption: 'La magia de celebrar',
  },
  {
    src: 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&w=800&q=80',
    alt: 'Mesa de banquete decorada con flores',
    layout: 'col-span-1 row-span-1',
    caption: 'Cada detalle cuenta',
  },
  {
    src: 'https://images.unsplash.com/photo-1537633552985-df8429e8048b?auto=format&fit=crop&w=800&q=80',
    alt: 'Pareja de novios disfrutando de su boda',
    layout: 'col-span-1 row-span-1',
    caption: 'Vuestra historia',
  },
  {
    src: 'https://images.unsplash.com/photo-1523438885200-e635ba2c371e?auto=format&fit=crop&w=800&q=80',
    alt: 'Decoración romántica para una boda',
    layout: 'col-span-1 row-span-1',
    caption: 'Detalles con cariño',
  },
]

const weddingVideos = [
  {
    src: 'https://videos.pexels.com/video-files/3195394/3195394-hd_1920_1080_25fps.mp4',
    poster: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=900&q=80',
    title: 'Un día lleno de emoción',
    detail: 'Ceremonia y momentos especiales',
  },
  {
    src: 'https://videos.pexels.com/video-files/853889/853889-hd_1920_1080_25fps.mp4',
    poster: 'https://images.unsplash.com/photo-1523438885200-e635ba2c371e?auto=format&fit=crop&w=900&q=80',
    title: 'Detalles para inspirarse',
    detail: 'Flores, decoración y ambiente',
  },
  {
    src: 'https://videos.pexels.com/video-files/3045163/3045163-hd_1920_1080_25fps.mp4',
    poster: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=900&q=80',
    title: 'Que empiece la celebración',
    detail: 'Ideas para una fiesta inolvidable',
  },
  {
    src: 'https://videos.pexels.com/video-files/2795749/2795749-hd_1920_1080_25fps.mp4',
    poster: 'https://images.unsplash.com/photo-1537633552985-df8429e8048b?auto=format&fit=crop&w=900&q=80',
    title: 'Momentos para siempre',
    detail: 'Una historia contada en imágenes',
  },
]

export default function WeddingInspiration() {
  const sliderRef = useRef(null)

  function moveSlider(direction) {
    const slider = sliderRef.current
    if (!slider) return

    slider.scrollBy({ left: direction * slider.clientWidth * 0.8, behavior: 'smooth' })
  }

  return (
    <section aria-label="Inspiración para bodas" className="space-y-8">
      <div>
        <div className="mb-4 flex items-center justify-between gap-3">
          <div>
            <p className="mb-1 flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[.15em] text-lilac">
              <Sparkles size={12} /> IDEAS PARA VUESTRO GRAN DÍA
            </p>
            <SectionHeading title="Un collage de momentos" />
          </div>
          <Heart aria-hidden="true" size={19} className="mb-4 shrink-0 text-[#d28d9d]" />
        </div>
        <div className="grid h-[250px] grid-cols-4 grid-rows-2 gap-2 overflow-hidden rounded-[22px] sm:h-[340px] sm:gap-3">
          {weddingPhotos.map((photo) => (
            <figure key={photo.src} className={`group relative min-h-0 min-w-0 overflow-hidden rounded-xl bg-[#ede8f4] sm:rounded-2xl ${photo.layout}`}>
              <img
                src={photo.src}
                alt={photo.alt}
                loading="lazy"
                className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
              />
              <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#201b32]/70 to-transparent px-2 pb-2 pt-7 text-[9px] font-medium text-white sm:px-3 sm:pb-3 sm:text-xs">
                {photo.caption}
              </figcaption>
            </figure>
          ))}
        </div>
      </div>

      <div>
        <div className="mb-4 flex items-end justify-between gap-3">
          <div>
            <p className="mb-1 flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[.15em] text-lilac">
              <Play size={12} /> UN POQUITO DE INSPIRACIÓN
            </p>
            <SectionHeading title="Historias para dar al play" />
          </div>
          <div className="mb-4 flex shrink-0 gap-2">
            <button
              type="button"
              aria-label="Ver vídeos anteriores"
              onClick={() => moveSlider(-1)}
              className="grid h-9 w-9 place-items-center rounded-full border border-[#eae7f0] bg-white text-[#777287] transition hover:border-lilac hover:text-lilac"
            >
              <ArrowLeft size={16} />
            </button>
            <button
              type="button"
              aria-label="Ver más vídeos"
              onClick={() => moveSlider(1)}
              className="grid h-9 w-9 place-items-center rounded-full border border-[#eae7f0] bg-white text-[#777287] transition hover:border-lilac hover:text-lilac"
            >
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
        <div
          ref={sliderRef}
          aria-label="Carrusel de vídeos de bodas"
          className="hide-scrollbar flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth pb-3"
        >
          {weddingVideos.map((video) => (
            <article
              key={video.src}
              className="w-[82%] shrink-0 snap-start overflow-hidden rounded-2xl border border-[#efedf3] bg-white shadow-card sm:w-[48%] lg:w-[38%]"
            >
              <video
                controls
                playsInline
                preload="none"
                poster={video.poster}
                aria-label={video.title}
                className="aspect-video w-full bg-[#29233f] object-cover"
              >
                <source src={video.src} type="video/mp4" />
                Tu navegador no puede reproducir este vídeo.
              </video>
              <div className="p-4">
                <h3 className="text-sm font-semibold text-ink">{video.title}</h3>
                <p className="mt-1 text-xs text-muted">{video.detail}</p>
              </div>
            </article>
          ))}
        </div>
        <p className="mt-1 text-[10px] text-muted">Desliza para descubrir más vídeos.</p>
      </div>
    </section>
  )
}
