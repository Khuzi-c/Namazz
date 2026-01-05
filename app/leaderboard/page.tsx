'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/utils/supabase/client'
import { Trophy, Medal, Flame, CheckCircle, User, Loader2 } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

type LeaderboardUser = {
    id: string
    name: string
    avatar_url: string | null
    current_streak: number
    total_prayers: number
}

export default function LeaderboardPage() {
    const [users, setUsers] = useState<LeaderboardUser[]>([])
    const [loading, setLoading] = useState(true)
    const [isPublic, setIsPublic] = useState(true) // Should fetch from DB
    const [userId, setUserId] = useState<string | null>(null)
    const supabase = createClient()
    const router = useRouter() // Import might need adding

    useEffect(() => {
        const fetchData = async () => {
            const { data: { user } } = await supabase.auth.getUser()
            if (user) {
                setUserId(user.id)
                const { data: profile } = await supabase.from('profiles').select('is_public').eq('id', user.id).single()
                if (profile) setIsPublic(profile.is_public ?? true)
            }

            const { data, error } = await supabase
                .from('profiles')
                .select('id, name, avatar_url, current_streak, total_prayers')
                .eq('is_public', true)
                .order('current_streak', { ascending: false })
                .order('total_prayers', { ascending: false })
                .limit(10)

            if (!error && data) {
                setUsers(data)
            }
            setLoading(false)
        }

        fetchData()
    }, [])

    const togglePrivacy = async () => {
        if (!userId) {
            router.push('/login')
            return
        }

        const newState = !isPublic
        setIsPublic(newState)

        await supabase.from('profiles').update({ is_public: newState }).eq('id', userId)

        // Refresh list if we just went public/private
        window.location.reload()
    }

    const getRankIcon = (index: number) => {
        if (index === 0) return <Trophy className="w-6 h-6 text-amber-400 fill-current animate-bounce" />
        if (index === 1) return <Medal className="w-6 h-6 text-gray-400 fill-current" />
        if (index === 2) return <Medal className="w-6 h-6 text-amber-700 fill-current" />
        return <span className="text-lg font-bold text-emerald-600 dark:text-emerald-400 font-mono">#{index + 1}</span>
    }

    return (
        <div className="min-h-screen bg-emerald-50 dark:bg-emerald-950 pb-24">
            {/* Header */}
            <div className="bg-emerald-600 dark:bg-emerald-900 pt-8 pb-32 px-6 rounded-b-[3rem] shadow-xl relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/arabesque.png')] opacity-10"></div>

                {/* Top Bar with Back & Privacy */}
                <div className="relative z-20 flex justify-between items-center mb-6">
                    <Link href="/" className="bg-white/20 p-2 rounded-full backdrop-blur-sm text-white hover:bg-white/30 transition">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 19-7-7 7-7" /><path d="M19 12H5" /></svg>
                    </Link>

                    <button
                        onClick={togglePrivacy}
                        className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold transition-all shadow-lg backdrop-blur-md ${isPublic ? 'bg-emerald-800/50 text-emerald-100 border border-emerald-500/50' : 'bg-red-500/80 text-white border border-red-400'}`}
                    >
                        {isPublic ? (
                            <>
                                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                                Public
                            </>
                        ) : (
                            <>
                                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 11v-2a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2v2" /><rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>
                                Private
                            </>
                        )}
                    </button>
                </div>

                <div className="relative z-10 text-center space-y-2">
                    <h1 className="text-3xl font-bold text-white">Leaderboard</h1>
                    <p className="text-emerald-100/90 text-sm">Top verified believers by streak</p>
                </div>
            </div>

            {/* List */}
            <div className="max-w-md mx-auto -mt-16 px-4 space-y-4">
                {loading ? (
                    <div className="bg-white dark:bg-emerald-900 rounded-2xl p-8 flex justify-center shadow-lg">
                        <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
                    </div>
                ) : users.length === 0 ? (
                    <div className="bg-white dark:bg-emerald-900 rounded-2xl p-8 text-center shadow-lg">
                        <p className="text-gray-500 dark:text-emerald-200">No public profiles yet. Be the first!</p>
                    </div>
                ) : (
                    users.map((user, index) => (
                        <Link
                            href={`/user/${user.id}`}
                            key={user.id}
                            className="block"
                        >
                            <div className="bg-white dark:bg-emerald-900/80 backdrop-blur-sm rounded-2xl p-4 flex items-center shadow-sm border border-emerald-100 dark:border-emerald-800 hover:scale-[1.02] transition-transform duration-200">
                                {/* Rank */}
                                <div className="w-10 flex-shrink-0 flex justify-center">
                                    {getRankIcon(index)}
                                </div>

                                {/* Avatar */}
                                <div className="mx-4 relative">
                                    <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-emerald-100 dark:border-emerald-700 bg-gray-100 dark:bg-emerald-800">
                                        {user.avatar_url ? (
                                            <img src={user.avatar_url} alt={user.name} className="w-full h-full object-cover" />
                                        ) : (
                                            <User className="w-6 h-6 text-gray-400 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                                        )}
                                    </div>
                                    {index < 3 && (
                                        <div className="absolute -bottom-1 -right-1 bg-yellow-400 text-[10px] w-5 h-5 flex items-center justify-center rounded-full border-2 border-white dark:border-emerald-900 shadow-sm">
                                            {index + 1}
                                        </div>
                                    )}
                                </div>

                                {/* Info */}
                                <div className="flex-1 min-w-0">
                                    <h3 className="font-bold text-gray-900 dark:text-white truncate">
                                        {user.name || 'Anonymous User'}
                                    </h3>
                                    <div className="flex items-center space-x-3 text-xs text-gray-500 dark:text-emerald-300">
                                        <div className="flex items-center space-x-1">
                                            <CheckCircle className="w-3 h-3 text-emerald-500" />
                                            <span>{user.total_prayers} Prayers</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Streak Badge */}
                                <div className="flex-shrink-0 text-center bg-orange-50 dark:bg-orange-900/20 px-3 py-1.5 rounded-xl border border-orange-100 dark:border-orange-900/50">
                                    <div className="flex items-center space-x-1 justify-center text-orange-600 dark:text-orange-400">
                                        <Flame className="w-4 h-4 fill-current" />
                                        <span className="font-bold">{user.current_streak}</span>
                                    </div>
                                    <span className="text-[10px] text-orange-400 dark:text-orange-500 font-medium">Day Streak</span>
                                </div>
                            </div>
                        </Link>
                    ))
                )}
            </div>
        </div>
    )
}
