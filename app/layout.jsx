import './globals.css'
import { Inter } from 'next/font/google'
import Providers from './providers'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'ReviewBoost Pro — Turn Every Customer Into a 5-Star Review',
  description: 'The smart review management platform that helps businesses get more Google reviews through WhatsApp, SMS, and AI-powered funnels.',
  keywords: 'review management, Google reviews, review boosting, customer feedback, reputation management',
  openGraph: {
    title: 'ReviewBoost Pro',
    description: 'Turn Every Customer Into a 5-Star Review',
    type: 'website',
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" data-theme="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className={inter.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
