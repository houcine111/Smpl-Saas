import { createClient } from '@/lib/supabase/server'
import { SupabaseVendorRepository } from '@/repositories/supabase/SupabaseVendorRepository'
import { SupabaseOrderRepository } from '@/repositories/supabase/SupabaseOrderRepository'
import VendorTable from '@/components/admin/VendorTable'
import { getTranslations } from 'next-intl/server'

export default async function AdminUsersPage() {
    const supabase = await createClient()
    const t = await getTranslations('Admin.users')
    
    const vendorRepo = new SupabaseVendorRepository(supabase)
    const orderRepo = new SupabaseOrderRepository(supabase)

    const [users, orders] = await Promise.all([
        vendorRepo.getAll(),
        orderRepo.getAll()
    ])

    // Calculate order counts for each vendor
    const ordersPerVendor = orders.reduce((acc, order) => {
        acc[order.vendorId] = (acc[order.vendorId] || 0) + 1
        return acc
    }, {} as Record<string, number>)

    // Enrich user data with order counts
    const enrichedUsers = users.map(user => ({
        ...user,
        orderCount: ordersPerVendor[user.id] || 0
    }))

    const admins = enrichedUsers.filter(u => u.isAdmin)
    const shops = enrichedUsers.filter(u => !u.isAdmin && u.storeName)
    const pending = enrichedUsers.filter(u => !u.isAdmin && !u.storeName)

    return (
        <div className="max-w-6xl space-y-12">
            <header className="space-y-2">
                <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-[#8FA998]">Administration Système</h2>
                <h1 className="text-5xl font-serif font-black tracking-tight text-zinc-950 italic">{t('title')}</h1>
                <p className="text-zinc-500 font-medium max-w-lg">{t('subtitle')}</p>
            </header>

            <div className="space-y-16">
                <section className="space-y-6">
                    <div className="flex items-center gap-4">
                        <div className="h-px flex-1 bg-zinc-100" />
                        <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-400">{t('admins')} ({admins.length})</h3>
                        <div className="h-px flex-1 bg-zinc-100" />
                    </div>
                    <VendorTable initialVendors={admins as any} hideStats />
                </section>

                <section className="space-y-6">
                    <div className="flex items-center gap-4">
                        <div className="h-px flex-1 bg-zinc-100" />
                        <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-[#8FA998]">{t('vendors')} ({shops.length})</h3>
                        <div className="h-px flex-1 bg-zinc-100" />
                    </div>
                    <VendorTable initialVendors={[...shops, ...pending] as any} />
                </section>
            </div>
        </div>
    )
}
