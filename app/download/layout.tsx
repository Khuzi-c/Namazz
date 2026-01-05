
import { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Download App',
    description: 'Install Namazz on Android, iOS, and PC. Download APK or install as PWA.',
}

export default function DownloadLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return <>{children}</>
}
