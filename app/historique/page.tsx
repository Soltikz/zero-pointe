import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import FiltresHistorique from "../composants/filtreshistorique";
import BoutonRetour from "../composants/boutonretour";
import Footer from "../composants/footer";

const OFFICIEL_CATEGORIES = [
  "Shopping",
  "Restaurant",
  "Beauté",
  "Tech",
  "Nourriture",
  "Jeux",
];
const FILTRES_CATEGORIES = [...OFFICIEL_CATEGORIES, "Autre"];

// Palette de couleurs uniquement pour les catégories dynamiques ("Autre")
const TAILWIND_PALETTES = [
  {
    bg: "bg-pink-950/40 border-pink-900/50 text-pink-300",
    rawTextColor: "#f472b6",
  },
  {
    bg: "bg-orange-950/40 border-orange-900/50 text-orange-300",
    rawTextColor: "#fb923c",
  },
  {
    bg: "bg-rose-950/40 border-rose-900/50 text-rose-300",
    rawTextColor: "#fb7185",
  },
  {
    bg: "bg-blue-950/40 border-blue-900/50 text-blue-300",
    rawTextColor: "#60a5fa",
  },
  {
    bg: "bg-amber-950/40 border-amber-900/50 text-amber-300",
    rawTextColor: "#fbbf24",
  },
  {
    bg: "bg-cyan-950/40 border-cyan-900/50 text-cyan-300",
    rawTextColor: "#22d3ee",
  },
  {
    bg: "bg-violet-950/40 border-violet-900/50 text-violet-300",
    rawTextColor: "#a78bfa",
  },
  {
    bg: "bg-emerald-950/40 border-emerald-900/50 text-emerald-300",
    rawTextColor: "#34d399",
  },
  {
    bg: "bg-indigo-950/40 border-indigo-900/50 text-indigo-300",
    rawTextColor: "#818cf8",
  },
  {
    bg: "bg-fuchsia-950/40 border-fuchsia-900/50 text-fuchsia-300",
    rawTextColor: "#e879f9",
  },
];

// Fonction utilitaire pour récupérer la palette en fonction du nom de la catégorie
function getCategoryColorData(category: string) {
  if (category === "Top Craquage") {
    return { className: "text-[#ff2a6d]", rawColor: "#ff2a6d" };
  }
  if (OFFICIEL_CATEGORIES.includes(category)) {
    return { className: "text-zinc-400", rawColor: "#a1a1aa" };
  }

  let hash = 0;
  for (let i = 0; i < category.length; i++) {
    hash = category.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % TAILWIND_PALETTES.length;

  return {
    className: TAILWIND_PALETTES[index].bg,
    rawColor: TAILWIND_PALETTES[index].rawTextColor,
  };
}

// Détermine le style d'un badge dans le tableau
function getCategoryBadgeStyle(category: string) {
  if (category === "Top Craquage") {
    return "bg-[#ff2a6d] text-white shadow-[0_0_12px_rgba(255,42,109,0.4)] font-black uppercase";
  }

  if (OFFICIEL_CATEGORIES.includes(category)) {
    return "bg-zinc-900/40 border border-zinc-800 text-zinc-300 font-extrabold";
  }

  let hash = 0;
  for (let i = 0; i < category.length; i++) {
    hash = category.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % TAILWIND_PALETTES.length;
  return `${TAILWIND_PALETTES[index].bg} font-extrabold border`;
}

interface PageProps {
  searchParams: Promise<{ categorie?: string; tri?: string }>;
}

async function getDepenses(
  userEmail: string,
  categorie?: string,
  tri?: string,
) {
  const orderBy =
    tri === "prix_asc"
      ? { prix: "asc" as const }
      : tri === "prix_desc"
        ? { prix: "desc" as const }
        : { creerLe: "desc" as const };
  let categoryCondition = {};
  if (categorie) {
    if (categorie === "Autre") {
      categoryCondition = { notIn: OFFICIEL_CATEGORIES };
    } else {
      categoryCondition = { equals: categorie };
    }
  }
  return await prisma.depense.findMany({
    where: {
      user: { email: userEmail },
      ...(categorie ? { category: categoryCondition } : {}),
    },
    orderBy,
    include: { votes: true },
  });
}

async function getAllDepenses(userEmail: string) {
  return await prisma.depense.findMany({
    where: { user: { email: userEmail } },
    select: { category: true, prix: true },
  });
}

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("fr-FR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(date));
}

export default async function PageHistorique({ searchParams }: PageProps) {
  const session = await getServerSession();
  if (!session?.user?.email) redirect("/auth");

  const { categorie, tri } = await searchParams;
  const [depenses, allDepenses] = await Promise.all([
    getDepenses(session.user.email, categorie, tri),
    getAllDepenses(session.user.email),
  ]);

  const total = depenses.reduce((acc, d) => acc + d.prix, 0);
  const count = depenses.length;

  const categoryTotals = allDepenses.reduce<Record<string, number>>(
    (acc, d) => {
      const displayCategory = OFFICIEL_CATEGORIES.includes(d.category)
        ? d.category
        : d.category;
      acc[displayCategory] = (acc[displayCategory] ?? 0) + d.prix;
      return acc;
    },
    {},
  );

  const topCategories = Object.entries(categoryTotals)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3);

  return (
    <div className="min-h-screen bg-[#080808] text-zinc-100 flex flex-col antialiased">
      {/* Header */}
      <header className="border-b border-white/15 py-5 sticky top-0 z-10 bg-[#080808]/95 backdrop-blur-md w-full">
        <div className="w-full px-4 md:px-8 flex items-center justify-between">
          <div className="flex items-center gap-3 sm:gap-4 min-w-0">
            <BoutonRetour />
            <div
              className="w-px h-5 flex-shrink-0"
              style={{ background: "rgba(202,60,102,0.25)" }}
            />
            <div className="min-w-0">
              <p
                className="text-[12px] uppercase tracking-[0.2em] font-bold"
                style={{ color: "#CA3C66" }}
              >
                Zéro Pointé
              </p>
              <h1
                className="text-sm sm:text-base font-extrabold tracking-tight leading-none truncate"
                style={{ color: "#A7E0E0" }}
              >
                Mon Historique{" "}
              </h1>
            </div>
          </div>
          <div className="hidden sm:flex flex-col items-end gap-1">
            <span className="text-[10px] uppercase tracking-[2.5px] text-zinc-300 font-bold">
              total dépensé
            </span>
            <span className="text-2xl font-black text-[#FF4A7D]">
              {total.toLocaleString("fr-FR", {
                style: "currency",
                currency: "EUR",
                maximumFractionDigits: 0,
              })}
            </span>
          </div>
        </div>
      </header>

      {/* Main Layout */}
      <main className="flex-1 w-full px-4 md:px-8 py-6 md:py-10 flex flex-col gap-6 md:gap-8">
        {/* Total affiché uniquement sur Mobile en haut de page */}
        <div className="sm:hidden bg-zinc-900/30 border border-white/5 rounded-2xl p-4 flex justify-between items-center">
          <span className="text-[10px] uppercase tracking-[2px] text-zinc-400 font-bold">Total dépensé</span>
          <span className="text-xl font-black text-[#FF4A7D]">
            {total.toLocaleString("fr-FR", {
              style: "currency",
              currency: "EUR",
              maximumFractionDigits: 0,
            })}
          </span>
        </div>

        {/* ── Bloc Top Catégories Dynamique et Cohérent ── */}
        {topCategories.length > 0 && (
          <div>
            <p className="text-[11px] uppercase tracking-[2.5px] text-[#A7E0E0] font-extrabold mb-4">
              Top catégories
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
              {topCategories.map(([cat, catTotal], i) => {
                const rank = ["#1", "#2", "#3"][i];
                const colorData = getCategoryColorData(cat);
                const borderStyle = OFFICIEL_CATEGORIES.includes(cat)
                  ? "border-zinc-800"
                  : "";

                return (
                  <div
                    key={cat}
                    className={`relative rounded-2xl border px-5 py-5 flex flex-col gap-4 bg-zinc-900/40 ${borderStyle}`}
                    style={
                      !OFFICIEL_CATEGORIES.includes(cat)
                        ? { borderColor: `${colorData.rawColor}33` }
                        : {}
                    }
                  >
                    <span className="absolute top-4 right-4 text-[10px] font-black text-zinc-500">
                      {rank}
                    </span>
                    <div>
                      <p
                        className="text-[10px] uppercase tracking-[2px] font-bold"
                        style={{ color: colorData.rawColor }}
                      >
                        {cat.toUpperCase()}
                      </p>
                      <p className="text-2xl font-black mt-0.5 text-zinc-300">
                        {catTotal.toLocaleString("fr-FR", {
                          style: "currency",
                          currency: "EUR",
                          maximumFractionDigits: 0,
                        })}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Filtres */}
        <FiltresHistorique
          categories={FILTRES_CATEGORIES}
          categorieActive={categorie}
          triActif={tri}
        />

        {/* Tableau / Liste Responsive */}
        {depenses.length === 0 ? (
          <div className="flex items-center justify-center h-48 text-zinc-400 font-medium text-sm border border-dashed border-white/15 rounded-2xl bg-[#0d0d0d]">
            Aucune dépense pour cette sélection.
          </div>
        ) : (
          <div className="bg-[#0d0d0d] border border-white/15 rounded-2xl overflow-hidden shadow-xl w-full">
            <div className="px-6 py-4 border-b border-white/10 bg-white/[0.02] flex items-center justify-between">
              <p className="text-[11px] uppercase tracking-[2.5px] text-zinc-300 font-extrabold">
                dépenses
              </p>
              <span className="text-[10px] text-zinc-400 font-bold bg-white/10 px-2 py-0.5 rounded">
                {count} résultat{count > 1 ? "s" : ""}
              </span>
            </div>

            {/* 📱 Affichage MOBILE : Cartes empilées (Masqué sur md et +) */}
            <div className="md:hidden divide-y divide-white/10">
              {depenses.map((depense) => {
                const validated = depense.votes.filter((v) => v.type === "VALIDATED").length;
                const shameful = depense.votes.filter((v) => v.type === "SHAMEFUL").length;
                const isTopCraquage = depense.category === "Top Craquage";
                const badgeClass = getCategoryBadgeStyle(depense.category);

                return (
                  <div 
                    key={depense.id} 
                    className={`p-4 flex flex-col gap-3 transition-colors ${isTopCraquage ? "bg-gradient-to-b from-red-950/20 to-transparent" : ""}`}
                  >
                    {/* Ligne 1 : Titre et Prix */}
                    <div className="flex items-start justify-between gap-2">
                      <span className="text-sm font-bold text-white truncate max-w-[70%]">
                        {depense.titre}
                      </span>
                      <span className="text-base font-black text-[#FF4A7D] tracking-tight whitespace-nowrap">
                        {depense.prix.toLocaleString("fr-FR", {
                          style: "currency",
                          currency: "EUR",
                          maximumFractionDigits: 0,
                        })}
                      </span>
                    </div>

                    {/* Ligne 2 : Badge Catégorie et Date */}
                    <div className="flex items-center justify-between">
                      <span className={`inline-block text-[9px] px-2 py-0.5 rounded-full uppercase tracking-wide ${badgeClass}`}>
                        {isTopCraquage ? "TOP CRAQUAGE" : depense.category.toUpperCase()}
                      </span>
                      <span className="text-[11px] text-zinc-500 font-semibold">
                        {formatDate(depense.creerLe)}
                      </span>
                    </div>

                    {/* Ligne 3 : Votes */}
                    <div className="flex items-center gap-4 bg-white/[0.02] p-2 rounded-lg border border-white/5 w-max">
                      <span className="flex items-center gap-1 text-[11px] font-bold" style={{ color: "#A7E0E0" }}>
                        <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3H14z" />
                          <path d="M7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3" />
                        </svg>
                        {validated}
                      </span>
                      <span className="flex items-center gap-1 text-[11px] font-bold text-[#FF4A7D]">
                        <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M10 15v4a3 3 0 0 0 3 3l4-9V2H5.72a2 2 0 0 0-2 1.7l-1.38 9a2 2 0 0 0 2 2.3H10z" />
                          <path d="M17 2h2.67A2.31 2.31 0 0 1 22 4v7a2.31 2.31 0 0 1-2.33 2H17" />
                        </svg>
                        {shameful}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* 🖥️ Affichage DESKTOP : Vrai Tableau (Masqué sur mobile, visible sur md et +) */}
            <div className="hidden md:block overflow-x-auto w-full">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-white/10 bg-white/[0.005] text-[10px] uppercase tracking-[2px] text-zinc-500 font-bold">
                    <th className="py-3 px-6 font-extrabold">Titre / Intitulé</th>
                    <th className="py-3 px-6 font-extrabold w-48">Catégorie</th>
                    <th className="py-3 px-6 font-extrabold w-48">Date</th>
                    <th className="py-3 px-6 font-extrabold w-48 text-center">Votes</th>
                    <th className="py-3 px-6 font-extrabold w-48 text-right">Prix</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10">
                  {depenses.map((depense) => {
                    const validated = depense.votes.filter((v) => v.type === "VALIDATED").length;
                    const shameful = depense.votes.filter((v) => v.type === "SHAMEFUL").length;
                    const isTopCraquage = depense.category === "Top Craquage";
                    const badgeClass = getCategoryBadgeStyle(depense.category);

                    return (
                      <tr
                        key={depense.id}
                        className={`transition-colors group ${isTopCraquage ? "bg-gradient-to-r from-red-950/20 via-transparent to-transparent hover:bg-red-950/30" : "hover:bg-white/[0.04]"}`}
                      >
                        <td className="py-4 px-6 text-sm font-bold text-white group-hover:text-[#FF4A7D] transition-colors max-w-xs truncate">
                          {depense.titre}
                        </td>
                        <td className="py-4 px-6">
                          <span className={`inline-block text-[10px] px-2 py-0.5 rounded-full uppercase tracking-wide ${badgeClass}`}>
                            {isTopCraquage ? "TOP CRAQUAGE" : depense.category.toUpperCase()}
                          </span>
                        </td>
                        <td className="py-4 px-6 text-[11px] text-zinc-400 font-semibold">
                          {formatDate(depense.creerLe)}
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex items-center justify-center gap-4">
                            <span className="flex items-center gap-1 text-[11px] font-bold" style={{ color: "#A7E0E0" }}>
                              <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3H14z" />
                                <path d="M7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3" />
                              </svg>
                              {validated}
                            </span>
                            <span className="flex items-center gap-1 text-[11px] font-bold text-[#FF4A7D]">
                              <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M10 15v4a3 3 0 0 0 3 3l4-9V2H5.72a2 2 0 0 0-2 1.7l-1.38 9a2 2 0 0 0 2 2.3H10z" />
                                <path d="M17 2h2.67A2.31 2.31 0 0 1 22 4v7a2.31 2.31 0 0 1-2.33 2H17" />
                              </svg>
                              {shameful}
                            </span>
                          </div>
                        </td>
                        <td className="py-4 px-6 text-right font-black text-[#FF4A7D] whitespace-nowrap text-base tracking-tight">
                          {depense.prix.toLocaleString("fr-FR", {
                            style: "currency",
                            currency: "EUR",
                            maximumFractionDigits: 0,
                          })}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}