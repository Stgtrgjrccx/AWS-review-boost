import { NextResponse } from 'next/server'
import { getAllClients } from '@/lib/clients'

export async function GET(req) {
  try {
    const clients = getAllClients()
    // Consolidate all intercepted complaints across clients
    const allFeedbacks = clients.flatMap(c =>
      (c.interceptedFeedback || []).map(f => ({
        ...f,
        clientName: c.name,
        clientSlug: c.slug,
        customer: { name: f.customer, phone: f.phone },
      }))
    )

    return NextResponse.json({ feedbacks: allFeedbacks })
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
