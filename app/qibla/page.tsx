'use client'

import { useState, useEffect } from 'react'
import { ArrowLeft, Compass, Loader2, Navigation } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function QiblaPage() {
    const router = useRouter()
    const [heading, setHeading] = useState<number | null>(null)
    const [qiblaDirection, setQiblaDirection] = useState<number | null>(null)
    const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null)
    const [error, setError] = useState<string | null>(null)
    const [permissionGranted, setPermissionGranted] = useState(false)

    // Kaaba Coordinates
    const KAABA_LAT = 21.422487
    const KAABA_LNG = 39.826206

    useEffect(() => {
        // 1. Get Location
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords
                    setLocation({ lat: latitude, lng: longitude })
                    calculateQibla(latitude, longitude)
                },
                (err) => {
                    setError('Please enable location services to calculate Qibla direction.')
                    console.error(err)
                }
            )
        } else {
            setError('Geolocation is not supported by your browser.')
        }
    }, [])

    const calculateQibla = (lat: number, lng: number) => {
        const phiK = (KAABA_LAT * Math.PI) / 180.0
        const lambdaK = (KAABA_LNG * Math.PI) / 180.0
        const phi = (lat * Math.PI) / 180.0
        const lambda = (lng * Math.PI) / 180.0
        const deltaLambda = lambdaK - lambda

        const y = Math.sin(deltaLambda) * Math.cos(phiK)
        const x =
            Math.cos(phi) * Math.sin(phiK) -
            Math.sin(phi) * Math.cos(phiK) * Math.cos(deltaLambda)
        let bearing = Math.atan2(y, x)
        bearing = (bearing * 180.0) / Math.PI
        setQiblaDirection((bearing + 360) % 360)
    }

    // Interface for iOS-specific property
    interface DeviceOrientationEventiOS extends DeviceOrientationEvent {
        webkitCompassHeading?: number;
        requestPermission?: () => Promise<'granted' | 'denied'>;
    }

    const requestCompassPermission = async () => {
        if (typeof (DeviceOrientationEvent as unknown as DeviceOrientationEventiOS).requestPermission === 'function') {
            try {
                const response = await (DeviceOrientationEvent as unknown as DeviceOrientationEventiOS).requestPermission?.()
                if (response === 'granted') {
                    setPermissionGranted(true)
                    window.addEventListener('deviceorientation', handleOrientation)
                } else {
                    alert('Permission denied')
                }
            } catch (e) {
                console.error(e)
            }
        } else {
            // Non-iOS 13+ devices
            setPermissionGranted(true)
            window.addEventListener('deviceorientation', handleOrientation)
        }
    }

    const handleOrientation = (event: DeviceOrientationEvent) => {
        const iosEvent = event as DeviceOrientationEventiOS
        if (iosEvent.webkitCompassHeading) {
            // iOS
            setHeading(iosEvent.webkitCompassHeading)
        } else if (event.alpha) {
            // Android / Others (approximate)
            setHeading(360 - event.alpha)
        }
    }

    useEffect(() => {
        return () => {
            window.removeEventListener('deviceorientation', handleOrientation)
        }
    }, [])

    return (
        <div className="min-h-screen bg-emerald-950 text-white flex flex-col items-center justify-center p-6 relative overflow-hidden">
            {/* Background Effects */}
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-emerald-900 to-emerald-950 z-0"></div>

            <button
                onClick={() => router.back()}
                className="absolute top-6 left-6 p-2 bg-white/10 rounded-full hover:bg-white/20 z-20 backdrop-blur-sm"
            >
                <ArrowLeft className="w-6 h-6" />
            </button>

            <div className="relative z-10 text-center space-y-8 w-full max-w-md">

                <div className="space-y-2">
                    <h1 className="text-3xl font-bold tracking-tight">Qibla Finder</h1>
                    <p className="text-emerald-200/80 text-sm">Align yourself towards the Kaaba</p>
                </div>

                {error ? (
                    <div className="bg-red-500/20 border border-red-500/50 p-4 rounded-xl text-red-200 text-sm">
                        {error}
                    </div>
                ) : !location ? (
                    <div className="flex flex-col items-center justify-center py-12 space-y-4">
                        <Loader2 className="w-8 h-8 animate-spin text-emerald-400" />
                        <p className="text-sm text-emerald-300">Locating you...</p>
                    </div>
                ) : (
                    <div className="relative flex items-center justify-center py-8">
                        {/* Compass Circle */}
                        <div
                            className="w-64 h-64 rounded-full border-4 border-emerald-700/50 relative flex items-center justify-center shadow-2xl bg-emerald-900/40 backdrop-blur-md transition-transform duration-500 ease-out"
                            style={{
                                transform: `rotate(${heading !== null ? -heading : 0}deg)`
                            }}
                        >
                            {/* North Marker */}
                            <div className="absolute top-2 text-xs font-bold text-emerald-200">N</div>
                            <div className="absolute bottom-2 text-xs font-bold text-emerald-800">S</div>
                            <div className="absolute left-2 text-xs font-bold text-emerald-800">W</div>
                            <div className="absolute right-2 text-xs font-bold text-emerald-800">E</div>

                            {/* Qibla Indicator (Goal) */}
                            {qiblaDirection !== null && (
                                <div
                                    className="absolute w-full h-full flex justify-center"
                                    style={{ transform: `rotate(${qiblaDirection}deg)` }}
                                >
                                    <div className="flex flex-col items-center -mt-8">
                                        <div className="relative">
                                            {/* Glow Effect */}
                                            <div className="absolute inset-0 bg-amber-400 rounded-full blur-xl opacity-50 animate-pulse"></div>

                                            {/* Main Marker */}
                                            <div className="w-12 h-12 bg-gradient-to-br from-amber-300 to-amber-500 rounded-full flex items-center justify-center shadow-lg shadow-amber-400/50 z-10 border-2 border-white/20">
                                                <div className="w-8 h-8 bg-black rounded-sm border-2 border-amber-200 shadow-inner" /> {/* Mini Kaaba */}
                                            </div>

                                            {/* Ripple Animation */}
                                            <div className="absolute inset-0 border-4 border-amber-400/30 rounded-full animate-ping"></div>
                                        </div>

                                        {/* Connector Line */}
                                        <div className="h-4 w-1 bg-gradient-to-b from-amber-400 to-transparent mt-1 rounded-full opacity-80"></div>
                                    </div>
                                </div>
                            )}

                            {/* Needle (Always points Up in UI, but whole circle rotates) */}
                            {/* Wait, the standard UI is: Compass rotates to match real North. 
                                 Needle points Up? No.
                                 Let's keep it simple: 
                                 Rotate the whole compass container so that 'North' aligns with real North.
                                 The Qibla marker is fixed at the Qibla angle relative to North.
                                 So if I face North, the compass shows N at top.
                                 If I turn right (East), the compass rotates left, showing N at left.
                                 
                                 Alternative:
                                 Show a fixed arrow pointing to Qibla.
                                 Arrow Rotation = QiblaDirection - Heading.
                             */}
                        </div>

                        {/* Fixed Center Element (The User) */}
                        <div className="absolute w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-xl z-20 pointer-events-none">
                            <Navigation className="w-8 h-8 text-emerald-600 fill-current" />
                        </div>

                    </div>
                )}

                {location && (
                    <div className="space-y-4">
                        <div className="bg-emerald-900/50 p-4 rounded-2xl border border-emerald-800">
                            <p className="text-xs text-emerald-400 uppercase tracking-wider mb-1">Qibla Direction</p>
                            <div className="text-4xl font-bold font-mono">
                                {qiblaDirection ? qiblaDirection.toFixed(0) : '--'}°
                            </div>
                            <p className="text-[10px] text-emerald-500 mt-1">Relative to True North</p>
                        </div>

                        {!permissionGranted && (
                            <button
                                onClick={requestCompassPermission}
                                className="w-full bg-emerald-600 text-white py-3 rounded-xl font-semibold hover:bg-emerald-500 transition shadow-lg"
                            >
                                Enable Compass Mode
                            </button>
                        )}

                        {permissionGranted && (
                            <p className="text-xs text-emerald-400 animate-pulse">
                                Rotate your phone to align the Kaaba icon
                            </p>
                        )}
                    </div>
                )}

            </div>
        </div>
    )
}
