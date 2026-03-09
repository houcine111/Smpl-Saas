import { createClient } from '@/lib/supabase/server'
import { SupabaseVendorRepository } from '@/repositories/supabase/SupabaseVendorRepository'
import VendorTable from '@/components/admin/VendorTable'

export default async function AdminVendorsPage() {
    const supabase = await createClient()
    const vendorRepo = new SupabaseVendorRepository(supabase)
    const vendors = await vendorRepo.getAll()

    return (
        <div className="max-w-6xl space-y-12">
            <header className="space-y-2">
                <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-[#8FA998]">Administration Système</h2>
                <h1 className="text-5xl font-serif font-black tracking-tight text-zinc-950 italic">Cercle des Vendeurs</h1>
                <p className="text-zinc-500 font-medium max-w-lg">Supervision et gestion de l'écosystème Smpl.</p>
            </header>

            <VendorTable initialVendors={vendors} />
        </div>
    )
}
