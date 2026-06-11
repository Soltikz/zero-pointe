// app/composants/BoutonDeconnexion.tsx
'use client'

import { signOut } from 'next-auth/react'

export default function BoutonDeconnexion() {
    return (
        <button
            onClick={() => signOut({ callbackUrl: '/' })} // Déconnecte et redirige vers l'accueil
            className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-bold uppercase tracking-wider rounded-xl transition-colors border border-white/5"
        >
            Se déconnecter
        </button>
    )
}