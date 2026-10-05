import { useState } from 'react'
import { ArrowDownLeft, ArrowUpRight, Check, CircleHelp, CreditCard, Download, Plus, Wallet } from 'lucide-react'
import SectionHeading from '../components/SectionHeading.jsx'

const transactions = [
  { label: 'Señal del evento', detail: '17 oct · Clara & Álvaro', amount: '+ 300 €', type: 'in', status: 'Recibida' },
  { label: 'Segundo pago', detail: '31 oct · Lucía & Marcos', amount: '+ 250 €', type: 'in', status: 'Pendiente' },
]

export default function BudgetPage() {
  const [payments, setPayments] = useState(transactions)
  const [showForm, setShowForm] = useState(false)
  const [amount, setAmount] = useState('')
  const [label, setLabel] = useState('')
  const received = payments.filter((item) => item.status === 'Recibida').reduce((sum, item) => sum + Number(item.amount.replace(/[^\d]/g, '')), 0)
  const pending = payments.filter((item) => item.status === 'Pendiente').reduce((sum, item) => sum + Number(item.amount.replace(/[^\d]/g, '')), 0)

  function addPayment(event) {
    event.preventDefault()
    setPayments((current) => [{ label: label.trim(), detail: 'Nuevo movimiento', amount: `+ ${Number(amount).toLocaleString('es-ES')} €`, type: 'in', status: 'Pendiente' }, ...current])
    setAmount('')
    setLabel('')
    setShowForm(false)
  }

  return (
    <div className="space-y-7">
      <section className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl bg-ink p-5 text-canvas shadow-card sm:p-6">
          <span className="flex items-center gap-2 text-xs text-canvas/75"><Wallet size={15} /> TOTAL RECIBIDO</span>
          <p className="mt-4 font-display text-3xl">{received.toLocaleString('es-ES')} €</p>
          <p className="mt-2 text-xs text-canvas/75">de 1.200 € presupuestados</p>
          <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-canvas/15"><div className="h-full rounded-full bg-canvas/80" style={{ width: `${Math.min((received / 1200) * 100, 100)}%` }} /></div>
        </div>
        <div className="rounded-2xl border border-ink/10 bg-canvas p-5 shadow-card sm:p-6"><span className="flex items-center gap-2 text-xs text-muted"><ArrowDownLeft size={15} className="text-accent" /> POR COBRAR</span><p className="mt-4 font-display text-3xl text-ink">{pending.toLocaleString('es-ES')} €</p><p className="mt-2 text-xs text-muted">En pagos pendientes</p></div>
        <div className="rounded-2xl border border-ink/10 bg-canvas p-5 shadow-card sm:p-6"><span className="flex items-center gap-2 text-xs text-muted"><ArrowUpRight size={15} className="text-accent" /> GASTOS</span><p className="mt-4 font-display text-3xl text-ink">180 €</p><p className="mt-2 text-xs text-muted">Este mes</p></div>
      </section>
      <section className="rounded-2xl border border-ink/10 bg-canvas shadow-card">
        <div className="flex flex-wrap items-center justify-between gap-3 p-5 sm:px-6">
          <SectionHeading title="Movimientos" />
          <div className="mb-4 flex gap-2">
            <button onClick={() => setShowForm((value) => !value)} className="flex items-center gap-1.5 rounded-lg bg-accent px-3 py-2 text-xs font-semibold text-canvas hover:bg-ink"><Plus size={15} /> Añadir pago</button>
            <button onClick={() => window.print()} aria-label="Imprimir presupuesto" className="grid h-8 w-8 place-items-center rounded-lg border border-ink/10 text-muted hover:bg-accent/10"><Download size={15} /></button>
          </div>
        </div>
        {showForm && <form onSubmit={addPayment} className="flex flex-col gap-3 border-y border-ink/10 bg-accent/5 p-4 sm:flex-row sm:items-end"><label className="flex-1 text-[11px] font-medium text-muted">Concepto<input required value={label} onChange={(event) => setLabel(event.target.value)} placeholder="Por ejemplo: señal de la boda" className="mt-1.5 w-full rounded-lg border border-ink/15 bg-canvas px-3 py-2.5 text-xs text-ink outline-none focus:border-accent" /></label><label className="text-[11px] font-medium text-muted">Importe (€)<input required min="1" type="number" value={amount} onChange={(event) => setAmount(event.target.value)} placeholder="300" className="mt-1.5 block w-full rounded-lg border border-ink/15 bg-canvas px-3 py-2.5 text-xs text-ink outline-none focus:border-accent sm:w-32" /></label><button className="rounded-lg bg-accent px-4 py-2.5 text-xs font-semibold text-canvas">Guardar</button></form>}
        <div className="divide-y divide-ink/10">
          {payments.map((item, index) => <div key={`${item.label}-${index}`} className="flex items-center gap-3 px-5 py-4 sm:px-6"><span className="grid h-10 w-10 place-items-center rounded-xl bg-accent/10 text-accent">{item.status === 'Recibida' ? <Check size={18} /> : <CreditCard size={18} />}</span><span className="min-w-0 flex-1"><span className="block truncate text-sm font-semibold text-ink">{item.label}</span><span className="mt-1 block truncate text-xs text-muted">{item.detail}</span></span><span className="text-right"><span className="block text-sm font-semibold text-ink">{item.amount}</span><span className="mt-1 block text-[10px] text-accent">{item.status}</span></span></div>)}
        </div>
        <div className="flex items-start gap-2 border-t border-ink/10 px-5 py-4 text-[11px] leading-5 text-muted sm:px-6"><CircleHelp size={14} className="mt-0.5 shrink-0" /> Los importes son orientativos y puedes actualizarlos cuando quieras.</div>
      </section>
    </div>
  )
}
