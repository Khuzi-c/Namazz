'use client'

import { createClient } from '@/utils/supabase/client'
import { useEffect, useState } from 'react'
import { Check, Loader2 } from 'lucide-react'
import { format } from 'date-fns'

type Prayers = {
    fajr: boolean
    zuhr: boolean
    asr: boolean
    maghrib: boolean
    isha: boolean
}

export default function PrayerChecklist() {
    const [prayers, setPrayers] = useState<Prayers>({
        fajr: false,
        zuhr: false,
        asr: false,
        maghrib: false,
        isha: false,
    })
    const [loading, setLoading] = useState(true)
    const [userId, setUserId] = useState<string | null>(null)
    const [isGuest, setIsGuest] = useState(false)
    const supabase = createClient()
    const today = format(new Date(), 'yyyy-MM-dd')
    const isFriday = new Date().getDay() === 5

    useEffect(() => {
        async function init() {
            const { data: { user } } = await supabase.auth.getUser()
            if (user) {
                setUserId(user.id)
                fetchPrayers(user.id)
            } else {
                setIsGuest(true)
                loadGuestPrayers()
                setLoading(false)
            }
        }
        init()

        // Notification Check Loop (Simple Polling)
        const checkTime = () => {
            // Real implementation would compare current time with AlAdhan API times
            // For now, we will just ensure permission is requested
            if ('Notification' in window && Notification.permission === 'default') {
                // Don't spam prompt, let user click button in Settings
            }
        }
        const interval = setInterval(checkTime, 60000)
        return () => clearInterval(interval)
    }, [])

    const fetchPrayers = async (uid: string) => {
        try {
            const { data, error } = await supabase
                .from('prayers')
                .select('*')
                .eq('user_id', uid)
                .eq('date', today)
                .single()

            if (data) {
                setPrayers({
                    fajr: data.fajr,
                    zuhr: data.zuhr,
                    asr: data.asr,
                    maghrib: data.maghrib,
                    isha: data.isha,
                })
            }
        } catch (error) {
            console.error('Error fetching prayers:', error)
        } finally {
            setLoading(false)
        }
    }

    const loadGuestPrayers = () => {
        const stored = localStorage.getItem(`prayers-${today}`)
        if (stored) {
            try {
                setPrayers(JSON.parse(stored))
            } catch (e) {
                console.error("Failed to parse guest prayers", e)
            }
        }
    }

    // Micro-interaction state
    const [lastChecked, setLastChecked] = useState<string | null>(null)
    const [showDua, setShowDua] = useState(false)

    const togglePrayer = async (prayer: keyof Prayers) => {
        const newValue = !prayers[prayer]
        const newPrayers = { ...prayers, [prayer]: newValue }

        // Optimistic update
        setPrayers(newPrayers)

        // Show feedback if checking (not unchecking)
        if (newValue) {
            setLastChecked(prayer)
            setTimeout(() => setLastChecked(null), 2000)
        }

        // Check if all done
        const allDone = Object.values(newPrayers).every(Boolean)
        const wasAllDone = Object.values(prayers).every(Boolean)
        if (allDone && !wasAllDone) {
            setShowDua(true)
        }

        if (userId) {
            const { error } = await supabase.from('prayers').upsert(
                {
                    user_id: userId,
                    date: today,
                    ...newPrayers,
                },
                { onConflict: 'user_id,date' }
            )

            if (error) {
                console.error('Error updating prayer:', error)
                // Revert
                setPrayers((prev) => ({ ...prev, [prayer]: !newValue }))
            } else {
                // Update Leaderboard Stats (Total Prayers + Streak)
                // We'll optimistically update if Checking
                if (newValue) {
                    await supabase.rpc('increment_total_prayers', { uid: userId })
                } else {
                    await supabase.rpc('decrement_total_prayers', { uid: userId })
                }

                // Update Streak
                await supabase.rpc('update_streak', { uid: userId })

                // --- Achievement Checks ---
                // 1. First Step (Any prayer)
                if (newValue) {
                    await supabase.from('user_achievements').insert({ user_id: userId, achievement_id: 'first_step' }).select().single().then(({ error }) => {
                        if (!error) alert('🏆 Achievement Unlocked: First Step!') // Simple alert for now, can be toast later
                    })
                }

                // 2. High Five (All 5 done)
                if (allDone) {
                    await supabase.from('user_achievements').insert({ user_id: userId, achievement_id: 'high_five' }).select().single().then(({ error }) => {
                        if (!error) alert('🏆 Achievement Unlocked: Perfect Day!')
                    })
                }
            }
        } else {
            // Guest mode: save to local storage
            localStorage.setItem(`prayers-${today}`, JSON.stringify(newPrayers))
        }
    }

    if (loading) return <div className="flex justify-center p-8"><Loader2 className="animate-spin text-emerald-600" /></div>

    // In guest mode, we don't block anymore
    if (!userId && !isGuest) {
        // Should not happen with new logic, but safe fallback
        return null;
    }

    return (
        <>
            {/* Dua Modal for All 5 Done */}
            {showDua && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in-up">
                    <div className="bg-white dark:bg-emerald-900 rounded-2xl p-8 max-w-sm w-full text-center shadow-2xl border-2 border-emerald-500 relative">
                        <button
                            onClick={() => setShowDua(false)}
                            className="absolute top-2 right-2 p-2 text-gray-400 hover:text-gray-600 dark:text-gray-400"
                        >✕</button>
                        <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-800 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl">
                            🎉
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">MashaAllah!</h3>
                        <p className="text-gray-600 dark:text-gray-300 mb-6">
                            You've completed all 5 daily prayers. May Allah accept your efforts and keep you steadfast.
                        </p>
                        <button
                            onClick={() => setShowDua(false)}
                            className="bg-emerald-600 text-white px-6 py-2 rounded-full font-bold hover:bg-emerald-700 w-full"
                        >
                            Ameen
                        </button>
                    </div>
                </div>
            )}

            <div className="bg-white dark:bg-emerald-900 rounded-2xl shadow-sm border border-emerald-100 dark:border-emerald-800 overflow-hidden transition-colors">
                <div className={`${isFriday ? 'bg-gradient-to-r from-amber-500 to-yellow-600' : 'bg-emerald-600 dark:bg-emerald-800'} px-6 py-4 flex justify-between items-center transition-all duration-500`}>
                    <div>
                        <h2 className="text-white font-semibold text-lg flex items-center gap-2">
                            {isFriday && <span className="text-yellow-200">✨</span>}
                            Daily Prayers
                        </h2>
                        <p className={`${isFriday ? 'text-yellow-100' : 'text-emerald-100'} text-sm`}>{format(new Date(), 'EEEE, MMMM do')}</p>
                    </div>
                    {!userId && (
                        <span className="text-xs bg-white/20 text-white px-2 py-1 rounded border border-white/30 backdrop-blur-sm">Guest</span>
                    )}
                </div>
                <div className="p-4 divide-y divide-gray-100 dark:divide-emerald-800/50">
                    {(Object.keys(prayers) as Array<keyof Prayers>).map((prayer) => (
                        <div key={prayer} className="flex flex-col py-3 px-2 hover:bg-emerald-50 dark:hover:bg-emerald-800/20 rounded-lg transition-colors group">
                            <div className="flex items-center justify-between">
                                <span onClick={() => togglePrayer(prayer)} className="capitalize font-medium text-gray-700 dark:text-gray-200 cursor-pointer flex-1">{prayer}</span>

                                <div className="flex items-center gap-3">
                                    {/* Beta: Photo Proof Button */}
                                    {typeof window !== 'undefined' && localStorage.getItem('beta-photo-proofs') === 'true' && userId && !prayers[prayer] && (
                                        <label
                                            onClick={(e) => e.stopPropagation()}
                                            className="p-2 bg-gray-100 dark:bg-emerald-800 rounded-full cursor-pointer hover:bg-emerald-100 dark:hover:bg-emerald-700 text-gray-400 dark:text-emerald-300 hover:text-emerald-600 transition-colors z-10"
                                        >
                                            <input
                                                type="file"
                                                accept="image/*"
                                                capture="environment"
                                                className="hidden"
                                                onChange={async (e) => {
                                                    if (e.target.files?.[0]) {
                                                        const file = e.target.files[0]
                                                        const ext = file.name.split('.').pop()
                                                        const path = `${userId}/${today}/${prayer}.${ext}`

                                                        // 1. Upload
                                                        const { error: uploadError } = await supabase.storage.from('prayer-proofs').upload(path, file, { upsert: true })

                                                        if (!uploadError) {
                                                            const { data: { publicUrl } } = supabase.storage.from('prayer-proofs').getPublicUrl(path)

                                                            const { data: currentData } = await supabase.from('prayers').select('proofs').eq('user_id', userId).eq('date', today).single()
                                                            const currentProofs = currentData?.proofs || {}
                                                            const newProofs = { ...currentProofs, [prayer]: publicUrl }

                                                            await supabase.from('prayers').update({ proofs: newProofs }).eq('user_id', userId).eq('date', today)

                                                            // 3. Mark as done automatically
                                                            togglePrayer(prayer)
                                                            alert('Proof uploaded & Prayer marked done! 📸')
                                                        } else {
                                                            alert('Upload failed: ' + uploadError.message)
                                                        }
                                                    }
                                                }}
                                            />
                                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z" /><circle cx="12" cy="13" r="3" /></svg>
                                        </label>
                                    )}

                                    <div
                                        onClick={() => togglePrayer(prayer)}
                                        className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all duration-200 cursor-pointer active:scale-75 ${prayers[prayer]
                                            ? 'bg-emerald-500 border-emerald-500 text-white scale-110 shadow-md shadow-emerald-200 dark:shadow-none'
                                            : 'border-gray-300 dark:border-emerald-700 text-transparent hover:border-emerald-400'
                                            }`}
                                    >
                                        <Check className="w-5 h-5" />
                                    </div>
                                </div>
                            </div>
                            {/* Micro-feedback text */}
                            <div className={`text-end overflow-hidden transition-all duration-500 ${lastChecked === prayer ? 'max-h-6 opacity-100 mt-1' : 'max-h-0 opacity-0'}`}>
                                <span className="text-[10px] sm:text-xs font-medium text-emerald-600 dark:text-emerald-400">May Allah accept it 🤍</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </>
    )
}
