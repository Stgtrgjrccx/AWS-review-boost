import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// GET /api/feedback — fetch all feedback for the business
export async function GET(req) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const business = await prisma.business.findUnique({ where: { ownerId: session.user.id } })
    if (!business) return NextResponse.json({ feedbacks: [] })

    const feedbacks = await prisma.feedback.findMany({
      where: { businessId: business.id },
      orderBy: { createdAt: 'desc' },
      include: { customer: { select: { name: true, phone: true } } },
    })

    return NextResponse.json({ feedbacks })
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
