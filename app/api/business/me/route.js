import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(req) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const business = await prisma.business.findUnique({
      where: { ownerId: session.user.id },
      select: { id: true, name: true, slug: true, industry: true, logoUrl: true, brandColor: true },
    })

    return NextResponse.json(business || {})
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
