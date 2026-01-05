'use client'

import { useEffect } from 'react'
import { AlertCircle, RefreshCcw } from 'lucide-react'

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string }
    reset: () => void
}) {
    useEffect(() => {
        console.error(error)
    }, [error])

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-emerald-950 p-4 text-center">
            <div className="bg-red-100 dark:bg-red-900/30 p-4 rounded-full mb-4">
                <AlertCircle className="w-12 h-12 text-red-600 dark:text-red-400" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">Something went wrong!</h2>
            <p className="text-gray-500 dark:text-gray-400 mb-8 max-w-sm text-sm">
                We encountered an unexpected error. Please try again or check your connection.
            </p>
            <button
                onClick={() => reset()}
                className="flex items-center gap-2 px-6 py-2.5 bg-gray-900 dark:bg-emerald-800 text-white rounded-full font-medium hover:opacity-90 transition-all active:scale-95"
            >
                <RefreshCcw className="w-4 h-4" />
                Try Again
            </button>
        </div>
    )
}
