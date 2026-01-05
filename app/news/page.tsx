'use client'

import Script from 'next/script'
import { ChevronLeft, ExternalLink } from 'lucide-react'
import Link from 'next/link'
import AdBanner from '@/components/AdBanner'

export default function NewsPage() {
    return (
        <div className="min-h-screen bg-gray-50 dark:bg-emerald-950 pb-24 transition-colors">
            {/* Header */}
            <header className="bg-white dark:bg-emerald-900 px-6 py-4 shadow-sm border-b dark:border-emerald-800 flex items-center gap-4 sticky top-0 z-10">
                <Link href="/" className="p-1 -ml-1 rounded-full hover:bg-gray-100 dark:hover:bg-emerald-800 text-gray-600 dark:text-emerald-100 transition-colors">
                    <ChevronLeft className="w-6 h-6" />
                </Link>
                <div className="flex-1">
                    <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">Islamic Insights</h1>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Curated feeds from trusted sources</p>
                </div>
            </header>

            <main className="p-4 max-w-2xl mx-auto space-y-8 animate-fade-in-up">

                {/* RSS Widget */}
                <div className="min-h-[500px] bg-white dark:bg-emerald-900 rounded-2xl shadow-sm border border-emerald-50 dark:border-emerald-800 p-4">
                    <Script src="https://elfsightcdn.com/platform.js" strategy="lazyOnload" />
                    <div className="elfsight-app-bd63f992-b762-4c9d-acf7-2bd385abf6ce" data-elfsight-app-lazy></div>
                </div>

                {/* Advertisement */}
                <AdBanner />

                {/* Sources List */}
                <div className="bg-emerald-50 dark:bg-emerald-900/50 rounded-xl p-6 border border-emerald-100 dark:border-emerald-800/50">
                    <h3 className="font-bold text-emerald-900 dark:text-emerald-100 mb-4 flex items-center gap-2">
                        <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
                        Featured Sources
                    </h3>
                    <ul className="space-y-3">
                        <li>
                            <a href="https://productivemuslim.com" target="_blank" rel="noopener noreferrer" className="flex items-center justify-between group p-3 bg-white dark:bg-emerald-800 rounded-lg hover:shadow-md transition-all">
                                <span className="text-gray-700 dark:text-gray-200 font-medium">Productive Muslim</span>
                                <ExternalLink className="w-4 h-4 text-emerald-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                            </a>
                        </li>
                        <li>
                            <a href="https://reviewofreligions.org" target="_blank" rel="noopener noreferrer" className="flex items-center justify-between group p-3 bg-white dark:bg-emerald-800 rounded-lg hover:shadow-md transition-all">
                                <span className="text-gray-700 dark:text-gray-200 font-medium">Review of Religions</span>
                                <ExternalLink className="w-4 h-4 text-emerald-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                            </a>
                        </li>
                        <li>
                            <a href="https://muslimmatters.org" target="_blank" rel="noopener noreferrer" className="flex items-center justify-between group p-3 bg-white dark:bg-emerald-800 rounded-lg hover:shadow-md transition-all">
                                <span className="text-gray-700 dark:text-gray-200 font-medium">MuslimMatters</span>
                                <ExternalLink className="w-4 h-4 text-emerald-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                            </a>
                        </li>
                    </ul>
                    <div className="mt-4 text-xs text-center text-gray-500 dark:text-gray-400">
                        Powered by <a href="https://elfsight.com" target="_blank" className="underline hover:text-emerald-500">Elfsight Widgets</a>
                    </div>
                </div>

            </main>
        </div>
    )
}
