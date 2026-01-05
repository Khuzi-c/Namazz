import { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Credits',
    description: 'Acknowledgments and credits for the libraries, APIs, and services used in Namazz.',
}

export default function CreditsPage() {
    return (
        <div className="min-h-screen bg-gray-50 dark:bg-emerald-950 pb-24 p-6 transition-colors duration-300">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">Credits</h1>
            <div className="bg-white dark:bg-emerald-900 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-emerald-800 space-y-4 text-sm text-gray-600 dark:text-gray-300">
                <h3 className="font-semibold text-gray-900 dark:text-gray-100">Development</h3>
                <p>Developed by <span className="font-bold text-emerald-600">Khxzi Devs</span></p>

                <h3 className="font-semibold text-gray-900 dark:text-gray-100 mt-4">APIs & Services</h3>
                <ul className="list-disc pl-5 space-y-1">
                    <li><strong>AlAdhan API</strong>: For accurate prayer timings.</li>
                    <li><strong>Quran.com / MP3Quran</strong>: For Quranic audio and text.</li>
                    <li><strong>Supabase</strong>: For secure database and authentication.</li>
                    <li><strong>Elfsight</strong>: For News/RSS Feed, Translation, and Audio playback widgets.</li>
                </ul>

                <h3 className="font-semibold text-gray-900 dark:text-gray-100 mt-4">Libraries</h3>
                <ul className="list-disc pl-5 space-y-1">
                    <li>Next.js</li>
                    <li>Tailwind CSS</li>
                    <li>Lucide Icons</li>
                    <li>Recharts</li>
                </ul>

                <p className="text-center text-gray-400 text-xs mt-8">© 2026 Khxzi Devs. All rights reserved.</p>
            </div>
        </div>
    )
}
