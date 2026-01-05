'use client'

import { Search, PlayCircle, PauseCircle, BookOpen } from 'lucide-react'
import { useState, useRef, useEffect } from 'react'
import { surahs } from '@/utils/quranData'
import { useRouter } from 'next/navigation'

export default function QuranPage() {
    const [searchQuery, setSearchQuery] = useState('')
    const [currentSurah, setCurrentSurah] = useState({
        number: 1,
        name: 'Al-Fatihah',
        english: 'The Opener',
        audioUrl: 'https://cdn.islamic.network/quran/audio/128/ar.alafasy/1.mp3',
        ayahs: 7
    })
    const [isPlaying, setIsPlaying] = useState(false)
    const audioRef = useRef<HTMLAudioElement | null>(null)
    const router = useRouter()

    const filteredSurahs = surahs.filter(s =>
        s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.english.toLowerCase().includes(searchQuery.toLowerCase()) ||
        String(s.number).includes(searchQuery)
    )

    const togglePlay = () => {
        if (!audioRef.current) return
        if (isPlaying) {
            audioRef.current.pause()
        } else {
            audioRef.current.play()
        }
    }

    const playSurah = (surah: any, e: React.MouseEvent) => {
        e.stopPropagation() // Prevent navigating to reading page

        if (currentSurah.number === surah.number) {
            togglePlay()
            return
        }

        const url = `https://cdn.islamic.network/quran/audio/128/ar.alafasy/${surah.number}.mp3`
        setCurrentSurah({ ...surah, audioUrl: url })
    }

    // Effect to handle audio playing when surah changes
    useEffect(() => {
        if (audioRef.current && audioRef.current.src !== currentSurah.audioUrl) {
            audioRef.current.src = currentSurah.audioUrl
            setIsPlaying(true)
            audioRef.current.play().catch(e => console.log("Audio play failed (interaction needed)", e))
        }
    }, [currentSurah])


    return (
        <div className="min-h-screen bg-gray-50 dark:bg-emerald-950 pb-24 transition-colors duration-300">
            <header className="bg-white dark:bg-emerald-900 px-6 py-4 shadow-sm sticky top-0 z-40 bg-white/80 dark:bg-emerald-900/80 backdrop-blur-md border-b dark:border-emerald-800 flex items-center justify-between">
                <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">Holy Quran</h1>
                <img src="/icon.png" alt="Logo" className="w-8 h-8 object-contain" />
            </header>

            <main className="p-4 space-y-6 max-w-lg mx-auto">
                {/* Search */}
                <div className="relative animate-fade-in-up">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search Surah..."
                        className="w-full bg-white border border-gray-200 rounded-xl pl-10 pr-4 py-3 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                    />
                </div>

                {/* Player Card */}
                <div className="bg-emerald-800 rounded-2xl p-6 text-white shadow-lg relative overflow-hidden animate-fade-in-up delay-100">
                    <div className="absolute top-0 right-0 w-40 h-40 bg-emerald-700 rounded-full -mr-10 -mt-10 opacity-50 blur-3xl animate-pulse-slow"></div>
                    <div className="relative z-10">
                        <p className="text-emerald-200 text-xs font-medium uppercase tracking-wider mb-1">Now Playing</p>
                        <div className="flex justify-between items-end">
                            <div>
                                <h3 className="text-2xl font-bold font-serif">{currentSurah.name}</h3>
                                <p className="text-emerald-100">{currentSurah.english}</p>
                            </div>
                            <button
                                onClick={togglePlay}
                                className="bg-white/20 hover:bg-white/30 p-3 rounded-full backdrop-blur-sm transition-colors"
                            >
                                {isPlaying ? <PauseCircle className="w-8 h-8 text-white" /> : <PlayCircle className="w-8 h-8 text-white" />}
                            </button>
                        </div>
                        {/* Audio Element Hidden */}
                        <audio
                            ref={audioRef}
                            src={currentSurah.audioUrl}
                            onEnded={() => setIsPlaying(false)}
                            onPlay={() => setIsPlaying(true)}
                            onPause={() => setIsPlaying(false)}
                        />
                    </div>
                </div>

                {/* Surah List */}
                <div className="animate-fade-in-up delay-200">
                    <h3 className="font-semibold text-gray-700 mb-3 px-2">All Surahs</h3>
                    <div className="space-y-3">
                        {filteredSurahs.map(surah => (
                            <div
                                key={surah.number}
                                onClick={() => router.push(`/quran/${surah.number}`)}
                                className={`p-4 rounded-xl shadow-sm border flex items-center justify-between transition-colors cursor-pointer group hover:border-emerald-300 bg-white dark:bg-emerald-900 border-gray-100 dark:border-emerald-800`}
                            >
                                <div className="flex items-center space-x-4">
                                    <div className="w-10 h-10 rounded-lg flex items-center justify-center font-bold text-sm bg-emerald-50 text-emerald-700 group-hover:bg-emerald-100">
                                        {surah.number}
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-gray-800 dark:text-gray-100">
                                            {surah.name}
                                        </h4>
                                        <p className="text-xs text-gray-500 dark:text-emerald-400">{surah.english}</p>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-3">
                                    <button
                                        onClick={(e) => playSurah(surah, e)}
                                        className="p-2 rounded-full text-emerald-600 hover:bg-emerald-50 transition-colors z-10"
                                    >
                                        {(currentSurah.number === surah.number && isPlaying) ?
                                            <PauseCircle className="w-6 h-6" /> :
                                            <PlayCircle className="w-6 h-6" />
                                        }
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </main>
        </div>
    )
}
