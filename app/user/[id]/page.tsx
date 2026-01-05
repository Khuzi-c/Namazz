'use client'

import { createClient } from '@/utils/supabase/client'
import { useState, useEffect } from 'react'
import { User, Calendar, Award, Flame, Lock } from 'lucide-react'
import { useParams, useRouter } from 'next/navigation'
import { format } from 'date-fns'

type Profile = {
    id: string
    name: string
    avatar_url: string | null
    total_prayers: number
    current_streak: number
    is_public: boolean
    created_at: string
}

export default function UserProfilePage() {
    const params = useParams()
    const router = useRouter()
    const [profile, setProfile] = useState<Profile | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const supabase = createClient()

    useEffect(() => {
        const fetchProfile = async () => {
            const { data, error } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', params.id)
                .single()

            if (error) {
                console.error('Error fetching profile:', error)
                setError('User not found')
            } else {
                setProfile(data)
            }
            setLoading(false)
        }

        if (params.id) {
            fetchProfile()
        }
    }, [params.id])

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-emerald-950">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
            </div>
        )
    }

    if (error || !profile) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-emerald-950 px-4 text-center">
                <div className="bg-white dark:bg-emerald-900 p-8 rounded-2xl shadow-lg max-w-sm w-full">
                    <User className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">User Not Found</h2>
                    <p className="text-gray-500 dark:text-gray-400 mb-6">This user does not exist or has a private profile.</p>
                    <button onClick={() => router.push('/')} className="bg-emerald-600 text-white px-6 py-2 rounded-lg font-medium">Go Home</button>
                </div>
            </div>
        )
    }

    if (!profile.is_public) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-emerald-950 px-4 text-center">
                <div className="bg-white dark:bg-emerald-900 p-8 rounded-2xl shadow-lg max-w-sm w-full border border-gray-100 dark:border-emerald-800">
                    <div className="w-20 h-20 bg-gray-100 dark:bg-emerald-800 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Lock className="w-8 h-8 text-gray-400 dark:text-emerald-500" />
                    </div>
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Private Profile</h2>
                    <p className="text-gray-500 dark:text-gray-400 mb-6">This user has chosen to keep their stats private.</p>
                    <button onClick={() => router.push('/leaderboard')} className="text-emerald-600 dark:text-emerald-400 font-medium hover:underline">Back to Leaderboard</button>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-emerald-950 pb-20">
            {/* Cover / Header */}
            <div className="h-48 bg-emerald-600 dark:bg-emerald-900 relative">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/arabesque.png')] opacity-10"></div>
                <button onClick={() => router.back()} className="absolute top-4 left-4 bg-white/10 p-2 rounded-full text-white backdrop-blur-sm hover:bg-white/20">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-arrow-left"><path d="m12 19-7-7 7-7" /><path d="M19 12H5" /></svg>
                </button>
            </div>

            <div className="max-w-md mx-auto px-4 -mt-20 relative z-10">
                {/* Profile Card */}
                <div className="bg-white dark:bg-emerald-900 rounded-2xl shadow-xl p-6 text-center border border-gray-100 dark:border-emerald-800">
                    <div className="w-32 h-32 mx-auto rounded-full p-1 bg-white dark:bg-emerald-800 shadow-lg -mt-20 mb-4 relative">
                        <div className="w-full h-full rounded-full overflow-hidden bg-gray-100 dark:bg-emerald-700">
                            {profile.avatar_url ? (
                                <img src={profile.avatar_url} alt={profile.name} className="w-full h-full object-cover" />
                            ) : (
                                <User className="w-12 h-12 text-gray-400 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                            )}
                        </div>
                    </div>

                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">{profile.name}</h1>
                    <p className="text-sm text-gray-500 dark:text-emerald-300 mb-6 flex items-center justify-center gap-1">
                        <Calendar className="w-3 h-3" />
                        Joined {format(new Date(profile.created_at), 'MMMM yyyy')}
                    </p>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-emerald-50 dark:bg-emerald-800/50 p-4 rounded-xl border border-emerald-100 dark:border-emerald-700/50">
                            <div className="flex items-center justify-center space-x-2 text-emerald-600 dark:text-emerald-400 mb-1">
                                <Award className="w-5 h-5" />
                                <span className="text-xs font-bold uppercase tracking-wider">Prayers</span>
                            </div>
                            <p className="text-3xl font-bold text-gray-900 dark:text-white">{profile.total_prayers}</p>
                        </div>

                        <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-xl border border-orange-100 dark:border-orange-900/50">
                            <div className="flex items-center justify-center space-x-2 text-orange-500 dark:text-orange-400 mb-1">
                                <Flame className="w-5 h-5 fill-current" />
                                <span className="text-xs font-bold uppercase tracking-wider">Streak</span>
                            </div>
                            <p className="text-3xl font-bold text-gray-900 dark:text-white">{profile.current_streak}</p>
                        </div>

                        <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl border border-blue-100 dark:border-blue-900/50 col-span-2">
                            <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center space-x-2 text-blue-600 dark:text-blue-400">
                                    <div className="p-1 bg-blue-100 dark:bg-blue-800 rounded">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>
                                    </div>
                                    <span className="text-xs font-bold uppercase tracking-wider">Consistency</span>
                                </div>
                                <span className="text-xl font-bold text-gray-900 dark:text-white">
                                    {(() => {
                                        const days = Math.max(1, Math.floor((new Date().getTime() - new Date(profile.created_at).getTime()) / (1000 * 60 * 60 * 24)))
                                        const possible = days * 5
                                        const percentage = Math.round((profile.total_prayers / possible) * 100) || 0
                                        return Math.min(100, percentage)
                                    })()}%
                                </span>
                            </div>
                            <div className="w-full bg-blue-100 dark:bg-blue-900/50 rounded-full h-2 overflow-hidden">
                                <div
                                    className="bg-blue-500 h-full rounded-full transition-all duration-1000"
                                    style={{ width: `${Math.min(100, Math.round((profile.total_prayers / (Math.max(1, Math.floor((new Date().getTime() - new Date(profile.created_at).getTime()) / (1000 * 60 * 60 * 24))) * 5)) * 100) || 0)}%` }}
                                ></div>
                            </div>
                            <p className="text-[10px] text-blue-400 dark:text-blue-300 mt-2 text-right">Based on account age</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
