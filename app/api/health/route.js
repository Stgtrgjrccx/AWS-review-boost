import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({
    status: 'operational',
    service: 'ASW Review Boost Cloud Engine',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    gateway: 'online',
  })
}
