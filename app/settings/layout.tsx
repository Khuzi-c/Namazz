
import { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Settings',
    description: 'Customize your Namazz experience. Manage profile, notifications, appearance, and privacy settings.',
}

export default function SettingsLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return <>{children}</>
}
