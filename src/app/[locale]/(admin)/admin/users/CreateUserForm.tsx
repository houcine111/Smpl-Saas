'use client'

import { useActionState } from 'react'
import { createManagedUser } from '@/app/[locale]/admin-actions'
import { CheckCircle2, AlertCircle, Loader2 } from 'lucide-react'
import { useTranslations } from 'next-intl'

type ActionState = {
    error?: string;
    success?: boolean;
}

const initialState: ActionState = {
    error: '',
    success: false
}

export function CreateUserForm() {
    const t = useTranslations('Admin.create.form')
    const [state, formAction, isPending] = useActionState(createManagedUser, initialState)

    return (
        <form action={formAction} className="p-8 space-y-6">
            {state?.error && (
                <div className="p-4 bg-red-50 border border-red-100 rounded-xl flex items-center gap-3 text-red-600 animate-in fade-in slide-in-from-top-2">
                    <AlertCircle className="w-5 h-5 flex-shrink-0" />
                    <p className="text-sm font-medium">{state.error}</p>
                </div>
            )}

            {state?.success && (
                <div className="p-4 bg-green-50 border border-green-100 rounded-xl flex items-center gap-3 text-green-600 animate-in fade-in slide-in-from-top-2">
                    <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
                    <p className="text-sm font-medium">{t('success')}</p>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <label className="text-sm font-bold text-zinc-700">{t('emailLabel')}</label>
                    <input
                        name="email"
                        type="email"
                        required
                        disabled={isPending}
                        className="w-full px-4 py-3 rounded-xl border border-zinc-200 focus:ring-2 focus:ring-zinc-900 outline-none transition-all disabled:opacity-50"
                        placeholder="exemple@mail.com"
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-bold text-zinc-700">{t('passwordLabel')}</label>
                    <input
                        name="password"
                        type="password"
                        required
                        disabled={isPending}
                        className="w-full px-4 py-3 rounded-xl border border-zinc-200 focus:ring-2 focus:ring-zinc-900 outline-none transition-all disabled:opacity-50"
                        placeholder="••••••••"
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <label className="text-sm font-bold text-zinc-700">{t('storeNameLabel')}</label>
                    <input
                        name="store_name"
                        type="text"
                        disabled={isPending}
                        className="w-full px-4 py-3 rounded-xl border border-zinc-200 focus:ring-2 focus:ring-zinc-900 outline-none transition-all disabled:opacity-50"
                        placeholder="Ma Super Boutique"
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-bold text-zinc-700">{t('slugLabel')}</label>
                    <input
                        name="slug"
                        type="text"
                        disabled={isPending}
                        className="w-full px-4 py-3 rounded-xl border border-zinc-200 focus:ring-2 focus:ring-zinc-900 outline-none transition-all disabled:opacity-50"
                        placeholder="ma-boutique"
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <label className="text-sm font-bold text-zinc-700">{t('whatsappLabel')}</label>
                    <input
                        name="whatsapp_number"
                        type="text"
                        disabled={isPending}
                        className="w-full px-4 py-3 rounded-xl border border-zinc-200 focus:ring-2 focus:ring-zinc-900 outline-none transition-all disabled:opacity-50"
                        placeholder="+216 12 345 678"
                    />
                </div>
            </div>

            <div className="flex items-center gap-3 p-4 bg-zinc-50 rounded-xl border border-zinc-100">
                <input
                    type="checkbox"
                    name="is_admin"
                    id="is_admin"
                    value="true"
                    disabled={isPending}
                    className="w-5 h-5 rounded border-zinc-300 text-zinc-900 focus:ring-zinc-900"
                />
                <label htmlFor="is_admin" className="text-sm cursor-pointer">
                    <p className="font-bold text-zinc-900">{t('isAdminLabel')}</p>
                    <p className="text-zinc-500">{t('isAdminDesc')}</p>
                </label>
            </div>

            <div className="flex justify-end pt-4">
                <button
                    type="submit"
                    disabled={isPending}
                    className="px-8 py-4 bg-zinc-900 text-white rounded-xl font-bold hover:bg-zinc-800 transition-all flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                    {isPending ? (
                        <>
                            <Loader2 className="w-5 h-5 animate-spin" />
                            {t('pending')}
                        </>
                    ) : (
                        t('submit')
                    )}
                </button>
            </div>
        </form>
    )
}
