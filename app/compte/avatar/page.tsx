// app/api/compte/avatar/route.ts
import { getServerSession } from "next-auth"
import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { writeFile, mkdir } from "fs/promises"
import path from "path"

export async function POST(req: Request) {
    const session = await getServerSession()
    if (!session?.user?.email) {
        return NextResponse.json({ error: "non autorisé" }, { status: 401 })
    }

    const form = await req.formData()
    const fichier = form.get("avatar") as File | null
    if (!fichier) {
        return NextResponse.json({ error: "aucun fichier" }, { status: 400 })
    }

    // Sauvegarde dans /public/avatars/
    const buffer = Buffer.from(await fichier.arrayBuffer())
    const ext = fichier.name.split(".").pop() ?? "jpg"
    const nom = `${session.user.email.replace(/[^a-z0-9]/gi, "_")}.${ext}`
    const dossier = path.join(process.cwd(), "public", "avatars")
    await mkdir(dossier, { recursive: true })
    await writeFile(path.join(dossier, nom), buffer)

    const imageUrl = `/avatars/${nom}`

    // Met à jour la DB
    await prisma.user.update({
        where: { email: session.user.email },
        data: { image: imageUrl },
    })

    return NextResponse.json({ image: imageUrl })
}