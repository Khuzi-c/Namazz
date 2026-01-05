'use client'

import { createClient } from '@/utils/supabase/client'
import { useState, useEffect } from 'react'
import { ChevronLeft, Plus, Minus, Loader2 } from 'lucide-react'
import Link from 'next/link'

type QadaCounts = {
    fajr: number
    zuhr: number
    asr: number
    maghrib: number
    isha: number
    witr: number
}

export default function QadaPage() {
    const [counts, setCounts] = useState<QadaCounts>({ fajr: 0, zuhr: 0, asr: 0, maghrib: 0, isha: 0, witr: 0 })
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [userId, setUserId] = useState<string | null>(null)
    const supabase = createClient()

    useEffect(() => {
        async function load() {
            const { data: { user } } = await supabase.auth.getUser()
            if (user) {
                setUserId(user.id)
                const { data } = await supabase.from('qada_tracking').select('*').eq('user_id', user.id).single()

                if (data) {
                    setCounts({
                        fajr: data.fajr,
                        zuhr: data.zuhr,
                        asr: data.asr,
                        maghrib: data.maghrib,
                        isha: data.isha,
                        witr: data.witr
                    })
                }
                // If no data, we stick to 0s, and the first save will insert.
            }
            setLoading(false)
        }
        load()
    }, [])

    const saveData = async (newCounts: QadaCounts) => {
        if (!userId) return
        setSaving(true)
        await supabase.from('qada_tracking').upsert({
            user_id: userId,
            ...newCounts,
            updated_at: new Date().toISOString()
        })
        setSaving(false)
    }

    // Debounced Auto-save Effect
    useEffect(() => {
        if (!loading && userId) {
            const timer = setTimeout(() => {
                saveData(counts)
            }, 1000)
            return () => clearTimeout(timer)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [counts, userId]) // Removed loading from dep to avoid loop, though loading changes only once.


    const updateCount = (type: keyof QadaCounts, delta: number) => {
        setCounts(prev => {
            const newVal = Math.max(0, prev[type] + delta)
            return { ...prev, [type]: newVal }
        })
    }

    if (loading) return <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-emerald-950"><Loader2 className="animate-spin text-emerald-600" /></div>

    if (!userId) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-emerald-950 p-6 flex flex-col items-center justify-center text-center">
                <h2 className="text-xl font-bold mb-2">Sign in Required</h2>
                <p className="mb-4">You need an account to track your missed prayers.</p>
                <Link href="/login" className="bg-emerald-600 text-white px-6 py-2 rounded-full">Sign In</Link>
            </div>
        )
    }

    const totalMissed = Object.values(counts).reduce((a, b) => a + b, 0)

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-emerald-950 pb-24 transition-colors">
            <header className="bg-white dark:bg-emerald-900 px-6 py-4 shadow-sm border-b dark:border-emerald-800 flex items-center gap-4 sticky top-0 z-10">
                <Link href="/" className="p-1 -ml-1 rounded-full hover:bg-gray-100 dark:hover:bg-emerald-800 text-gray-600 dark:text-emerald-100 transition-colors">
                    <ChevronLeft className="w-6 h-6" />
                </Link>
                <div className="flex-1">
                    <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">Qada Bank</h1>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Track and repay missed prayers</p>
                </div>
                {saving && <Loader2 className="w-4 h-4 animate-spin text-emerald-500" />}
            </header>

            <main className="p-4 max-w-lg mx-auto space-y-6">

                {/* Total Summary */}
                <div className="bg-gradient-to-br from-indigo-600 to-indigo-800 rounded-2xl p-6 text-white shadow-lg shadow-indigo-200 dark:shadow-none text-center">
                    <p className="text-indigo-200 uppercase tracking-widest text-xs font-semibold mb-1">Total Debt</p>
                    <h2 className="text-5xl font-bold mb-2">{totalMissed}</h2>
                    <p className="text-sm text-indigo-100 opacity-80">prayers to make up</p>
                </div>

                <div className="grid grid-cols-1 gap-3">
                    {/* Rows for each prayer */}
                    {(Object.keys(counts) as Array<keyof QadaCounts>).map(type => (
                        <div key={type} className="bg-white dark:bg-emerald-900 p-4 rounded-xl border border-gray-100 dark:border-emerald-800 flex items-center justify-between shadow-sm">
                            <div className="flex items-center gap-3">
                                <div className={`w-2 h-10 rounded-full ${counts[type] > 0 ? 'bg-red-400' : 'bg-emerald-200'}`}></div>
                                <div>
                                    <h3 className="font-bold text-lg capitalize text-gray-800 dark:text-gray-100">{type}</h3>
                                    <p className="text-xs text-gray-500">{counts[type] > 0 ? 'Pending' : 'All good'}</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-4">
                                <button
                                    onClick={() => updateCount(type, -1)}
                                    disabled={counts[type] === 0}
                                    className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-800 text-emerald-700 dark:text-emerald-300 flex items-center justify-center disabled:opacity-30 hover:bg-emerald-200 active:scale-75 transition-all duration-100"
                                >
                                    <Minus className="w-5 h-5" />
                                </button>
                                <span className="text-xl font-bold w-8 text-center tabular-nums">{counts[type]}</span>
                                <button
                                    onClick={() => updateCount(type, 1)}
                                    className="w-10 h-10 rounded-full bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-300 flex items-center justify-center hover:bg-red-100 active:scale-75 transition-all duration-100"
                                >
                                    <Plus className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="p-4 bg-yellow-50 dark:bg-yellow-900/10 border border-yellow-100 dark:border-yellow-800/30 rounded-xl text-xs text-yellow-800 dark:text-yellow-200 leading-relaxed">
                    <p><strong>Note:</strong> Use the <span className="font-bold text-red-500">+</span> button when you miss a prayer. Use the <span className="font-bold text-emerald-500">-</span> button when you perform a Qada (make-up) prayer to pay off your debt.</p>
                </div>
            </main>
        </div>
    )
}
