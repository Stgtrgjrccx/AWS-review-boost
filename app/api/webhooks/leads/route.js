import { NextResponse } from 'next/server'
import { getClientBySlug } from '@/lib/clients'

export async function POST(req) {
  try {
    const body = await req.json()
    const { clientSlug, name, phone, email, type, message } = body

    if (!clientSlug || !name) {
      return NextResponse.json({ error: 'Missing clientSlug or customer name' }, { status: 400 })
    }

    const client = getClientBySlug(clientSlug)
    if (!client) {
      return NextResponse.json({ error: 'Client property not found' }, { status: 404 })
    }

    if (!client.website) {
      client.website = { leadsCaptured: 0 }
    }
    client.website.leadsCaptured = (client.website.leadsCaptured || 0) + 1

    const leadTypeLabel = type || 'Website Inquiry'
    client.recentActivity.unshift({
      id: `lead-${Date.now()}`,
      type: 'web_lead',
      customer: name,
      time: 'Just now',
      note: `${leadTypeLabel} received via live website (${phone || email || 'Direct'})`
    })

    return NextResponse.json({
      success: true,
      message: 'Website lead successfully logged and synchronized with ASW Live Engine',
      totalLeads: client.website.leadsCaptured,
    })
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
