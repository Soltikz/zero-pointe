'use client'

import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import Link from 'next/link'

export default function WelcomePage() {
  const router = useRouter()

  useEffect(() => {
    if (document.cookie.includes('zero-pointe-visited=true')) {
      router.replace('/')
    }
  }, [router])

  function entrerSurLeSite() {
    const expiration = new Date()
    expiration.setFullYear(expiration.getFullYear() + 1)
    document.cookie = `zero-pointe-visited=true; expires=${expiration.toUTCString()}; path=/; SameSite=Lax`
    router.push('/')
  }

  return (
    <div className="h-screen overflow-hidden bg-[#0d0d0d] text-slate-200 font-sans flex flex-col">

      {/* Bruit de fond */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          backgroundSize: '200px 200px',
        }}
      />

      <div className="h-1 w-full flex-shrink-0 bg-gradient-to-r from-[#CA3C66] via-[#e05580] to-[#A7E0E0]" />

      {/* Corps — centré verticalement, prend tout l'espace restant */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 text-center relative">

        <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#A7E0E0] mb-4">
          Un projet entre amis · Finance &amp; Honte
        </p>

        <h1 className="text-5xl md:text-7xl font-black tracking-tighter leading-none text-white mb-3">
          Zéro <span className="text-[#CA3C66]">Pointé</span>
        </h1>

        <p className="text-lg md:text-xl text-zinc-400 font-light max-w-md mb-10 leading-relaxed">
          Le tribunal de la honte pour vos dépenses inutiles.
        </p>

        {/* Les 3 étapes */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 max-w-3xl w-full mb-10 text-left">
          <div className="bg-[#111111] border border-white/8 rounded-2xl p-5">
            <div className="text-[#CA3C66] text-2xl font-black mb-2">01</div>
            <h3 className="text-white font-bold text-xs uppercase tracking-wider mb-1.5">Tu craques</h3>
            <p className="text-zinc-500 text-xs leading-relaxed">
              Une dépense inutile, impulsive ou franchement honteuse. Tu la confesses sur le site.
            </p>
          </div>
          <div className="bg-[#111111] border border-white/8 rounded-2xl p-5">
            <div className="text-[#CA3C66] text-2xl font-black mb-2">02</div>
            <h3 className="text-white font-bold text-xs uppercase tracking-wider mb-1.5">Le groupe juge</h3>
            <p className="text-zinc-500 text-xs leading-relaxed">
              Tes amis votent : dépense validée ou carrément honteuse ? Le jury est sans pitié.
            </p>
          </div>
          <div className="bg-[#111111] border border-white/8 rounded-2xl p-5">
            <div className="text-[#CA3C66] text-2xl font-black mb-2">03</div>
            <h3 className="text-white font-bold text-xs uppercase tracking-wider mb-1.5">Le classement</h3>
            <p className="text-zinc-500 text-xs leading-relaxed">
              Chaque semaine, le pire craqueur est couronné. Peut-être que ça t'aidera à te tenir.
            </p>
          </div>
        </div>

        <button
          onClick={entrerSurLeSite}
          className="group px-9 py-3.5 bg-[#CA3C66] hover:bg-[#b8335a] text-white font-black uppercase tracking-widest text-sm rounded-2xl transition-all duration-200 hover:scale-105 active:scale-95 shadow-lg shadow-[#CA3C66]/20"
        >
          Entrer sur le site
          <span className="ml-3 opacity-60 group-hover:opacity-100 transition-opacity">→</span>
        </button>

        <p className="text-[11px] text-zinc-600 mt-4 max-w-sm leading-relaxed">
          En entrant, un cookie fonctionnel est déposé pour mémoriser cette visite.{' '} <br />
          <Link href="/confidentialite" className="text-zinc-500 underline underline-offset-2 hover:text-zinc-400 transition-colors">
            En savoir plus
          </Link>
          {' '}· <br />Connexion requise pour participer.
        </p>

      </div>

    </div>
  )
}