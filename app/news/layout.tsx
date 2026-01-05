
import { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Islamic Insights',
    description: 'Stay updated with the latest Islamic news, RSS feeds, and community insights from around the Muslim world.',
}

export default function NewsLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return <>{children}</>
}
