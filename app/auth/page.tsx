// app/auth/page.tsx
// Page Auth (Connexion + Inscription) – design harmonisé avec la charte Zéro Pointé
// - Champ identifiant unique : pseudo OU e-mail
// - Toggle Connexion / Inscription intégré dans la carte

"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { inscriptionUser } from "@/app/actions/auth";
import Footer from "../composants/footer";
import Link from "next/link";
import BoutonRetour from "../composants/boutonretour";

export default function PageAuth() {
  const [mode, setMode] = useState<"connexion" | "inscription">("connexion");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const form = e.currentTarget;
    const formData = new FormData(form);
    const data = Object.fromEntries(formData) as Record<string, string>;

    if (mode === "inscription") {
      // 1. Création du compte
      const res = await inscriptionUser(formData);
      if (res?.error) {
        setError(res.error);
        setLoading(false);
        return;
      }
      // 2. Connexion automatique après inscription
      const result = await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
      });
      if (result?.error) {
        setError("Compte créé — connecte-toi maintenant.");
        setLoading(false);
        setMode("connexion");
        return;
      }
    } else {
      // Connexion : le champ "identifiant" est envoyé dans email ET pseudo
      // La logique authorize() côté serveur choisit la bonne clé
      const result = await signIn("credentials", {
        email: data.identifiant,
        pseudo: data.identifiant,
        password: data.password,
        redirect: false,
      });
      if (result?.error) {
        setError("Identifiant ou mot de passe incorrect.");
        setLoading(false);
        return;
      }
    }

    window.location.href = "/";
  }

  function changerMode(nouveau: "connexion" | "inscription") {
    setMode(nouveau);
    setError(null);
  }

  return (
    <div className="min-h-screen bg-[#080808] font-sans flex flex-col text-slate-200 w-full">

      {/* Liseré accent */}
      <div className="h-[3px] w-full bg-gradient-to-r from-[#CA3C66] via-[#e05580] to-[#A7E0E0] flex-shrink-0" />

      {/* ── Header ── */}
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

      {/* ── Contenu centré ── */}
      <main className="flex-1 flex items-center justify-center px-4 py-10 sm:py-14">
        <div className="w-full max-w-sm flex flex-col gap-5">

          {/* Titre contextuel */}
          <div className="text-center">
            <p className="text-[9px] uppercase tracking-[0.3em] font-bold text-[#A7E0E0] mb-1.5">
              {mode === "connexion" ? "Accès membre" : "Rejoindre le tribunal"}
            </p>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              {mode === "connexion" ? "Connexion" : "Inscription"}
            </h2>
          </div>

          {/* ── Carte principale ── */}
          <div
            className="rounded-2xl overflow-hidden"
            style={{
              background: "rgba(202,60,102,0.04)",
              border: "1px solid rgba(202,60,102,0.15)",
            }}
          >

            {/* Toggle Connexion / Inscription */}
            <div className="p-2 border-b border-white/8 bg-white/[0.02]">
              <div className="flex bg-[#080808] rounded-xl p-1 gap-1">
                {(["connexion", "inscription"] as const).map((m) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => changerMode(m)}
                    className={`flex-1 py-2 text-[10px] font-black uppercase tracking-wider rounded-lg transition-all duration-200 ${
                      mode === m
                        ? "bg-[#CA3C66] text-white shadow-md shadow-[#CA3C66]/25"
                        : "text-zinc-500 hover:text-zinc-300"
                    }`}
                  >
                    {m === "connexion" ? "Connexion" : "Inscription"}
                  </button>
                ))}
              </div>
            </div>

            {/* ── Formulaire ── */}
            <form onSubmit={handleSubmit} className="p-5 flex flex-col gap-4">

              {/* Pseudo (inscription uniquement) */}
              {mode === "inscription" && (
                <div className="flex flex-col gap-1.5">
                  <label className="text-[9px] uppercase tracking-[0.18em] font-bold" style={{ color: "#A7E0E0" }}>
                    Pseudo
                  </label>
                  <input
                    name="pseudo"
                    type="text"
                    required
                    autoComplete="username"
                    placeholder="Ton surnom au tribunal"
                    className="w-full rounded-xl px-3 py-2.5 text-sm text-white placeholder:text-zinc-600 focus:outline-none transition"
                    style={{
                      background: "rgba(255,255,255,0.05)",
                      border: "1px solid rgba(202,60,102,0.2)",
                    }}
                    onFocus={e => (e.currentTarget.style.borderColor = "rgba(202,60,102,0.6)")}
                    onBlur={e => (e.currentTarget.style.borderColor = "rgba(202,60,102,0.2)")}
                  />
                  <p className="text-[10px] text-zinc-600 leading-relaxed">
                    Visible par les autres. Tu pourras aussi l'utiliser pour te connecter.
                  </p>
                </div>
              )}

              {/* Identifiant unique : pseudo OU e-mail (connexion) */}
              {mode === "connexion" ? (
                <div className="flex flex-col gap-1.5">
                  <label className="text-[9px] uppercase tracking-[0.18em] font-bold" style={{ color: "#A7E0E0" }}>
                    Identifiant / Email 
                  </label>
                  <input
                    name="identifiant"
                    type="text"
                    required
                    autoComplete="username"
                    placeholder="Identifiant / e-mail"
                    className="w-full rounded-xl px-3 py-2.5 text-sm text-white placeholder:text-zinc-600 focus:outline-none transition"
                    style={{
                      background: "rgba(255,255,255,0.05)",
                      border: "1px solid rgba(202,60,102,0.2)",
                    }}
                    onFocus={e => (e.currentTarget.style.borderColor = "rgba(202,60,102,0.6)")}
                    onBlur={e => (e.currentTarget.style.borderColor = "rgba(202,60,102,0.2)")}
                  />
                </div>
              ) : (
                /* E-mail (inscription uniquement) */
                <div className="flex flex-col gap-1.5">
                  <label className="text-[9px] uppercase tracking-[0.18em] font-bold" style={{ color: "#A7E0E0" }}>
                    Adresse e-mail
                  </label>
                  <input
                    name="email"
                    type="email"
                    required
                    autoComplete="email"
                    placeholder="toi@exemple.fr"
                    className="w-full rounded-xl px-3 py-2.5 text-sm text-white placeholder:text-zinc-600 focus:outline-none transition"
                    style={{
                      background: "rgba(255,255,255,0.05)",
                      border: "1px solid rgba(202,60,102,0.2)",
                    }}
                    onFocus={e => (e.currentTarget.style.borderColor = "rgba(202,60,102,0.6)")}
                    onBlur={e => (e.currentTarget.style.borderColor = "rgba(202,60,102,0.2)")}
                  />
                </div>
              )}

              {/* Mot de passe */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[9px] uppercase tracking-[0.18em] font-bold" style={{ color: "#A7E0E0" }}>
                  Mot de passe
                </label>
                <input
                  name="password"
                  type="password"
                  required
                  autoComplete={mode === "inscription" ? "new-password" : "current-password"}
                  placeholder="••••••••"
                  className="w-full rounded-xl px-3 py-2.5 text-sm text-white placeholder:text-zinc-600 focus:outline-none transition"
                  style={{
                    background: "rgba(255,255,255,0.05)",
                    border: "1px solid rgba(202,60,102,0.2)",
                  }}
                  onFocus={e => (e.currentTarget.style.borderColor = "rgba(202,60,102,0.6)")}
                  onBlur={e => (e.currentTarget.style.borderColor = "rgba(202,60,102,0.2)")}
                />
              </div>

              {/* Bandeau d'erreur */}
              {error && (
                <div className="flex items-start gap-2 rounded-xl px-4 py-3"
                  style={{
                    background: "rgba(202,60,102,0.08)",
                    border: "1px solid rgba(202,60,102,0.20)",
                  }}
                >
                  <svg className="w-4 h-4 text-[#ED93B1] flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  <p className="text-[#ED93B1] text-xs leading-relaxed">{error}</p>
                </div>
              )}

              {/* Séparateur */}
              <div style={{ borderTop: "1px solid rgba(202,60,102,0.12)" }} />

              {/* Bouton submit */}
              <button
                type="submit"
                disabled={loading}
                className="w-full font-black text-[10px] uppercase tracking-wider py-3 rounded-xl transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-[1.02] active:scale-95"
                style={{
                  background: loading ? "rgba(202,60,102,0.4)" : "#CA3C66",
                  color: "white",
                  boxShadow: loading ? "none" : "0 0 24px rgba(202,60,102,0.35)",
                }}
              >
                {loading
                  ? "En cours..."
                  : mode === "connexion"
                    ? "Se connecter"
                    : "Rejoindre le tribunal"}
              </button>

              {/* Lien alternatif */}
              <p className="text-[11px] text-center text-zinc-600">
                {mode === "connexion" ? "Pas encore de compte ?" : "Déjà membre ?"}{" "}
                <button
                  type="button"
                  onClick={() => changerMode(mode === "connexion" ? "inscription" : "connexion")}
                  className="text-[#A7E0E0] hover:text-white transition-colors font-bold"
                >
                  {mode === "connexion" ? "S'inscrire" : "Se connecter"}
                </button>
              </p>
            </form>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}