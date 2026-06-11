// Page Accueil – design harmonisé Zéro Pointé
// Améliorations : hero section pour visiteurs non connectés, spacing affiné

import Link from 'next/link'
import prisma from '@/lib/prisma'
import FluxCaniveauClient from './composants/craquagesupp'
import { getServerSession } from 'next-auth'
import BoutonDeconnexion from './composants/boutondeco'
import Footer from './composants/footer'
import MenuMobile from './composants/menuburger' // <-- Nouvel import

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getLimitesSemaine() {
  const maintenant = new Date()
  const lundi = new Date(maintenant)
  const jour = lundi.getDay()
  const décalage = jour === 0 ? -6 : 1 - jour
  lundi.setDate(lundi.getDate() + décalage)
  lundi.setHours(0, 0, 0, 0)
  const dimanche = new Date(lundi)
  dimanche.setDate(dimanche.getDate() + 6)
  dimanche.setHours(23, 59, 59, 999)
  return { lundi, dimanche }
}

async function getDepensesSemaine() {
  const { lundi, dimanche } = getLimitesSemaine()
  const depenses = await prisma.depense.findMany({
    where:   { creerLe: { gte: lundi, lte: dimanche } },
    include: { votes: { select: { type: true } } },
  })
  return depenses
    .map((d) => ({
      ...d,
      rejets:      d.votes.filter((v) => v.type === 'SHAMEFUL').length,
      approbations: d.votes.filter((v) => v.type === 'VALIDATED').length,
    }))
    .sort((a, b) => b.rejets - a.rejets)
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function PageAccueil() {
  const [toutesLesDepenses, session] = await Promise.all([
    getDepensesSemaine(),
    getServerSession(),
  ])

  return (
    <div className="min-h-screen bg-[#080808] font-sans flex flex-col text-slate-200 w-full">

      {/* Liseré accent */}
      <div className="h-[3px] w-full bg-gradient-to-r from-[#CA3C66] via-[#e05580] to-[#A7E0E0] flex-shrink-0" />

      {/* ── Header ── */}
      <header className="bg-[#111111] border-b border-white/8 py-4 sm:py-5 sticky top-0 z-20 w-full backdrop-blur-md">
        <div className="w-full px-4 sm:px-8 flex justify-between items-center gap-3">

          {/* Logo */}
          <div className="flex-shrink-0">
            <h1 className="text-xl sm:text-2xl font-black tracking-tight text-[#CA3C66] leading-none">
              <Link href="/">Zéro Pointé</Link>
            </h1>
            <p className="text-[10px] text-[#A7E0E0] mt-1 tracking-widest uppercase font-semibold hidden sm:block">
              Le tribunal de la honte
            </p>
          </div>

          {/* Navigation Desktop (Cachée sur mobile via md:flex) */}
          <div className="hidden md:flex items-center">
            {session ? (
              <nav className="flex items-center gap-2 flex-wrap justify-end">
                <Link
                  href="/dashboard"
                  className="px-4 py-2 bg-[#CA3C66] hover:bg-[#b8335a] text-white text-xs font-black uppercase tracking-wider rounded-xl transition-all duration-150 shadow-md shadow-[#CA3C66]/20"
                >
                  + Dépense
                </Link>
                <Link
                  href="/historique"
                  className="px-4 py-2 bg-white/6 hover:bg-white/10 text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-colors border border-white/8"
                >
                  Historique
                </Link>
                <Link
                  href="/compte"
                  className="px-4 py-2 bg-white/6 hover:bg-white/10 text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-colors border border-white/8"
                >
                  Compte
                </Link>
                <BoutonDeconnexion />
              </nav>
            ) : (
              <Link
                href="/auth"
                className="px-4 py-2 bg-[#CA3C66] hover:bg-[#b8335a] text-white text-xs font-black uppercase tracking-wider rounded-xl transition-all duration-150 shadow-md shadow-[#CA3C66]/20 flex-shrink-0"
              >
                Connexion
              </Link>
            )}
          </div>

          {/* Navigation Mobile (Burger injecté ici, visible uniquement sur petits écrans) */}
          <MenuMobile session={session} />

        </div>
      </header>

      {/* ── Hero pour visiteurs non connectés ── */}
      {!session && (
        <section className="w-full px-4 sm:px-8 pt-10 pb-6">
          <div
            className="w-full rounded-2xl px-6 py-8 sm:py-10 flex flex-col sm:flex-row items-center justify-between gap-6"
            style={{
              background: 'linear-gradient(135deg, rgba(202,60,102,0.08) 0%, rgba(167,224,224,0.04) 100%)',
              border:     '1px solid rgba(202,60,102,0.2)',
            }}
          >
            <div className="flex flex-col gap-3 text-center sm:text-left">
              <h2 className="text-xl sm:text-2xl font-black text-white leading-tight">
                Juge les craquages de la semaine.
                <br />
                <span style={{ color: '#CA3C66' }}>Voter. Condamner. Rigoler.</span>
              </h2>
            </div>
            <Link
              href="/auth"
              className="px-6 py-3 bg-[#CA3C66] hover:bg-[#b8335a] text-white text-xs font-black uppercase tracking-wider rounded-xl transition-all duration-150 shadow-lg shadow-[#CA3C66]/30 flex-shrink-0 whitespace-nowrap"
            >
              Rejoindre le tribunal →
            </Link>
          </div>
        </section>
      )}

      {/* ── Main ── */}
      <main className="flex-1 w-full px-4 sm:px-8 py-8 flex flex-col gap-6">

        {/* Titre de section */}
        <div className="flex items-center justify-between border-b border-white/8 pb-4 w-full gap-3">
          <div>
            <p className="text-[9px] uppercase tracking-[0.2em] font-bold text-[#A7E0E0] mb-1">
              Semaine en cours
            </p>
            <h2 className="text-base sm:text-lg font-black text-white tracking-tight leading-none">
              Les craquages du tribunal
            </h2>
          </div>
          {toutesLesDepenses.length > 0 && (
            <span className="text-[10px] text-white-30/4 font-semibold bg-white30/3 border border-white/8 px-2.5 py-1 rounded-lg flex-shrink-0">
              {toutesLesDepenses.length} dossier{toutesLesDepenses.length > 1 ? 's' : ''}
            </span>
          )}
        </div>

        {/* Flux de votes */}
        <FluxCaniveauClient depensesInitiales={toutesLesDepenses} />

      </main>

      <Footer />
    </div>
  )
}