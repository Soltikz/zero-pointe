// app/api/votes/depenses/route.ts
import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

function getLimitesSemaine() {
  const maintenant = new Date()
  const lundi = new Date(maintenant)
  const jour = lundi.getDay()
  const décalage = jour === 0 ? -6 : 1 - jour
  lundi.setDate(lundi.getDate() + décalage)
  lundi.setHours(0, 0, 0, 0)

  const dimanche = new Date(lundi)
  dimanche.setDate(dimanche.getDate() + 6)
  dimanche.setHours(23, 59, 59, 999)

  return { lundi, dimanche }
}

export async function GET() {
  const { lundi, dimanche } = getLimitesSemaine()

  const depenses = await prisma.depense.findMany({
    where: {
      creerLe: { gte: lundi, lte: dimanche },
    },
    include: {
      votes: { select: { type: true } },
    },
  })

  const result = depenses
    .map(d => {
      const rejets = d.votes.filter(v => v.type === 'SHAMEFUL').length
      const approbations = d.votes.filter(v => v.type === 'VALIDATED').length
      return { ...d, rejets, approbations }
    })
    .sort((a, b) => b.rejets - a.rejets)

  return NextResponse.json(result)
}