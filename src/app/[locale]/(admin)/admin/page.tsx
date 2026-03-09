import { createClient } from '@/lib/supabase/server'
import { SupabaseVendorRepository } from '@/repositories/supabase/SupabaseVendorRepository'
import { SupabaseProductRepository } from '@/repositories/supabase/SupabaseProductRepository'
import { SupabaseOrderRepository } from '@/repositories/supabase/SupabaseOrderRepository'
import { getTranslations } from 'next-intl/server'
import Link from 'next/link'

export default async function AdminPage() {
    const supabase = await createClient()
    const t = await getTranslations('Admin.dashboard')

    // Repositories
    const vendorRepo = new SupabaseVendorRepository(supabase)
    const productRepo = new SupabaseProductRepository(supabase)
    const orderRepo = new SupabaseOrderRepository(supabase)

    // Parallel fetching for performance
    const [vendors, products, orders] = await Promise.all([
        vendorRepo.getAll(),
        productRepo.getAll(),
        orderRepo.getAll()
    ])

    const activeVendors = vendors.filter(v => !v.isAdmin).length
    const totalProducts = products.length
    const totalOrders = orders.length

    const recentActivities = [
        ...vendors.slice(0, 3).map(v => ({ action: "Nouveau Vendeur", user: v.storeName || "Inconnu", time: new Date(v.createdAt).toLocaleDateString() })),
        ...orders.slice(0, 3).map(o => ({ action: "Nouvelle Commande", user: o.customerName, time: new Date(o.createdAt).toLocaleDateString() }))
    ].sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime()).slice(0, 5)

    return (
        <div className="space-y-10">
            <div className="flex items-end justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">{t('title')}</h2>
                    <p className="text-zinc-500 mt-1">{t('subtitle')}</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <AdminStatsCard title={t('stats.vendors')} value={activeVendors.toString()} change={`${vendors.filter(v => v.isAdmin).length} Admins`} />
                <AdminStatsCard title={t('stats.products')} value={totalProducts.toString()} change={`${products.filter(p => p.isActive).length} Actifs`} />
                <AdminStatsCard title={t('stats.orders')} value={totalOrders.toString()} change="Depuis le début" />
                <AdminStatsCard title={t('stats.revenue')} value="N/A" change="Prévu" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 bg-white rounded-2xl border border-zinc-200 p-8 min-h-[400px]">
                    <h3 className="text-lg font-bold mb-6">{t('activities.title')}</h3>
                    <div className="space-y-6">
                        {recentActivities.map((act, i) => (
                            <ActivityItem key={i} action={act.action} user={act.user} time={act.time} />
                        ))}
                        {recentActivities.length === 0 && (
                            <p className="text-zinc-400 text-sm italic">{t('activities.empty')}</p>
                        )}
                    </div>
                </div>

                <div className="bg-zinc-900 rounded-2xl p-8 text-white space-y-6">
                    <h3 className="text-lg font-bold">{t('quickActions.title')}</h3>
                    <div className="space-y-3">
                        <Link href="/admin/create" className="block">
                            <QuickActionBtn label={t('quickActions.createUser')} />
                        </Link>
                        <QuickActionBtn label={t('quickActions.maintenance')} outline />
                    </div>
                </div>
            </div>
        </div>
    )
}

function AdminStatsCard({ title, value, change, urgent }: { title: string; value: string; change?: string; urgent?: boolean }) {
    return (
        <div className={`p-6 rounded-2xl border ${urgent ? 'bg-red-50 border-red-100' : 'bg-white border-zinc-200'} shadow-sm`}>
            <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-widest">{title}</h4>
            <div className="flex items-baseline gap-2 mt-2">
                <p className="text-2xl font-bold text-zinc-900">{value}</p>
                {change && <span className="text-[10px] text-green-600 font-bold">{change}</span>}
            </div>
        </div>
    )
}

function ActivityItem({ action, user, time }: { action: string; user: string; time: string }) {
    return (
        <div className="flex items-center justify-between border-b border-zinc-100 pb-4">
            <div>
                <p className="font-bold text-sm text-zinc-900">{action}</p>
                <p className="text-xs text-zinc-500">{user}</p>
            </div>
            <span className="text-[11px] text-zinc-400 font-medium">{time}</span>
        </div>
    )
}

function QuickActionBtn({ label, outline }: { label: string; outline?: boolean }) {
    return (
        <button className={`w-full py-3 rounded-xl text-sm font-bold transition-all ${outline ? 'border border-zinc-700 text-zinc-400 hover:text-white' : 'bg-white text-black hover:bg-zinc-200'}`}>
            {label}
        </button>
    )
}
