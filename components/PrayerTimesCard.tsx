'use client'

import { useEffect, useState } from 'react'
import { MapPin, Loader2 } from 'lucide-react'

type Timings = {
    Fajr: string
    Dhuhr: string
    Asr: string
    Maghrib: string
    Isha: string
    [key: string]: string
}

export default function PrayerTimesCard() {
    const [timings, setTimings] = useState<Timings | null>(null)
    const [locationName, setLocationName] = useState('Locating...')
    const [loading, setLoading] = useState(true)
    const [nextPrayer, setNextPrayer] = useState<{ name: string; time: string } | null>(null)
    const [use12Hour, setUse12Hour] = useState(true)

    const formatTime = (time: string) => {
        if (!time) return '--:--'
        if (!use12Hour) return time
        const [hours, minutes] = time.split(':')
        const h = parseInt(hours, 10)
        const suffix = h >= 12 ? 'PM' : 'AM'
        const formattedH = h % 12 || 12
        return `${formattedH}:${minutes} ${suffix}`
    }

    useEffect(() => {
        // Load Time Format
        const loadFormat = () => {
            const saved = localStorage.getItem('time-format')
            setUse12Hour(saved !== '24h')
        }
        loadFormat()

        // Listen for changes
        window.addEventListener('storage', loadFormat)
        return () => window.removeEventListener('storage', loadFormat)
    }, [])

    useEffect(() => {
        // 1. Try to load from cache first
        const today = new Date().toISOString().split('T')[0]
        const cached = localStorage.getItem(`namaz-timings-${today}`)

        if (cached) {
            try {
                const { timings: cachedTimings, meta } = JSON.parse(cached)
                setTimings(cachedTimings)
                setLocationName(meta.timezone)
                calculateNextPrayer(cachedTimings)
                setLoading(false) // Data is ready immediately
            } catch (e) {
                console.error('Cache parse error', e)
            }
        }

        // 2. Fetch fresh data (updates cache if successful)
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    fetchTimings(position.coords.latitude, position.coords.longitude)
                },
                (error) => {
                    console.error('Geolocation error:', error)
                    if (!cached) { // Only fallback if no cache
                        setLocationName('London (Fallback)')
                        fetchTimings(51.5074, -0.1278)
                    }
                }
            )
        } else if (!cached) {
            setLocationName('London (Fallback)')
            fetchTimings(51.5074, -0.1278)
        }
    }, [])

    const fetchTimings = async (lat: number, lng: number) => {
        try {
            const date = new Date()
            const response = await fetch(
                `https://api.aladhan.com/v1/timings/${Math.floor(date.getTime() / 1000)}?latitude=${lat}&longitude=${lng}&method=2`
            )
            const data = await response.json()
            if (data.code === 200) {
                setTimings(data.data.timings)
                setLocationName(data.data.meta.timezone)
                calculateNextPrayer(data.data.timings)

                // Save to Cache
                const today = new Date().toISOString().split('T')[0]
                localStorage.setItem(`namaz-timings-${today}`, JSON.stringify(data.data))
            }
        } catch (error) {
            console.error('Error fetching timings:', error)
        } finally {
            setLoading(false)
        }
    }

    const calculateNextPrayer = (timings: Timings) => {
        if (!timings) return
        const now = new Date()
        const prayerNames = ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha']

        for (const name of prayerNames) {
            const timeStr = timings[name]
            const [hours, minutes] = timeStr.split(':').map(Number)
            const prayerDate = new Date()
            prayerDate.setHours(hours, minutes, 0)
            prayerDate.setSeconds(0)

            if (prayerDate > now) {
                setNextPrayer({ name, time: timeStr })
                return
            }
        }
        // If all passed, next is Fajr tomorrow
        setNextPrayer({ name: 'Fajr', time: timings['Fajr'] })
    }

    // Countdown Timer Logic
    const [timeLeft, setTimeLeft] = useState('')

    useEffect(() => {
        if (!nextPrayer || !timings) return

        const timer = setInterval(() => {
            const now = new Date()
            const timeStr = nextPrayer.time
            const [hours, minutes] = timeStr.split(':').map(Number)
            let prayerDate = new Date()
            prayerDate.setHours(hours, minutes, 0)
            prayerDate.setSeconds(0)

            // If prayer is earlier in the day than now, it must be tomorrow (e.g. Next Fajr)
            // Exception: If we just detected it's for today (future).
            // Logic improvement: calculateNextPrayer determines the name. 
            // If the calculated name is Fajr and now is night, it's tomorrow's Fajr.
            if (nextPrayer.name === 'Fajr' && now.getHours() > 12) {
                prayerDate.setDate(now.getDate() + 1)
            }

            const diff = prayerDate.getTime() - now.getTime()

            if (diff <= 0) {
                // Refresh timings/logic if time passed
                if (timings) calculateNextPrayer(timings)
                return
            }

            const h = Math.floor(diff / (1000 * 60 * 60))
            const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))

            setTimeLeft(`${h}h ${m}m`)
        }, 60000) // Update every minute

        // Initial call
        const now = new Date()
        const timeStr = nextPrayer.time
        const [hours, minutes] = timeStr.split(':').map(Number)
        let prayerDate = new Date()
        prayerDate.setHours(hours, minutes, 0)
        prayerDate.setSeconds(0)
        if (nextPrayer.name === 'Fajr' && now.getHours() > 12) {
            prayerDate.setDate(now.getDate() + 1)
        }
        const diff = prayerDate.getTime() - now.getTime()
        if (diff > 0) {
            const h = Math.floor(diff / (1000 * 60 * 60))
            const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
            setTimeLeft(`${h}h ${m}m`)
        } else {
            setTimeLeft('Now')
        }

        return () => clearInterval(timer)
    }, [nextPrayer, timings])


    if (loading) {
        return (
            <div className="bg-emerald-800 text-white rounded-2xl p-6 shadow-lg animate-pulse h-48 flex items-center justify-center">
                <Loader2 className="animate-spin w-8 h-8" />
            </div>
        )
    }

    return (
        <div className="bg-emerald-900 dark:bg-emerald-950 text-white rounded-2xl p-6 shadow-lg relative overflow-hidden transition-colors border border-emerald-800">
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-800 rounded-full -mr-16 -mt-16 opacity-50 blur-2xl animate-pulse-slow"></div>

            <div className="relative z-10">
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center space-x-2 text-emerald-200 text-sm bg-emerald-900/50 px-2 py-1 rounded-full">
                        <MapPin className="w-3 h-3" />
                        <span>{locationName}</span>
                    </div>
                </div>

                <div className="mb-6">
                    <p className="text-emerald-300 text-xs font-medium uppercase tracking-wider mb-1">Upcoming Prayer</p>
                    <div className="flex items-end justify-between">
                        <div>
                            <h3 className="text-3xl font-bold">
                                {nextPrayer?.name || '--'}
                            </h3>
                            <p className="text-2xl font-light opacity-90">
                                {nextPrayer ? formatTime(nextPrayer.time) : '--:--'}
                            </p>
                        </div>
                        <div className="text-right">
                            <p className="text-xs text-emerald-300 mb-1">Starts in</p>
                            <p className="text-xl font-mono font-bold text-white bg-emerald-800/80 px-3 py-1 rounded-lg backdrop-blur-sm">
                                {timeLeft || '--'}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-5 gap-2 text-center text-xs">
                    {['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'].map(p => (
                        <div key={p} className={`py-2 rounded-lg transition-all duration-300 ${nextPrayer?.name === p ? 'bg-emerald-500 text-white font-bold scale-105 shadow-lg ring-2 ring-emerald-400/50' : 'bg-emerald-800/30 text-emerald-100 hover:bg-emerald-800/50'}`}>
                            <div className="mb-1 opacity-70 text-[10px] uppercase tracking-wide">{p}</div>
                            <div className="font-semibold">{timings ? formatTime(timings[p]) : '--'}</div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
