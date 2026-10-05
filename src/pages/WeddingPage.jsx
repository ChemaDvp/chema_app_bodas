import { useState } from 'react'
import { CalendarDays, Camera, Check, ChevronRight, Clock3, Disc3, Heart, Martini, Plus, Utensils } from 'lucide-react'
import SectionHeading from '../components/SectionHeading.jsx'
import { timeline as initialTimeline } from '../data/demoData.js'

const timelineIcons = { Heart, Martini, Utensils, Disc3 }

export default function WeddingPage() {
  const [moments, setMoments] = useState(initialTimeline)
  const [showForm, setShowForm] = useState(false)
  const [title, setTitle] = useState('')
  const [time, setTime] = useState('')

  function addMoment(event) {
    event.preventDefault()
    setMoments((current) => [...current, { time, title: title.trim(), detail: 'Momento especial', icon: 'Heart', tone: 'bg-accent/10 text-accent' }].sort((a, b) => a.time.localeCompare(b.time)))
    setTitle('')
    setTime('')
    setShowForm(false)
  }

  return (
    <div className="grid gap-7 lg:grid-cols-[1fr_310px]">
      <section className="rounded-2xl border border-ink/10 bg-canvas p-5 shadow-card sm:p-7">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div><p className="text-xs font-semibold uppercase tracking-wider text-accent">SÁBADO, 17 DE OCTUBRE DE 2026</p><h2 className="mt-2 font-display text-2xl text-ink sm:text-3xl">El gran día, paso a paso</h2></div>
          <button onClick={() => setShowForm((value) => !value)} className="flex items-center gap-1.5 rounded-xl bg-accent/10 px-3 py-2.5 text-xs font-semibold text-accent hover:bg-accent/15"><Plus size={15} /> Añadir momento</button>
        </div>
        <div className="mt-6 flex flex-wrap gap-x-5 gap-y-2 border-b border-ink/10 pb-5 text-xs text-muted">
          <span className="flex items-center gap-1.5"><CalendarDays size={14} /> Finca La Viborilla, Málaga</span>
          <span className="flex items-center gap-1.5"><Clock3 size={14} /> Quedan 11 días</span>
        </div>
        {showForm && <form onSubmit={addMoment} className="mt-5 flex flex-col gap-3 rounded-xl bg-accent/5 p-4 sm:flex-row sm:items-end"><label className="flex-1 text-[11px] font-medium text-muted">Momento<input required value={title} onChange={(event) => setTitle(event.target.value)} placeholder="Por ejemplo: lanzamiento del ramo" className="mt-1.5 w-full rounded-lg border border-ink/15 bg-canvas px-3 py-2.5 text-xs text-ink outline-none focus:border-accent" /></label><label className="text-[11px] font-medium text-muted">Hora<input required type="time" value={time} onChange={(event) => setTime(event.target.value)} className="mt-1.5 block rounded-lg border border-ink/15 bg-canvas px-3 py-2.5 text-xs text-ink outline-none focus:border-accent" /></label><button className="rounded-lg bg-accent px-4 py-2.5 text-xs font-semibold text-canvas">Guardar</button></form>}
        <div className="mt-7">
          {moments.map((moment, index) => {
            const Icon = timelineIcons[moment.icon] || Heart
            return (
              <div key={`${moment.time}-${moment.title}`} className="relative flex gap-4 pb-7 last:pb-0 sm:gap-6">
                {index !== moments.length - 1 && <span className="absolute bottom-0 left-[49px] top-12 w-px border-l border-dashed border-ink/20 sm:left-[61px]" />}
                <span className="w-8 pt-3 text-right text-xs font-semibold tabular-nums text-muted sm:w-10 sm:text-sm">{moment.time}</span>
                <span className={`z-10 grid h-10 w-10 shrink-0 place-items-center rounded-xl ${moment.tone}`}><Icon size={18} /></span>
                <div className="min-w-0 flex-1 rounded-xl border border-ink/10 bg-canvas px-4 py-3">
                  <p className="text-sm font-semibold text-ink">{moment.title}</p>
                  <p className="mt-1 text-xs text-muted">{moment.detail}</p>
                </div>
                <button aria-label={`Editar ${moment.title}`} className="mt-3 text-muted/50 hover:text-accent"><ChevronRight size={16} /></button>
              </div>
            )
          })}
        </div>
      </section>
      <aside className="space-y-5">
        <section className="rounded-2xl bg-accent/10 p-5">
          <span className="grid h-10 w-10 place-items-center rounded-xl bg-canvas text-accent"><Camera size={19} /></span>
          <h3 className="mt-4 font-display text-xl text-ink">Momentos únicos</h3>
          <p className="mt-2 text-sm leading-6 text-muted">Cuéntanos cuándo ocurren las sorpresas, el ramo o ese baile que nadie espera.</p>
          <button onClick={() => setShowForm(true)} className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-accent">Añadir un momento <ChevronRight size={14} /></button>
        </section>
        <section className="rounded-2xl border border-ink/10 bg-canvas p-5 shadow-card">
          <SectionHeading title="Checklist" />
          <div className="space-y-4">
            {['Elegir canción del primer baile', 'Compartir horarios con el DJ', 'Preparar canción sorpresa'].map((task, index) => <div key={task} className="flex items-center gap-3"><span className={`grid h-5 w-5 place-items-center rounded-md ${index === 1 ? 'bg-accent text-canvas' : 'border border-ink/20 text-transparent'}`}><Check size={13} /></span><span className={`text-xs ${index === 1 ? 'text-muted line-through' : 'text-ink'}`}>{task}</span></div>)}
          </div>
        </section>
      </aside>
    </div>
  )
}
