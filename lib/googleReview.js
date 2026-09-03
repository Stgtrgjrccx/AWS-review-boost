/**
 * Formats Google URLs to open the direct 5-star review dialog popup immediately
 */
export function formatDirectReviewUrl(inputUrl) {
  if (!inputUrl) return ''
  const trimmed = inputUrl.trim()

  // If already a direct writereview link, keep it
  if (trimmed.includes('search.google.com/local/writereview')) {
    return trimmed
  }

  // If input is just a Place ID (starts with ChIJ...)
  if (trimmed.startsWith('ChIJ') && !trimmed.includes('http')) {
    return `https://search.google.com/local/writereview?placeid=${trimmed}`
  }

  // If URL contains placeid parameter
  const match = trimmed.match(/placeid=([a-zA-Z0-9_\-]+)/i)
  if (match && match[1]) {
    return `https://search.google.com/local/writereview?placeid=${match[1]}`
  }

  // If g.page review link (e.g. https://g.page/r/XYZ/review)
  if (trimmed.includes('g.page') && !trimmed.endsWith('/review')) {
    return `${trimmed.replace(/\/$/, '')}/review`
  }

  return trimmed
}
