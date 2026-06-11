// app/composants/footer.tsx
import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="mt-auto bg-[#111111] border-t border-white/8 py-6">
      <div className="w-full px-8 flex flex-col md:flex-row justify-between items-center gap-3 text-xs tracking-wide">

        {/* Copyright */}
        <p className="text-zinc-500 font-medium text-center md:text-left">
          &copy; {new Date().getFullYear()} Zéro Pointé — Tout droit réservé.
        </p>

        {/* Liens */}
        <div className="flex items-center gap-5 text-[10px] uppercase tracking-wider font-semibold">
          <Link
            href="/confidentialite"
            className="text-zinc-600 hover:text-[#A7E0E0] transition-colors"
          >
            Confidentialité
          </Link>
          <span className="text-white/10">·</span>
          <span className="text-zinc-600">Mise à jour dimanche à 23h59</span>
        </div>

        {/* Signature */}
        <p className="text-zinc-700 normal-case text-center md:text-right">
          Fait avec soin
        </p>

      </div>
    </footer>
  )
}