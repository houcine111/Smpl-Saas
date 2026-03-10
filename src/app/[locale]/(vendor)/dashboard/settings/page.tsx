import { createClient } from '@/lib/supabase/server'
import { SupabaseVendorRepository } from '@/repositories/supabase/SupabaseVendorRepository'
import SettingsForm from '@/components/features/SettingsForm'
import { notFound } from 'next/navigation'

import { getTranslations } from 'next-intl/server'

export default async function SettingsPage({ params: { locale } }: { params: { locale: string } }) {
    const t = await getTranslations({ locale, namespace: 'Dashboard' });
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        notFound()
    }

    const vendorRepo = new SupabaseVendorRepository(supabase)
    const vendor = await vendorRepo.getById(user.id)

    if (!vendor) {
        notFound()
    }

    return (
        <div className="space-y-12">
            <header className="space-y-4">
                <div className="inline-flex px-4 py-2 bg-zinc-100 dark:bg-zinc-800 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">
                    {t('nav.settings')}
                </div>
                <h1 className="text-5xl font-black tracking-tight text-zinc-950 dark:text-white">{t('nav.settings')}</h1>
            </header>

            <SettingsForm vendor={vendor} />
        </div>
    )
}
