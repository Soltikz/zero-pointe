// app/compte/page.tsx
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import BoutonDeconnexion from "../composants/boutondeco";
import BoutonSuppression from "../composants/boutonsuppression";
import AvatarEditable from "../composants/avatareditabel";
import GraphiqueActivite from "../composants/graphiqueactivite";
import BoutonRetour from "../composants/boutonretour";

export default async function PageCompte() {
  const session = await getServerSession();

  if (!session?.user?.email) {
    redirect("/auth");
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: {
      pseudo: true,
      email: true,
      image: true,
      inscritLe: true,
      _count: {
        select: {
          votes: true,
          depense: true,
        },
      },
    },
  });

  const initiale = (user?.pseudo || user?.email || "?")[0].toUpperCase();

  const dateInscription = user?.inscritLe
    ? new Intl.DateTimeFormat("fr-FR", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      }).format(new Date(user.inscritLe))
    : null;

  const nbVotes = user?._count?.votes ?? 0;
  const nbDepenses = user?._count?.depense ?? 0;

  const maintenant = new Date();
  const debut12Mois = new Date(maintenant);
  debut12Mois.setMonth(debut12Mois.getMonth() - 11);
  debut12Mois.setDate(1);
  debut12Mois.setHours(0, 0, 0, 0);

  const depensesBrutes = await prisma.depense.findMany({
    where: {
      user: { email: session.user.email },
      creerLe: { gte: debut12Mois },
    },
    select: {
      prix: true,
      creerLe: true,
    },
  });

  const totauxParCle: Record<string, number> = {};
  for (const d of depensesBrutes) {
    const cle = `${d.creerLe.getFullYear()}-${d.creerLe.getMonth()}`;
    totauxParCle[cle] = (totauxParCle[cle] ?? 0) + Number(d.prix);
  }

  const nomsMois = [
    "jan",
    "fév",
    "mar",
    "avr",
    "mai",
    "juin",
    "juil",
    "aoû",
    "sep",
    "oct",
    "nov",
    "déc",
  ];

  const donneesGraphique = Array.from({ length: 12 }, (_, i) => {
    const d = new Date(maintenant);
    d.setMonth(d.getMonth() - (11 - i));
    const cle = `${d.getFullYear()}-${d.getMonth()}`;
    return {
      label: nomsMois[d.getMonth()], // Aligné sur le type 'label' du composant
      valeur: Math.round(totauxParCle[cle] ?? 0),
    };
  });

  const totalAnnuel = depensesBrutes.reduce(
    (acc, d) => acc + Number(d.prix),
    0,
  );

  const debutMoisActuel = new Date(
    maintenant.getFullYear(),
    maintenant.getMonth(),
    1,
  );
  const totalMoisActuel = depensesBrutes
    .filter((d) => d.creerLe >= debutMoisActuel)
    .reduce((acc, d) => acc + Number(d.prix), 0);

  return (
    <div className="min-h-screen bg-[#080808] text-zinc-100 flex flex-col antialiased">
      {/* Header */}
      <header className="border-b border-white/15 py-5 sticky top-0 z-10 bg-[#080808]/95 backdrop-blur-md w-full">
        <div className="w-full px-8 flex items-center justify-between">
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
                Mon Compte{" "}
              </h1>
            </div>
          </div>
          <div className="hidden sm:flex flex-col items-end gap-1">
            <span className="text-[10px] uppercase tracking-[2.5px] text-zinc-300 font-bold">
              total craqué
            </span>
            <span className="text-2xl font-black text-[#FF4A7D]">
              {totalAnnuel.toLocaleString("fr-FR", {
                style: "currency",
                currency: "EUR",
                maximumFractionDigits: 0,
              })}
            </span>
            <span className="text-[10px] text-zinc-400 font-medium">
              sur 12 mois
            </span>
          </div>
        </div>
      </header>

      <main className="flex-1 w-full px-8 py-10 flex flex-col gap-8">
        {/* Hero profil */}
        <div className="relative flex items-center gap-8 p-8 rounded-2xl bg-[#0d0d0d] border border-white/15 overflow-hidden">
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              backgroundImage:
                "radial-gradient(circle at 85% 50%, rgba(255,74,125,0.15) 0%, transparent 60%)",
            }}
          />
          <AvatarEditable
            initiale={initiale}
            imageActuelle={user?.image ?? null}
          />
          <div className="flex-1 min-w-0">
            <h2 className="text-3xl font-black text-white leading-tight truncate">
              {user?.pseudo || "membre du caniveau"}
            </h2>
            <p className="text-xs text-[#B2F0F0] uppercase tracking-[3px] mt-2 font-bold bg-[#142d2d] px-2.5 py-1 rounded-md inline-block border border-[#A7E0E0]/20">
              membre du tribunal
            </p>
          </div>
          <div className="hidden sm:flex flex-col items-end shrink-0 gap-1">
            <span className="text-[10px] uppercase tracking-[2px] text-zinc-400 font-bold">
              membre depuis
            </span>
            <span className="text-base font-bold text-white">
              {dateInscription ?? "—"}
            </span>
          </div>
        </div>

        {/* Grille principale 3 colonnes */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
          {/* ── Colonne 1 : informations + déconnexion ── */}
          <div className="flex flex-col gap-5 h-full">
            <div className="bg-[#0d0d0d] border border-white/15 rounded-2xl overflow-hidden flex-1">
              <div className="px-6 py-4 border-b border-white/10 bg-white/[0.02]">
                <p className="text-[11px] uppercase tracking-[2.5px] text-zinc-300 font-extrabold">
                  informations
                </p>
              </div>

              {/* Pseudo */}
              <div className="px-6 py-5 flex items-center gap-4 border-b border-white/10 hover:bg-white/[0.04] transition-colors cursor-pointer">
                <div className="w-9 h-9 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center shrink-0">
                  <svg
                    className="w-4 h-4 text-zinc-200"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[9px] uppercase tracking-[2px] text-zinc-400 font-bold">
                    pseudo
                  </p>
                  <p className="text-sm text-white font-bold mt-0.5 truncate">
                    {user?.pseudo || "—"}
                  </p>
                </div>
              </div>

              {/* Email */}
              <div className="px-6 py-5 flex items-center gap-4 border-b border-white/10 hover:bg-white/[0.04] transition-colors cursor-pointer">
                <div className="w-9 h-9 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center shrink-0">
                  <svg
                    className="w-4 h-4 text-zinc-200"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[9px] uppercase tracking-[2px] text-zinc-400 font-bold">
                    email
                  </p>
                  <p className="text-sm text-white font-bold mt-0.5 truncate">
                    {user?.email}
                  </p>
                </div>
              </div>

              {/* Mot de passe */}
              <div className="px-6 py-5 flex items-center gap-4 hover:bg-white/[0.04] transition-colors cursor-pointer">
                <div className="w-9 h-9 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center shrink-0">
                  <svg
                    className="w-4 h-4 text-zinc-200"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                    />
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[9px] uppercase tracking-[2px] text-zinc-400 font-bold">
                    mot de passe
                  </p>
                  <p className="text-sm text-zinc-400 tracking-widest mt-0.5 select-none font-bold">
                    ••••••••••
                  </p>
                </div>
              </div>
            </div>

            <BoutonDeconnexion />
          </div>

          {/* ── Colonne 2 : graphique ── */}
          {/* Ajout de flex flex-col pour que la boîte s'allonge correctement et affiche l'enfant complet */}
          <div className="flex flex-col gap-5 h-full">
            <div className="bg-[#0d0d0d] border border-white/15 rounded-2xl overflow-hidden flex-1 flex flex-col">
              <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between bg-white/[0.02] flex-shrink-0">
                <p className="text-[11px] uppercase tracking-[2.5px] text-zinc-300 font-extrabold">
                  dépenses / mois
                </p>
                <span className="text-[10px] text-zinc-400 font-bold bg-white/10 px-2 py-0.5 rounded">
                  12 mois
                </span>
              </div>
              <div className="flex-1">
                <GraphiqueActivite
                  donnees={donneesGraphique}
                  couleurPrincipale="#FF4A7D"
                />
              </div>
            </div>
          </div>

          {/* ── Colonne 3 : stats + zone dangereuse ── */}
          <div className="flex flex-col gap-5 h-full">
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-[#0d0d0d] border border-white/15 rounded-2xl p-4 flex flex-col gap-1">
                <p className="text-2xl font-black text-white">{nbVotes}</p>
                <p className="text-[9px] uppercase tracking-[1.5px] text-zinc-300 font-extrabold leading-tight">
                  affaires traitées
                </p>
              </div>

              <div className="bg-[#0d0d0d] border border-white/15 rounded-2xl p-4 flex flex-col gap-1">
                <p className="text-2xl font-black text-white">{nbDepenses}</p>
                <p className="text-[9px] uppercase tracking-[1.5px] text-zinc-300 font-extrabold leading-tight">
                  dossiers soumis
                </p>
              </div>

              <div
                className="bg-[#0d0d0d] rounded-2xl p-4 flex flex-col gap-1"
                style={{ border: "1px solid rgba(255,74,125,0.50)" }}
              >
                <p className="text-2xl font-black text-[#FF4A7D]">
                  {totalMoisActuel.toLocaleString("fr-FR", {
                    style: "currency",
                    currency: "EUR",
                    maximumFractionDigits: 0,
                  })}
                </p>
                <p className="text-[9px] uppercase tracking-[1.5px] text-[#FF4A7D] font-extrabold leading-tight">
                  ce mois-ci
                </p>
              </div>
            </div>

            <div className="bg-[#0d0d0d] border border-red-500/40 rounded-2xl overflow-hidden flex-1 shadow-lg shadow-red-950/20">
              <div className="px-6 py-4 border-b border-red-500/20 flex items-center gap-2 bg-red-950/20">
                <svg
                  className="w-4 h-4 text-red-400"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
                <p className="text-[11px] uppercase tracking-[2.5px] text-red-400 font-extrabold">
                  zone dangereuse
                </p>
              </div>
              <div className="p-6 flex flex-col gap-5">
                <div>
                  <p className="text-base text-white font-bold">
                    Supprimer mon compte
                  </p>
                  <p className="text-sm text-zinc-300 mt-2 leading-relaxed font-medium">
                    Action irréversible — tous tes votes et dépenses seront
                    définitivement effacés du serveur.
                  </p>
                </div>
                <BoutonSuppression />
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="border-t border-white/10 py-6 mt-4 bg-black/40">
        <div className="w-full px-8 text-center">
          <p className="text-zinc-400 text-xs font-medium">
            &copy; {new Date().getFullYear()} Zéro Pointé — aucun droit réservé.
          </p>
        </div>
      </footer>
    </div>
  );
}
