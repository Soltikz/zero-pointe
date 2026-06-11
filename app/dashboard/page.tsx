import prisma from "@/lib/prisma";
import Link from "next/link";
import FormulaireDepense from "../composants/formulairedepense";
import BoutonRetour from "../composants/boutonretour";
import GraphiqueActivite from "../composants/graphiqueactivite";
import Footer from "../composants/footer";

async function getDepenses() {
  return await prisma.depense.findMany({
    orderBy: { creerLe: "desc" },
  });
}

const CATEGORY_COLORS: Record<string, string> = {
  Shopping: "bg-pink-950/60 text-pink-300",
  Restaurant: "bg-orange-950/60 text-orange-300",
  Beauté: "bg-rose-950/60 text-rose-300",
  Tech: "bg-blue-950/60 text-blue-300",
  Nourriture: "bg-amber-950/60 text-amber-300",
  Jeux: "bg-cyan-950/60 text-cyan-300",
};

const TAILWIND_PALETTES = [
  "bg-pink-950/40 border-pink-900/50 text-pink-300",
  "bg-orange-950/40 border-orange-900/50 text-orange-300",
  "bg-rose-950/40 border-rose-900/50 text-rose-300",
  "bg-blue-950/40 border-blue-900/50 text-blue-300",
  "bg-amber-950/40 border-amber-900/50 text-amber-300",
  "bg-cyan-950/40 border-cyan-900/50 text-cyan-300",
  "bg-violet-950/40 border-violet-900/50 text-violet-300",
  "bg-emerald-950/40 border-emerald-900/50 text-emerald-300",
  "bg-indigo-950/40 border-indigo-900/50 text-indigo-300",
  "bg-fuchsia-950/40 border-fuchsia-900/50 text-fuchsia-300",
];

function getCategoryBadgeStyle(category: string) {
  if (category === "Top Craquage") {
    return "bg-[#ff2a6d] text-white shadow-[0_0_12px_rgba(255,42,109,0.4)] font-black uppercase";
  }
  if (CATEGORY_COLORS[category]) {
    return CATEGORY_COLORS[category];
  }
  let hash = 0;
  for (let i = 0; i < category.length; i++) {
    hash = category.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % TAILWIND_PALETTES.length;
  return `${TAILWIND_PALETTES[index]} border`;
}

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("fr-FR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(date));
}

function getLundiSemaine(): Date {
  const now = new Date();
  const jour = now.getDay();
  const diff = jour === 0 ? -6 : 1 - jour;
  const lundi = new Date(now);
  lundi.setDate(now.getDate() + diff);
  lundi.setHours(0, 0, 0, 0);
  return lundi;
}

function getTextePeriode(lundi: Date): string {
  const dimanche = new Date(lundi);
  dimanche.setDate(lundi.getDate() + 6);
  const options: Intl.DateTimeFormatOptions = {
    day: "2-digit",
    month: "2-digit",
  };
  const strLundi = new Intl.DateTimeFormat("fr-FR", options).format(lundi);
  const strDimanche = new Intl.DateTimeFormat("fr-FR", options).format(
    dimanche,
  );
  return `Semaine du ${strLundi} au ${strDimanche}`;
}

const JOURS = ["LUN", "MAR", "MER", "JEU", "VEN", "SAM", "DIM"];

export default async function PageDashboard() {
  const depenses = await getDepenses();

  const total = depenses.reduce((acc, d) => acc + d.prix, 0);
  const count = depenses.length;
  const moyenne = count > 0 ? total / count : 0;
  const max = count > 0 ? Math.max(...depenses.map((d) => d.prix)) : 0;

  const recentes = depenses.slice(0, 5);

  const lundi = getLundiSemaine();
  const titrePeriode = getTextePeriode(lundi);
  const depensesSemaine = depenses.filter((d) => new Date(d.creerLe) >= lundi);

  const totauxJour = Array.from({ length: 7 }, (_, i) => {
    const jour = new Date(lundi);
    jour.setDate(lundi.getDate() + i);
    const jourSuivant = new Date(jour);
    jourSuivant.setDate(jour.getDate() + 1);
    const total = depensesSemaine
      .filter((d) => {
        const date = new Date(d.creerLe);
        return date >= jour && date < jourSuivant;
      })
      .reduce((acc, d) => acc + d.prix, 0);
    return { jour: JOURS[i], valeur: Math.round(total) };
  });

  const totalSemaine = depensesSemaine.reduce((acc, d) => acc + d.prix, 0);

  const maintenant = new Date();
  const heureMAJ = new Intl.DateTimeFormat("fr-FR", {
    weekday: "long",
    hour: "2-digit",
    minute: "2-digit",
  }).format(maintenant);

  return (
    <div
      className="min-h-screen font-sans flex flex-col"
      style={{
        background:
          "linear-gradient(160deg, #1a0a10 0%, #0d0d0d 40%, #0d0d0d 100%)",
      }}
    >
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
                Mon Dépôt{" "}
              </h1>
            </div>
          </div>
          <div className="text-right flex-shrink-0">
            <p
              className="text-[9px] uppercase tracking-[0.2em] font-bold"
              style={{ color: "#A7E0E0" }}
            >
              Total Cumulé
            </p>
            <p
              className="text-xl sm:text-2xl font-black leading-tight"
              style={{ color: "#CA3C66" }}
            >
              {total.toLocaleString("fr-FR", {
                style: "currency",
                currency: "EUR",
              })}
            </p>
            <p className="text-[10px] text-zinc-500 font-medium hidden sm:block">
              sur 12 mois
            </p>
          </div>
        </div>
      </header>

      {/* ── Body ── */}
      <div className="w-full px-4 sm:px-8 py-6 sm:py-8">
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 lg:items-stretch">
          {/* Formulaire gauche */}
          <div className="w-full lg:w-[340px] xl:w-[380px] flex-shrink-0 flex flex-col">
            <FormulaireDepense />
          </div>

          {/* Colonne droite */}
          <div className="flex-1 min-w-0 flex flex-col gap-4">
            {/* Stats */}
            <div className="grid grid-cols-3 gap-3 sm:gap-4">
              {[
                { label: "Dépenses", value: count.toString() },
                {
                  label: "Moyenne",
                  value: moyenne.toLocaleString("fr-FR", {
                    style: "currency",
                    currency: "EUR",
                  }),
                },
                {
                  label: "Record",
                  value: max.toLocaleString("fr-FR", {
                    style: "currency",
                    currency: "EUR",
                  }),
                },
              ].map((stat, i) => (
                <div
                  key={i}
                  className="rounded-2xl p-3 sm:p-4 flex flex-col gap-1"
                  style={{
                    background: "rgba(202,60,102,0.06)",
                    border: "1px solid rgba(202,60,102,0.15)",
                  }}
                >
                  <p
                    className="text-[8px] sm:text-[9px] uppercase tracking-[0.18em] font-bold"
                    style={{ color: "#A7E0E0" }}
                  >
                    {stat.label}
                  </p>
                  <p
                    className="text-xl sm:text-3xl font-black leading-none"
                    style={{ color: "#CA3C66" }}
                  >
                    {stat.value}
                  </p>
                </div>
              ))}
            </div>

            {/* Graphique + Historique */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1">
              {/* Le Graphique Hebdomadaire avec l'en-tête réinjecté */}
              <div
                className="rounded-2xl overflow-hidden flex flex-col"
                style={{
                  background: "rgba(202,60,102,0.04)",
                  border: "1px solid rgba(202,60,102,0.15)",
                }}
              >
                <GraphiqueActivite
                  donnees={totauxJour.map((d) => ({
                    label: d.jour,
                    valeur: d.valeur,
                  }))}
                  couleurPrincipale="#CA3C66"
                  titreEnTete="Craquages Hebdomadaires"
                  sousTitreEnTete={`${totalSemaine.toLocaleString("fr-FR", { style: "currency", currency: "EUR", maximumFractionDigits: 0 })} cette semaine`}
                  textePeriode={titrePeriode.toUpperCase()}
                  texteAide="Repart à zéro dimanche soir"
                />
              </div>

              {/* Historique récent aligné */}
              <div
                className="rounded-2xl overflow-hidden flex flex-col"
                style={{
                  background: "rgba(202,60,102,0.04)",
                  border: "1px solid rgba(202,60,102,0.15)",
                }}
              >
                <div
                  className="px-5 py-3 flex items-center justify-between gap-4"
                  style={{ borderBottom: "1px solid rgba(202,60,102,0.12)" }}
                >
                  <span
                    className="flex-1 text-[10px] uppercase tracking-[0.18em] font-bold"
                    style={{ color: "#A7E0E0" }}
                  >
                    Nom / Date
                  </span>
                  <span
                    className="w-32 text-[10px] uppercase tracking-[0.18em] font-bold text-left"
                    style={{ color: "#A7E0E0" }}
                  >
                    Catégorie
                  </span>
                  <span
                    className="w-28 text-[10px] uppercase tracking-[0.18em] font-bold text-right"
                    style={{ color: "#A7E0E0" }}
                  >
                    Montant
                  </span>
                </div>

                <div className="flex flex-col flex-1 py-1">
                  {recentes.length === 0 ? (
                    <div
                      className="flex items-center justify-center h-16 text-zinc-600 text-xs m-2 rounded-xl"
                      style={{ border: "1px dashed rgba(202,60,102,0.2)" }}
                    >
                      Aucun craquage pour le moment.
                    </div>
                  ) : (
                    recentes.map((depense) => {
                      const badgeClass = getCategoryBadgeStyle(
                        depense.category,
                      );

                      return (
                        <div
                          key={depense.id}
                          className="px-5 py-3 flex items-center justify-between gap-4 transition-colors hover:bg-white/[0.02]"
                        >
                          <div className="flex-1 min-w-0">
                            <p className="text-xs sm:text-sm font-bold text-white/90 truncate leading-tight">
                              {depense.titre}
                            </p>
                            <p className="text-[10px] text-zinc-500 font-medium leading-none mt-1">
                              {formatDate(depense.creerLe)}
                            </p>
                          </div>

                          <div className="w-32 flex-shrink-0 flex justify-start">
                            <span
                              className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full whitespace-nowrap uppercase tracking-wider ${badgeClass}`}
                            >
                              {depense.category === "Top Craquage"
                                ? "TOP CRAQUAGE"
                                : depense.category.toUpperCase()}
                            </span>
                          </div>

                          <div className="w-28 flex-shrink-0 text-right">
                            <p
                              className="text-sm sm:text-base font-black tracking-tight"
                              style={{ color: "#ED93B1" }}
                            >
                              {depense.prix.toLocaleString("fr-FR", {
                                style: "currency",
                                currency: "EUR",
                              })}
                            </p>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>

                <div
                  className="px-5 py-3 flex items-center justify-between gap-2 mt-auto"
                  style={{ borderTop: "1px solid rgba(202,60,102,0.12)" }}
                >
                  <p
                    className="text-[10px] font-bold uppercase tracking-[0.12em]"
                    style={{ color: "#A7E0E0" }}
                  >
                    Total :{" "}
                    <span style={{ color: "#ED93B1" }}>
                      {total.toLocaleString("fr-FR", {
                        style: "currency",
                        currency: "EUR",
                      })}
                    </span>
                  </p>
                  <Link
                    href="/historique"
                    className="flex items-center gap-1 px-3 py-1.5 rounded-xl text-[10px] font-bold transition-all whitespace-nowrap"
                    style={{
                      background: "rgba(202,60,102,0.12)",
                      border: "1px solid rgba(202,60,102,0.25)",
                      color: "#ED93B1",
                    }}
                  >
                    Voir tout
                    <svg
                      className="w-3 h-3"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}
