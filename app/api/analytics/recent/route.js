import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(req) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) return NextResponse.json({ requests: [] })

    const business = await prisma.business.findUnique({ where: { ownerId: session.user.id } })
    if (!business) return NextResponse.json({ requests: [] })

    const requests = await prisma.reviewRequest.findMany({
      where: { businessId: business.id },
      orderBy: { createdAt: 'desc' },
      take: 10,
      include: { customer: { select: { name: true, phone: true } } },
    })

    return NextResponse.json({ requests })
  } catch {
    return NextResponse.json({ requests: [] })
  }
}
