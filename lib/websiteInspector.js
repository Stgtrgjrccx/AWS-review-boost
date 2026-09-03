/**
 * Real-time Website Health, Uptime, and Status Inspector
 * Pings client domains, checks HTTP response time, and tracks live status
 */
export async function inspectLiveWebsite(url) {
  if (!url || !url.startsWith('http')) {
    return { status: 'offline', responseTimeMs: 0, ssl: 'Not configured', statusCode: 0 }
  }

  const startTime = Date.now()
  try {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 6000)

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'User-Agent': 'ASW-Uptime-Monitor/2.0 (+https://asw.agency)',
      },
      signal: controller.signal,
      cache: 'no-store',
    })
    clearTimeout(timeoutId)

    const responseTimeMs = Date.now() - startTime
    const isOk = response.status >= 200 && response.status < 400
    const isHttps = url.startsWith('https://')

    return {
      status: isOk ? 'live' : 'degraded',
      statusCode: response.status,
      responseTimeMs,
      ssl: isHttps ? 'Active 🟢' : 'Missing SSL ⚠️',
      lastChecked: new Date().toISOString(),
    }
  } catch (err) {
    const responseTimeMs = Date.now() - startTime
    return {
      status: 'offline',
      statusCode: 0,
      responseTimeMs,
      ssl: 'Offline',
      error: err.name === 'AbortError' ? 'Timeout (>6s)' : 'Network unreachable',
      lastChecked: new Date().toISOString(),
    }
  }
}
