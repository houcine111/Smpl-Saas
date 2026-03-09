"use client";

import { useState } from 'react'
import { motion } from 'framer-motion'
import { signIn } from '../auth/actions'
import { Mail, Lock, ArrowRight, Loader2 } from 'lucide-react'
import { Link } from '@/i18n/routing'
import Image from 'next/image'
import { useTranslations } from 'next-intl'
import { ThemeToggle } from '@/components/ui/ThemeToggle'

export default function LoginPage() {
    const t = useTranslations('Auth.login')
    const [pending, setPending] = useState(false)
    const [error, setError] = useState<string | null>(null)

    async function handleSubmit(formData: FormData) {
        setPending(true)
        setError(null)
        const result = await signIn(formData)
        if (result?.error) {
            setError(result.error)
            setPending(false)
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-background px-6 py-12 relative">
            <div className="absolute top-8 right-8 flex items-center gap-4">
                <ThemeToggle />
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-md"
            >
                <div className="flex flex-col items-center mb-10">
                    <Link
                        href="/"
                        className="relative w-16 h-16 overflow-hidden rounded-full border-4 border-card shadow-xl hover:scale-105 transition-transform active:scale-95 mb-6"
                    >
                        <Image
                            src="/Smpl.jpg"
                            alt="Smpl Logo"
                            fill
                            className="object-cover"
                        />
                    </Link>
                    <h1 className="text-3xl font-black tracking-tight text-foreground">
                        {t('title')}
                    </h1>
                    <p className="mt-2 text-zinc-500 dark:text-zinc-400 text-center font-medium">
                        {t('subtitle')}
                    </p>
                </div>

                <div className="bg-card/5 dark:bg-card/10 backdrop-blur-sm rounded-3xl p-8 border border-border shadow-2xl shadow-foreground/[0.02]">
                    <form action={handleSubmit} className="space-y-5">
                        <div className="space-y-2">
                            <label className="text-sm font-black uppercase tracking-widest text-zinc-500 ml-1">
                                {t('emailLabel')}
                            </label>
                            <div className="relative group">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 group-focus-within:text-accent transition-colors" />
                                <input
                                    required
                                    name="email"
                                    type="email"
                                    placeholder="name@store.com"
                                    className="w-full pl-11 pr-4 py-3 bg-background border border-border rounded-xl focus:ring-2 focus:ring-accent outline-none transition-all placeholder:text-zinc-300 dark:placeholder:text-zinc-700"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-black uppercase tracking-widest text-zinc-500 ml-1">
                                {t('passwordLabel')}
                            </label>
                            <div className="relative group">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 group-focus-within:text-accent transition-colors" />
                                <input
                                    required
                                    name="password"
                                    type="password"
                                    placeholder="••••••••"
                                    className="w-full pl-11 pr-4 py-3 bg-background border border-border rounded-xl focus:ring-2 focus:ring-accent outline-none transition-all placeholder:text-zinc-300 dark:placeholder:text-zinc-700"
                                />
                            </div>
                        </div>

                        {error && (
                            <motion.p
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="text-sm text-red-500 bg-red-500/10 px-4 py-2 rounded-lg border border-red-500/20 font-medium"
                            >
                                {error}
                            </motion.p>
                        )}

                        <button
                            disabled={pending}
                            type="submit"
                            className="w-full py-4 bg-foreground text-background rounded-2xl font-black uppercase tracking-widest text-xs flex items-center justify-center gap-2 hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-50 disabled:active:scale-100 shadow-lg shadow-foreground/5"
                        >
                            {pending ? (
                                <Loader2 className="w-5 h-5 animate-spin" />
                            ) : (
                                <>
                                    {t('button')}
                                    <ArrowRight className="w-4 h-4" />
                                </>
                            )}
                        </button>
                    </form>
                </div>

                <div className="mt-8 text-center">
                    <p className="text-sm text-zinc-500 dark:text-zinc-400 font-medium">
                        {t('noAccount')}{' '}
                        <Link href="/register" className="font-black uppercase tracking-widest text-[10px] text-accent hover:underline decoration-2 ml-1">
                            {t('createAccount')}
                        </Link>
                    </p>
                </div>
            </motion.div>
        </div>
    )
}
