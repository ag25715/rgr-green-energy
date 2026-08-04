import './globals.css'
import { Providers } from './providers'

export const metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || 'https://rgrgreenenergy.com'),
  title: { default: 'RGR Green Energy — Premium Solar EPC in North Bengal', template: '%s | RGR Green Energy' },
  description: 'RGR Green Energy is a premium Solar EPC company delivering engineered rooftop, commercial, industrial and agricultural solar solutions across India.',
  keywords: ['solar epc','solar company','rooftop solar','commercial solar','industrial solar','agriculture solar','siliguri solar','north bengal solar','on grid solar','off grid solar','hybrid solar'],
  openGraph: {
    title: 'RGR Green Energy — Premium Solar EPC',
    description: 'Engineered solar solutions with premium execution. Homes, businesses, industries and farms.',
    type: 'website',
    locale: 'en_IN',
    siteName: 'RGR Green Energy',
  },
  twitter: { card: 'summary_large_image', title: 'RGR Green Energy', description: 'Engineered solar solutions' },
  robots: { index: true, follow: true },
  icons: { icon: '/favicon.ico' },
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
