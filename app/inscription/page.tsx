// app/inscription/page.tsx
// Page Inscription standalone – design harmonisé avec la charte Zéro Pointé
// (conservée pour compatibilité ; la logique principale est dans /auth)

'use client'

import { useState } from 'react'
import { inscriptionUser } from '@/app/actions/auth'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Footer from '../composants/footer'

export default function PageInscription() {
  const [erreur, setErreur] = useState('')
  const [succes, setSucces] = useState('')
  const router = useRouter()

  async function clientAction(formData: FormData) {
    setErreur('')
    setSucces('')

    const reponse = await inscriptionUser(formData)

    if (reponse?.error) {
      setErreur(reponse.error)
    } else if (reponse?.success) {
      setSucces(reponse.success)
      setTimeout(() => router.push('/auth'), 2000)
    }
  }

  const inputStyle = {
    background: "rgba(255,255,255,0.05)",
    border: "1px solid rgba(202,60,102,0.2)",
  }

  return (
    <div className="min-h-screen bg-[#080808] font-sans flex flex-col text-slate-200 w-full">

      {/* Liseré accent */}
      <div className="h-[3px] w-full bg-gradient-to-r from-[#CA3C66] via-[#e05580] to-[#A7E0E0] flex-shrink-0" />

      {/* ── Header ── */}
      <header className="bg-[#111111] border-b border-white/8 py-4 sm:py-5 sticky top-0 z-20 w-full backdrop-blur-md">
        <div className="w-full px-4 sm:px-8 flex items-center justify-between gap-3">
          <div>
            <h1 className="text-xl sm:text-2xl font-black tracking-tight text-[#CA3C66] leading-none">
              <Link href="/">Zéro Pointé</Link>
            </h1>
            <p className="text-[10px] text-[#A7E0E0] mt-1 tracking-widest uppercase font-semibold hidden sm:block">
              Le tribunal de la honte
            </p>
          </div>
          <Link
            href="/auth"
            className="flex items-center gap-1.5 text-xs text-zinc-500 hover:text-zinc-300 transition-colors font-semibold"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            Se connecter
          </Link>
        </div>
      </header>

      {/* ── Contenu centré ── */}
      <main className="flex-1 flex items-center justify-center px-4 py-10 sm:py-14">
        <div className="w-full max-w-sm flex flex-col gap-5">

          {/* Titre */}
          <div className="text-center">
            <p className="text-[9px] uppercase tracking-[0.3em] font-bold text-[#A7E0E0] mb-1.5">
              Rejoindre le tribunal
            </p>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              Inscription
            </h2>
          </div>

          {/* ── Carte formulaire ── */}
          <div
            className="rounded-2xl overflow-hidden"
            style={{
              background: "rgba(202,60,102,0.04)",
              border: "1px solid rgba(202,60,102,0.15)",
            }}
          >
            <form action={clientAction} className="p-5 flex flex-col gap-4">

              {/* Bandeau erreur */}
              {erreur && (
                <div className="flex items-start gap-2 rounded-xl px-4 py-3"
                  style={{ background: "rgba(202,60,102,0.08)", border: "1px solid rgba(202,60,102,0.20)" }}
                >
                  <svg className="w-4 h-4 text-[#ED93B1] flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  <p className="text-[#ED93B1] text-xs leading-relaxed">{erreur}</p>
                </div>
              )}

              {/* Bandeau succès */}
              {succes && (
                <div className="flex items-start gap-2 rounded-xl px-4 py-3"
                  style={{ background: "rgba(52,211,153,0.08)", border: "1px solid rgba(52,211,153,0.20)" }}
                >
                  <svg className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  <p className="text-emerald-400 text-xs leading-relaxed">{succes}</p>
                </div>
              )}

              {/* Pseudo */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[9px] uppercase tracking-[0.18em] font-bold" style={{ color: "#A7E0E0" }}>
                  Pseudo
                </label>
                <input
                  type="text"
                  name="pseudo"
                  required
                  autoComplete="username"
                  placeholder="Ton surnom au tribunal"
                  className="w-full rounded-xl px-3 py-2.5 text-sm text-white placeholder:text-zinc-600 focus:outline-none transition"
                  style={inputStyle}
                  onFocus={e => (e.currentTarget.style.borderColor = "rgba(202,60,102,0.6)")}
                  onBlur={e => (e.currentTarget.style.borderColor = "rgba(202,60,102,0.2)")}
                />
                <p className="text-[10px] text-zinc-600 leading-relaxed">
                  C'est ce que les autres verront. Tu pourras te connecter avec.
                </p>
              </div>

              {/* E-mail */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[9px] uppercase tracking-[0.18em] font-bold" style={{ color: "#A7E0E0" }}>
                  Adresse e-mail
                </label>
                <input
                  type="email"
                  name="email"
                  required
                  autoComplete="email"
                  placeholder="toi@exemple.fr"
                  className="w-full rounded-xl px-3 py-2.5 text-sm text-white placeholder:text-zinc-600 focus:outline-none transition"
                  style={inputStyle}
                  onFocus={e => (e.currentTarget.style.borderColor = "rgba(202,60,102,0.6)")}
                  onBlur={e => (e.currentTarget.style.borderColor = "rgba(202,60,102,0.2)")}
                />
              </div>

              {/* Mot de passe */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[9px] uppercase tracking-[0.18em] font-bold" style={{ color: "#A7E0E0" }}>
                  Mot de passe
                </label>
                <input
                  type="password"
                  name="password"
                  required
                  autoComplete="new-password"
                  placeholder="••••••••"
                  className="w-full rounded-xl px-3 py-2.5 text-sm text-white placeholder:text-zinc-600 focus:outline-none transition"
                  style={inputStyle}
                  onFocus={e => (e.currentTarget.style.borderColor = "rgba(202,60,102,0.6)")}
                  onBlur={e => (e.currentTarget.style.borderColor = "rgba(202,60,102,0.2)")}
                />
              </div>

              {/* Séparateur */}
              <div style={{ borderTop: "1px solid rgba(202,60,102,0.12)" }} />

              {/* Submit */}
              <button
                type="submit"
                className="w-full font-black text-[10px] uppercase tracking-wider py-3 rounded-xl transition-all duration-150 hover:scale-[1.02] active:scale-95"
                style={{
                  background: "#CA3C66",
                  color: "white",
                  boxShadow: "0 0 24px rgba(202,60,102,0.35)",
                }}
              >
                Rejoindre le tribunal
              </button>

              {/* Lien connexion */}
              <p className="text-[11px] text-center text-zinc-600">
                Déjà membre ?{' '}
                <Link href="/auth" className="text-[#A7E0E0] hover:text-white transition-colors font-bold">
                  Se connecter
                </Link>
              </p>
            </form>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  )
}