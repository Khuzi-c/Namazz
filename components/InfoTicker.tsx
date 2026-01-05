'use client'

import { useState, useEffect } from 'react'
import { isFriday, isThursday, format } from 'date-fns'
import { Bell, Megaphone, Moon, Info } from 'lucide-react'
import Link from 'next/link'

export default function InfoTicker() {
    const [message, setMessage] = useState('')
    const [icon, setIcon] = useState(<Info className="w-4 h-4" />)
    const [isVisible, setIsVisible] = useState(true)

    useEffect(() => {
        const today = new Date()

        // Logic for messages
        if (isFriday(today)) {
            setMessage("Jumu'ah Mubarak! Don't forget to read Surah Al-Kahf today. 🕌")
            setIcon(<Moon className="w-4 h-4 text-emerald-200" />)
        } else if (isThursday(today) && today.getHours() >= 18) {
            setMessage("The night of Jumu'ah has begun. Prepare for a blessed Friday.")
            setIcon(<Moon className="w-4 h-4 text-indigo-200" />)
        } else {
            // Rotate basic tips or news
            const tips = [
                "Tip: You can track missed prayers in the new 'Qada Bank'.",
                "Hadith: 'The key to Paradise is Salah.'",
                "Reminder: Turn on notifications to never miss a prayer.",
                "Beta: Try the new Photo Confirmation feature!",
                "Namazz 2.0 is coming soon with Achievements!"
            ]
            setMessage(tips[Math.floor(Math.random() * tips.length)])
            setIcon(<Megaphone className="w-4 h-4 text-emerald-200" />)
        }
    }, [])

    if (!isVisible) return null

    return (
        <div className="bg-emerald-800 text-white text-xs py-2 px-4 relative overflow-hidden">
            <div className="max-w-md mx-auto flex items-center justify-center gap-2 animate-fade-in">
                {icon}
                <span className="font-medium text-center">{message}</span>
            </div>
            <button
                onClick={() => setIsVisible(false)}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1 opacity-50 hover:opacity-100"
            >
                ✕
            </button>
        </div>
    )
}
