'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { useRouter } from '@/i18n/routing'
import { useTranslations } from 'next-intl'

interface UseActionOptions<T> {
    onSuccess?: (data: T) => void
    onError?: (error: string) => void
    successMessage?: string
}

export function useAction<TInput, TOutput>(
    action: (data: TInput) => Promise<{ data?: TOutput; error?: string; status?: number }>,
    options?: UseActionOptions<TOutput>
) {
    const [isLoading, setIsLoading] = useState(false)
    const router = useRouter()
    const t = useTranslations('Errors')

    const execute = async (data: TInput) => {
        setIsLoading(true)
        try {
            const result = await action(data)

            if (result.error === 'AUTH_EXPIRED') {
                toast.error(t('sessionExpired'), {
                    description: t('redirecting'),
                    duration: 2000,
                })
                setTimeout(() => {
                    router.push('/login')
                }, 2000)
                return
            }

            if (result.error) {
                const message = t(result.error) || t('INTERNAL_ERROR')
                toast.error(message)
                options?.onError?.(result.error)
                return
            }

            if (result.data) {
                if (options?.successMessage) {
                    toast.success(options.successMessage)
                }
                options?.onSuccess?.(result.data)
            }
        } catch (err) {
            toast.error(t('INTERNAL_ERROR'))
        } finally {
            setIsLoading(false)
        }
    }

    return { execute, isLoading }
}
