import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getFunnelDesign } from '@/lib/gemini'
import { getClientBySlug } from '@/lib/clients'

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url)
    const slug = searchParams.get('slug')

    if (!slug) {
      return NextResponse.json({ error: 'slug required' }, { status: 400 })
    }

    let business = null
    try {
      business = await prisma.business.findUnique({
        where: { slug },
        select: {
          id: true,
          name: true,
          industry: true,
          logoUrl: true,
          googleReviewUrl: true,
          yelpUrl: true,
          tripadvisorUrl: true,
          brandColor: true,
          ctaButtonText: true,
        },
      })
    } catch {
      // Fallback to client repository
    }

    if (!business) {
      const client = getClientBySlug(slug)
      if (client) {
        business = {
          id: client.id,
          name: client.name,
          industry: client.industry,
          logoUrl: null,
          googleReviewUrl: client.googleReviewUrl || 'https://google.com',
          yelpUrl: null,
          tripadvisorUrl: null,
          brandColor: client.brandColor || '#6366f1',
          ctaButtonText: 'Share Your Experience',
        }
      }
    }

    if (!business) {
      return NextResponse.json({ error: 'Business not found' }, { status: 404 })
    }

    const design = getFunnelDesign(business.industry)

    return NextResponse.json({ business, design })
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
