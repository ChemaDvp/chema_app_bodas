import { ArrowRight, CalendarDays, Check, Clock3, MapPin, Music2, Plus, Sparkles } from 'lucide-react'
import { upcomingEvents } from '../data/demoData.js'
import SectionHeading from '../components/SectionHeading.jsx'

export default function DashboardPage({ user, onNavigate }) {
  const nextEvent = upcomingEvents[0]
  const firstName = user.name?.split(' ')[0] || 'Alex'

  return (
    <div className="space-y-8">
      <section className="relative overflow-hidden rounded-[26px] bg-[#302848] p-6 text-white shadow-card sm:p-8">
        <div className="absolute -right-10 -top-24 h-64 w-64 rounded-full bg-[#8b73da]/25 blur-3xl" />
        <div className="absolute -bottom-24 right-1/3 h-48 w-48 rounded-full bg-[#d6a590]/15 blur-3xl" />
        <div className="relative grid items-center gap-7 md:grid-cols-[1fr_auto]">
          <div>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/[0.08] px-3 py-1.5 text-[11px] font-medium text-[#e5def8]">
              <Sparkles size={13} /> PRÓXIMO EVENTO
            </span>
            <h2 className="mt-4 font-display text-3xl sm:text-4xl">{nextEvent.title}</h2>
            <p className="mt-2 flex items-center gap-1.5 text-sm text-[#cfcbda]"><MapPin size={15} />{nextEvent.venue}</p>
            <div className="mt-6 flex flex-wrap gap-2">
              <span className="inline-flex items-center gap-2 rounded-xl bg-white/10 px-3 py-2 text-xs font-medium"><CalendarDays size={15} /> Sábado, 17 de octubre</span>
              <span className="inline-flex items-center gap-2 rounded-xl bg-white/10 px-3 py-2 text-xs font-medium"><Clock3 size={15} /> En 11 días</span>
            </div>
          </div>
          <div className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/[0.07] p-4 md:min-w-[210px] md:flex-col md:items-start">
            <div className="flex -space-x-2">
              {['C', 'A'].map((letter, index) => <span key={letter} className={`grid h-10 w-10 place-items-center rounded-full border-2 border-[#39314f] text-sm font-semibold ${index ? 'bg-[#c89c6d]' : 'bg-[#c98792]'}`}>{letter}</span>)}
            </div>
            <div className="flex-1">
              <p className="text-xs text-[#c9c4d8]">Preparativos listos</p>
              <p className="mt-0.5 text-lg font-semibold">82%</p>
            </div>
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/15 md:w-full">
              <div className="h-full rounded-full bg-[#c4b5fd]" style={{ width: `${nextEvent.progress}%` }} />
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-8 lg:grid-cols-[1.35fr_.85fr]">
        <div>
          <SectionHeading title="Vuestros eventos" action="Ver todos" onAction={() => onNavigate('wedding')} />
          <div className="space-y-3">
            {upcomingEvents.map((event) => (
              <button key={event.title} onClick={() => onNavigate('wedding')} className="group flex w-full items-center gap-4 rounded-2xl border border-[#efedf3] bg-white p-4 text-left shadow-card transition hover:-translate-y-0.5 hover:border-[#ded8f2] sm:p-5">
                <span className={`grid h-14 w-14 shrink-0 place-items-center rounded-2xl ${event.tone}`}>
                  <span className="text-center"><span className="block font-display text-xl leading-5 text-ink">{event.day}</span><span className="mt-1 block text-[9px] font-semibold tracking-wider text-muted">{event.month}</span></span>
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate font-semibold text-ink">{event.title}</span>
                  <span className="mt-1 flex items-center gap-1 truncate text-xs text-muted"><MapPin size={12} />{event.venue}</span>
                </span>
                <span className="hidden text-right sm:block">
                  <span className="block text-xs font-medium text-lilac">{event.daysLeft}</span>
                  <span className="mt-2 block h-1 w-20 overflow-hidden rounded-full bg-[#efedf5]"><span className="block h-full rounded-full bg-lilac" style={{ width: `${event.progress}%` }} /></span>
                </span>
                <ArrowRight size={17} className="text-[#c5c2ce] transition group-hover:translate-x-1 group-hover:text-lilac" />
              </button>
            ))}
            <button onClick={() => onNavigate('account')} className="flex w-full items-center justify-center gap-2 rounded-2xl border border-dashed border-[#d9d4e7] py-4 text-sm font-medium text-[#777287] transition hover:border-lilac hover:text-lilac">
              <Plus size={16} /> Añadir evento
            </button>
          </div>
        </div>

        <div className="space-y-6">
          <section className="rounded-2xl border border-[#efedf3] bg-white p-5 shadow-card sm:p-6">
            <SectionHeading title="Esta semana" action="Ver boda" onAction={() => onNavigate('wedding')} />
            <div className="space-y-5">
              {[
                ['Elegir canción del primer baile', 'Hoy · Música', false],
                ['Confirmar horario del cóctel', 'Jue, 8 oct · Organización', true],
                ['Revisar canciones prohibidas', 'Sáb, 10 oct · Música', false],
              ].map(([label, detail, completed]) => (
                <div key={label} className="flex items-start gap-3">
                  <span className={`mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-md border ${completed ? 'border-lilac bg-lilac text-white' : 'border-[#dcd9e5] text-transparent'}`}><Check size={13} /></span>
                  <span className="min-w-0 flex-1">
                    <span className={`block text-sm font-medium ${completed ? 'text-[#a6a3b1] line-through' : 'text-ink'}`}>{label}</span>
                    <span className="mt-1 block text-[11px] text-muted">{detail}</span>
                  </span>
                </div>
              ))}
            </div>
          </section>
          <button onClick={() => onNavigate('requests')} className="group flex w-full items-center gap-4 rounded-2xl bg-[#e9e5f7] p-5 text-left transition hover:bg-[#e2ddf3]">
            <span className="grid h-11 w-11 place-items-center rounded-xl bg-white text-lilac"><Music2 size={20} /></span>
            <span className="flex-1"><span className="block text-sm font-semibold text-ink">La música lo cambia todo</span><span className="mt-1 block text-xs text-[#777287]">Añade vuestras canciones favoritas</span></span>
            <ArrowRight size={17} className="text-lilac transition group-hover:translate-x-1" />
          </button>
        </div>
      </section>
      <p className="text-center text-xs text-muted">¡Qué bonito lo que estáis preparando, {firstName}! <Sparkles size={13} className="inline text-[#cf9f5e]" /></p>
    </div>
  )
}
