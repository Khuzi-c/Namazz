
import { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Achievements',
    description: 'View your badges and progress unlocked by consistent prayer tracking.',
}

export default function AchievementsLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return <>{children}</>
}
