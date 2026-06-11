// app/api/votes/route.ts

import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import prisma from '@/lib/prisma'

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)

  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })
  }

  const { depenseId, type } = await req.json()

  if (!depenseId || !['SHAMEFUL', 'VALIDATED'].includes(type)) {
    return NextResponse.json({ error: 'Données invalides' }, { status: 400 })
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  })

  if (!user) {
    return NextResponse.json({ error: 'Utilisateur introuvable' }, { status: 404 })
  }

  const voteExistant = await prisma.vote.findUnique({
    where: { userId_depenseId: { userId: user.id, depenseId } },
  })

  if (voteExistant) {
    if (voteExistant.type === type) {
      // Toggle : supprimer si même vote
      await prisma.vote.delete({
        where: { userId_depenseId: { userId: user.id, depenseId } },
      })
    } else {
      // Changer le type
      await prisma.vote.update({
        where: { userId_depenseId: { userId: user.id, depenseId } },
        data: { type },
      })
    }
  } else {
    // Nouveau vote
    await prisma.vote.create({
      data: { userId: user.id, depenseId, type },
    })
  }

  // Recompter
  const votes = await prisma.vote.findMany({
    where: { depenseId },
    select: { type: true, userId: true },
  })

  const rejets = votes.filter(v => v.type === 'SHAMEFUL').length
  const approbations = votes.filter(v => v.type === 'VALIDATED').length
  const monVote = votes.find(v => v.userId === user.id)?.type ?? null

  return NextResponse.json({ rejets, approbations, monVote })
}