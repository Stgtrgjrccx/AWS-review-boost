import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(req) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) return NextResponse.json({ count: 0 })

    const business = await prisma.business.findUnique({ where: { ownerId: session.user.id } })
    if (!business) return NextResponse.json({ count: 0 })

    const count = await prisma.feedback.count({
      where: { businessId: business.id, resolved: false },
    })

    return NextResponse.json({ count })
  } catch {
    return NextResponse.json({ count: 0 })
  }
}
