'use client'

import { createClient } from '@/utils/supabase/client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2, Eye, EyeOff } from 'lucide-react'

export default function AuthPage() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [fullName, setFullName] = useState('')
    const [isLogin, setIsLogin] = useState(true)
    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState<string | null>(null)
    const [showPassword, setShowPassword] = useState(false)
    const router = useRouter()
    const supabase = createClient()

    const handleAuth = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setMessage(null)

        // Pre-flight check for config
        if (process.env.NEXT_PUBLIC_SUPABASE_URL?.includes('placeholder')) {
            setMessage('Error: Supabase URL is not configured. Please check .env.local')
            setLoading(false)
            return
        }

        try {
            if (isLogin) {
                const { error } = await supabase.auth.signInWithPassword({
                    email,
                    password,
                })
                if (error) throw error
                router.push('/')
                router.refresh()
            } else {
                const { error } = await supabase.auth.signUp({
                    email,
                    password,
                    options: {
                        data: {
                            full_name: fullName,
                        },
                        emailRedirectTo: `${location.origin}/auth/callback`,
                    },
                })
                if (error) throw error
                setMessage('Check your email for the confirmation link.')
            }
        } catch (error: any) {
            console.error('Auth error:', error)
            setMessage(error.message || 'An unexpected error occurred')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-emerald-50 dark:bg-emerald-950 p-4 transition-colors duration-300">
            <div className="w-full max-w-md rounded-2xl bg-white dark:bg-emerald-900 p-8 shadow-xl animate-fade-in-up border border-emerald-100 dark:border-emerald-800">
                <div className="mb-8 text-center">
                    <img src="/icon.png" alt="Logo" className="w-16 h-16 mx-auto mb-4 object-contain" />
                    <h1 className="text-3xl font-bold text-emerald-900 dark:text-emerald-50">
                        {isLogin ? 'Welcome Back' : 'Create Account'}
                    </h1>
                    <p className="mt-2 text-emerald-600 dark:text-emerald-400">
                        {isLogin
                            ? 'Sign in to track your daily prayers'
                            : 'Start your journey of consistency'}
                    </p>
                </div>

                <form onSubmit={handleAuth} className="space-y-4">
                    {!isLogin && (
                        <div>
                            <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                                Full Name
                            </label>
                            <input
                                type="text"
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
                                className="w-full rounded-lg border border-gray-300 dark:border-emerald-700 bg-white dark:bg-emerald-950/50 p-3 text-gray-900 dark:text-white outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 placeholder-gray-400 dark:placeholder-emerald-700/50"
                                placeholder="Your name"
                                required
                            />
                        </div>
                    )}
                    <div>
                        <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Email
                        </label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value.toLowerCase())}
                            className="w-full rounded-lg border border-gray-300 dark:border-emerald-700 bg-white dark:bg-emerald-950/50 p-3 text-gray-900 dark:text-white outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 placeholder-gray-400 dark:placeholder-emerald-700/50"
                            placeholder="hello@example.com"
                            required
                        />
                    </div>
                    <div>
                        <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Password
                        </label>
                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full rounded-lg border border-gray-300 dark:border-emerald-700 bg-white dark:bg-emerald-950/50 p-3 pr-10 text-gray-900 dark:text-white outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 placeholder-gray-400 dark:placeholder-emerald-700/50"
                                placeholder="••••••••"
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                            >
                                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                            </button>
                        </div>
                    </div>

                    {message && (
                        <div className="rounded-lg bg-emerald-100 dark:bg-emerald-900/50 p-3 text-sm text-emerald-800 dark:text-emerald-200 border border-emerald-200 dark:border-emerald-800">
                            {message}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="flex w-full items-center justify-center rounded-lg bg-emerald-600 p-3 font-semibold text-white transition-colors hover:bg-emerald-700 disabled:opacity-50 shadow-lg shadow-emerald-200/20 dark:shadow-none"
                    >
                        {loading ? (
                            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        ) : isLogin ? (
                            'Sign In'
                        ) : (
                            'Sign Up'
                        )}
                    </button>
                </form>

                <div className="relative my-6">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-200 dark:border-emerald-800"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                        <span className="bg-white dark:bg-emerald-900 px-2 text-gray-500 dark:text-gray-400">Or continue with</span>
                    </div>
                </div>

                <button
                    type="button"
                    disabled={loading}
                    onClick={async () => {
                        setLoading(true)
                        const { error } = await supabase.auth.signInWithOAuth({
                            provider: 'google',
                            options: {
                                redirectTo: 'https://namazz.khxzi.shop/auth/callback',
                            },
                        })
                        if (error) {
                            setMessage(error.message)
                            setLoading(false)
                        }
                    }}
                    className="flex w-full items-center justify-center rounded-lg border border-gray-200 dark:border-emerald-700 bg-white dark:bg-emerald-800/50 p-3 font-semibold text-gray-700 dark:text-gray-200 transition-colors hover:bg-gray-50 dark:hover:bg-emerald-800 disabled:opacity-50"
                >
                    <svg className="mr-2 h-5 w-5" viewBox="0 0 24 24">
                        <path
                            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                            fill="#4285F4"
                        />
                        <path
                            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                            fill="#34A853"
                        />
                        <path
                            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                            fill="#FBBC05"
                        />
                        <path
                            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                            fill="#EA4335"
                        />
                    </svg>
                    Google
                </button>

                <div className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
                    {isLogin ? "Don't have an account? " : 'Already have an account? '}
                    <button
                        onClick={() => setIsLogin(!isLogin)}
                        className="font-semibold text-emerald-600 dark:text-emerald-400 hover:underline hover:text-emerald-700 dark:hover:text-emerald-300"
                    >
                        {isLogin ? 'Sign up' : 'Log in'}
                    </button>
                </div>

                <div className="mt-6 border-t pt-4 text-center">
                    <button
                        onClick={() => {
                            document.cookie = "guest-mode=true; path=/";
                            window.location.href = "/";
                        }}
                        className="text-sm text-gray-500 hover:text-emerald-600 hover:underline"
                    >
                        Continue as Guest
                    </button>
                </div>
            </div>
        </div>
    )
}
