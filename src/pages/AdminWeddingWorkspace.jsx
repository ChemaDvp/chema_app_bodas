import { useState } from 'react'
import { ArrowLeft, CalendarDays, Link2, Music2, Wallet } from 'lucide-react'
import { QRCodeSVG } from 'qrcode.react'
import { supabase } from '../lib/supabase.js'
import BudgetPage from './BudgetPage.jsx'
import RequestsPage from './RequestsPage.jsx'
import WeddingPage from './WeddingPage.jsx'

const tabs = [
  ['wedding', 'Boda', CalendarDays],
  ['songs', 'Canciones', Music2],
  ['budget', 'Presupuesto', Wallet],
  ['invite', 'Invitación', Link2],
]

export default function AdminWeddingWorkspace({ wedding, user, onBack }) {
  const [activeTab, setActiveTab] = useState('wedding')
  const [inviteUrl, setInviteUrl] = useState('')
  const [creatingInvite, setCreatingInvite] = useState(false)
  const [revokingInvite, setRevokingInvite] = useState(false)
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(false)

  async function createInvitation() {
    setCreatingInvite(true)
    setError('')
    setInviteUrl('')
    const { data, error: inviteError } = await supabase.rpc('create_wedding_invitation', {
      p_wedding_id: wedding.id,
    })
    if (inviteError) {
      setError(`No se pudo crear la invitación: ${inviteError.message}`)
    } else {
      const url = new URL(window.location.href)
      url.searchParams.set('invite', data)
      setInviteUrl(url.toString())
    }
    setCreatingInvite(false)
  }

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(inviteUrl)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 2000)
    } catch {
      setError('No se pudo copiar automáticamente. Selecciona y copia el enlace manualmente.')
    }
  }

  async function revokeInvitation() {
    setRevokingInvite(true)
    setError('')
    const { error: revokeError } = await supabase.rpc('revoke_wedding_invitations', {
      p_wedding_id: wedding.id,
    })
    if (revokeError) setError(`No se pudo revocar la invitación: ${revokeError.message}`)
    else {
      setInviteUrl('')
      setCopied(false)
    }
    setRevokingInvite(false)
  }

  const page = {
    wedding: <WeddingPage weddingId={wedding.id} user={user} />,
    songs: <RequestsPage weddingId={wedding.id} user={user} />,
    budget: <BudgetPage weddingId={wedding.id} user={user} />,
    invite: (
      <section className="mx-auto max-w-2xl rounded-2xl border border-ink/10 bg-canvas p-5 shadow-card sm:p-8">
        <h2 className="font-display text-2xl text-ink">Invitar a {wedding.partner_names}</h2>
        <p className="mt-2 text-sm leading-6 text-muted">Genera un enlace de un solo uso válido durante 7 días y compártelo como enlace o QR. La persona debe tener una cuenta de Auth creada mediante invitación desde Supabase → Authentication → Users; el registro público permanece desactivado. Generar un nuevo enlace invalida las invitaciones anteriores aún no utilizadas.</p>
        <button disabled={creatingInvite} onClick={createInvitation} className="mt-5 rounded-xl bg-accent px-5 py-3 text-sm font-semibold text-canvas disabled:opacity-60">
          {creatingInvite ? 'Generando…' : 'Generar enlace y QR'}
        </button>
        {error && <p role="alert" className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}
        {inviteUrl && <div className="mt-6 grid gap-5 rounded-xl bg-accent/5 p-5 sm:grid-cols-[auto_1fr] sm:items-center">
          <div className="w-fit rounded-lg bg-white p-3"><QRCodeSVG value={inviteUrl} size={176} level="M" /></div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-ink">Invitación de un solo uso</p>
            <p className="mt-2 break-all text-xs leading-5 text-muted">{inviteUrl}</p>
            <button onClick={copyLink} className="mt-4 rounded-lg border border-ink/10 px-3 py-2 text-xs font-semibold text-ink">{copied ? 'Enlace copiado' : 'Copiar enlace'}</button>
            <p className="mt-3 text-xs text-muted">No publiques este QR: quien lo canjee primero vinculará su cuenta a esta boda.</p>
          </div>
        </div>}
        <button disabled={revokingInvite} onClick={revokeInvitation} className="mt-4 text-xs font-medium text-red-700 underline disabled:opacity-50">
          {revokingInvite ? 'Revocando…' : 'Revocar enlaces pendientes'}
        </button>
      </section>
    ),
  }[activeTab]

  return (
    <div className="space-y-5">
      <button onClick={onBack} className="inline-flex items-center gap-2 text-sm font-medium text-muted hover:text-accent"><ArrowLeft size={16} />Todas las bodas</button>
      <div className="rounded-2xl border border-ink/10 bg-canvas p-4 shadow-card sm:p-5">
        <p className="text-xs font-semibold uppercase tracking-[.14em] text-accent">Gestión de boda</p>
        <h2 className="mt-1 font-display text-2xl text-ink">{wedding.partner_names}</h2>
        <div className="mt-4 flex flex-wrap gap-2">
          {tabs.map(([id, label, Icon]) => (
            <button key={id} onClick={() => setActiveTab(id)} className={`inline-flex items-center gap-2 rounded-lg px-3 py-2.5 text-xs font-semibold ${activeTab === id ? 'bg-accent text-canvas' : 'bg-accent/5 text-muted hover:text-ink'}`}><Icon size={14} />{label}</button>
          ))}
        </div>
      </div>
      {page}
    </div>
  )
}
