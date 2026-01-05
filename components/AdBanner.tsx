'use client'

import React, { useState, useEffect } from 'react'

export default function AdBanner() {
    const [enabled, setEnabled] = useState(true)
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
        const checkAds = () => {
            // Default to FALSE (disabled) if not set
            const isEnabled = localStorage.getItem('beta-ads-enabled') === 'true'
            setEnabled(isEnabled)
        }
        checkAds()

        window.addEventListener('storage', checkAds)
        return () => window.removeEventListener('storage', checkAds)
    }, [])

    if (!mounted || !enabled) return null

    return (
        <div id="frame" className="w-full relative z-[99998] my-8 animate-fade-in-up delay-300">
            <iframe
                data-aa='2423330'
                src='//acceptable.a-ads.com/2423330/?size=Adaptive'
                style={{
                    border: 0,
                    padding: 0,
                    width: '100%',
                    maxWidth: '100%',
                    height: '100px', // Set a default height to prevent jump, iframe might resize if it can
                    overflow: 'hidden',
                    display: 'block',
                    margin: 'auto'
                }}
                className="w-full md:w-[70%] h-auto min-h-[90px] mx-auto rounded-lg shadow-sm bg-gray-50 dark:bg-emerald-900/20"
                title="Advertisement"
            ></iframe>
        </div>
    )
}
