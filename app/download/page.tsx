
'use client'

import { Download, Smartphone, Laptop, Apple, ArrowRight, Share, PlusSquare, Menu } from 'lucide-react'
import Link from 'next/link'
import { useState, useEffect } from 'react'

export default function DownloadPage() {
    const [deferredPrompt, setDeferredPrompt] = useState<any>(null)
    const [isIOS, setIsIOS] = useState(false)
    const [isAndroid, setIsAndroid] = useState(false)

    useEffect(() => {
        // Detect OS
        const userAgent = window.navigator.userAgent.toLowerCase()
        if (/iphone|ipad|ipod/.test(userAgent)) setIsIOS(true)
        if (/android/.test(userAgent)) setIsAndroid(true)

        const handler = (e: any) => {
            e.preventDefault()
            setDeferredPrompt(e)
        }
        window.addEventListener('beforeinstallprompt', handler)
        return () => window.removeEventListener('beforeinstallprompt', handler)
    }, [])

    const handleInstallClick = async () => {
        if (!deferredPrompt) {
            alert("Install prompt not available. Please follow the instructions below.")
            return
        }
        deferredPrompt.prompt()
        const { outcome } = await deferredPrompt.userChoice
        if (outcome === 'accepted') {
            setDeferredPrompt(null)
        }
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-emerald-950 pb-24 transition-colors duration-300">
            <header className="bg-white dark:bg-emerald-900 px-6 py-4 shadow-sm border-b dark:border-emerald-800 flex items-center justify-between sticky top-0 z-50">
                <Link href="/" className="flex items-center gap-2">
                    <img src="/icon.png" alt="Logo" className="w-8 h-8 object-contain" />
                    <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">Namazz</h1>
                </Link>
                <Link href="/" className="text-sm font-medium text-emerald-600 dark:text-emerald-400">Back</Link>
            </header>

            <main className="p-6 space-y-8 max-w-lg mx-auto">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Get the App</h2>
                    <p className="text-gray-600 dark:text-gray-400">Choose your platform for the best experience.</p>
                </div>

                {/* Primary Install Button (PWA) */}
                <div className="bg-gradient-to-br from-emerald-600 to-teal-700 rounded-2xl p-6 text-white text-center shadow-lg relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-xl group-hover:bg-white/20 transition-all"></div>

                    <Smartphone className="w-12 h-12 mx-auto mb-4 text-emerald-100" />
                    <h3 className="text-xl font-bold mb-2">Install App</h3>
                    <p className="text-emerald-100 text-sm mb-6">Lightweight, works offline, and sends notifications.</p>

                    <button
                        onClick={handleInstallClick}
                        className="bg-white text-emerald-700 font-bold py-3 px-8 rounded-full shadow-lg hover:bg-emerald-50 active:scale-95 transition-all w-full flex items-center justify-center gap-2"
                    >
                        <Download className="w-5 h-5" />
                        Install Now
                    </button>
                    {!deferredPrompt && (
                        <p className="text-[10px] text-emerald-200 mt-2">
                            *(If nothing happens, see instructions below)*
                        </p>
                    )}
                </div>

                {/* Platform Specific Instructions */}
                <div className="space-y-4">
                    <h3 className="font-bold text-gray-900 dark:text-white px-2">Manual Installation</h3>

                    {/* Android */}
                    <div className={`bg-white dark:bg-emerald-900 rounded-xl p-4 shadow-sm border ${isAndroid ? 'border-emerald-500 ring-2 ring-emerald-500/20' : 'border-gray-100 dark:border-emerald-800'}`}>
                        <div className="flex items-center gap-3 mb-3">
                            <div className="bg-green-100 dark:bg-green-900/30 p-2 rounded-lg text-green-600 dark:text-green-400">
                                <Smartphone className="w-5 h-5" />
                            </div>
                            <h4 className="font-bold text-gray-800 dark:text-gray-200">Android (Chrome)</h4>
                        </div>
                        <ol className="list-decimal pl-5 space-y-2 text-sm text-gray-600 dark:text-gray-400">
                            <li>Tap the <span className="font-bold text-gray-900 dark:text-gray-200">Menu</span> (3 dots) in Chrome.</li>
                            <li>Select <span className="font-bold text-gray-900 dark:text-gray-200">"Install app"</span> or "Add to Home Screen".</li>
                            <li>Confirm installation.</li>
                        </ol>
                        <hr className="my-4 border-gray-100 dark:border-emerald-800" />
                        <div className="flex items-center gap-3">
                            <h4 className="font-bold text-gray-800 dark:text-gray-200 text-sm">Download APK</h4>
                        </div>
                        <p className="text-xs text-gray-500 mt-1 mb-2">Native Android Package (Beta)</p>
                        <a href="/namazz.apk" download className="text-xs bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-4 py-2 rounded-lg w-full flex items-center justify-center gap-2 transition-colors shadow-md">
                            <Download className="w-3 h-3" />
                            Download APK (Unknown Source)
                        </a>
                        <p className="text-[10px] text-gray-400 mt-2 text-center">
                            *You may need to allow "Install from Unknown Sources"*
                        </p>
                    </div>

                    {/* iOS */}
                    <div className={`bg-white dark:bg-emerald-900 rounded-xl p-4 shadow-sm border ${isIOS ? 'border-blue-500 ring-2 ring-blue-500/20' : 'border-gray-100 dark:border-emerald-800'}`}>
                        <div className="flex items-center gap-3 mb-3">
                            <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-lg text-blue-600 dark:text-blue-400">
                                <Apple className="w-5 h-5" />
                            </div>
                            <h4 className="font-bold text-gray-800 dark:text-gray-200">iOS (Safari)</h4>
                        </div>
                        <ol className="list-decimal pl-5 space-y-2 text-sm text-gray-600 dark:text-gray-400">
                            <li>Tap the <span className="font-bold text-gray-900 dark:text-gray-200">Share</span> icon <Share className="w-3 h-3 inline" />.</li>
                            <li>Scroll down and tap <span className="font-bold text-gray-900 dark:text-gray-200">"Add to Home Screen"</span> <PlusSquare className="w-3 h-3 inline" />.</li>
                            <li>Tap "Add" in the top right.</li>
                        </ol>
                    </div>

                    {/* PC */}
                    <div className="bg-white dark:bg-emerald-900 rounded-xl p-4 shadow-sm border border-gray-100 dark:border-emerald-800">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="bg-purple-100 dark:bg-purple-900/30 p-2 rounded-lg text-purple-600 dark:text-purple-400">
                                <Laptop className="w-5 h-5" />
                            </div>
                            <h4 className="font-bold text-gray-800 dark:text-gray-200">PC / Desktop</h4>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                            Look for the <span className="font-bold">Install Icon</span> <Download className="w-3 h-3 inline" /> in the right side of your browser's address bar.
                        </p>
                    </div>
                </div>
            </main>
        </div>
    )
}
