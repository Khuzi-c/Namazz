'use client'

import { useState, useEffect } from 'react'
import { RotateCcw, Volume2, VolumeX, ChevronRight, Check } from 'lucide-react'

const DHIKR_LIST = [
    { arabic: "سُبْحَانَ ٱللَّٰهِ", trans: "SubhanAllah", meaning: "Glory be to Allah" },
    { arabic: "ٱلْحَمْدُ لِلَّٰهِ", trans: "Alhamdulillah", meaning: "Praise be to Allah" },
    { arabic: "ٱللَّٰهُ أَكْبَرُ", trans: "Allahu Akbar", meaning: "Allah is the Greatest" },
    { arabic: "أَسْتَغْفِرُ ٱللَّٰهَ", trans: "Astaghfirullah", meaning: "I seek forgiveness from Allah" },
    { arabic: "لَا إِلَٰهَ إِلَّا ٱللَّٰهُ", trans: "La ilaha illallah", meaning: "There is no god but Allah" }
]

export default function DhikrPage() {
    const [count, setCount] = useState(0)
    const [goal, setGoal] = useState(33)
    const [selectedDhikr, setSelectedDhikr] = useState(DHIKR_LIST[0])
    const [vibrate, setVibrate] = useState(true)
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
        const savedCount = localStorage.getItem('dhikr-count')
        const savedDhikrIndex = localStorage.getItem('dhikr-index')
        if (savedCount) setCount(parseInt(savedCount))
        if (savedDhikrIndex) setSelectedDhikr(DHIKR_LIST[parseInt(savedDhikrIndex)])
    }, [])

    useEffect(() => {
        if (!mounted) return
        localStorage.setItem('dhikr-count', count.toString())
        const index = DHIKR_LIST.findIndex(d => d.trans === selectedDhikr.trans)
        localStorage.setItem('dhikr-index', index.toString())
    }, [count, selectedDhikr, mounted])

    const increment = () => {
        const newCount = count + 1
        setCount(newCount)
        if (vibrate && navigator.vibrate) {
            // Strong vibration on goal, light otherwise
            if (newCount % goal === 0) navigator.vibrate(200)
            else navigator.vibrate(10)
        }
    }

    const reset = () => {
        if (confirm('Reset your counter?')) {
            setCount(0)
            if (vibrate && navigator.vibrate) navigator.vibrate(50)
        }
    }

    if (!mounted) return null

    return (
        <div className="min-h-screen bg-emerald-50 dark:bg-emerald-950 pb-24 transition-colors duration-300 flex flex-col">
            <header className="bg-white dark:bg-emerald-900 px-6 py-4 shadow-sm border-b dark:border-emerald-800 flex items-center justify-between z-10">
                <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">Dhikr Counter</h1>
                <button
                    onClick={() => setVibrate(!vibrate)}
                    className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-emerald-800 transition"
                >
                    {vibrate ? <Volume2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" /> : <VolumeX className="w-5 h-5 text-gray-400" />}
                </button>
            </header>

            <main className="flex-1 flex flex-col items-center justify-center p-6 relative overflow-hidden">
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-20 pointer-events-none bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>

                {/* Selected Dhikr Display */}
                <div className="text-center mb-8 z-10 animate-fade-in-up">
                    <h2 className="text-4xl font-serif text-emerald-800 dark:text-emerald-300 font-bold mb-2">{selectedDhikr.arabic}</h2>
                    <p className="text-lg font-medium text-gray-700 dark:text-gray-200">{selectedDhikr.trans}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 italic mt-1">{selectedDhikr.meaning}</p>
                </div>

                {/* Counter Button */}
                <button
                    onClick={increment}
                    className="w-64 h-64 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-700 shadow-[0_10px_40px_rgba(16,185,129,0.3)] dark:shadow-[0_10px_40px_rgba(16,185,129,0.1)] flex items-center justify-center relative active:scale-95 transition-transform duration-100 z-10"
                >
                    <div className="w-56 h-56 rounded-full border-4 border-white/20 flex items-col flex-col items-center justify-center">
                        <span className="text-7xl font-bold text-white tracking-tight drop-shadow-md font-mono">{count}</span>
                        <span className="text-emerald-100/60 text-sm mt-2 font-medium">Tap</span>
                    </div>
                </button>

                {/* Controls */}
                <div className="w-full max-w-xs mt-12 flex items-center justify-between z-10 animate-fade-in-up delay-100">
                    <button
                        onClick={reset}
                        className="flex items-center space-x-2 text-gray-500 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400 transition"
                    >
                        <RotateCcw className="w-5 h-5" />
                        <span className="text-sm font-medium">Reset</span>
                    </button>

                    <div className="flex items-center space-x-2 text-gray-400 dark:text-gray-500 text-xs">
                        <span>Goal:</span>
                        <select
                            value={goal}
                            onChange={(e) => setGoal(Number(e.target.value))}
                            className="bg-transparent border-none font-bold text-emerald-600 dark:text-emerald-400 outline-none cursor-pointer"
                        >
                            <option value="33">33</option>
                            <option value="100">100</option>
                            <option value="1000">1000</option>
                        </select>
                    </div>
                </div>

                {/* Dhikr Selector */}
                <div className="mt-8 w-full max-w-sm overflow-x-auto pb-4 z-10 no-scrollbar">
                    <div className="flex space-x-3 px-2">
                        {DHIKR_LIST.map((d, i) => (
                            <button
                                key={d.trans}
                                onClick={() => {
                                    setSelectedDhikr(d)
                                    setCount(0)
                                }}
                                className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all ${selectedDhikr.trans === d.trans
                                    ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-200/50 dark:shadow-none'
                                    : 'bg-white dark:bg-emerald-800 text-gray-600 dark:text-gray-300 border border-gray-100 dark:border-emerald-700'
                                    }`}
                            >
                                {d.trans}
                            </button>
                        ))}
                    </div>
                </div>

            </main>
        </div>
    )
}
