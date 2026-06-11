// app/api/auth/[...nextauth]/route.ts

import NextAuth, { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import prisma from "@/lib/prisma"

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "text" },
                password: { label: "Mot de passe", type: "password" }
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    return null
                }

                const user = await prisma.user.findUnique({
                    where: { email: credentials.email }
                })

                if (user && user.mdp === credentials.password) {
                    return { id: user.id, name: user.pseudo, email: user.email }
                }

                return null
            }
        })
    ],
    pages: {
        signIn: '/auth',
    },
    secret: process.env.NEXTAUTH_SECRET,
    // --- CE BLOC MANQUAIT ---
    callbacks: {
        async jwt({ token, user }) {
            // Étape 1 : On passe l'id de l'utilisateur dans le token JWT
            if (user) {
                token.id = user.id
            }
            return token
        },
        async session({ session, token }) {
            // Étape 2 : On récupère l'id du token pour le rendre accessible dans getServerSession()
            if (session.user && token) {
                session.user.id = token.id as string
            }
            return session
        }
    }
    // ------------------------
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }