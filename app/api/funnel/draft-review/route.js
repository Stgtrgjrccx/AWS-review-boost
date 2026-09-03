import { NextResponse } from 'next/server'
import { generateConsumerReviewDraft } from '@/lib/gemini'

export async function POST(req) {
  try {
    const body = await req.json()
    const {
      businessName,
      industry = 'restaurant',
      rating = 5,
      selectedTags = [],
      customNotes = '',
      tone = 'enthusiastic'
    } = body

    if (!businessName) {
      return NextResponse.json({ error: 'businessName required' }, { status: 400 })
    }

    const review = await generateConsumerReviewDraft({
      businessName,
      industry,
      rating,
      selectedTags,
      customNotes,
      tone
    })

    return NextResponse.json({ review, success: true })
  } catch (error) {
    console.error('Error in /api/funnel/draft-review:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
