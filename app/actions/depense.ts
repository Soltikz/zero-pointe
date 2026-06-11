'use server'
import prisma from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'

export async function creerDepense(formData: FormData) {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
        throw new Error("Tu dois être connecté pour ajouter une dépense.")
    }
    const titre = formData.get('titre') as string
    const prix = parseFloat(formData.get('prix') as string)
    const categorie = formData.get('categorie') as string
    if (!titre || isNaN(prix) || !categorie) {
        throw new Error("Tous les champs sont obligatoires.")
    }
    try {
        await prisma.depense.create({
            data: {
                titre,
                prix,
                category: categorie,
                userId: session.user.id
            },
        })
        revalidatePath('/dashboard')
        revalidatePath('/historique')
    } catch (erreur) {
        console.error("Erreur lors de l'ajout du craquage :", erreur)
        throw new Error("Impossible d'enregistrer le craquage en bdd.")
    }
}