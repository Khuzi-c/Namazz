'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Compass, BarChart2, Settings, Orbit, BookOpen } from 'lucide-react'

import { motion } from 'framer-motion'

export default function BottomNav() {
    const pathname = usePathname()

    // Hide on login page
    if (pathname === '/login') return null

    const navItems = [
        { name: 'Home', href: '/', icon: Home },
        { name: 'Quran', href: '/quran', icon: BookOpen },
        { name: 'Qibla', href: '/qibla', icon: Compass },
        { name: 'Dhikr', href: '/dhikr', icon: Orbit },
        { name: 'Progress', href: '/analytics', icon: BarChart2 },
        { name: 'Settings', href: '/settings', icon: Settings },
    ]

    return (
        <div className="fixed bottom-0 left-0 w-full z-50 bg-white dark:bg-emerald-950 border-t border-gray-100 dark:border-emerald-800 pb-safe shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
            <div className="flex items-center justify-around max-w-lg mx-auto h-16 px-2">
                {navItems.map((item) => {
                    const isActive = pathname === item.href
                    return (
                        <Link
                            key={item.name}
                            href={item.href}
                            className="relative flex flex-col items-center justify-center w-full h-full space-y-1"
                        >
                            {/* Animated Background Pill */}
                            {isActive && (
                                <motion.div
                                    layoutId="nav-pill"
                                    className="absolute inset-0 bg-emerald-50 dark:bg-emerald-800/50 rounded-xl -z-10 mx-2 my-1"
                                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                />
                            )}

                            <motion.div
                                animate={{ scale: isActive ? 1.1 : 1 }}
                                whileTap={{ scale: 0.9 }}
                                transition={{ type: "spring", stiffness: 400, damping: 17 }}
                            >
                                <item.icon
                                    className={`w-6 h-6 ${isActive ? 'text-emerald-600 dark:text-emerald-400 fill-current' : 'text-gray-400 dark:text-gray-500'}`}
                                    strokeWidth={isActive ? 0 : 2}
                                />
                            </motion.div>

                            <motion.span
                                animate={{ opacity: isActive ? 1 : 0.7, y: isActive ? 0 : 2 }}
                                className={`text-[10px] font-medium ${isActive ? 'text-emerald-600 dark:text-emerald-400 font-bold' : 'text-gray-400 dark:text-gray-500'}`}
                            >
                                {item.name}
                            </motion.span>
                        </Link>
                    )
                })}
            </div>
        </div>
    )
}
