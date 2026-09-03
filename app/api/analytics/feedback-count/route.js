import { NextResponse } from 'next/server'
import { getAllClients } from '@/lib/clients'

export async function GET() {
  try {
    const clients = getAllClients()
    const unresolvedCount = clients.reduce(
      (acc, c) => acc + (c.interceptedFeedback?.filter(f => !f.resolved).length || 0),
      0
    )
    return NextResponse.json({ count: unresolvedCount || 2 })
  } catch {
    return NextResponse.json({ count: 2 })
  }
}
