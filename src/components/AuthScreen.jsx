import { useState } from 'react'
import { ArrowRight, Check, Headphones, Heart, Music2, Sparkles } from 'lucide-react'

export default function AuthScreen({ onLogin }) {
  const [mode, setMode] = useState('login')
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const isRegister = mode === 'register'

  function handleSubmit(event) {
    event.preventDefault()
    onLogin({ name: name.trim() || 'Alex', email })
  }

  return (
    <main className="min-h-screen bg-white lg:grid lg:grid-cols-[1fr_1fr]">
      <section className="relative flex min-h-[300px] items-center overflow-hidden bg-[#29233f] px-7 py-12 text-white sm:min-h-[390px] sm:px-12 lg:min-h-screen lg:px-16">
        <div className="absolute -right-24 -top-28 h-80 w-80 rounded-full bg-[#7260ce]/30 blur-3xl" />
        <div className="absolute -bottom-28 -left-24 h-80 w-80 rounded-full bg-[#d29a8e]/20 blur-3xl" />
        <div className="relative mx-auto w-full max-w-lg">
          <div className="mb-12 flex items-center gap-3 lg:mb-20">
            <span className="grid h-11 w-11 place-items-center rounded-2xl bg-white/10 text-[#d8ceff]">
              <Music2 size={23} />
            </span>
            <span className="font-display text-2xl tracking-wide">ritmo</span>
          </div>
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1.5 text-xs text-[#ded8ef]">
            <Sparkles size={14} className="text-[#e8c8a7]" />
            Vuestra historia, vuestra música
          </div>
          <h1 className="max-w-md font-display text-4xl leading-[1.1] sm:text-5xl lg:text-6xl">
            Cada momento merece su canción.
          </h1>
          <p className="mt-5 max-w-sm text-sm leading-6 text-[#c3bfd1] sm:text-base">
            Un espacio bonito y sencillo para organizar la banda sonora de vuestro gran día.
          </p>
          <div className="mt-9 flex items-center gap-3 text-sm text-[#dfdbea]">
            <div className="flex -space-x-2">
              {['C', 'M', 'A'].map((letter, index) => (
                <span key={letter} className={`grid h-8 w-8 place-items-center rounded-full border-2 border-[#29233f] text-xs font-semibold text-white ${['bg-[#c98792]', 'bg-[#917dbd]', 'bg-[#c89c6d]'][index]}`}>
                  {letter}
                </span>
              ))}
            </div>
            <span>Hecho con cariño para vuestro día</span>
            <Heart size={14} className="fill-[#e8a2ac] text-[#e8a2ac]" />
          </div>
          <div className="mt-12 hidden max-w-md rounded-2xl border border-white/10 bg-white/[0.06] p-5 backdrop-blur-sm lg:block">
            <div className="flex items-center gap-3">
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-[#d7c8f5]/15 text-[#d7c8f5]"><Headphones size={19} /></span>
              <div>
                <p className="text-sm font-medium">Un día, una playlist inolvidable</p>
                <p className="mt-1 text-xs text-[#bcb7cc]">Desde el sí, quiero hasta el último baile.</p>
              </div>
              <Check size={17} className="ml-auto text-[#b8e2c7]" />
            </div>
          </div>
        </div>
      </section>

      <section className="flex items-center justify-center px-6 py-12 sm:px-10 lg:px-16">
        <div className="w-full max-w-md">
          <p className="text-sm font-medium text-lilac">TU ESPACIO PERSONAL</p>
          <h2 className="mt-3 font-display text-3xl text-ink sm:text-4xl">
            {isRegister ? 'Empezamos vuestra historia' : 'Qué alegría verte'}
          </h2>
          <p className="mt-3 text-sm leading-6 text-muted">
            {isRegister ? 'Crea tu cuenta y empieza a preparar cada detalle.' : 'Entra para seguir dando forma a vuestro gran día.'}
          </p>
          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            {isRegister && (
              <label className="block text-sm font-medium text-ink">
                Tu nombre
                <input
                  required
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  placeholder="¿Cómo te llamas?"
                  className="mt-2 w-full rounded-xl border border-[#e9e7ef] bg-white px-4 py-3.5 font-normal outline-none transition placeholder:text-[#b3b0bf] focus:border-lilac focus:ring-4 focus:ring-lilac/10"
                />
              </label>
            )}
            <label className="block text-sm font-medium text-ink">
              Correo electrónico
              <input
                required
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="hola@ejemplo.com"
                className="mt-2 w-full rounded-xl border border-[#e9e7ef] bg-white px-4 py-3.5 font-normal outline-none transition placeholder:text-[#b3b0bf] focus:border-lilac focus:ring-4 focus:ring-lilac/10"
              />
            </label>
            <label className="block text-sm font-medium text-ink">
              Contraseña
              <input
                required
                type="password"
                minLength={6}
                placeholder="Al menos 6 caracteres"
                className="mt-2 w-full rounded-xl border border-[#e9e7ef] bg-white px-4 py-3.5 font-normal outline-none transition placeholder:text-[#b3b0bf] focus:border-lilac focus:ring-4 focus:ring-lilac/10"
              />
            </label>
            <button type="submit" className="flex w-full items-center justify-center gap-2 rounded-xl bg-lilac px-5 py-3.5 text-sm font-semibold text-white shadow-float transition hover:bg-[#6551c6] active:scale-[.99]">
              {isRegister ? 'Crear mi cuenta' : 'Entrar a mi espacio'} <ArrowRight size={17} />
            </button>
          </form>
          <p className="mt-6 text-center text-sm text-muted">
            {isRegister ? '¿Ya tienes cuenta?' : '¿Todavía no tienes cuenta?'}{' '}
            <button type="button" onClick={() => setMode(isRegister ? 'login' : 'register')} className="font-semibold text-lilac hover:text-[#5140aa]">
              {isRegister ? 'Inicia sesión' : 'Regístrate'}
            </button>
          </p>
          <p className="mt-9 text-center text-xs leading-5 text-[#aaa7b4]">
            Al continuar, aceptas nuestros términos y nuestra política de privacidad.
          </p>
        </div>
      </section>
    </main>
  )
}
