"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";

interface Vote {
  type: string;
  userId?: string;
}

interface Depense {
  id: string;
  titre: string;
  prix: number;
  category: string;
  rejets: number;
  approbations: number;
  votes?: Vote[];
}

export default function FluxCaniveauClient({
  depensesInitiales,
}: {
  depensesInitiales: Depense[];
}) {
  const { data: session } = useSession();
  const router = useRouter();
  const [depenses, setDepenses] = useState(depensesInitiales);
  const [afficherTout, setAfficherTout] = useState(false);
  const [mesVotes, setMesVotes] = useState<Record<string, string | null>>({});
  const [popupVisible, setPopupVisible] = useState(false);

  // Polling toutes les 10 secondes
useEffect(() => {
  // 30 secondes en dev, 15 secondes en prod
  const intervalle = process.env.NODE_ENV === 'development' ? 30_000 : 15_000;

  const interval = setInterval(async () => {
    // 🛡️ Évite de requêter Aiven si l'onglet est en arrière-plan
    if (document.hidden) return;

    try {
      const res = await fetch("/api/votes/depenses");
      if (res.ok) {
        const data = await res.json();
        setDepenses(data);
      }
    } catch {
      // Silencieux
    }
  }, intervalle);

  return () => clearInterval(interval);
}, []);

  async function voter(depenseId: string, type: "SHAMEFUL" | "VALIDATED") {
    if (!session) {
      setPopupVisible(true);
      return;
    }

    const ancienVote = mesVotes[depenseId] ?? null;
    const nouveauVote = ancienVote === type ? null : type;

    setMesVotes((prev) => ({ ...prev, [depenseId]: nouveauVote }));
    setDepenses((prev) =>
      prev.map((d) => {
        if (d.id !== depenseId) return d;
        let { rejets, approbations } = d;
        if (ancienVote === "SHAMEFUL") rejets--;
        if (ancienVote === "VALIDATED") approbations--;
        if (nouveauVote === "SHAMEFUL") rejets++;
        if (nouveauVote === "VALIDATED") approbations++;
        return { ...d, rejets, approbations };
      })
    );

    try {
      const res = await fetch("/api/votes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ depenseId, type }),
      });
      if (!res.ok) throw new Error();
      const data = await res.json();

      setDepenses((prev) =>
        prev.map((d) =>
          d.id === depenseId
            ? { ...d, rejets: data.rejets, approbations: data.approbations }
            : d,
        )
      );
      setMesVotes((prev) => ({ ...prev, [depenseId]: data.monVote }));

      setTimeout(() => {
        setDepenses((prev) => [...prev].sort((a, b) => b.rejets - a.rejets));
      }, 1500);

    } catch {
      setDepenses(depensesInitiales);
      setMesVotes({});
    }
  }

  if (depenses.length === 0) {
    return (
      <div className="flex items-center justify-center h-48 text-zinc-600 text-sm border border-dashed border-white/8 rounded-2xl bg-[#111111] w-full">
        Aucun vote pour l'instant. Le caniveau est vide.
      </div>
    );
  }

  const depensesVisibles = afficherTout ? depenses : depenses.slice(0, 10);
  const aPlusDeDix = depenses.length > 10;

  return (
    <>
      {popupVisible && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
          <div className="bg-[#161616] border border-white/10 rounded-2xl p-8 max-w-sm w-full mx-4 flex flex-col items-center gap-5 shadow-2xl">
            <div className="text-center">
              <h3 className="text-white font-black text-lg mb-2">Connexion requise</h3>
              <p className="text-zinc-400 text-sm">
                Vous devez être connecté pour voter sur les craquages.
              </p>
            </div>
            <div className="flex gap-3 w-full">
              <button
                onClick={() => setPopupVisible(false)}
                className="flex-1 py-2.5 bg-white/5 hover:bg-white/10 text-zinc-400 font-bold rounded-xl text-xs uppercase tracking-wider transition-colors"
              >
                Annuler
              </button>
              <button
                onClick={() => router.push("/auth")}
                className="flex-1 py-2.5 bg-[#CA3C66] hover:bg-[#b8335a] text-white font-bold rounded-xl text-xs uppercase tracking-wider transition-colors"
              >
                Me connecter
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-8 w-full">
        <motion.div
          layout
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 w-full"
        >
          <AnimatePresence>
            {depensesVisibles.map((depense, index) => {
              const monVote = mesVotes[depense.id] ?? null;
              const total = depense.rejets + depense.approbations;
              const pourcentageCompulsif = total > 0 ? (depense.rejets / total) * 100 : 50;
              const pourcentageUtile = 100 - pourcentageCompulsif;

              return (
                <motion.div
                  key={depense.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.4, ease: "easeInOut" }}
                  className="bg-[#161616] border border-white/8 rounded-2xl p-5 flex flex-col justify-between gap-4 relative overflow-hidden w-full"
                >
                  {/* Badge rang */}
                  <div className="absolute top-0 right-0 bg-[#CA3C66]/10 text-[#CA3C66] font-black px-3 py-1 rounded-bl-xl text-xs">
                    #{index + 1}
                  </div>

                  {/* Titre + prix */}
                  <div className="space-y-1 pr-8">
                    <h3 className="text-base font-semibold text-white/90 truncate">
                      {depense.titre}
                    </h3>
                    <span className="text-xl font-black text-[#ED93B1] block">
                      {depense.prix.toFixed(2)} €
                    </span>
                  </div>

                  {/* Boutons de vote */}
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => voter(depense.id, "VALIDATED")}
                      className={`py-1.5 px-2 font-bold rounded-xl text-[10px] uppercase tracking-wider text-center transition-colors cursor-pointer
                        ${monVote === "VALIDATED"
                          ? "bg-[#4AA3A2] text-white ring-2 ring-[#4AA3A2]/50"
                          : "bg-[#4AA3A2]/80 text-white"
                        }`}
                    >
                      Utile
                    </button>
                    <button
                      onClick={() => voter(depense.id, "SHAMEFUL")}
                      className={`py-1.5 px-2 font-bold rounded-xl text-[10px] uppercase tracking-wider text-center transition-colors cursor-pointer
                        ${monVote === "SHAMEFUL"
                          ? "bg-[#CA3C66] text-white ring-2 ring-[#CA3C66]/50"
                          : "bg-[#CA3C66]/80 text-white"
                        }`}
                    >
                      Compulsif
                    </button>
                  </div>

                  {/* Barre de progression */}
                  <div className="space-y-1">
                    <div className="w-full h-2 rounded-full overflow-hidden bg-white/5 flex">
                      <div
                        className="h-full bg-[#A7E0E0] transition-all duration-500"
                        style={{ width: `${pourcentageUtile}%` }}
                      />
                      <div
                        className="h-full bg-[#CA3C66] transition-all duration-500"
                        style={{ width: `${pourcentageCompulsif}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-[9px] font-semibold uppercase tracking-wider">
                      <span className="text-white">{Math.round(pourcentageUtile)}% utile</span>
                      <span className="text-white">{Math.round(pourcentageCompulsif)}% compulsif</span>
                    </div>
                  </div>

                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>

        {aPlusDeDix && !afficherTout && (
          <div className="flex justify-center pt-4 w-full">
            <button
              onClick={() => setAfficherTout(true)}
              className="py-3 px-8 bg-[#161616] border border-white/8 text-white font-bold rounded-xl text-xs uppercase tracking-wider text-center"
            >
              Voir tous les craquages
            </button>
          </div>
        )}
      </div>
    </>
  );
}