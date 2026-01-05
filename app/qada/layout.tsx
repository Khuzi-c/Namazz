
import { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Qada Bank',
    description: 'Track and repay your missed (Qada) prayers easily. Calculate your total debt and maintain your spiritual accountability.',
}

export default function QadaLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return <>{children}</>
}
