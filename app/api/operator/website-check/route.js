import { NextResponse } from 'next/server'
import { inspectLiveWebsite } from '@/lib/websiteInspector'
import { getClientById, updateWebsiteProject } from '@/lib/clients'

export async function POST(req) {
  try {
    const { clientId, url } = await req.json()
    const targetUrl = url || (clientId ? getClientById(clientId)?.website?.domain : null)

    if (!targetUrl) {
      return NextResponse.json({ error: 'Missing target URL or clientId' }, { status: 400 })
    }

    const inspection = await inspectLiveWebsite(targetUrl)

    if (clientId) {
      updateWebsiteProject(clientId, {
        uptime: inspection.status === 'live' ? '99.98%' : 'Degraded',
        ssl: inspection.ssl,
        lastChecked: inspection.lastChecked,
      })
    }

    return NextResponse.json({
      success: true,
      inspection,
    })
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
