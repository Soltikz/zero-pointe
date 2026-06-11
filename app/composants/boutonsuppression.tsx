"use client"

import { useState } from "react"
import { signOut } from "next-auth/react"

export default function BoutonSuppression() {
    const [ouvert, setOuvert] = useState(false)
    const [chargement, setChargement] = useState(false)
    const [erreur, setErreur] = useState<string | null>(null)

    async function supprimerCompte() {
        setChargement(true)
        setErreur(null)
        try {
            const res = await fetch("/api/compte/supprimer", { method: "DELETE" })
            if (!res.ok) throw new Error("Erreur lors de la suppression")
            await signOut({ callbackUrl: "/" })
        } catch {
            setErreur("Une erreur est survenue. Réessaie.")
            setChargement(false)
        }
    }

    return (
        <>
            <button
                onClick={() => setOuvert(true)}
                className="w-full px-4 py-2.5 bg-red-500/8 hover:bg-red-500/12 border border-red-500/20 hover:border-red-500/30 rounded-xl text-red-400 text-sm font-medium flex items-center justify-center gap-2 transition-all duration-150 whitespace-nowrap"
            >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                Supprimer mon compte
            </button>

            {/* Modale */}
            {ouvert && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center px-4"
                    style={{ background: "rgba(0,0,0,0.75)" }}
                    onClick={(e) => { if (e.target === e.currentTarget) setOuvert(false) }}
                >
                    <div className="w-full max-w-xs bg-[#161616] border border-white/[0.08] rounded-2xl overflow-hidden">

                        {/* Icône + titre */}
                        <div className="flex flex-col items-center gap-3 px-6 pt-6 pb-4 text-center">
                            <div className="w-12 h-12 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center">
                                <svg className="w-5 h-5 text-red-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                </svg>
                            </div>
                            <div>
                                <p className="text-white font-bold text-base">Supprimer le compte ?</p>
                                <p className="text-zinc-500 text-xs mt-1.5 leading-relaxed">
                                    Tous tes votes, commentaires et données seront{" "}
                                    <span className="text-zinc-400">définitivement perdus</span>.
                                    Cette action est irréversible.
                                </p>
                            </div>
                        </div>

                        {erreur && (
                            <p className="text-red-400 text-xs text-center px-6 pb-2">{erreur}</p>
                        )}

                        {/* Actions */}
                        <div className="flex gap-2 px-6 pb-6">
                            <button
                                onClick={() => setOuvert(false)}
                                disabled={chargement}
                                className="flex-1 py-2.5 bg-white/[0.05] hover:bg-white/[0.08] border border-white/[0.08] rounded-xl text-zinc-300 text-sm font-medium transition-all duration-150 disabled:opacity-50"
                            >
                                Annuler
                            </button>
                            <button
                                onClick={supprimerCompte}
                                disabled={chargement}
                                className="flex-1 py-2.5 bg-red-500/15 hover:bg-red-500/20 border border-red-500/30 rounded-xl text-red-400 text-sm font-medium transition-all duration-150 disabled:opacity-50 flex items-center justify-center gap-2"
                            >
                                {chargement ? (
                                    <>
                                        <svg className="w-3.5 h-3.5 animate-spin" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                        </svg>
                                        Suppression...
                                    </>
                                ) : "Confirmer"}
                            </button>
                        </div>

                    </div>
                </div>
            )}
        </>
    )
}