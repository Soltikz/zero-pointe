import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import prisma from "@/lib/prisma"

export async function DELETE() {
    try {
        const session = await getServerSession(authOptions)

        if (!session?.user?.email) {
            return NextResponse.json({ error: "Non autorisé" }, { status: 401 })
        }

        const user = await prisma.user.findUnique({
            where: { email: session.user.email },
            select: { id: true }
        })

        if (!user) {
            return NextResponse.json({ error: "Utilisateur introuvable" }, { status: 404 })
        }

        await prisma.user.delete({
            where: { id: user.id },
        })

        return NextResponse.json({ ok: true })

    } catch (erreur) {
        console.error("Erreur suppression compte :", erreur)
        return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
    }
}