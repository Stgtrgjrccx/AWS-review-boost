import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function POST(req) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const body = await req.json()
    const { name, slug, industry, googleReviewUrl, yelpUrl, tripadvisorUrl, brandColor, ctaButtonText } = body

    if (!name || !slug) {
      return NextResponse.json({ error: 'Name and slug are required' }, { status: 400 })
    }

    // Check slug uniqueness
    const existing = await prisma.business.findUnique({ where: { slug } })
    if (existing && existing.ownerId !== session.user.id) {
      return NextResponse.json({ error: 'This URL is already taken. Please choose another.' }, { status: 409 })
    }

    const business = await prisma.business.upsert({
      where: { ownerId: session.user.id },
      update: { name, slug, industry, googleReviewUrl, yelpUrl, tripadvisorUrl, brandColor, ctaButtonText, onboardingDone: true },
      create: {
        ownerId: session.user.id,
        name, slug, industry,
        googleReviewUrl, yelpUrl, tripadvisorUrl,
        brandColor: brandColor || '#6366f1',
        ctaButtonText: ctaButtonText || 'Share Your Experience',
        onboardingDone: true,
      },
    })

    return NextResponse.json({ success: true, business })
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
