import { useState } from 'react'
import { ArrowRight, Bell, Camera, Check, ChevronRight, LogOut, MapPin, Music2, Save, ShieldCheck, UserRound } from 'lucide-react'

export default function AccountPage({ user, onLogout }) {
  const [name, setName] = useState(user.name || '')
  const [email, setEmail] = useState(user.email || '')
  const [saved, setSaved] = useState(false)

  function saveProfile(event) {
    event.preventDefault()
    setSaved(true)
    window.setTimeout(() => setSaved(false), 2500)
  }

  return (
    <div className="grid gap-7 lg:grid-cols-[1fr_310px]">
      <section className="rounded-2xl border border-ink/10 bg-canvas p-5 shadow-card sm:p-7">
        <div className="flex items-center gap-4 border-b border-ink/10 pb-6">
          <div className="relative grid h-16 w-16 place-items-center rounded-2xl bg-accent/15 text-lg font-semibold text-ink">{name.split(' ').map((part) => part[0]).slice(0, 2).join('').toUpperCase()}<button aria-label="Cambiar foto de perfil" className="absolute -bottom-1 -right-1 grid h-7 w-7 place-items-center rounded-full border-2 border-canvas bg-accent text-canvas"><Camera size={13} /></button></div>
          <div><h2 className="font-display text-2xl text-ink">{name || 'Tu perfil'}</h2><p className="mt-1 text-xs text-muted">Vuestra boda · 17 oct 2026</p></div>
        </div>
        <form onSubmit={saveProfile} className="mt-6 space-y-5">
          <h3 className="text-sm font-semibold text-ink">Vuestros datos</h3>
          <label className="block text-xs font-medium text-muted">Nombres<input value={name} onChange={(event) => setName(event.target.value)} placeholder="Alex y Sam" className="mt-2 w-full rounded-xl border border-ink/15 bg-canvas px-4 py-3 text-sm text-ink outline-none focus:border-accent focus:ring-4 focus:ring-accent/10" /></label>
          <label className="block text-xs font-medium text-muted">Correo electrónico<input required type="email" value={email} onChange={(event) => setEmail(event.target.value)} className="mt-2 w-full rounded-xl border border-ink/15 bg-canvas px-4 py-3 text-sm text-ink outline-none focus:border-accent focus:ring-4 focus:ring-accent/10" /></label>
          <label className="block text-xs font-medium text-muted">Lugar de celebración<span className="relative mt-2 block"><MapPin size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" /><input defaultValue="Finca La Viborilla, Málaga" className="w-full rounded-xl border border-ink/15 bg-canvas py-3 pl-10 pr-4 text-sm text-ink outline-none focus:border-accent focus:ring-4 focus:ring-accent/10" /></span></label>
          <button className="flex items-center gap-2 rounded-xl bg-accent px-5 py-3 text-sm font-semibold text-canvas transition hover:bg-ink"><Save size={16} /> {saved ? '¡Cambios guardados!' : 'Guardar cambios'} {saved && <Check size={16} />}</button>
        </form>
      </section>
      <aside className="space-y-4">
        <section className="rounded-2xl border border-ink/10 bg-canvas p-5 shadow-card">
          <h3 className="mb-3 text-sm font-semibold text-ink">Preferencias</h3>
          {[
            [Bell, 'Notificaciones', 'Avisos y recordatorios'],
            [Music2, 'Estilo musical', 'Pop, indie, clásicos'],
            [ShieldCheck, 'Privacidad', 'Tus datos están seguros'],
          ].map(([Icon, title, detail]) => <button key={title} className="flex w-full items-center gap-3 border-t border-ink/10 py-4 text-left first:border-0"><span className="grid h-9 w-9 place-items-center rounded-xl bg-accent/10 text-accent"><Icon size={17} /></span><span className="flex-1"><span className="block text-xs font-semibold text-ink">{title}</span><span className="mt-1 block text-[10px] text-muted">{detail}</span></span><ChevronRight size={15} className="text-muted" /></button>)}
        </section>
        <button onClick={onLogout} className="flex w-full items-center gap-3 rounded-2xl border border-ink/10 bg-canvas p-4 text-left text-sm font-medium text-muted transition hover:border-accent hover:text-accent"><span className="grid h-9 w-9 place-items-center rounded-xl bg-accent/10 text-accent"><LogOut size={16} /></span><span className="flex-1">Cerrar sesión</span><ArrowRight size={15} /></button>
        <p className="flex items-center justify-center gap-1.5 text-[10px] text-muted"><UserRound size={12} /> Ritmo · Hecho con cariño</p>
      </aside>
    </div>
  )
}
