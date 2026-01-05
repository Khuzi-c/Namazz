import Link from 'next/link'
import { Compass } from 'lucide-react'

export default function NotFound() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-emerald-950 p-4 text-center">
            <div className="bg-emerald-100 dark:bg-emerald-900/50 p-6 rounded-full mb-6 animate-pulse">
                <Compass className="w-16 h-16 text-emerald-600 dark:text-emerald-400" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-emerald-50 mb-2">Page Not Found</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-sm">
                It seems you've lost your way. But don't worry, the path to prayer is always open.
            </p>
            <Link
                href="/"
                className="px-8 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-full font-bold transition-all shadow-lg hover:shadow-xl active:scale-95"
            >
                Return Home
            </Link>
        </div>
    )
}
