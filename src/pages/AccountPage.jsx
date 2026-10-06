import { ArrowRight, LogOut, ShieldCheck } from 'lucide-react'

export default function AccountPage({ user, onLogout }) {
  if (user.role === 'admin') {
    return (
      <div className="mx-auto grid max-w-xl gap-5">
        <section className="rounded-2xl border border-ink/10 bg-canvas p-6 shadow-card sm:p-8">
          <span className="grid h-12 w-12 place-items-center rounded-2xl bg-accent/10 text-accent"><ShieldCheck size={22} /></span>
          <h2 className="mt-5 font-display text-2xl text-ink">Cuenta de administración</h2>
          <p className="mt-2 text-sm text-muted">Sesión iniciada como administrador de Ritmo.</p>
          <p className="mt-5 break-all rounded-xl bg-accent/5 px-4 py-3 text-sm text-ink">{user.email}</p>
        </section>
        <button onClick={onLogout} className="flex w-full items-center gap-3 rounded-2xl border border-ink/10 bg-canvas p-4 text-left text-sm font-medium text-muted transition hover:border-accent hover:text-accent">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-accent/10 text-accent"><LogOut size={16} /></span>
          <span className="flex-1">Cerrar sesión</span>
          <ArrowRight size={15} />
        </button>
      </div>
    )
  }

  return (
    <div className="mx-auto grid max-w-xl gap-5">
      <section className="rounded-2xl border border-ink/10 bg-canvas p-6 shadow-card sm:p-8">
        <span className="grid h-12 w-12 place-items-center rounded-2xl bg-accent/10 text-accent"><ShieldCheck size={22} /></span>
        <h2 className="mt-5 font-display text-2xl text-ink">Vuestra cuenta</h2>
        <p className="mt-2 text-sm text-muted">Los datos de la boda y las condiciones se consultan en sus apartados. Para solicitar cambios, contactad con el DJ.</p>
        <p className="mt-5 break-all rounded-xl bg-accent/5 px-4 py-3 text-sm text-ink">{user.email}</p>
      </section>
      <button onClick={onLogout} className="flex w-full items-center gap-3 rounded-2xl border border-ink/10 bg-canvas p-4 text-left text-sm font-medium text-muted transition hover:border-accent hover:text-accent">
        <span className="grid h-9 w-9 place-items-center rounded-xl bg-accent/10 text-accent"><LogOut size={16} /></span>
        <span className="flex-1">Cerrar sesión</span>
        <ArrowRight size={15} />
      </button>
    </div>
  )
}
