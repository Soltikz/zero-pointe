// app/composants/formulairedepense.tsx
'use client'

import { useState, useTransition } from 'react'
import { creerDepense } from '../actions/depense'

const CATEGORIES = ['Shopping', 'Restaurant', 'Beauté', 'Tech', 'Nourriture', 'Jeux', 'Autre']

export default function FormulaireDepense() {
    const [category, setCategory] = useState('')
    const [customCategory, setCustomCategory] = useState('')
    const [isPending, startTransition] = useTransition()

    async function handleAction(formData: FormData) {
        if (category === 'Autre' && customCategory) {
            formData.set('categorie', customCategory)
        } else {
            formData.set('categorie', category)
        }
        startTransition(async () => {
            try {
                await creerDepense(formData)
                setCategory('')
                setCustomCategory('')
                const form = document.getElementById('form-craquage') as HTMLFormElement
                form?.reset()
            } catch (error) {
                console.error(error)
                alert("Erreur lors de l'enregistrement.")
            }
        })
    }

    const inputStyle = {
        background: "rgba(255,255,255,0.05)",
        border: "1px solid rgba(202,60,102,0.2)",
    }

    return (
        <form
            id="form-craquage"
            action={handleAction}
            className="rounded-2xl p-5 flex flex-col gap-4 w-full h-full"
            style={{
                background: "rgba(202,60,102,0.04)",
                border: "1px solid rgba(202,60,102,0.15)",
            }}
        >
            {/* Titre section */}
            <div>
                <h3 className="text-base font-black text-white leading-tight">
                    Soumettre un craquage
                </h3>
            </div>

            {/* Titre */}
            <div className="flex flex-col gap-1.5">
                <label className="text-[9px] uppercase tracking-[0.18em] font-bold" style={{ color: "#A7E0E0" }}>
                    Titre
                </label>
                <input
                    type="text"
                    name="titre"
                    required
                    placeholder="Ex: Un lego Star Wars"
                    className="w-full rounded-xl px-3 py-2.5 text-sm text-white placeholder:text-zinc-600 focus:outline-none transition"
                    style={inputStyle}
                    onFocus={e => (e.currentTarget.style.borderColor = "rgba(202,60,102,0.6)")}
                    onBlur={e => (e.currentTarget.style.borderColor = "rgba(202,60,102,0.2)")}
                />
            </div>

            {/* Prix */}
            <div className="flex flex-col gap-1.5">
                <label className="text-[9px] uppercase tracking-[0.18em] font-bold" style={{ color: "#A7E0E0" }}>
                    Montant (€)
                </label>
                <input
                    type="number"
                    name="prix"
                    step="0.01"
                    required
                    placeholder="0.00"
                    className="w-full rounded-xl px-3 py-2.5 text-sm text-white placeholder:text-zinc-600 focus:outline-none transition"
                    style={inputStyle}
                    onFocus={e => (e.currentTarget.style.borderColor = "rgba(202,60,102,0.6)")}
                    onBlur={e => (e.currentTarget.style.borderColor = "rgba(202,60,102,0.2)")}
                />
            </div>

            {/* Catégorie */}
            <div className="flex flex-col gap-1.5">
                <label className="text-[9px] uppercase tracking-[0.18em] font-bold" style={{ color: "#A7E0E0" }}>
                    Catégorie
                </label>
                <div className="relative">
                    <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        required
                        className="w-full rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none transition appearance-none cursor-pointer"
                        style={inputStyle}
                        onFocus={e => (e.currentTarget.style.borderColor = "rgba(202,60,102,0.6)")}
                        onBlur={e => (e.currentTarget.style.borderColor = "rgba(202,60,102,0.2)")}
                    >
                        <option value="" disabled className="bg-[#161616] text-zinc-500">Choisir une catégorie</option>
                        {CATEGORIES.map((cat) => (
                            <option key={cat} value={cat} className="bg-[#161616] text-white">{cat}</option>
                        ))}
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-zinc-500">
                        <svg className="fill-current h-3.5 w-3.5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                            <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                        </svg>
                    </div>
                </div>
            </div>

            {/* Catégorie personnalisée */}
            {category === 'Autre' && (
                <div className="flex flex-col gap-1.5">
                    <label className="text-[9px] uppercase tracking-[0.18em] font-bold" style={{ color: "#A7E0E0" }}>
                        Nom personnalisé
                    </label>
                    <input
                        type="text"
                        value={customCategory}
                        onChange={(e) => setCustomCategory(e.target.value)}
                        required
                        placeholder="Ex: Kebab, Moto, Karting..."
                        className="w-full rounded-xl px-3 py-2.5 text-sm text-white placeholder:text-zinc-600 focus:outline-none transition"
                        style={inputStyle}
                        onFocus={e => (e.currentTarget.style.borderColor = "rgba(202,60,102,0.6)")}
                        onBlur={e => (e.currentTarget.style.borderColor = "rgba(202,60,102,0.2)")}
                    />
                </div>
            )}

            {/* Séparateur */}
            <div className="mt-auto" style={{ borderTop: "1px solid rgba(202,60,102,0.12)" }} />

            {/* Boutons */}
            <div className="flex flex-col gap-2">
                <button
                    type="submit"
                    disabled={isPending}
                    className="w-full font-black text-xs uppercase tracking-wider py-3 rounded-xl transition-all"
                    style={{
                        background: isPending ? "rgba(202,60,102,0.4)" : "#CA3C66",
                        color: "white",
                        boxShadow: isPending ? "none" : "0 0 24px rgba(202,60,102,0.35)",
                    }}
                >
                    {isPending ? 'Enregistrement...' : 'Soumettre le dossier au tribunal'}
                </button>
                <button
                    type="reset"
                    onClick={() => { setCategory(''); setCustomCategory('') }}
                    className="w-full font-bold text-xs uppercase tracking-wider py-2.5 rounded-xl transition-all"
                    style={{
                        background: "rgba(255,255,255,0.04)",
                        border: "1px solid rgba(202,60,102,0.2)",
                        color: "rgba(255,255,255,0.4)",
                    }}
                >
                    Annuler
                </button>
            </div>
        </form>
    )
}