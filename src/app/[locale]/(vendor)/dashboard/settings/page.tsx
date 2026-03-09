import { createClient } from '@/lib/supabase/server'
import { SupabaseVendorRepository } from '@/repositories/supabase/SupabaseVendorRepository'
import SettingsForm from '@/components/features/SettingsForm'
import { notFound } from 'next/navigation'

export default async function SettingsPage() {
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
                    Configuration
                </div>
                <h1 className="text-5xl font-black tracking-tight text-zinc-950 dark:text-white">Paramètres</h1>
                <p className="text-zinc-500 font-medium max-w-xl">
                    Personnalisez votre boutique et sécurisez votre compte vendeur.
                </p>
            </header>

            <SettingsForm vendor={vendor} />
        </div>
    )
}
