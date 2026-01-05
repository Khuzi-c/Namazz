'use client'

import { createClient } from '@/utils/supabase/client'
import { useEffect, useState } from 'react'
import { ChevronLeft, Lock, Trophy } from 'lucide-react'
import Link from 'next/link'

type Achievement = {
    id: string
    name: string
    description: string
    icon: string
    tier: string
    secret: boolean
}

export default function AchievementsPage() {
    const [achievements, setAchievements] = useState<Achievement[]>([])
    const [unlockedIds, setUnlockedIds] = useState<Set<string>>(new Set())
    const [loading, setLoading] = useState(true)
    const supabase = createClient()

    useEffect(() => {
        async function load() {
            const { data: { user } } = await supabase.auth.getUser()

            // 1. Fetch All Definitions
            const { data: allAchievements } = await supabase.from('achievements').select('*').order('tier') // basic sort
            if (allAchievements) setAchievements(allAchievements)

            // 2. Fetch User Unlocks
            if (user) {
                const { data: userUnlocks } = await supabase.from('user_achievements').select('achievement_id').eq('user_id', user.id)
                if (userUnlocks) {
                    setUnlockedIds(new Set(userUnlocks.map(u => u.achievement_id)))
                }
            }

            setLoading(false)
        }
        load()
    }, [])

    const getTierColor = (tier: string) => {
        switch (tier) {
            case 'bronze': return 'bg-amber-100 text-amber-800 border-amber-200'
            case 'silver': return 'bg-slate-100 text-slate-800 border-slate-200'
            case 'gold': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
            case 'platinum': return 'bg-purple-100 text-purple-800 border-purple-200'
            default: return 'bg-gray-100 text-gray-800 border-gray-200'
        }
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-emerald-950 pb-24 transition-colors">
            <header className="bg-white dark:bg-emerald-900 px-6 py-4 shadow-sm border-b dark:border-emerald-800 flex items-center gap-4 sticky top-0 z-10">
                <Link href="/" className="p-1 -ml-1 rounded-full hover:bg-gray-100 dark:hover:bg-emerald-800 text-gray-600 dark:text-emerald-100 transition-colors">
                    <ChevronLeft className="w-6 h-6" />
                </Link>
                <div className="flex-1">
                    <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">Achievements</h1>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Unlock badges as you progress</p>
                </div>
                <div className="flex items-center gap-1 bg-emerald-100 dark:bg-emerald-800 px-3 py-1 rounded-full">
                    <Trophy className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    <span className="text-sm font-bold text-emerald-700 dark:text-emerald-300">
                        {unlockedIds.size} / {achievements.length}
                    </span>
                </div>
            </header>

            <main className="p-4 max-w-2xl mx-auto space-y-6">
                {loading ? (
                    <div className="space-y-4">
                        {[1, 2, 3, 4].map(i => (
                            <div key={i} className="h-24 bg-gray-200 dark:bg-emerald-900/50 rounded-xl animate-pulse" />
                        ))}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {achievements.map((badge) => {
                            const isUnlocked = unlockedIds.has(badge.id)
                            return (
                                <div
                                    key={badge.id}
                                    className={`relative p-4 rounded-xl border flex items-center gap-4 transition-all ${isUnlocked
                                            ? 'bg-white dark:bg-emerald-900 border-emerald-100 dark:border-emerald-800 shadow-sm'
                                            : 'bg-gray-50 dark:bg-emerald-950/50 border-gray-200 dark:border-emerald-900/50 opacity-80'
                                        }`}
                                >
                                    <div className={`w-16 h-16 rounded-full flex items-center justify-center text-3xl shadow-inner ${isUnlocked ? 'bg-emerald-50 dark:bg-emerald-800' : 'bg-gray-200 dark:bg-gray-800 grayscale'}`}>
                                        {isUnlocked ? badge.icon : <Lock className="w-6 h-6 text-gray-400" />}
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-center justify-between mb-1">
                                            <h3 className={`font-bold ${isUnlocked ? 'text-gray-900 dark:text-gray-100' : 'text-gray-500 dark:text-gray-500'}`}>
                                                {badge.name}
                                            </h3>
                                            {isUnlocked && (
                                                <span className={`text-[10px] px-2 py-0.5 rounded-full uppercase font-bold border ${getTierColor(badge.tier)}`}>
                                                    {badge.tier}
                                                </span>
                                            )}
                                        </div>
                                        <p className={`text-xs ${isUnlocked ? 'text-gray-600 dark:text-gray-400' : 'text-gray-400 dark:text-gray-600'}`}>
                                            {badge.secret && !isUnlocked ? '???' : badge.description}
                                        </p>
                                    </div>
                                    {isUnlocked && (
                                        <div className="absolute top-2 right-2 flex space-x-1">
                                            {/* Could add date unlocked tooltip here */}
                                        </div>
                                    )}
                                </div>
                            )
                        })}
                    </div>
                )}

                {/* Encouragement */}
                {!loading && unlockedIds.size === 0 && (
                    <div className="text-center p-8 text-gray-400">
                        <p>Start logging your prayers to verify your progress!</p>
                    </div>
                )}
            </main>
        </div>
    )
}
