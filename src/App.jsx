import { useEffect, useState } from 'react'
import AuthScreen from './components/AuthScreen.jsx'
import DashboardLayout from './components/DashboardLayout.jsx'
import { supabase } from './lib/supabase.js'

export default function App() {
  const [session, setSession] = useState(null)
  const [role, setRole] = useState(null)
  const [weddingId, setWeddingId] = useState(null)
  const [loading, setLoading] = useState(true)
  const [authError, setAuthError] = useState('')

  useEffect(() => {
    let mounted = true
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      if (mounted) {
        setSession(nextSession)
        setAuthError('')
      }
    })

    supabase.auth.getSession().then(({ data, error }) => {
      if (!mounted) return
      if (error) setAuthError(error.message)
      setSession(data.session)
      setLoading(false)
    })

    return () => {
      mounted = false
      subscription.unsubscribe()
    }
  }, [])

  useEffect(() => {
    let mounted = true

    async function loadAccess() {
      if (!session?.user) {
        setRole(null)
        setWeddingId(null)
        setLoading(false)
        return
      }

      setLoading(true)
      setAuthError('')

      const { data: roleRow, error: roleError } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', session.user.id)
        .maybeSingle()

      if (!mounted) return
      if (roleError) {
        setAuthError(`No se pudo comprobar el rol de la cuenta: ${roleError.message}`)
        setLoading(false)
        return
      }

      if (roleRow?.role === 'admin') {
        setRole('admin')
        setWeddingId(null)
        setLoading(false)
        return
      }

      const { data: membership, error: membershipError } = await supabase
        .from('wedding_members')
        .select('wedding_id')
        .eq('user_id', session.user.id)
        .maybeSingle()

      if (!mounted) return
      if (membershipError) {
        setAuthError(`No se pudo comprobar la invitación de la cuenta: ${membershipError.message}`)
      } else if (membership) {
        setRole('couple')
        setWeddingId(membership.wedding_id)
      } else {
        setRole(null)
        setWeddingId(null)
      }
      setLoading(false)
    }

    loadAccess()
    return () => {
      mounted = false
    }
  }, [session])

  async function login(credentials) {
    setAuthError('')
    const { error } = await supabase.auth.signInWithPassword(credentials)
    if (error) setAuthError(error.message)
  }

  async function logout() {
    const { error } = await supabase.auth.signOut()
    if (error) setAuthError(`No se pudo cerrar la sesión: ${error.message}`)
  }

  if (loading) {
    return <main className="grid min-h-dvh place-items-center bg-canvas text-sm text-muted">Conectando con Ritmo…</main>
  }

  if (!session) {
    return <AuthScreen onLogin={login} error={authError} />
  }

  if (!role) {
    return (
      <main className="grid min-h-dvh place-items-center bg-canvas px-5">
        <section className="max-w-md rounded-2xl border border-ink/10 bg-canvas p-7 text-center shadow-card">
          <h1 className="font-display text-2xl text-ink">Aún no tienes una boda vinculada</h1>
          <p className="mt-3 text-sm leading-6 text-muted">
            Esta cuenta necesita una invitación válida para acceder. Pide al DJ que te invite y vuelve a iniciar sesión.
          </p>
          {authError && <p role="alert" className="mt-4 text-sm text-red-700">{authError}</p>}
          <button onClick={logout} className="mt-6 rounded-xl bg-accent px-5 py-3 text-sm font-semibold text-canvas">
            Cerrar sesión
          </button>
        </section>
      </main>
    )
  }

  const user = {
    name: session.user.email?.split('@')[0] || 'Ritmo',
    email: session.user.email || '',
    role,
    weddingId,
  }

  return <DashboardLayout user={user} onLogout={logout} />
}
