import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { sendSMS } from '@/lib/twilio'
import { recordClientReview, getClientBySlug } from '@/lib/clients'

export async function POST(req) {
  try {
    const { slug, requestId, starRating, quickTags, comment, platformRedirected, customerName } = await req.json()

    // Always record into the operator's live client store for real-time live dashboard sync
    recordClientReview(slug, starRating, comment, quickTags, customerName || 'Customer')

    // Also persist to Prisma if database is connected
    try {
      const business = await prisma.business.findUnique({
        where: { slug },
      })

      if (business) {
        if (requestId) {
          await prisma.reviewRequest.update({
            where: { id: requestId },
            data: {
              starRating,
              platformRedirected: platformRedirected || null,
              status: 'delivered',
            },
          }).catch(() => {})
        }

        if (starRating && starRating <= 3) {
          await prisma.feedback.create({
            data: {
              businessId: business.id,
              starRating,
              quickTags: quickTags || [],
              comment: comment || null,
            },
          }).catch(() => {})
        }
      }
    } catch {
      // Non-blocking if offline
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Submit feedback error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
