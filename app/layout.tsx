import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import BottomNav from '@/components/BottomNav'
import PwaRegistrar from '@/components/PwaRegistrar'
import { ThemeProvider } from '@/components/ThemeProvider'
import TranslationWidget from '@/components/TranslationWidget'
import InfoTicker from '@/components/InfoTicker'
import InstallPrompt from '@/components/InstallPrompt'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: {
    default: 'Namazz',
    template: '%s | Namazz',
  },
  metadataBase: new URL('https://namazz.khxzi.shop'),
  description: 'Track your daily prayers (Salah/Namaz), read the Holy Quran, and maintain your spiritual consistency with elegance. Features include prayer times, Qibla direction context, and progress analytics.',
  keywords: ['Namazz', 'Salah', 'Prayer Tracker', 'Islam', 'Muslim', 'Quran', 'Prayer Times', 'Salah Tracker', 'Islamic App', 'Ramadan'],
  authors: [{ name: 'Khxzi Devs' }],
  creator: 'Khxzi Devs',
  publisher: 'Khxzi Devs',
  applicationName: 'Namazz',
  manifest: '/manifest.json',
  icons: {
    icon: '/icon.png',
    shortcut: '/icon.png',
    apple: '/icon.png',
    other: {
      rel: 'apple-touch-icon-precomposed',
      url: '/icon.png',
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://namazz.khxzi.shop',
    siteName: 'Namazz',
    title: 'Namazz - Daily Prayer & Quran Companion',
    description: 'Track your daily prayers and connect with your faith.',
    images: [
      {
        url: '/icon.png',
        width: 192,
        height: 192,
        alt: 'Namazz Logo',
      },
    ],
  },
  twitter: {
    card: 'summary',
    title: 'Namazz',
    description: 'Track your daily prayers and connect with your faith.',
    images: ['/icon.png'],
    creator: '@khxzidevs',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'google-site-verification-code', // Placeholder
  },
}

export const viewport: Viewport = {
  themeColor: '#10b981',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'WebSite',
              name: 'Namazz',
              alternateName: ['Namaz Counter', 'Salah Tracker', 'Muslim App'],
              url: 'https://namazz.khxzi.shop',
              potentialAction: {
                '@type': 'SearchAction',
                target: 'https://namazz.khxzi.shop/quran?q={search_term_string}',
                'query-input': 'required name=search_term_string'
              }
            }),
          }}
        />
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <InfoTicker />
          <PwaRegistrar />
          {children}
          <InstallPrompt />

          <TranslationWidget />

          <BottomNav />
        </ThemeProvider>
      </body>
    </html>
  )
}
