// app/actions/auth.ts
'use server'

import prisma from "@/lib/prisma"

export async function inscriptionUser(formData: FormData) {
    // 1. On récupère les données du formulaire
    const email = formData.get('email') as string
    const mdp = formData.get('password') as string
    const pseudo = formData.get('pseudo') as string

    // Sécurité de base
    if (!email || !mdp || !pseudo) {
        return { error: "Tous les champs sont obligatoires." }
    }

    try {
        // 2. On vérifie si l'email existe déjà dans la BDD
        const existeDeja = await prisma.user.findUnique({
            where: { email: email }
        })

        if (existeDeja) {
            return { error: "Cet email est déjà utilisé." }
        }

        // 3. On crée l'utilisateur dans la base de données
        // (Note : Si le prof utilise du hachage comme bcrypt, il faudra modifier cette partie)
        await prisma.user.create({
            data: {
                email: email,
                mdp: mdp, // Stocké en clair pour correspondre à ton authorize actuel
                pseudo: pseudo
            }
        })

        return { success: "Inscription réussie ! Vous pouvez vous connecter." }

    } catch (error) {
        console.error(error)
        return { error: "Une erreur est survenue lors de l'inscription." }
    }
}