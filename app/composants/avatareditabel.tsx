"use client"

import { useRef, useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"

interface Props {
    initiale: string
    imageActuelle: string | null
}

export default function AvatarEditable({ initiale, imageActuelle }: Props) {
    const inputRef = useRef<HTMLInputElement>(null)
    const [preview, setPreview] = useState<string | null>(imageActuelle)
    const [chargement, setChargement] = useState(false)
    const [erreur, setErreur] = useState<string | null>(null)
    const router = useRouter()

    async function handleFichier(e: React.ChangeEvent<HTMLInputElement>) {
        const fichier = e.target.files?.[0]
        if (!fichier) return

        // Aperçu local immédiat
        const urlLocale = URL.createObjectURL(fichier)
        setPreview(urlLocale)
        setErreur(null)

        setChargement(true)
        try {
            const form = new FormData()
            form.append("avatar", fichier)

            const res = await fetch("/api/compte/avatar", { method: "POST", body: form })
            const data = await res.json()

            if (!res.ok) {
                setErreur(data.error ?? "Erreur upload")
                setPreview(imageActuelle) // revenir à l'ancienne image
                return
            }

            // Utiliser le vrai chemin retourné par l'API
            setPreview(data.image)
            router.refresh()

        } catch {
            setErreur("Erreur réseau")
            setPreview(imageActuelle)
        } finally {
            setChargement(false)
        }
    }

    return (
        <div className="flex flex-col items-center gap-2">
            <div
                className="relative group cursor-pointer"
                onClick={() => inputRef.current?.click()}
            >
                {/* Avatar */}
                <div className="w-[72px] h-[72px] rounded-[18px] bg-[#CA3C66]/15 border border-[#CA3C66]/25 flex items-center justify-center overflow-hidden">
                    {preview ? (
                        <Image
                            src={preview}
                            alt="avatar"
                            width={72}
                            height={72}
                            className="w-full h-full object-cover"
                            unoptimized
                        />
                    ) : (
                        <span className="text-3xl font-black text-[#CA3C66]">{initiale}</span>
                    )}
                </div>

                {/* Overlay hover */}
                <div className="absolute inset-0 rounded-[18px] bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-150 flex items-center justify-center">
                    {chargement ? (
                        <svg className="w-5 h-5 text-white animate-spin" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                        </svg>
                    ) : (
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                    )}
                </div>

                {/* Badge crayon */}
                <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-[#CA3C66] border-2 border-[#0a0a0a] flex items-center justify-center">
                    <svg className="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                    </svg>
                </div>

                {/* Input caché */}
                <input
                    ref={inputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleFichier}
                />
            </div>

            {/* Message d'erreur sous l'avatar */}
            {erreur && (
                <p className="text-red-400 text-[10px] text-center">{erreur}</p>
            )}
        </div>
    )
}