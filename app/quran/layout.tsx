
import { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Holy Quran',
    description: 'Read and listen to the Holy Quran (Al-Qur\'an Al-Kareem) with translations and audio recitations.',
}

export default function QuranLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return <>{children}</>
}
