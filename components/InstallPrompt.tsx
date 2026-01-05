'use client'

import { useState, useEffect } from 'react'
import { Download, X } from 'lucide-react'

export default function InstallPrompt() {
    const [deferredPrompt, setDeferredPrompt] = useState<any>(null)
    const [isVisible, setIsVisible] = useState(false)

    useEffect(() => {
        const handler = (e: any) => {
            // Prevent Chrome 67 and earlier from automatically showing the prompt
            e.preventDefault()
            // Stash the event so it can be triggered later.
            setDeferredPrompt(e)
            // Show the prompt
            setIsVisible(true)
        }

        window.addEventListener('beforeinstallprompt', handler)

        // Check if already installed
        if (window.matchMedia('(display-mode: standalone)').matches) {
            setIsVisible(false)
        }

        return () => window.removeEventListener('beforeinstallprompt', handler)
    }, [])

    const handleInstallClick = async () => {
        if (!deferredPrompt) return

        // Show the install prompt
        deferredPrompt.prompt()

        // Wait for the user to respond to the prompt
        const { outcome } = await deferredPrompt.userChoice

        // We've used the prompt, and can't use it again, discard it
        setDeferredPrompt(null)
        setIsVisible(false)
    }

    if (!isVisible) return null

    return (
        <div className="fixed bottom-20 left-4 right-4 z-50 animate-fade-in-up">
            <div className="bg-emerald-900 text-white p-4 rounded-xl shadow-2xl flex items-center justify-between border border-emerald-700">
                <div className="flex items-center gap-3">
                    <div className="bg-white/10 p-2 rounded-lg">
                        <Download className="w-6 h-6 text-emerald-300" />
                    </div>
                    <div>
                        <h3 className="font-bold text-sm">Install Namazz App</h3>
                        <p className="text-xs text-emerald-200">Get better performance & offline access</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => setIsVisible(false)}
                        className="p-2 text-emerald-300 hover:text-white"
                    >
                        <X className="w-5 h-5" />
                    </button>
                    <button
                        onClick={handleInstallClick}
                        className="bg-emerald-500 hover:bg-emerald-400 text-white px-4 py-1.5 rounded-lg text-xs font-bold transition-colors shadow-lg"
                    >
                        Install
                    </button>
                </div>
            </div>
        </div>
    )
}
