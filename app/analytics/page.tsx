import { createClient } from '@/utils/supabase/server'
import { WeeklyProgressChart, ConsistencyBarChart } from '@/components/AnalyticsCharts'
import { format, subDays, eachDayOfInterval, startOfMonth, endOfMonth, getDay, isSameMonth, isToday, isSameDay } from 'date-fns'
import Link from 'next/link'

export default async function AnalyticsPage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return (
            <div className="min-h-screen pb-24 p-6 flex flex-col items-center justify-center text-center">
                <h1 className="text-2xl font-bold text-emerald-900 mb-2">Analytics</h1>
                <p className="text-gray-600 mb-6">Sign in to view your prayer stats and history.</p>
                <Link href="/login" className="bg-emerald-600 text-white px-6 py-2 rounded-full font-medium">
                    Sign In
                </Link>
            </div>
        )
    }

    // Helper date functions
    const today = new Date()
    const last7Days = eachDayOfInterval({
        start: subDays(today, 6),
        end: today
    })

    // Fetch data for the last 30 days
    const { data: prayers } = await supabase
        .from('prayers')
        .select('*')
        .eq('user_id', user.id)
        .gte('date', format(subDays(today, 30), 'yyyy-MM-dd'))
        .lte('date', format(today, 'yyyy-MM-dd'))
        .order('date', { ascending: true })

    // --- Calculations ---

    // 1. Weekly Data
    const weeklyData = last7Days.map(day => {
        const dateStr = format(day, 'yyyy-MM-dd')
        const dayRecord = prayers?.find(p => p.date === dateStr)
        let count = 0
        if (dayRecord) {
            if (dayRecord.fajr) count++
            if (dayRecord.zuhr) count++
            if (dayRecord.asr) count++
            if (dayRecord.maghrib) count++
            if (dayRecord.isha) count++
        }
        return {
            date: format(day, 'EEE'),
            count
        }
    })

    // 2. Monthly Prayers Count & Week Summary
    let monthlyPrayersCount = 0
    let weekTotalCount = 0

    // Sum for monthly total
    prayers?.forEach(p => {
        if (p.fajr) monthlyPrayersCount++
        if (p.zuhr) monthlyPrayersCount++
        if (p.asr) monthlyPrayersCount++
        if (p.maghrib) monthlyPrayersCount++
        if (p.isha) monthlyPrayersCount++
    })

    // Sum for this week (X/35 logic)
    // We already calculated `weeklyData` counts, just sum them up
    weekTotalCount = weeklyData.reduce((acc, day) => acc + day.count, 0)


    // 3. Current Streak
    let streak = 0
    const dateMap = new Map()
    prayers?.forEach(p => {
        let count = 0
        if (p.fajr) count++
        if (p.zuhr) count++
        if (p.asr) count++
        if (p.maghrib) count++
        if (p.isha) count++
        dateMap.set(p.date, count)
    })

    // Check today
    const todayStr = format(today, 'yyyy-MM-dd')
    if (dateMap.get(todayStr) === 5) {
        streak++
    }

    // Check backwards
    for (let i = 1; i <= 365; i++) {
        const d = subDays(today, i)
        const ds = format(d, 'yyyy-MM-dd')
        if (dateMap.get(ds) === 5) {
            streak++
        } else {
            // If yesterday was missing but today is perfect, streak is 1. 
            // If yesterday was perfect, continue.
            // Loop breaks when a day is not perfect.
            break
        }
    }


    // 4. Monthly Consistency (Weeks)
    const monthlyChartData = []
    for (let i = 3; i >= 0; i--) {
        const weekStart = subDays(today, i * 7 + 6)
        const weekEnd = subDays(today, i * 7)
        // Sum prayers in this range
        let weekSum = 0
        prayers?.forEach(p => {
            const pDate = new Date(p.date)
            // Simple date comparison - imprecise but sufficient for visual
            if (pDate >= weekStart && pDate <= weekEnd) {
                if (p.fajr) weekSum++
                if (p.zuhr) weekSum++
                if (p.asr) weekSum++
                if (p.maghrib) weekSum++
                if (p.isha) weekSum++
            }
        })
        monthlyChartData.push({
            date: `W${4 - i}`,
            count: weekSum
        })
    }

    // 5. Monthly Calendar Logic
    const monthStart = startOfMonth(today)
    const monthEnd = endOfMonth(today)
    const calendarDays = eachDayOfInterval({ start: monthStart, end: monthEnd })

    // Pad start of month
    const startDayOfWeek = getDay(monthStart) // 0 (Sun) to 6 (Sat)
    const paddingDays = Array(startDayOfWeek).fill(null)

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-emerald-950 pb-24 transition-colors duration-300">
            <header className="bg-white dark:bg-emerald-900 px-6 py-4 shadow-sm border-b dark:border-emerald-800">
                <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">Your Progress</h1>
            </header>

            <main className="p-4 space-y-6 max-w-lg mx-auto">
                {/* Stats Grid */}
                <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white dark:bg-emerald-900 p-4 rounded-xl shadow-sm border border-emerald-50 dark:border-emerald-800">
                        <p className="text-gray-500 dark:text-emerald-400 text-xs uppercase tracking-wider font-medium">Current Streak</p>
                        <div className="flex items-baseline mt-1">
                            <span className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">{streak}</span>
                            <span className="text-sm text-gray-400 ml-1">days</span>
                        </div>
                    </div>
                    <div className="bg-white dark:bg-emerald-900 p-4 rounded-xl shadow-sm border border-emerald-50 dark:border-emerald-800">
                        <p className="text-gray-500 dark:text-emerald-400 text-xs uppercase tracking-wider font-medium">This Week</p>
                        <div className="flex items-baseline mt-1">
                            <div className="flex items-baseline">
                                <span className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">{weekTotalCount}</span>
                                <span className="text-sm text-gray-400 dark:text-gray-500 font-medium">/35</span>
                            </div>
                        </div>
                        <p className="text-[10px] text-gray-400 mt-1">Prayers completed</p>
                    </div>
                </div>

                {/* Calendar View */}
                <div className="bg-white dark:bg-emerald-900 p-6 rounded-xl shadow-sm border border-emerald-50 dark:border-emerald-800">
                    <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-4 flex justify-between items-center">
                        <span>{format(today, 'MMMM yyyy')}</span>
                        <span className="text-xs text-gray-400 font-normal">Monthly Overview</span>
                    </h3>
                    <div className="grid grid-cols-7 gap-1 text-center mb-2">
                        {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => (
                            <div key={`day-header-${i}`} className="text-xs text-gray-400 font-medium">{d}</div>
                        ))}
                    </div>
                    <div className="grid grid-cols-7 gap-1">
                        {paddingDays.map((_, i) => <div key={`pad-${i}`} className="aspect-square" />)}
                        {calendarDays.map(day => {
                            const dateStr = format(day, 'yyyy-MM-dd')
                            const record = prayers?.find(p => p.date === dateStr)

                            // Calculate color intensity based on prayers done
                            let count = 0
                            if (record) {
                                if (record.fajr) count++
                                if (record.zuhr) count++
                                if (record.asr) count++
                                if (record.maghrib) count++
                                if (record.isha) count++
                            }

                            // Generate Color Class
                            let bgClass = 'bg-gray-100 dark:bg-emerald-800/30 text-gray-400 dark:text-gray-500' // Default / 0
                            if (count === 5) bgClass = 'bg-emerald-500 text-white shadow-sm shadow-emerald-200 dark:shadow-none' // Perfect
                            else if (count >= 3) bgClass = 'bg-emerald-300 dark:bg-emerald-600 text-white' // Good
                            else if (count > 0) bgClass = 'bg-emerald-100 dark:bg-emerald-800 text-emerald-700 dark:text-emerald-300' // Started

                            const isTodayDate = isToday(day)

                            return (
                                <div
                                    key={dateStr}
                                    className={`aspect-square rounded-lg flex items-center justify-center text-xs font-medium relative ${bgClass} ${isTodayDate ? 'ring-2 ring-emerald-400 dark:ring-emerald-500 ring-offset-1 dark:ring-offset-emerald-900' : ''}`}
                                >
                                    {format(day, 'd')}
                                </div>
                            )
                        })}
                    </div>
                    <div className="flex items-center justify-between mt-4 text-[10px] text-gray-400 px-1">
                        <div className="flex items-center gap-1"><div className="w-2 h-2 rounded bg-gray-100 dark:bg-emerald-800/30"></div><span>0</span></div>
                        <div className="flex items-center gap-1"><div className="w-2 h-2 rounded bg-emerald-100 dark:bg-emerald-800"></div><span>1-2</span></div>
                        <div className="flex items-center gap-1"><div className="w-2 h-2 rounded bg-emerald-300 dark:bg-emerald-600"></div><span>3-4</span></div>
                        <div className="flex items-center gap-1"><div className="w-2 h-2 rounded bg-emerald-500"></div><span>5</span></div>
                    </div>
                </div>

                {/* Weekly Chart */}
                <WeeklyProgressChart data={weeklyData} />

                {/* Monthly Chart */}
                <ConsistencyBarChart data={monthlyChartData} />

                {/* Insight Card */}
                <div className="bg-emerald-900 text-white p-6 rounded-xl shadow-lg">
                    <h3 className="font-semibold text-lg mb-2">Keep it up!</h3>
                    <p className="text-emerald-100 text-sm">
                        "The most beloved deed to Allah is the one performed consistently, even if it is small."
                    </p>
                </div>

                {/* Photo Gallery (Beta) */}
                {prayers?.some(p => p.proofs && Object.values(p.proofs).length > 0) && (
                    <div className="bg-white dark:bg-emerald-900 p-6 rounded-xl shadow-sm border border-emerald-50 dark:border-emerald-800">
                        <div className="flex items-center gap-2 mb-4">
                            <h3 className="font-semibold text-gray-900 dark:text-gray-100">Prayer Journal</h3>
                            <span className="bg-emerald-100 dark:bg-emerald-800 text-emerald-700 dark:text-emerald-200 px-1.5 py-0.5 rounded text-[10px] font-bold">BETA</span>
                        </div>
                        <div className="grid grid-cols-3 gap-2">
                            {prayers
                                .filter(p => p.proofs)
                                .flatMap(p => Object.entries(p.proofs as Record<string, string>).map(([name, url]) => ({ date: p.date, name, url })))
                                .reverse() // Newest first
                                .slice(0, 9) // Limit to 9
                                .map((item, i) => (
                                    <div key={i} className="aspect-square rounded-lg overflow-hidden relative group">
                                        <img src={item.url} className="w-full h-full object-cover transition-transform group-hover:scale-110" />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <p className="text-[10px] text-white font-medium capitalize">{format(new Date(item.date), 'MMM d')} • {item.name}</p>
                                        </div>
                                    </div>
                                ))}
                        </div>
                        <p className="text-xs text-gray-400 mt-4 text-center">Your visual history of devotion.</p>
                    </div>
                )}
            </main>
        </div>
    )
}
