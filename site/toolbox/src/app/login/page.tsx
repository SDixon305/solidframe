'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { Mail, Loader2, CheckCircle, AlertCircle } from 'lucide-react'

type Status = 'idle' | 'loading' | 'success' | 'error'

function LoginForm() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [usePassword, setUsePassword] = useState(true)
    const [status, setStatus] = useState<Status>('idle')
    const [message, setMessage] = useState('')
    const searchParams = useSearchParams()

    // Check for error or redirect params
    useEffect(() => {
        const error = searchParams.get('error')
        const redirect = searchParams.get('redirect')

        if (error) {
            setStatus('error')
            setMessage(decodeURIComponent(error))
        }

        // Store redirect for after login
        if (redirect) {
            sessionStorage.setItem('loginRedirect', redirect)
        }
    }, [searchParams])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!email) {
            setStatus('error')
            setMessage('Please enter your email address')
            return
        }

        if (usePassword && !password) {
            setStatus('error')
            setMessage('Please enter your password')
            return
        }

        setStatus('loading')
        setMessage('')

        try {
            // Get stored redirect if any
            const redirect = sessionStorage.getItem('loginRedirect') || '/admin'

            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email,
                    password: usePassword ? password : undefined,
                    redirectTo: redirect
                }),
            })

            const data = await response.json()

            if (data.success) {
                if (usePassword) {
                    // Password login - redirect immediately
                    window.location.href = redirect
                } else {
                    // Magic link - show success message
                    setStatus('success')
                    setMessage(data.message)
                    sessionStorage.removeItem('loginRedirect')
                }
            } else {
                setStatus('error')
                setMessage(data.error || 'Failed to sign in')
            }
        } catch {
            setStatus('error')
            setMessage('An unexpected error occurred. Please try again.')
        }
    }

    return (
        <>
            {/* Success State */}
            {status === 'success' ? (
                <div className="rounded-lg bg-emerald-50 border border-emerald-200 p-6 text-center">
                    <CheckCircle className="mx-auto h-12 w-12 text-emerald-500" />
                    <h3 className="mt-4 text-lg font-medium text-emerald-900">Check your email</h3>
                    <p className="mt-2 text-sm text-emerald-700">
                        We sent a magic link to <strong>{email}</strong>. Click the link in the email to sign in.
                    </p>
                    <button
                        onClick={() => {
                            setStatus('idle')
                            setEmail('')
                        }}
                        className="mt-4 text-sm text-emerald-600 hover:text-emerald-500 underline"
                    >
                        Use a different email
                    </button>
                </div>
            ) : (
                /* Login Form */
                <form onSubmit={handleSubmit} className="mt-8 space-y-6">
                    {/* Error Message */}
                    {status === 'error' && message && (
                        <div className="rounded-lg bg-red-50 border border-red-200 p-4 flex items-start gap-3">
                            <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
                            <p className="text-sm text-red-700">{message}</p>
                        </div>
                    )}

                    {/* Email Input */}
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                            Email address
                        </label>
                        <div className="mt-1 relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Mail className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                autoComplete="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                disabled={status === 'loading'}
                                className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent sm:text-sm disabled:bg-gray-50 disabled:cursor-not-allowed"
                                placeholder="you@company.com"
                            />
                        </div>
                    </div>

                    {/* Password Input (conditional) */}
                    {usePassword && (
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                                Password
                            </label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                autoComplete="current-password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                disabled={status === 'loading'}
                                className="mt-1 block w-full px-3 py-3 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent sm:text-sm disabled:bg-gray-50 disabled:cursor-not-allowed"
                                placeholder="••••••••"
                            />
                        </div>
                    )}

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={status === 'loading'}
                        className="w-full flex justify-center items-center gap-2 py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-slate-900 hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        {status === 'loading' ? (
                            <>
                                <Loader2 className="h-4 w-4 animate-spin" />
                                {usePassword ? 'Signing in...' : 'Sending magic link...'}
                            </>
                        ) : (
                            <>
                                <Mail className="h-4 w-4" />
                                {usePassword ? 'Sign in' : 'Send magic link'}
                            </>
                        )}
                    </button>

                    {/* Toggle between password and magic link */}
                    <div className="text-center">
                        <button
                            type="button"
                            onClick={() => {
                                setUsePassword(!usePassword)
                                setPassword('')
                                setStatus('idle')
                                setMessage('')
                            }}
                            className="text-sm text-slate-600 hover:text-slate-900 underline"
                        >
                            {usePassword ? 'Use magic link instead' : 'Sign in with password'}
                        </button>
                    </div>
                </form>
            )}
        </>
    )
}

function LoginFormFallback() {
    return (
        <div className="mt-8 space-y-6">
            <div className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-24 mb-2"></div>
                <div className="h-12 bg-gray-200 rounded"></div>
            </div>
            <div className="h-12 bg-gray-200 rounded animate-pulse"></div>
        </div>
    )
}

export default function LoginPage() {
    return (
        <div className="flex min-h-screen items-center justify-center bg-[#f4f5f7] px-4 py-12 sm:px-6 lg:px-8">
            <div className="w-full max-w-md space-y-8">
                {/* Header */}
                <div className="text-center">
                    <div className="mx-auto h-12 w-12 rounded-xl bg-slate-900 flex items-center justify-center">
                        <span className="text-amber-400 font-bold text-xl">SF</span>
                    </div>
                    <h2 className="mt-6 text-3xl font-bold tracking-tight text-gray-900">
                        SolidFrame Toolbox
                    </h2>
                    <p className="mt-2 text-sm text-gray-600">
                        Sign in with a magic link sent to your email
                    </p>
                </div>

                <Suspense fallback={<LoginFormFallback />}>
                    <LoginForm />
                </Suspense>
            </div>
        </div>
    )
}
