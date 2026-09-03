import { NextResponse } from 'next/server'
import { getAllProspects, createProspect, updateProspect, convertProspectToClient } from '@/lib/clients'

export async function GET() {
  const prospects = getAllProspects()
  return NextResponse.json({ prospects })
}

export async function POST(req) {
  try {
    const data = await req.json()
    if (!data.businessName) {
      return NextResponse.json({ error: 'Business name is required' }, { status: 400 })
    }
    const prospect = createProspect(data)
    return NextResponse.json({ success: true, prospect })
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function PATCH(req) {
  try {
    const { id, action, updates } = await req.json()
    if (!id) return NextResponse.json({ error: 'Missing prospect id' }, { status: 400 })

    if (action === 'convert') {
      const result = convertProspectToClient(id)
      return NextResponse.json({ success: true, ...result })
    }

    const updated = updateProspect(id, updates || {})
    return NextResponse.json({ success: true, prospect: updated })
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
