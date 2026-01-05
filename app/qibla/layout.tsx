
import { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Qibla Finder',
    description: 'Locate the Qibla direction (Kaaba) accurately from your current location for prayer.',
}

export default function QiblaLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return <>{children}</>
}
