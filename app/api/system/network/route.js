import { NextResponse } from 'next/server'
import os from 'os'

export async function GET() {
  try {
    const interfaces = os.networkInterfaces()
    const ips = []
    for (const name of Object.keys(interfaces)) {
      for (const net of interfaces[name] || []) {
        if (net.family === 'IPv4' && !net.internal) {
          ips.push(net.address)
        }
      }
    }
    const localIp = ips[0] || 'localhost'
    const port = process.env.PORT || 3000
    const wifiBase = `http://${localIp}:${port}`
    const localhostBase = `http://localhost:${port}`

    return NextResponse.json({
      localIp,
      port,
      wifiBase,
      localhostBase,
    })
  } catch (e) {
    return NextResponse.json({
      localIp: 'localhost',
      port: 3000,
      wifiBase: 'http://localhost:3000',
      localhostBase: 'http://localhost:3000',
    })
  }
}
