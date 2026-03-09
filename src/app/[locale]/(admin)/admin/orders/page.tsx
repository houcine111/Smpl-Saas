import { createClient } from '@/lib/supabase/server'
import { SupabaseOrderRepository } from '@/repositories/supabase/SupabaseOrderRepository'
import AdminOrderList from '@/components/admin/AdminOrderList'

export default async function AdminOrdersPage() {
    const supabase = await createClient()
    const orderRepo = new SupabaseOrderRepository(supabase)
    const orders = await orderRepo.getAllWithDetails()

    const pendingOrders = orders.filter(o => o.status === 'PENDING').length
    const deliveredOrders = orders.filter(o => o.status === 'DELIVERED').length

    return (
        <div className="max-w-6xl space-y-12">
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div className="space-y-2">
                    <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-[#8FA998]">Supervision Plateforme</h2>
                    <h1 className="text-5xl font-serif font-black tracking-tight text-zinc-950 italic">Flux des Commandes</h1>
                    <p className="text-zinc-500 font-medium max-w-lg">Vue d'ensemble de toutes les transactions sur le réseau Smpl.</p>
                </div>

                <div className="flex gap-4">
                    <div className="px-6 py-4 bg-amber-50 rounded-2xl border border-amber-100 min-w-[140px]">
                        <p className="text-[10px] font-black uppercase tracking-widest text-amber-600 mb-1">En attente</p>
                        <p className="text-2xl font-black text-amber-900">{pendingOrders}</p>
                    </div>
                    <div className="px-6 py-4 bg-emerald-50 rounded-2xl border border-emerald-100 min-w-[140px]">
                        <p className="text-[10px] font-black uppercase tracking-widest text-emerald-600 mb-1">Livrées</p>
                        <p className="text-2xl font-black text-emerald-900">{deliveredOrders}</p>
                    </div>
                </div>
            </header>

            <AdminOrderList initialOrders={orders} />
        </div>
    )
}
