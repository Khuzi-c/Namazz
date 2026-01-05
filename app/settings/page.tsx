'use client'

import { Bell, User, LogOut, Moon, Globe, ChevronRight, Clock, FileText, Shield, Info, Lock, Camera, Download } from 'lucide-react'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { createClient } from '@/utils/supabase/client'
import { useTheme } from 'next-themes'

export default function SettingsPage() {
    const [timeFormat12h, setTimeFormat12h] = useState(true)
    const [profileName, setProfileName] = useState('')
    const [avatarUrl, setAvatarUrl] = useState('')
    const [newPassword, setNewPassword] = useState('')
    const [isPublic, setIsPublic] = useState(true)
    const [isGuest, setIsGuest] = useState(false) // New State
    const [loading, setLoading] = useState(false)
    const { theme, setTheme } = useTheme()
    const [mounted, setMounted] = useState(false)
    const supabase = createClient()

    useEffect(() => {
        setMounted(true)
        // Load Time Format
        const savedFormat = localStorage.getItem('time-format')
        if (savedFormat === '24h') setTimeFormat12h(false)

        // Load Profile
        const getProfile = async () => {
            const { data: { user } } = await supabase.auth.getUser()
            if (user) {
                setAvatarUrl(user.user_metadata?.avatar_url || '')
                const { data } = await supabase.from('profiles').select('name, is_public').eq('id', user.id).single()
                if (data) {
                    setProfileName(data.name || '')
                    setIsPublic(data.is_public ?? true)
                }
            } else {
                setIsGuest(true)
            }
        }
        getProfile()
    }, [])

    const toggleTimeFormat = () => {
        const newFormat = !timeFormat12h
        setTimeFormat12h(newFormat)
        localStorage.setItem('time-format', newFormat ? '12h' : '24h')
        // Dispatch event so other components can listen
        window.dispatchEvent(new Event('storage'))
    }

    const toggleTheme = () => {
        setTheme(theme === 'dark' ? 'light' : 'dark')
    }

    const uploadAvatar = async (event: React.ChangeEvent<HTMLInputElement>) => {
        try {
            setLoading(true)
            if (!event.target.files || event.target.files.length === 0) {
                throw new Error('You must select an image to upload.')
            }

            const file = event.target.files[0]
            const fileExt = file.name.split('.').pop()
            const fileName = `${Math.random()}.${fileExt}`
            const filePath = `${fileName}`

            const { error: uploadError } = await supabase.storage
                .from('avatars')
                .upload(filePath, file)

            if (uploadError) {
                // Handle missing bucket error gently
                if (uploadError.message.includes('bucket not found') || uploadError.message.includes('row-level security')) {
                    alert("Error: Please enable Storage in your Supabase dashboard and create a public bucket named 'avatars'.")
                }
                throw uploadError
            }

            const { data } = supabase.storage.from('avatars').getPublicUrl(filePath)

            setAvatarUrl(data.publicUrl)

            // Auto-save the new avatar URL
            const { data: { user } } = await supabase.auth.getUser()
            if (user) {
                const { error: updateError } = await supabase.auth.updateUser({
                    data: { avatar_url: data.publicUrl }
                })
                if (updateError) throw updateError
                alert('Profile picture updated!')
            }

        } catch (error: any) {
            alert('Error uploading avatar: ' + error.message)
        } finally {
            setLoading(false)
        }
    }

    const updateProfile = async () => {
        setLoading(true)
        const { data: { user } } = await supabase.auth.getUser()
        if (user) {
            // Update Name and Visibility in profiles table
            await supabase.from('profiles').update({ name: profileName, is_public: isPublic }).eq('id', user.id)

            // Update Avatar in auth metadata
            await supabase.auth.updateUser({
                data: { avatar_url: avatarUrl }
            })

            // Update Password if provided
            if (newPassword.length > 0) {
                const { error } = await supabase.auth.updateUser({ password: newPassword })
                if (error) {
                    alert('Error updating password: ' + error.message)
                } else {
                    setNewPassword('')
                    alert('Profile and password updated successfully!')
                }
            } else {
                alert('Profile updated!')
            }
        }
        setLoading(false)
    }

    if (!mounted) return null

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-emerald-950 pb-24 transition-colors duration-300">
            <header className="bg-white dark:bg-emerald-900 px-6 py-4 shadow-sm border-b dark:border-emerald-800 flex items-center justify-between">
                <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">Settings</h1>
                {/* Logo in Header as requested */}
                <img src="/icon.png" alt="Logo" className="w-8 h-8 object-contain" />
            </header>

            <main className="p-4 space-y-6 max-w-lg mx-auto">

                {/* Account Section - Only for Authenticated Users */}
                {!isGuest ? (
                    <section>
                        <h3 className="text-xs font-semibold text-gray-500 dark:text-emerald-400 uppercase tracking-wider mb-3 px-2">Account</h3>
                        <div className="bg-white dark:bg-emerald-900 rounded-xl shadow-sm border border-gray-100 dark:border-emerald-800 p-4 space-y-4">

                            {/* Profile Picture */}
                            <div className="flex items-center space-x-4 mb-2">
                                <div className="relative">
                                    <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-100 dark:bg-emerald-800 border-2 border-emerald-500 relative">
                                        {avatarUrl ? (
                                            <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                                        ) : (
                                            <User className="w-8 h-8 text-gray-400 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                                        )}
                                    </div>
                                    <label
                                        htmlFor="avatar-upload"
                                        className="absolute -bottom-1 -right-1 bg-white dark:bg-emerald-700 rounded-full p-1.5 shadow-md border border-gray-100 dark:border-emerald-600 cursor-pointer hover:bg-gray-50 dark:hover:bg-emerald-600 transition-colors"
                                    >
                                        <Camera className="w-3 h-3 text-emerald-600 dark:text-emerald-100" />
                                        <input
                                            id="avatar-upload"
                                            type="file"
                                            accept="image/*"
                                            onChange={uploadAvatar}
                                            disabled={loading}
                                            className="hidden"
                                        />
                                    </label>
                                </div>
                                <div className="flex-1 space-y-1">
                                    <label className="text-xs font-medium text-gray-500 dark:text-gray-400 block">Profile Picture</label>
                                    <p className="text-[10px] text-gray-400 dark:text-gray-500">Tap the camera icon to upload. Max 2MB.</p>
                                </div>
                            </div>

                            {/* Name Input */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Display Name</label>
                                <input
                                    type="text"
                                    value={profileName}
                                    onChange={(e) => setProfileName(e.target.value)}
                                    placeholder="Your Name"
                                    className="w-full rounded-lg border border-gray-200 dark:border-emerald-700 dark:bg-emerald-950 dark:text-white p-2 text-sm outline-none focus:border-emerald-500"
                                />
                            </div>

                            {/* Public Profile Toggle */}
                            <div className="flex items-center justify-between py-2">
                                <div className="space-y-0.5">
                                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Public Profile</label>
                                    <p className="text-[10px] text-gray-400 dark:text-gray-500">Show your stats on the leaderboard.</p>
                                </div>
                                <button
                                    onClick={() => setIsPublic(!isPublic)}
                                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 ${isPublic ? 'bg-emerald-600' : 'bg-gray-200 dark:bg-gray-700'}`}
                                >
                                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${isPublic ? 'translate-x-6' : 'translate-x-1'}`} />
                                </button>
                            </div>

                            {/* Password Change */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">New Password (Optional)</label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                    <input
                                        type="password"
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        placeholder="Enter new password to change"
                                        className="w-full rounded-lg border border-gray-200 dark:border-emerald-700 dark:bg-emerald-950 dark:text-white pl-10 p-2 text-sm outline-none focus:border-emerald-500"
                                    />
                                </div>
                            </div>

                            <button
                                onClick={updateProfile}
                                disabled={loading}
                                className="w-full bg-emerald-600 text-white px-4 py-3 rounded-xl text-sm font-bold disabled:opacity-50 hover:bg-emerald-700 shadow-lg shadow-emerald-200/50 dark:shadow-none transition-all active:scale-[0.98]"
                            >
                                {loading ? 'Saving Changes...' : 'Save Changes'}
                            </button>

                            <div className="border-t border-gray-50 dark:border-emerald-800 pt-2 mt-4">
                                <form action="/auth/signout" method="post">
                                    <button className="w-full flex items-center justify-between py-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded px-2 transition-colors">
                                        <div className="flex items-center space-x-3">
                                            <LogOut className="w-5 h-5" />
                                            <span>Sign Out</span>
                                        </div>
                                        <ChevronRight className="w-4 h-4 opacity-50" />
                                    </button>
                                </form>
                            </div>
                        </div>
                    </section>
                ) : (
                    // GUEST VIEW
                    <section className="mb-6">
                        <div className="bg-gradient-to-r from-emerald-600 to-teal-600 rounded-xl p-6 text-white text-center shadow-lg">
                            <h3 className="text-lg font-bold mb-2">Create an Account</h3>
                            <p className="text-sm opacity-90 mb-4">
                                Sign up to customize your profile, save your stats, and appear on the leaderboard.
                            </p>
                            <Link href="/login">
                                <button className="bg-white text-emerald-600 px-6 py-2 rounded-full font-bold text-sm hover:bg-emerald-50 transition">
                                    Sign Up Now
                                </button>
                            </Link>
                            <div className="mt-4 pt-4 border-t border-white/20">
                                <form action="/auth/signout" method="post">
                                    <button className="text-xs text-emerald-100 hover:text-white flex items-center justify-center gap-2 w-full">
                                        <LogOut className="w-3 h-3" />
                                        Exit Guest Mode
                                    </button>
                                </form>
                            </div>
                        </div>
                    </section>
                )}

                {/* Preferences Section */}
                <section>
                    <h3 className="text-xs font-semibold text-gray-500 dark:text-emerald-400 uppercase tracking-wider mb-3 px-2">Preferences</h3>
                    <div className="bg-white dark:bg-emerald-900 rounded-xl shadow-sm border border-gray-100 dark:border-emerald-800 divide-y divide-gray-50 dark:divide-emerald-800 overflow-hidden">
                        {/* Notifications */}
                        <button
                            onClick={() => {
                                if ('Notification' in window) {
                                    Notification.requestPermission().then(permission => {
                                        if (permission === 'granted') {
                                            new Notification('Notifications Enabled', {
                                                body: 'You will now receive prayer reminders.',
                                                icon: '/icon.png'
                                            })
                                        }
                                    })
                                }
                            }}
                            className="w-full flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-emerald-800/50 transition-colors text-left"
                        >
                            <div className="flex items-center space-x-3 text-gray-700 dark:text-gray-200">
                                <Bell className="w-5 h-5 text-gray-400 dark:text-gray-500" />
                                <span>Notifications</span>
                            </div>
                            <span className="text-xs text-emerald-600 dark:text-emerald-400 font-medium bg-emerald-50 dark:bg-emerald-950 px-2 py-1 rounded">Enable</span>
                        </button>

                        {/* Time Format */}
                        <button
                            onClick={toggleTimeFormat}
                            className="w-full flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-emerald-800/50 transition-colors text-left"
                        >
                            <div className="flex items-center space-x-3 text-gray-700 dark:text-gray-200">
                                <Clock className="w-5 h-5 text-gray-400 dark:text-gray-500" />
                                <span>Time Format</span>
                            </div>
                            <span className="text-xs text-gray-500 dark:text-emerald-400 font-medium bg-gray-100 dark:bg-emerald-950 px-2 py-1 rounded">
                                {timeFormat12h ? '12 Hours' : '24 Hours'}
                            </span>
                        </button>

                        {/* Dark Mode */}
                        <button
                            onClick={toggleTheme}
                            className="w-full flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-emerald-800/50 transition-colors text-left"
                        >
                            <div className="flex items-center space-x-3 text-gray-700 dark:text-gray-200">
                                <Moon className="w-5 h-5 text-gray-400 dark:text-gray-500" />
                                <span>Dark Mode</span>
                            </div>
                            <span className="text-xs text-gray-500 dark:text-emerald-400 font-medium bg-gray-100 dark:bg-emerald-950 px-2 py-1 rounded">
                                {theme === 'dark' ? 'On' : 'Off'}
                            </span>
                        </button>

                        <button className="w-full flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-emerald-800/50 transition-colors text-left">
                            <div className="flex items-center space-x-3 text-gray-700 dark:text-gray-200">
                                <Globe className="w-5 h-5 text-gray-400 dark:text-gray-500" />
                                <span>Calculation Method</span>
                            </div>
                            <span className="text-xs text-gray-500 dark:text-emerald-400">ISNA</span>
                        </button>
                    </div>
                </section>

                {/* Beta Features */}
                <section>
                    <h3 className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider mb-3 px-2 flex items-center gap-2">
                        <span className="bg-emerald-100 dark:bg-emerald-800 text-emerald-700 dark:text-emerald-200 px-1.5 py-0.5 rounded text-[10px] font-bold">BETA</span>
                        Experimental
                    </h3>
                    <div className="bg-white dark:bg-emerald-900 rounded-xl shadow-sm border border-emerald-100 dark:border-emerald-800 divide-y divide-gray-50 dark:divide-emerald-800 overflow-hidden">
                        <div className="p-4 flex items-center justify-between">
                            <div className="flex-1 pr-4">
                                <div className="flex items-center space-x-3 text-gray-700 dark:text-gray-200">
                                    <Camera className="w-5 h-5 text-emerald-500" />
                                    <span className="font-medium">Photo Confirmation</span>
                                </div>
                                <p className="text-[10px] text-gray-400 dark:text-gray-500 mt-1 ml-8">
                                    Upload a photo proof when you complete a prayer. Your photos will be saved to your personal analytics gallery.
                                </p>
                            </div>
                            <button
                                onClick={() => {
                                    const current = localStorage.getItem('beta-photo-proofs') === 'true'
                                    localStorage.setItem('beta-photo-proofs', String(!current))
                                    window.dispatchEvent(new Event('storage'))
                                    // Force re-render hack
                                    setIsPublic(prev => prev)
                                }}
                                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${typeof window !== 'undefined' && localStorage.getItem('beta-photo-proofs') === 'true' ? 'bg-emerald-600' : 'bg-gray-200 dark:bg-gray-700'}`}
                            >
                                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${typeof window !== 'undefined' && localStorage.getItem('beta-photo-proofs') === 'true' ? 'translate-x-6' : 'translate-x-1'}`} />
                            </button>
                        </div>
                        {/* Ads Toggle */}
                        <div className="p-4 flex items-center justify-between border-t border-gray-50 dark:border-emerald-800">
                            <div className="flex-1 pr-4">
                                <div className="flex items-center space-x-3 text-gray-700 dark:text-gray-200">
                                    <Globe className="w-5 h-5 text-emerald-500" />
                                    <span className="font-medium">Show Community Ads</span>
                                </div>
                                <p className="text-[10px] text-gray-400 dark:text-gray-500 mt-1 ml-8">
                                    Support us by keeping ethical ads enabled. Turning this off will remove all banners.
                                </p>
                            </div>
                            <button
                                onClick={() => {
                                    // Default is false if missing
                                    const current = localStorage.getItem('beta-ads-enabled') === 'true'
                                    localStorage.setItem('beta-ads-enabled', current ? 'false' : 'true')
                                    window.dispatchEvent(new Event('storage'))
                                    // Force re-render hack
                                    setIsPublic(prev => prev)
                                }}
                                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${typeof window !== 'undefined' && localStorage.getItem('beta-ads-enabled') === 'true' ? 'bg-emerald-600' : 'bg-gray-200 dark:bg-gray-700'}`}
                            >
                                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${typeof window !== 'undefined' && localStorage.getItem('beta-ads-enabled') === 'true' ? 'translate-x-6' : 'translate-x-1'}`} />
                            </button>
                        </div>
                    </div>
                </section>

                {/* About & Legal */}
                <section>
                    <h3 className="text-xs font-semibold text-gray-500 dark:text-emerald-400 uppercase tracking-wider mb-3 px-2">About</h3>
                    <div className="bg-white dark:bg-emerald-900 rounded-xl shadow-sm border border-gray-100 dark:border-emerald-800 divide-y divide-gray-50 dark:divide-emerald-800 overflow-hidden">
                        <Link href="/settings/privacy" className="w-full flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-emerald-800/50 transition-colors">
                            <div className="flex items-center space-x-3 text-gray-700 dark:text-gray-200">
                                <Shield className="w-5 h-5 text-gray-400 dark:text-gray-500" />
                                <span>Privacy Policy</span>
                            </div>
                            <ChevronRight className="w-4 h-4 text-gray-300 dark:text-emerald-700" />
                        </Link>
                        <Link href="/settings/terms" className="w-full flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-emerald-800/50 transition-colors">
                            <div className="flex items-center space-x-3 text-gray-700 dark:text-gray-200">
                                <FileText className="w-5 h-5 text-gray-400 dark:text-gray-500" />
                                <span>Terms of Service</span>
                            </div>
                            <ChevronRight className="w-4 h-4 text-gray-300 dark:text-emerald-700" />
                        </Link>
                        <Link href="/about" className="w-full flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-emerald-800/50 transition-colors">
                            <div className="flex items-center space-x-3 text-gray-700 dark:text-gray-200">
                                <Info className="w-5 h-5 text-gray-400 dark:text-gray-500" />
                                <span>About Us</span>
                            </div>
                            <ChevronRight className="w-4 h-4 text-gray-300 dark:text-emerald-700" />
                        </Link>
                        <Link href="/settings/credits" className="w-full flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-emerald-800/50 transition-colors">
                            <div className="flex items-center space-x-3 text-gray-700 dark:text-gray-200">
                                <FileText className="w-5 h-5 text-gray-400 dark:text-gray-500" />
                                <span>Credits</span>
                            </div>
                            <ChevronRight className="w-4 h-4 text-gray-300 dark:text-emerald-700" />
                        </Link>
                        <Link href="/download" className="w-full flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-emerald-800/50 transition-colors border-t border-gray-50 dark:border-emerald-800">
                            <div className="flex items-center space-x-3 text-emerald-600 dark:text-emerald-400">
                                <Download className="w-5 h-5" />
                                <span className="font-bold">Install App</span>
                            </div>
                            <ChevronRight className="w-4 h-4 text-gray-300 dark:text-emerald-700" />
                        </Link>
                    </div>
                </section>

                <div className="text-center pt-8 pb-8">
                    <p className="text-xs text-gray-400">Namazz v1.2.0 (Beta)</p>
                    <p className="text-[10px] text-gray-300 mt-1">© 2026 Khxzi Devs. All rights reserved.</p>
                </div>

            </main>
        </div>
    )
}
