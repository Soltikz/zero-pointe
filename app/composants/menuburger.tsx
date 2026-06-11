'use client'

import { useState } from 'react'
import Link from 'next/link'
import BoutonDeconnexion from './boutondeco'

interface MenuMobileProps {
  session: any // Tu peux typer plus précisément selon ton setup NextAuth
}

export default function MenuMobile({ session }: MenuMobileProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="md:hidden flex items-center">
      {/* Bouton Burger */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="text-slate-200 hover:text-white p-2 focus:outline-none z-30"
        aria-label="Menu de navigation"
      >
        <svg
          className="h-6 w-6 transition-transform duration-200"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          {isOpen ? (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          ) : (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          )}
        </svg>
      </button>

      {/* Rideau / Overlay du Menu */}
      {isOpen && (
        <div className="fixed inset-0 top-[60px] bg-[#080808]/95 backdrop-blur-lg z-20 flex flex-col p-6 border-t border-white/5 animate-fade-in-down">
          <nav className="flex flex-col gap-4 w-full bg-[#111111] border border-white/8 rounded-2xl p-4">
            {session ? (
              <>
                <Link
                  href="/dashboard"
                  onClick={() => setIsOpen(false)}
                  className="w-full text-center px-4 py-3 bg-[#CA3C66] hover:bg-[#b8335a] text-white text-sm font-black uppercase tracking-wider rounded-xl transition-all"
                >
                  + Nouvelle Dépense
                </Link>
                <Link
                  href="/historique"
                  onClick={() => setIsOpen(false)}
                  className="w-full text-center px-4 py-3 bg-white/6 hover:bg-white/10 text-white text-sm font-bold uppercase tracking-wider rounded-xl border border-white/8"
                >
                  Historique
                </Link>
                <Link
                  href="/compte"
                  onClick={() => setIsOpen(false)}
                  className="w-full text-center px-4 py-3 bg-white/6 hover:bg-white/10 text-white text-sm font-bold uppercase tracking-wider rounded-xl border border-white/8"
                >
                  Compte
                </Link>
                <div className="mt-4 pt-4 border-t border-white/10 w-full flex justify-center" onClick={() => setIsOpen(false)}>
                  <BoutonDeconnexion />
                </div>
              </>
            ) : (
              <Link
                href="/auth"
                onClick={() => setIsOpen(false)}
                className="w-full text-center px-4 py-3 bg-[#CA3C66] hover:bg-[#b8335a] text-white text-sm font-black uppercase tracking-wider rounded-xl transition-all shadow-md shadow-[#CA3C66]/20"
              >
                Connexion
              </Link>
            )}
          </nav>
        </div>
      )}
    </div>
  )
}