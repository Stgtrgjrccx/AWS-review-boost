import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { generatePersonalizedMessage } from '@/lib/gemini'

export async function POST(req) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { customerName } = await req.json()

    if (!customerName) {
      return NextResponse.json({ error: 'customerName required' }, { status: 400 })
    }

    const business = await prisma.business.findUnique({
      where: { ownerId: session.user.id },
      select: { name: true, industry: true },
    })

    if (!business) {
      return NextResponse.json({ error: 'Business not found' }, { status: 404 })
    }

    const message = await generatePersonalizedMessage(business.name, customerName, business.industry)
    return NextResponse.json({ message })
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
