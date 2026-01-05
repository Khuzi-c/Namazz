'use client'

import { useEffect } from 'react'

export default function TranslationWidget() {
    useEffect(() => {
        const script = document.createElement('script')
        script.src = "https://elfsightcdn.com/platform.js"
        script.async = true
        document.body.appendChild(script)

        return () => {
            document.body.removeChild(script)
        }
    }, [])

    return (
        <div className="flex justify-center py-4 bg-gray-50 dark:bg-emerald-950">
            <div className="elfsight-app-1bac7305-aef4-43d3-b163-011b349bd4c3" data-elfsight-app-lazy></div>
        </div>
    )
}
