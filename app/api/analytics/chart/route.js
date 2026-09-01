import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// Chart data for last 7 days
export async function GET(req) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) return NextResponse.json({ data: [] })

    const business = await prisma.business.findUnique({ where: { ownerId: session.user.id } })
    if (!business) return NextResponse.json({ data: [] })

    const days = 7
    const data = []
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date()
      date.setDate(date.getDate() - i)
      const start = new Date(date.setHours(0, 0, 0, 0))
      const end = new Date(date.setHours(23, 59, 59, 999))

      const [sent, clicked] = await Promise.all([
        prisma.reviewRequest.count({ where: { businessId: business.id, createdAt: { gte: start, lte: end } } }),
        prisma.reviewRequest.count({ where: { businessId: business.id, clickedAt: { gte: start, lte: end } } }),
      ])

      data.push({
        date: start.toLocaleDateString('en-IN', { weekday: 'short' }),
        sent,
        clicked,
      })
    }

    return NextResponse.json({ data })
  } catch {
    return NextResponse.json({ data: [] })
  }
}
