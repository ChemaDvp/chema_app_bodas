import { useEffect, useState } from 'react'
import { ArrowRight, Check, Headphones, Heart, Music2, Sparkles } from 'lucide-react'

const backgroundImage = `${import.meta.env.BASE_URL}images/img-0635.jpg`

export default function AuthScreen({
  onLogin,
  onRequestPasswordReset,
  onUpdatePassword,
  recoveryMode = false,
  error,
}) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [view, setView] = useState(recoveryMode ? 'recovery' : 'login')
  const [message, setMessage] = useState('')

  useEffect(() => {
    if (recoveryMode) setView('recovery')
  }, [recoveryMode])

  async function handleSubmit(event) {
    event.preventDefault()
    setSubmitting(true)
    try {
      if (view === 'recovery') {
        if (password !== confirmPassword) {
          setMessage('Las contraseñas no coinciden.')
          return
        }
        if (await onUpdatePassword(password)) {
          setMessage('Contraseña actualizada. Ya puedes continuar.')
        }
      } else if (view === 'reset') {
        if (await onRequestPasswordReset(email.trim())) {
          setView('sent')
          setMessage('Si existe una cuenta con ese correo, recibirás un enlace para cambiar la contraseña.')
        }
      } else {
        await onLogin({ email: email.trim(), password })
      }
    } finally {
      setSubmitting(false)
    }
  }

  const isRecovery = view === 'recovery'
  const isReset = view === 'reset'
  const isSent = view === 'sent'

  return (
    <main
      className="relative flex min-h-dvh items-center justify-center overflow-hidden bg-ink px-4 py-6 sm:px-8 sm:py-10"
      style={{
        backgroundImage: `linear-gradient(rgba(41, 42, 38, 0.32), rgba(41, 42, 38, 0.5)), url("${backgroundImage}")`,
        backgroundPosition: 'center',
        backgroundSize: 'cover',
      }}
    >
      <section className="w-full max-w-md rounded-[28px] border border-canvas/35 bg-canvas/[0.85] p-6 shadow-2xl backdrop-blur-md sm:p-9">
        <div className="mb-8 flex items-center gap-3">
          <span className="grid h-11 w-11 place-items-center rounded-2xl bg-accent text-canvas">
            <Music2 size={22} />
          </span>
          <span className="font-display text-2xl tracking-wide text-ink">ritmo</span>
        </div>

        <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-accent/20 bg-accent/10 px-3 py-1.5 text-xs font-medium text-ink">
          <Sparkles size={14} className="text-accent" />
          Vuestra historia, vuestra música
        </div>
        <h1 className="font-display text-3xl leading-tight text-ink sm:text-4xl">
          Cada momento merece su canción.
        </h1>
        <p className="mt-3 text-sm leading-6 text-muted">
          Un espacio bonito y sencillo para organizar la banda sonora de vuestro gran día.
        </p>

        <div className="my-6 flex items-center gap-2 text-xs text-muted">
          <Heart size={15} className="shrink-0 text-accent" />
          Hecho con cariño para vuestro día.
        </div>

        <div className="mb-7 h-px bg-ink/10" />
        <p className="text-xs font-semibold tracking-[.14em] text-accent">TU ESPACIO PERSONAL</p>
        <h2 className="mt-2 font-display text-2xl text-ink">
          {isRecovery ? 'Elige una nueva contraseña' : isReset ? 'Recupera tu acceso' : isSent ? 'Revisa tu correo' : 'Qué alegría verte'}
        </h2>
        <p className="mt-2 text-sm leading-6 text-muted">
          {isRecovery
            ? 'Crea una contraseña nueva para tu cuenta.'
            : isReset
              ? 'Te enviaremos un enlace para restablecer la contraseña.'
              : isSent
                ? 'Sigue el enlace del correo para continuar.'
                : 'Entra para seguir dando forma a vuestro gran día.'}
        </p>

        {!isSent && (
          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            {!isRecovery && (
              <label className="block text-sm font-medium text-ink">
                Correo electrónico
                <input
                  required
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="hola@ejemplo.com"
                  className="mt-2 w-full rounded-xl border border-ink/15 bg-canvas/70 px-4 py-3.5 font-normal text-ink outline-none transition placeholder:text-muted/75 focus:border-accent focus:ring-4 focus:ring-accent/10"
                />
              </label>
            )}
            {!isReset && (
              <label className="block text-sm font-medium text-ink">
                {isRecovery ? 'Nueva contraseña' : 'Contraseña'}
                <input
                  required
                  minLength={8}
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="Al menos 8 caracteres"
                  className="mt-2 w-full rounded-xl border border-ink/15 bg-canvas/70 px-4 py-3.5 font-normal text-ink outline-none transition placeholder:text-muted/75 focus:border-accent focus:ring-4 focus:ring-accent/10"
                />
              </label>
            )}
            {isRecovery && (
              <label className="block text-sm font-medium text-ink">
                Repite la nueva contraseña
                <input
                  required
                  minLength={8}
                  type="password"
                  value={confirmPassword}
                  onChange={(event) => setConfirmPassword(event.target.value)}
                  placeholder="Repite la contraseña"
                  className="mt-2 w-full rounded-xl border border-ink/15 bg-canvas/70 px-4 py-3.5 font-normal text-ink outline-none transition placeholder:text-muted/75 focus:border-accent focus:ring-4 focus:ring-accent/10"
                />
              </label>
            )}
          {error && <p role="alert" className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}
            {message && <p role="status" className="rounded-xl bg-accent/10 px-4 py-3 text-sm text-ink">{message}</p>}
            <button disabled={submitting} type="submit" className="flex w-full items-center justify-center gap-2 rounded-xl bg-accent px-5 py-3.5 text-sm font-semibold text-canvas shadow-card transition hover:bg-ink active:scale-[.99] disabled:cursor-not-allowed disabled:opacity-60">
              {submitting ? 'Un momento…' : isRecovery ? 'Guardar nueva contraseña' : isReset ? 'Enviar enlace' : 'Entrar a mi espacio'} <ArrowRight size={17} />
            </button>
          </form>
        )}
        {isSent && message && <p role="status" className="mt-6 rounded-xl bg-accent/10 px-4 py-3 text-sm leading-5 text-ink">{message}</p>}

        {!isRecovery && !isSent && (
          <div className="mt-5 flex items-center justify-center gap-2 text-xs text-muted">
            {!isReset && <span>¿Olvidaste tu contraseña?</span>}
            <button
              type="button"
              onClick={() => {
                setMessage('')
                setView(isReset ? 'login' : 'reset')
              }}
              className="font-semibold text-accent hover:text-ink"
            >
              {isReset ? 'Volver al inicio de sesión' : 'Restablecerla'}
            </button>
          </div>
        )}
        {isSent && (
          <button type="button" onClick={() => setView('login')} className="mt-5 block w-full text-center text-xs font-semibold text-accent hover:text-ink">
            Volver al inicio de sesión
          </button>
        )}
        <div className="mt-6 flex items-center justify-center gap-2 text-[11px] text-muted">
          <Headphones size={13} />
          Un día, una playlist inolvidable.
          <Check size={13} className="text-accent" />
        </div>
      </section>
    </main>
  )
}
