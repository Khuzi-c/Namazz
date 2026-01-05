
import { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Leaderboard',
    description: 'Compete with the Ummah. Track your prayer streaks and see where you stand among other believers.',
}

export default function LeaderboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return <>{children}</>
}
