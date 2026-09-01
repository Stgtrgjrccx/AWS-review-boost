import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(req) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const business = await prisma.business.findUnique({
      where: { ownerId: session.user.id },
    })

    if (!business) {
      return NextResponse.json({ sent: 0, clicked: 0, rated: 0, avgRating: 0, negativeFeedback: 0, conversionRate: 0 })
    }

    const [sent, clicked, rated, feedbackData, negFeedback] = await Promise.all([
      prisma.reviewRequest.count({ where: { businessId: business.id } }),
      prisma.reviewRequest.count({ where: { businessId: business.id, clickedAt: { not: null } } }),
      prisma.reviewRequest.count({ where: { businessId: business.id, starRating: { not: null } } }),
      prisma.reviewRequest.aggregate({
        where: { businessId: business.id, starRating: { not: null } },
        _avg: { starRating: true },
      }),
      prisma.feedback.count({ where: { businessId: business.id } }),
    ])

    const conversionRate = sent > 0 ? Math.round((clicked / sent) * 100) : 0
    const avgRating = feedbackData._avg.starRating ? Math.round(feedbackData._avg.starRating * 10) / 10 : 0

    return NextResponse.json({ sent, clicked, rated, avgRating, negativeFeedback: negFeedback, conversionRate })
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
