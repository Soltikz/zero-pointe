// app/confidentialite/page.tsx
import Link from 'next/link'
import Footer from '../composants/footer'
import BoutonRetour from '../composants/boutonretour'

export default function PolitiqueConfidentialite() {
  const dateMAJ = new Date().toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  return (
    <div className="min-h-screen w-full bg-[#080808] text-slate-200 font-sans flex flex-col">

      {/* Liseré accent */}
      <div className="h-[3px] w-full bg-gradient-to-r from-[#CA3C66] via-[#e05580] to-[#A7E0E0]" />

      {/* Header cohérent avec le reste du site */}
      <header
        className="sticky top-0 z-10 w-full py-4"
        style={{
          background: "rgba(13,13,13,0.85)",
          backdropFilter: "blur(12px)",
          borderBottom: "1px solid rgba(202,60,102,0.15)",
        }}
      >
        <div className="w-full px-4 sm:px-8 flex justify-between items-center">
          <div className="flex items-center gap-3 sm:gap-4 min-w-0">
            <BoutonRetour />
            <div>
              <h1 className="text-xl sm:text-2xl font-black tracking-tight text-[#CA3C66] leading-none">
                <Link href="/">Zéro Pointé</Link>
              </h1>
              <p className="text-[10px] text-[#A7E0E0] mt-1 tracking-widest uppercase font-semibold hidden sm:block">
                Le tribunal de la honte
              </p>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 w-full px-8 py-10 flex flex-col gap-10">

        {/* En-tête de page */}
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#A7E0E0] mb-3">
            Légal
          </p>
          <h2 className="text-3xl md:text-4xl font-black tracking-tight text-white">
            Politique de confidentialité
          </h2>
          <p className="text-zinc-500 text-sm mt-2">
            Dernière mise à jour : {dateMAJ}
          </p>
        </div>

        {/* Cookie fonctionnel */}
        <section className="bg-[#111111] border border-white/8 rounded-2xl overflow-hidden">
          <div className="px-6 py-4 border-b border-white/8 bg-white/[0.02] flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-[#CA3C66]" />
            <p className="text-[11px] uppercase tracking-[2.5px] text-zinc-300 font-extrabold">
              Cookie de navigation
            </p>
          </div>
          <div className="p-6 flex flex-col gap-5">
            <p className="text-zinc-400 text-sm leading-relaxed">
              Zéro Pointé dépose un seul cookie sur votre appareil, nommé{' '}
              <code className="text-[#A7E0E0] bg-white/5 px-1.5 py-0.5 rounded text-xs font-mono">
                zero-pointe-visited
              </code>.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {[
                {
                  label: 'Finalité',
                  value:
                    "Mémoriser que vous avez déjà consulté la page de présentation, afin de ne pas vous l'afficher à nouveau.",
                },
                {
                  label: 'Durée',
                  value: '1 an à compter de votre première visite.',
                },
                {
                  label: 'Données collectées',
                  value: 'Aucune donnée personnelle. La valeur stockée est simplement true.',
                },
                {
                  label: 'Partagé avec des tiers ?',
                  value: "Non. Ce cookie reste sur votre appareil et n'est lu que par notre site.",
                },
              ].map(({ label, value }) => (
                <div key={label} className="bg-[#0d0d0d] border border-white/6 rounded-xl p-4">
                  <p className="text-[9px] uppercase tracking-[2px] text-[#A7E0E0] font-bold mb-2">
                    {label}
                  </p>
                  <p className="text-zinc-300 text-sm leading-relaxed">{value}</p>
                </div>
              ))}
            </div>
            <p className="text-zinc-600 text-xs leading-relaxed border-t border-white/5 pt-4">
              Ce cookie est strictement fonctionnel au sens de la loi Informatique et Libertés et des
              recommandations de la CNIL. Il est exempté de consentement préalable conformément à
              l'article 82 de la loi Informatique et Libertés.
            </p>
          </div>
        </section>

        {/* Supprimer le cookie */}
        <section className="bg-[#111111] border border-white/8 rounded-2xl overflow-hidden">
          <div className="px-6 py-4 border-b border-white/8 bg-white/[0.02]">
            <p className="text-[11px] uppercase tracking-[2.5px] text-zinc-300 font-extrabold">
              Supprimer ce cookie
            </p>
          </div>
          <div className="p-6">
            <p className="text-zinc-400 text-sm leading-relaxed max-w-3xl">
              Vous pouvez supprimer ce cookie à tout moment depuis les paramètres de votre navigateur
              (section "Cookies" ou "Historique de navigation"). Après suppression, la page de
              présentation vous sera à nouveau affichée lors de votre prochaine visite.
            </p>
          </div>
        </section>

        {/* Données de compte */}
        <section className="bg-[#111111] border border-white/8 rounded-2xl overflow-hidden">
          <div className="px-6 py-4 border-b border-white/8 bg-white/[0.02]">
            <p className="text-[11px] uppercase tracking-[2.5px] text-zinc-300 font-extrabold">
              Données de compte
            </p>
          </div>
          <div className="p-6 flex flex-col gap-3">
            <p className="text-zinc-400 text-sm leading-relaxed max-w-3xl">
              Si vous créez un compte, votre adresse e-mail et votre nom d'utilisateur sont stockés
              pour vous permettre de vous connecter et de participer. Ces données sont uniquement
              utilisées dans le cadre du fonctionnement du site et ne sont jamais revendues ni
              partagées avec des tiers.
            </p>
            <p className="text-zinc-400 text-sm leading-relaxed max-w-3xl">
              Pour demander la suppression de votre compte et de vos données, rendez-vous dans la
              section{' '}
              <strong className="text-zinc-300">Compte → Supprimer mon compte</strong>.
            </p>
          </div>
        </section>

        {/* Contact */}
        <section className="bg-[#111111] border border-white/8 rounded-2xl overflow-hidden">
          <div className="px-6 py-4 border-b border-white/8 bg-white/[0.02]">
            <p className="text-[11px] uppercase tracking-[2.5px] text-zinc-300 font-extrabold">
              Contact
            </p>
          </div>
          <div className="p-6">
            <p className="text-zinc-400 text-sm leading-relaxed max-w-3xl">
              Pour toute question relative à vos données personnelles, vous pouvez nous contacter
              directement via le site. Ce projet est un projet personnel entre amis, sans activité
              commerciale.
            </p>
          </div>
        </section>

      </main>

      <Footer />
    </div>
  )
}