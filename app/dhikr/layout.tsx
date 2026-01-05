
import { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Digital Tasbih',
    description: 'Perform Dhikr (Remembrance of Allah) with our digital counter. Select from common Adhkar or create your own.',
}

export default function DhikrLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return <>{children}</>
}
