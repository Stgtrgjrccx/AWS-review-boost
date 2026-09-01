import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(req) {
  try {
    const { requestId } = await req.json()

    if (!requestId) return NextResponse.json({ ok: true })

    await prisma.reviewRequest.update({
      where: { id: requestId },
      data: { clickedAt: new Date(), status: 'clicked' },
    }).catch(() => {}) // Silent fail — tracking is non-critical

    return NextResponse.json({ ok: true })
  } catch (error) {
    return NextResponse.json({ ok: true }) // Always succeed — non-critical
  }
}
