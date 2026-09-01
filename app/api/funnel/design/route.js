import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getFunnelDesign } from '@/lib/gemini'

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url)
    const slug = searchParams.get('slug')

    if (!slug) {
      return NextResponse.json({ error: 'slug required' }, { status: 400 })
    }

    const business = await prisma.business.findUnique({
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

    if (!business) {
      return NextResponse.json({ error: 'Business not found' }, { status: 404 })
    }

    const design = getFunnelDesign(business.industry)

    return NextResponse.json({ business, design })
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
