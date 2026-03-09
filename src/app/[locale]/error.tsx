'use client'

import { useEffect } from 'react'
import { RefreshCcw, Home } from 'lucide-react'
import { Link } from '@/i18n/routing'
import { useTranslations } from 'next-intl'

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string }
    reset: () => void
}) {
    const t = useTranslations('Errors.boundary')

    useEffect(() => {
        // Log the error to an error reporting service
        console.error(error)
    }, [error])

    return (
        <div className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-zinc-950 px-6">
            <div className="max-w-md w-full text-center space-y-8">
                <div className="space-y-4">
                    <h1 className="text-6xl font-black text-foreground tracking-tighter">Oups.</h1>
                    <h2 className="text-xl font-bold text-zinc-500 dark:text-zinc-400">
                        {t('title')}
                    </h2>
                    <p className="text-zinc-400 text-sm font-medium">
                        {t('description')}
                    </p>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-4 justify-center">
                    <button
                        onClick={() => reset()}
                        className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 bg-[#8FA998] text-white rounded-2xl font-black uppercase tracking-widest text-xs hover:opacity-90 transition-all shadow-lg shadow-[#8FA998]/20"
                    >
                        <RefreshCcw className="w-4 h-4" />
                        {t('retry')}
                    </button>
                    <Link
                        href="/"
                        className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 bg-background border border-border text-foreground rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-all"
                    >
                        <Home className="w-4 h-4" />
                        {t('home')}
                    </Link>
                </div>
            </div>
        </div>
    )
}
