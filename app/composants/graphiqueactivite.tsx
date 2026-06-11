"use client"

import { useState } from "react"

type Donnee = {
    mois?: string  // Pour la page Mon compte
    label?: string // Pour le Dashboard
    valeur: number
}

interface GraphiqueProps {
    donnees: Donnee[]
    couleurPrincipale?: string
    titreEnTete?: string
    sousTitreEnTete?: string
    textePeriode?: string
    texteAide?: string
}

export default function GraphiqueActivite({ 
    donnees, 
    couleurPrincipale = "#CA3C66",
    titreEnTete,
    sousTitreEnTete,
    textePeriode,
    texteAide
}: GraphiqueProps) {
    const max = Math.max(...donnees.map(d => d.valeur), 1)
    const [actif, setActif] = useState<number | null>(null)

    const handleClick = (index: number) => {
        setActif(index === actif ? null : index)
    }

    const elementActif = actif !== null ? donnees[actif] : null

    return (
        <div className="flex flex-col flex-1 min-h-0 w-full h-full justify-between gap-4">
            {/* En-tête supérieur affiché uniquement sur le Dashboard */}
            {titreEnTete && (
                <div className="px-5 pt-4 pb-2 flex items-start justify-between gap-2">
                    <div>
                        <p className="text-[9px] uppercase tracking-[0.18em] font-bold" style={{ color: "#A7E0E0" }}>
                            {titreEnTete}
                        </p>
                        <p className="text-base font-black text-white mt-0.5">
                            {sousTitreEnTete}
                        </p>
                    </div>
                    <div className="text-right flex-shrink-0">
                        <p className="text-[9px] uppercase tracking-[0.18em] font-bold" style={{ color: "#A7E0E0" }}>
                            {textePeriode}
                        </p>
                        <p className="text-[10px] text-zinc-500 mt-0.5">{texteAide}</p>
                    </div>
                </div>
            )}

            {/* Conteneur principal qui prend tout l'espace de la boîte */}
            <div className="px-5 pt-2 pb-5 flex flex-col gap-5 flex-1 justify-between min-h-0">
                {/* Tooltip inline */}
                <div
                    className="flex items-center justify-between px-4 rounded-xl border transition-all duration-300"
                    style={{
                        height: "64px",
                        flexShrink: 0,
                        background: elementActif ? "rgba(202,60,102,0.08)" : "rgba(255,255,255,0.03)",
                        borderColor: elementActif ? "rgba(202,60,102,0.35)" : "rgba(255,255,255,0.06)",
                    }}
                >
                    <div>
                        <p
                            className="text-[9px] uppercase tracking-[2px] font-bold transition-colors duration-200"
                            style={{ color: elementActif ? "rgba(202,60,102,0.8)" : "rgb(82,82,91)" }}
                        >
                            {elementActif ? `${elementActif.label || elementActif.mois} · sélectionné` : "cliquer sur une barre"}
                        </p>
                        <p
                            className="text-xl font-bold mt-0.5 transition-all duration-300"
                            style={{ color: elementActif ? "#ffffff" : "rgb(63,63,70)" }}
                        >
                            {elementActif
                                ? elementActif.valeur > 0
                                    ? elementActif.valeur.toLocaleString("fr-FR", { style: "currency", currency: "EUR", maximumFractionDigits: 0 })
                                    : "—"
                                : "—"
                            }
                        </p>
                    </div>
                    {elementActif && (
                        <button
                            onClick={() => setActif(null)}
                            className="text-zinc-600 hover:text-zinc-400 transition-colors text-xs"
                        >
                            ✕
                        </button>
                    )}
                </div>

                {/* Zone des barres descendue tout en bas avec une hauteur fixe de 120px */}
                <div className="flex items-end gap-1.5 h-[120px] pt-2 mt-auto">
                    {donnees.map((d, i) => {
                        const nomAffichage = d.label || d.mois || ""
                        const hauteur = max > 0 ? Math.max((d.valeur / max) * 100, d.valeur > 0 ? 5 : 0) : 0
                        const estActif = actif === i

                        return (
                            <div
                                key={i}
                                className="flex-1 flex flex-col items-center gap-1.5 cursor-pointer group h-full justify-end min-w-0"
                                onClick={() => handleClick(i)}
                                title={`${nomAffichage} : ${d.valeur > 0 ? d.valeur.toLocaleString("fr-FR", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }) : "0 €"}`}
                            >
                                <div className="w-full flex items-end justify-center flex-1 min-h-0">
                                    <div
                                        className="w-full rounded-t transition-all duration-300"
                                        style={{
                                            height: `${hauteur}%`,
                                            minHeight: d.valeur > 0 ? "5px" : "2px",
                                            background: estActif
                                                ? couleurPrincipale
                                                : d.valeur > 0
                                                    ? "rgba(202,60,102,0.50)"
                                                    : "rgba(255,255,255,0.08)",
                                            boxShadow: estActif ? `0 0 14px ${couleurPrincipale}8c` : "none",
                                            transform: estActif ? "scaleX(1.05)" : "scaleX(1)",
                                        }}
                                    />
                                </div>
                                <span
                                    className="text-[9px] font-bold uppercase tracking-wide transition-colors duration-200 flex-shrink-0"
                                    style={{ color: estActif ? couleurPrincipale : "rgb(113,113,122)" }}
                                >
                                    {nomAffichage}
                                </span>
                            </div>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}