"use client"
import { useRouter } from "next/navigation"

export default function BoutonRetour() {
    const router = useRouter()
    return (
        <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-zinc-300 hover:text-white transition-colors text-sm font-semibold"
        >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            Retour
        </button>
    )
}