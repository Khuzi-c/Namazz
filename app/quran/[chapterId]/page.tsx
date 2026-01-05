'use client'

import { useParams, useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import { ArrowLeft, Loader2, PlayCircle, PauseCircle } from 'lucide-react'
import { surahs } from '@/utils/quranData'

type Ayah = {
    id: number
    text_uthmani: string
    text_imlaei_simple: string
    verse_key: string
    translations: { text: string }[]
}

export default function SurahPage() {
    const params = useParams()
    const router = useRouter()
    const chapterId = Number(params.chapterId)
    const surahInfo = surahs.find(s => s.number === chapterId)

    const [ayahs, setAyahs] = useState<Ayah[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (!chapterId) return

        const fetchAyahs = async () => {
            try {
                // Fetch Arabic + English (Saheeh International resource_id=131)
                const res = await fetch(
                    `https://api.quran.com/api/v4/verses/by_chapter/${chapterId}?language=en&words=false&translations=131&fields=text_uthmani&per_page=${surahInfo?.ayahs || 500}`
                )
                const data = await res.json()
                if (data.verses) {
                    setAyahs(data.verses)
                }
            } catch (err) {
                console.error("Failed to fetch ayah", err)
            } finally {
                setLoading(false)
            }
        }
        fetchAyahs()
    }, [chapterId, surahInfo])

    if (!surahInfo) return <div className="p-10 text-center">Surah not found.</div>

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-emerald-950 pb-24 transition-colors duration-300">
            {/* Header */}
            <div className="sticky top-0 bg-white/90 dark:bg-emerald-900/90 backdrop-blur-sm z-50 border-b border-gray-100 dark:border-emerald-800 p-4 flex items-center justify-between">
                <button
                    onClick={() => router.back()}
                    className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-emerald-800 text-gray-600 dark:text-emerald-100"
                >
                    <ArrowLeft className="w-6 h-6" />
                </button>
                <div className="text-center">
                    <h1 className="text-lg font-bold text-gray-900 dark:text-gray-100">{surahInfo.name}</h1>
                    <p className="text-xs text-gray-500 dark:text-emerald-400">{surahInfo.english}</p>
                </div>
                <img src="/icon.png" alt="Logo" className="w-8 h-8 object-contain" />
            </div>

            {/* Bismillah */}
            <div className="text-center py-8">
                <p className="font-serif text-3xl text-emerald-800 dark:text-emerald-400" style={{ fontFamily: 'Lateef, serif' }}>
                    بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ
                </p>
            </div>

            {/* Ayahs List */}
            {loading ? (
                <div className="flex justify-center py-10">
                    <Loader2 className="animate-spin text-emerald-600 dark:text-emerald-400 w-8 h-8" />
                </div>
            ) : (
                <div className="px-4 space-y-6 max-w-2xl mx-auto">
                    {ayahs.map((ayah, index) => (
                        <div key={ayah.id} className="bg-white dark:bg-emerald-900 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-emerald-800 relative group hover:border-emerald-100 dark:hover:border-emerald-700 transition-colors">
                            {/* Ayah Number */}
                            <div className="absolute top-4 left-4 bg-emerald-50 dark:bg-emerald-800 text-emerald-700 dark:text-emerald-200 w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold">
                                {index + 1}
                            </div>

                            {/* Arabic */}
                            <p className="text-right font-serif text-2xl leading-loose text-gray-900 dark:text-gray-100 mb-4 pt-8" style={{ fontFamily: 'Lateef, serif' }}>
                                {ayah.text_uthmani}
                            </p>

                            {/* Translation */}
                            <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed text-left border-t border-gray-100 dark:border-emerald-800 pt-3">
                                {ayah.translations?.[0]?.text?.replace(/<[^>]*>/g, '') /* Simple Tag strip */}
                            </p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}
