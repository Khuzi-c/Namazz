import Link from 'next/link'
import AdBanner from '@/components/AdBanner'
import { createClient } from '@/utils/supabase/server'
import PrayerTimesCard from '@/components/PrayerTimesCard'
import PrayerChecklist from '@/components/PrayerChecklist'
import ExternalWidgets from '@/components/ExternalWidgets'
import { format } from 'date-fns'
import { LogOut } from 'lucide-react'
import { cookies } from 'next/headers'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Namazz - Daily Prayer Tracker', // Absolute title override? No, layout template makes it "Namazz - Daily Prayer Tracker | Namazz" which is weird.
  // Actually, let's use the default "Namazz" from layout for Home, or make it specific.
  // User said: "Namazz - Login".
  // For home, maybe just "Namazz - Your Spiritual Companion".
}

export default async function Home() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const cookieStore = await cookies()
  const isGuest = cookieStore.get('guest-mode')?.value === 'true'

  const signOut = async () => {
    'use server'
    const supabase = await createClient()
    await supabase.auth.signOut()
  }

  if (!user && !isGuest) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-emerald-50 px-4 text-center">
        <div className="mb-8 animate-fade-in-up">
          <h1 className="text-4xl font-bold text-emerald-900">Namazz</h1>
          <p className="mt-2 text-lg text-emerald-700">Connect with your Creator, one prayer at a time.</p>
        </div>
        <div className="flex flex-col gap-4 items-center animate-fade-in-up delay-100">
          <Link
            href="/login"
            className="w-full rounded-full bg-emerald-600 px-8 py-3 font-semibold text-white shadow-lg transition-transform hover:scale-105 active:scale-95 sm:w-auto"
          >
            Get Started
          </Link>
          <form
            action={async () => {
              'use server'
              const { cookies } = await import('next/headers')
              const cookieStore = await cookies()
              cookieStore.set('guest-mode', 'true')
            }}
          >
            <button className="text-sm font-medium text-emerald-600 hover:text-emerald-800 hover:underline">
              Continue as Guest
            </button>
          </form>
        </div>
      </div>
    )
  }

  // Fetch Profile Name
  let userName = 'Believer'
  if (user) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('name')
      .eq('id', user.id)
      .single()

    userName = profile?.name || user.email?.split('@')[0] || 'Believer'
  } else {
    userName = 'Guest'
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-emerald-950 pb-20 transition-colors duration-300">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 dark:bg-emerald-900/80 px-6 py-4 backdrop-blur-md animate-fade-in-up border-b dark:border-emerald-800">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <img src="/icon.png" alt="Logo" className="w-8 h-8 object-contain" />
            <div>
              <p className="text-xs font-medium text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">Assalamu Alaikum</p>
              <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">{userName}</h1>
            </div>
          </div>
          <form action="/auth/signout" method="post">
            <button className="rounded-full bg-gray-100 dark:bg-emerald-800 p-2 text-gray-600 dark:text-emerald-200 hover:bg-gray-200 dark:hover:bg-emerald-700 transition-colors">
              <Link href="/settings" className="flex items-center">
                <span className="sr-only">Settings</span>
                <div className="h-8 w-8 rounded-full bg-emerald-100 dark:bg-emerald-700 flex items-center justify-center font-bold text-emerald-700 dark:text-emerald-100">
                  {userName.charAt(0).toUpperCase()}
                </div>
              </Link>
            </button>
          </form>
        </div>
      </header>

      <main className="px-4 py-6 space-y-6 max-w-lg mx-auto">
        {/* Quote / Date */}
        <div className="text-center mb-2 animate-fade-in-up">
          <p className="text-sm text-gray-500">{format(new Date(), 'EEEE, MMMM do, yyyy')}</p>
        </div>

        {/* Guest Banner */}
        {!user && userName === 'Guest' && (
          <div className="bg-emerald-50 dark:bg-emerald-900/40 border border-emerald-100 dark:border-emerald-800 rounded-xl p-4 mb-2 flex items-center justify-between animate-fade-in-up">
            <div className="text-sm text-emerald-800 dark:text-emerald-200">
              <span className="font-bold">Guest Mode:</span> Create an account to save your streak forever!
            </div>
            <Link href="/login" className="text-xs bg-emerald-600 text-white px-3 py-1.5 rounded-lg hover:bg-emerald-700 transition">
              Sign Up
            </Link>
          </div>
        )}

        {/* Prayer Times */}
        <div className="animate-fade-in-up delay-100 animate-float">
          <PrayerTimesCard />
        </div>

        {/* Checklist */}
        <div className="animate-fade-in-up delay-200">
          <PrayerChecklist />
        </div>

        {/* Download App Banner */}
        <div className="bg-gradient-to-r from-emerald-800 to-emerald-900 rounded-2xl p-4 shadow-lg flex items-center justify-between animate-fade-in-up delay-200">
          <div className="flex items-center gap-3">
            <div className="bg-white/10 p-2 rounded-lg backdrop-blur-sm">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white"><rect width="14" height="20" x="5" y="2" rx="2" ry="2" /><path d="M12 18h.01" /></svg>
            </div>
            <div>
              <h3 className="text-white font-bold text-sm">Get the App</h3>
              <p className="text-emerald-100 text-xs">Install for better experience</p>
            </div>
          </div>
          <Link href="/download" className="bg-white text-emerald-900 text-xs font-bold px-4 py-2 rounded-full hover:bg-emerald-50 transition-colors shadow-sm">
            Install
          </Link>
        </div>

        {/* Daily Content / Ayah */}
        <div className="bg-white dark:bg-emerald-900 rounded-2xl p-6 shadow-sm border border-emerald-50 dark:border-emerald-800 text-center animate-fade-in-up delay-300 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-emerald-400 to-transparent opacity-50"></div>
          <h3 className="font-serif text-sm text-emerald-600 dark:text-emerald-400 uppercase tracking-widest mb-4">Daily Reflection</h3>

          <div className="mb-4">
            <p className="text-gray-700 dark:text-gray-200 text-lg leading-relaxed font-serif italic">
              "Indeed, prayer prohibits immorality and wrongdoing, and the remembrance of Allah is greater."
            </p>
          </div>

          <div className="w-16 h-[1px] bg-emerald-100 dark:bg-emerald-800 mx-auto mb-3"></div>
          <p className="text-xs text-gray-500 dark:text-gray-400 font-medium font-serif">Al-Ankabut 29:45</p>
        </div>

        {/* Quick Links Grid */}
        <div className="grid grid-cols-2 gap-4 mb-4">

          {/* Leaderboard Quick Link - Full Width */}
          <Link href="/leaderboard" className="col-span-2">
            <div className="w-full bg-gradient-to-r from-yellow-500 via-amber-500 to-yellow-600 rounded-xl p-4 flex items-center justify-between shadow-lg shadow-yellow-200/50 dark:shadow-none animate-fade-in-up delay-200 transform transition hover:scale-[1.02] relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/arabesque.png')] opacity-10"></div>
              <div className="flex items-center gap-4 relative z-10">
                <div className="bg-white/20 p-3 rounded-full backdrop-blur-sm">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white w-6 h-6"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" /><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" /><path d="M4 22h16" /><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" /><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" /><path d="M18 2h-6c-1.1 0-2 .49-2 1.22V7h10V3.22C20 2.49 19.1 2 18 2Z" /></svg>
                </div>
                <div>
                  <h3 className="font-bold text-lg text-white">Leaderboard</h3>
                  <p className="text-yellow-100 text-xs">Compete with the Ummah</p>
                </div>
              </div>
              <div className="bg-white/20 p-2 rounded-lg backdrop-blur-sm relative z-10">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white"><path d="m9 18 6-6-6-6" /></svg>
              </div>
            </div>
          </Link>

          {/* Qada Bank Quick Link */}
          <Link href="/qada">
            <div className="w-full bg-gradient-to-br from-indigo-500 to-violet-600 rounded-xl p-4 flex flex-col justify-between shadow-lg shadow-indigo-200/50 dark:shadow-none animate-fade-in-up delay-300 transform transition hover:scale-[1.02] h-full relative overflow-hidden">
              <div className="absolute top-0 right-0 p-2 opacity-20">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-12 h-12 text-white"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z" /></svg>
              </div>
              <div>
                <div className="bg-white/20 p-2 rounded-full backdrop-blur-sm w-fit mb-2">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white"><path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" /><path d="M3 3v5h5" /><path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16" /><path d="M16 16h5v5" /></svg>
                </div>
                <h3 className="font-bold text-lg text-white">Qada Bank</h3>
                <p className="text-indigo-100 text-[10px] leading-tight mt-1">Track Missed Prayers</p>
              </div>
            </div>
          </Link>

          {/* Dhikr Quick Link */}
          <Link href="/dhikr">
            <div className="w-full bg-gradient-to-br from-amber-500 to-orange-500 rounded-xl p-4 flex flex-col justify-between shadow-lg shadow-amber-200/50 dark:shadow-none animate-fade-in-up delay-300 transform transition hover:scale-[1.02] h-full relative overflow-hidden">
              {/* Icon content similar to before */}
              <div className="absolute top-0 right-0 p-2 opacity-20">
                <div className="w-12 h-12 rounded-full border-2 border-white" />
              </div>
              <div>
                <div className="bg-white/20 p-2 rounded-full backdrop-blur-sm w-fit mb-2">
                  <div className="w-4 h-4 rounded-full border border-white" />
                </div>
                <h3 className="font-bold text-lg text-white">Dhikr</h3>
                <p className="text-amber-100 text-[10px] leading-tight mt-1">Digital Tasbeeh</p>
              </div>
            </div>
          </Link>

          {/* Qibla Quick Link */}
          <Link href="/qibla">
            <div className="w-full bg-gradient-to-br from-emerald-600 to-teal-600 rounded-xl p-4 flex flex-col justify-between shadow-lg shadow-emerald-200/50 dark:shadow-none animate-fade-in-up delay-300 transform transition hover:scale-[1.02] h-full relative overflow-hidden">
              <div className="absolute top-0 right-0 p-2 opacity-20">
                <img src="/icon.png" className="w-12 h-12 invert brightness-0" alt="Qibla" />
              </div>
              <div>
                <div className="bg-white/20 p-2 rounded-full backdrop-blur-sm w-fit mb-2">
                  <img src="/icon.png" className="w-4 h-4 invert brightness-0" alt="Compass" />
                </div>
                <h3 className="font-bold text-lg text-white">Find Qibla</h3>
                <p className="text-emerald-100 text-[10px] leading-tight mt-1">Locate Kaaba Direction</p>
              </div>
            </div>
          </Link>

          {/* News Quick Link */}
          <Link href="/news">
            <div className="w-full bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl p-4 flex flex-col justify-between shadow-lg shadow-purple-200/50 dark:shadow-none animate-fade-in-up delay-300 transform transition hover:scale-[1.02] h-full relative overflow-hidden">
              <div className="absolute top-0 right-0 p-2 opacity-20">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-12 h-12 text-white"><path d="M12 3a1 1 0 0 1 1 1v1h1.5a1 1 0 0 1 0 2H13v1h1.5a1 1 0 0 1 0 2H13v1h1.5a1 1 0 0 1 0 2H13v1a1 1 0 0 1-2 0v-1H9.5a1 1 0 0 1 0-2H11v-1H9.5a1 1 0 0 1 0-2H11v-1H9.5a1 1 0 0 1 0-2H11V4a1 1 0 0 1 1-1z" /><path fillRule="evenodd" d="M20.25 4.5H22v15a2.25 2.25 0 0 1-2.25 2.25H3.75A2.25 2.25 0 0 1 1.5 19.5v-15a2.25 2.25 0 0 1 2.25-2.25h16.5zM3.75 6v14.25h15.75V6H3.75z" clipRule="evenodd" /></svg>
              </div>
              <div>
                <div className="bg-white/20 p-2 rounded-full backdrop-blur-sm w-fit mb-2">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
                </div>
                <h3 className="font-bold text-lg text-white">Insights</h3>
                <p className="text-purple-100 text-[10px] leading-tight mt-1">Read Islamic News</p>
              </div>
            </div>
          </Link>

        </div>

        {/* Onboarding / "How It Works" Section */}
        <section className="bg-white/50 dark:bg-emerald-900/20 rounded-3xl p-6 backdrop-blur-md animate-fade-in-up delay-300">
          <div className="text-center mb-8">
            <span className="text-xs font-bold text-emerald-500 uppercase tracking-widest">Features</span>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-2">Simple, Intuitive, Powerful</h2>
          </div>

          <div className="space-y-8">
            {/* Step 1 */}
            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-800 rounded-full flex items-center justify-center text-emerald-600 dark:text-emerald-300 font-bold text-lg">1</div>
              </div>
              <div>
                <h3 className="font-bold text-gray-900 dark:text-gray-100 mb-1">Enable Location</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                  Grant location permission for accurate prayer times based on your exact position. We support both GPS and manual location entry.
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-800 rounded-full flex items-center justify-center text-emerald-600 dark:text-emerald-300 font-bold text-lg">2</div>
              </div>
              <div>
                <h3 className="font-bold text-gray-900 dark:text-gray-100 mb-1">Choose Your Settings</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                  Select your preferred calculation method from 12+ options. Choose Hanafi or Shafi madhab for Asr time.
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <Link href="/achievements" className="group">
              <div className="bg-white dark:bg-emerald-900 p-4 rounded-2xl shadow-sm border border-emerald-100 dark:border-emerald-800 flex flex-col items-center justify-center text-center hover:shadow-md transition-shadow h-32">
                <div className="w-10 h-10 bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 rounded-full flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" /><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" /><path d="M4 22h16" /><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" /><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" /><path d="M18 2h-6c-1.1 0-2 .9-2 2v2.22a2 2 0 0 0 .58 1.45l2.42 2.42a1 1 0 0 1 .28.71V11a2 2 0 0 0 2 2h3a2 2 0 0 0 2-2v-.12a1 1 0 0 1 .29-.71l2.41-2.42A2 2 0 0 0 20 6.22V4c0-1.1-.9-2-2-2z" /></svg>
                </div>
                <h3 className="font-bold text-gray-900 dark:text-gray-100 text-sm">Badges</h3>
                <p className="text-[10px] text-gray-500 dark:text-gray-400">View Awards</p>
              </div>
            </Link>

            {/* Step 4: Qada (Existing) */}
            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-800 rounded-full flex items-center justify-center text-emerald-600 dark:text-emerald-300 font-bold text-lg">3</div>
              </div>
              <div>
                <h3 className="font-bold text-gray-900 dark:text-gray-100 mb-1">Enable Notifications</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                  Set up prayer reminders with optional Adhan sound. Customize notification timing and vibration preferences.
                </p>
              </div>
            </div>

            {/* Step 4 */}
            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-800 rounded-full flex items-center justify-center text-emerald-600 dark:text-emerald-300 font-bold text-lg">4</div>
              </div>
              <div>
                <h3 className="font-bold text-gray-900 dark:text-gray-100 mb-1">Start Praying</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                  View prayer times, find Qibla direction, track your dhikr, and mark prayers as completed. Your spiritual journey made simple.
                </p>
              </div>
            </div>
          </div>
        </section>



        {/* Advertisement */}
        <AdBanner />

        {/* External Widgets */}
        <ExternalWidgets />

        {/* Footer */}
        <footer className="mt-12 mb-8 text-center animate-fade-in-up delay-500">
          <div className="flex flex-col items-center space-y-2">
            <img src="/icon.png" alt="Logo" className="w-8 h-8 opacity-50 grayscale hover:grayscale-0 transition duration-500" />
            <p className="text-[10px] text-gray-400 dark:text-gray-500 max-w-xs mx-auto leading-relaxed">
              Copyright 2026 Copyrights Islam, Quran, Muslim And Prayers Apps. All Rights Reserved
            </p>
          </div>
        </footer>
      </main>

      {/* Bottom Nav Placeholder (optional) */}
    </div >
  )
}
