import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import prisma from "@/lib/prisma"
import { writeFile, mkdir } from "fs/promises"
import { join } from "path"

export async function POST(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions)

        if (!session?.user?.email) {
            return NextResponse.json({ error: "Non autorisé" }, { status: 401 })
        }

        const form = await req.formData()
        const fichier = form.get("avatar") as File

        if (!fichier || !fichier.type.startsWith("image/")) {
            return NextResponse.json({ error: "Fichier invalide" }, { status: 400 })
        }

        // Limite 2Mo
        if (fichier.size > 2 * 1024 * 1024) {
            return NextResponse.json({ error: "Image trop lourde (max 2Mo)" }, { status: 400 })
        }

        const bytes = await fichier.arrayBuffer()
        const buffer = Buffer.from(bytes)

        // Nom unique basé sur l'email
        const ext = fichier.name.split(".").pop() ?? "jpg"
        const nomFichier = `${session.user.email.replace(/[^a-z0-9]/gi, "_")}.${ext}`

        // Dossier public/avatars
        const dossier = join(process.cwd(), "public", "avatars")
        await mkdir(dossier, { recursive: true })
        await writeFile(join(dossier, nomFichier), buffer)

        const cheminImage = `/avatars/${nomFichier}`

        // Sauvegarder le chemin en BDD
        await prisma.user.update({
            where: { email: session.user.email },
            data: { image: cheminImage },
        })

        return NextResponse.json({ ok: true, image: cheminImage })

    } catch (erreur) {
        console.error("Erreur upload avatar :", erreur)
        return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
    }
}