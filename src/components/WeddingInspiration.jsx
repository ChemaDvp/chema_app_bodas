import { useRef } from 'react'
import { ArrowLeft, ArrowRight, Heart, Play, Sparkles } from 'lucide-react'
import SectionHeading from './SectionHeading.jsx'

const weddingPhotos = [
  {
    src: `${import.meta.env.BASE_URL}images/wedding-02.jpg`,
    alt: 'Pareja disfrutando de la fiesta de su boda',
    layout: 'col-span-2 row-span-2',
    caption: 'Un día para recordar',
  },
  {
    src: `${import.meta.env.BASE_URL}images/wedding-01.jpg`,
    alt: 'Novios y familia celebrando juntos',
    layout: 'col-span-2 row-span-1',
    caption: 'La magia de celebrar',
  },
  {
    src: `${import.meta.env.BASE_URL}images/wedding-03.jpg`,
    alt: 'Invitada disfrutando de la música en la pista',
    layout: 'col-span-1 row-span-1',
    caption: 'Momentos únicos',
  },
  {
    src: `${import.meta.env.BASE_URL}images/wedding-04.jpg`,
    alt: 'Invitados bailando juntos en la celebración',
    layout: 'col-span-1 row-span-1',
    caption: 'Vuestra historia',
  },
]

const weddingVideos = [
  {
    src: 'https://videos.pexels.com/video-files/3195394/3195394-hd_1920_1080_25fps.mp4',
    poster: `${import.meta.env.BASE_URL}images/wedding-02.jpg`,
    title: 'Un día lleno de emoción',
    detail: 'Ceremonia y momentos especiales',
  },
  {
    src: 'https://videos.pexels.com/video-files/853889/853889-hd_1920_1080_25fps.mp4',
    poster: `${import.meta.env.BASE_URL}images/wedding-01.jpg`,
    title: 'Detalles para inspirarse',
    detail: 'Flores, decoración y ambiente',
  },
  {
    src: 'https://videos.pexels.com/video-files/3045163/3045163-hd_1920_1080_25fps.mp4',
    poster: `${import.meta.env.BASE_URL}images/wedding-03.jpg`,
    title: 'Que empiece la celebración',
    detail: 'Ideas para una fiesta inolvidable',
  },
  {
    src: 'https://videos.pexels.com/video-files/2795749/2795749-hd_1920_1080_25fps.mp4',
    poster: `${import.meta.env.BASE_URL}images/wedding-04.jpg`,
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
            <p className="mb-1 flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[.15em] text-accent">
              <Sparkles size={12} /> IDEAS PARA VUESTRO GRAN DÍA
            </p>
            <SectionHeading title="Un collage de momentos" />
          </div>
          <Heart aria-hidden="true" size={19} className="mb-4 shrink-0 text-accent" />
        </div>
        <div className="grid h-[250px] grid-cols-4 grid-rows-2 gap-2 overflow-hidden rounded-[22px] sm:h-[340px] sm:gap-3">
          {weddingPhotos.map((photo) => (
            <figure key={photo.src} className={`group relative min-h-0 min-w-0 overflow-hidden rounded-xl bg-accent/10 sm:rounded-2xl ${photo.layout}`}>
              <img
                src={photo.src}
                alt={photo.alt}
                loading="lazy"
                className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
              />
              <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink/75 to-transparent px-2 pb-2 pt-7 text-[9px] font-medium text-canvas sm:px-3 sm:pb-3 sm:text-xs">
                {photo.caption}
              </figcaption>
            </figure>
          ))}
        </div>
      </div>

      <div>
        <div className="mb-4 flex items-end justify-between gap-3">
          <div>
            <p className="mb-1 flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[.15em] text-accent">
              <Play size={12} /> UN POQUITO DE INSPIRACIÓN
            </p>
            <SectionHeading title="Historias para dar al play" />
          </div>
          <div className="mb-4 flex shrink-0 gap-2">
            <button
              type="button"
              aria-label="Ver vídeos anteriores"
              onClick={() => moveSlider(-1)}
              className="grid h-9 w-9 place-items-center rounded-full border border-ink/10 bg-canvas text-muted transition hover:border-accent hover:text-accent"
            >
              <ArrowLeft size={16} />
            </button>
            <button
              type="button"
              aria-label="Ver más vídeos"
              onClick={() => moveSlider(1)}
              className="grid h-9 w-9 place-items-center rounded-full border border-ink/10 bg-canvas text-muted transition hover:border-accent hover:text-accent"
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
              className="w-[82%] shrink-0 snap-start overflow-hidden rounded-2xl border border-ink/10 bg-canvas shadow-card sm:w-[48%] lg:w-[38%]"
            >
              <video
                controls
                playsInline
                preload="none"
                poster={video.poster}
                aria-label={video.title}
                className="aspect-video w-full bg-ink object-cover"
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
