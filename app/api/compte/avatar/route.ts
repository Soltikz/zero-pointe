import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import prisma from "@/lib/prisma"
import { v2 as cloudinary } from "cloudinary"

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
})

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

        if (fichier.size > 2 * 1024 * 1024) {
            return NextResponse.json({ error: "Image trop lourde (max 2Mo)" }, { status: 400 })
        }

        const bytes = await fichier.arrayBuffer()
        const buffer = Buffer.from(bytes)

        const base64 = `data:${fichier.type};base64,${buffer.toString("base64")}`

        const upload = await cloudinary.uploader.upload(base64, {
            folder: "avatars",
            public_id: session.user.email.replace(/[^a-z0-9]/gi, "_"),
            overwrite: true,
        })

        const cheminImage = upload.secure_url

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