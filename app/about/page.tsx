'use client'

import { ArrowLeft, Send } from 'lucide-react'
import Link from 'next/link'

export default function AboutPage() {
    return (
        <div className="min-h-screen bg-gray-50 dark:bg-emerald-950 pb-24 transition-colors duration-300">
            <header className="bg-white dark:bg-emerald-900 px-6 py-4 shadow-sm border-b dark:border-emerald-800 flex items-center space-x-4 sticky top-0 z-40">
                <Link href="/settings" className="p-2 -ml-2 hover:bg-gray-100 dark:hover:bg-emerald-800 rounded-full transition-colors">
                    <ArrowLeft className="w-5 h-5 text-gray-600 dark:text-emerald-100" />
                </Link>
                <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">About Us</h1>
            </header>

            <main className="p-6 max-w-lg mx-auto space-y-8">

                <section className="text-center animate-fade-in-up">
                    <div className="w-24 h-24 bg-white dark:bg-emerald-800 rounded-3xl shadow-lg mx-auto mb-6 flex items-center justify-center p-4">
                        <img src="/icon.png" alt="Namaz Counter Logo" className="w-full h-full object-contain" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-50 mb-2">Namaz Tracker</h2>
                    <p className="text-emerald-600 dark:text-emerald-400 font-medium">Connect with your Creator</p>
                </section>

                <section className="bg-white dark:bg-emerald-900 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-emerald-800 animate-fade-in-up delay-100">
                    <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-3 text-lg">Our Mission</h3>
                    <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                        In a fast-paced world, it's easy to lose track of what matters most.
                        Namaz Tracker was built to help you maintain your spiritual routine with ease and elegance.
                        We believe that technology should serve your faith, not distract from it.
                    </p>
                </section>

                <section className="bg-white dark:bg-emerald-900 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-emerald-800 animate-fade-in-up delay-200">
                    <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-3 text-lg">The Team</h3>
                    <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-4">
                        Developed by **Khxzi Devs**, a passionate team dedicated to creating beautiful, functional, and ethical software.
                    </p>
                    <div className="flex items-center space-x-3 text-sm text-gray-500 dark:text-gray-400">
                        <Send className="w-4 h-4" />
                        <span>Contact us: support@namaztracker.com</span>
                    </div>
                </section>

                <div className="text-center text-xs text-gray-400 dark:text-gray-600 pt-8">
                    <p>Version 1.0.0</p>
                    <p className="mt-1">Made with ❤️ for the Ummah</p>
                </div>
            </main>
        </div>
    )
}
