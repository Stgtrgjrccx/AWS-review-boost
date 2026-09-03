import { NextResponse } from 'next/server'
import { getClientBySlug } from '@/lib/clients'

export async function GET(req, { params }) {
  const { slug } = params
  const client = getClientBySlug(slug)

  if (!client) {
    return NextResponse.json({ error: 'Client portal not found' }, { status: 404 })
  }

  // Return live, non-interactive customer-facing reporting data
  return NextResponse.json({
    client: {
      name: client.name,
      slug: client.slug,
      industry: client.industry,
      brandColor: client.brandColor,
      status: client.status,
      googleReviewUrl: client.googleReviewUrl,
    },
    metrics: {
      avgRating: client.avgRating,
      fiveStarCount: client.fiveStarCount,
      fourStarCount: client.fourStarCount,
      totalReviewsDriven: client.fiveStarCount + client.fourStarCount,
      shieldedComplaints: client.interceptedCount,
      reviewsSent: client.reviewsSent,
      conversionRate: client.conversionRate,
    },
    recentActivity: client.recentActivity,
    customerPraises: client.customerPraises,
    lastUpdated: new Date().toISOString(),
  })
}
