import { createClient } from '@/lib/supabase/server'
import { SupabaseVendorRepository } from '@/repositories/supabase/SupabaseVendorRepository'
import SettingsForm from '@/components/features/SettingsForm'
import { notFound } from 'next/navigation'

export default async function AdminSettingsPage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        notFound()
    }

    const vendorRepo = new SupabaseVendorRepository(supabase)
    const profile = await vendorRepo.getById(user.id)

    if (!profile) {
        notFound()
    }

    return (
        <div className="space-y-12">
            <header className="space-y-4">
                <div className="inline-flex px-4 py-2 bg-[#8FA998]/10 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] text-[#8FA998]">
                    Configuration Système
                </div>
                <h1 className="text-5xl font-black tracking-tight text-zinc-950">Paramètres Admin</h1>
                <p className="text-zinc-500 font-medium max-w-xl">
                    Gérez vos informations de compte administrateur et votre sécurité.
                </p>
            </header>

            <SettingsForm vendor={profile} isAdmin={true} />
        </div>
    )
}
