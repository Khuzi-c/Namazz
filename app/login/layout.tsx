
import { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Login',
    description: 'Sign in to Namazz to track your daily prayers, access leaderboard, and sync your progress across devices.',
}

export default function LoginLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return <>{children}</>
}
