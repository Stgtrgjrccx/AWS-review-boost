import { NextResponse } from 'next/server'
import { getAllClients, createClient } from '@/lib/clients'

export async function GET() {
  const clients = getAllClients()
  return NextResponse.json({ clients })
}

export async function POST(req) {
  try {
    const body = await req.json()
    const { name, slug, industry, googleReviewUrl, phone, brandColor } = body
    if (!name) {
      return NextResponse.json({ error: 'Client name required' }, { status: 400 })
    }
    const client = createClient({ name, slug, industry, googleReviewUrl, phone, brandColor })
    return NextResponse.json({ success: true, client })
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
