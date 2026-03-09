import { createClient } from '@/lib/supabase/server'
import { SupabaseOrderRepository } from '@/repositories/supabase/SupabaseOrderRepository'
import { redirect } from 'next/navigation'
import OrderList from './OrderList'
import { getTranslations } from 'next-intl/server'

export default async function VendorOrdersPage() {
    const t = await getTranslations('Dashboard.recentOrders')
    const tNav = await getTranslations('Dashboard.nav')
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) redirect('/login')

    const orderRepo = new SupabaseOrderRepository(supabase)
    const orders = await orderRepo.getWithDetailsByVendorId(user.id)

    return (
        <div className="p-6 max-w-7xl mx-auto space-y-10">
            <header>
                <h1 className="text-4xl font-black tracking-tight text-foreground uppercase">
                    {tNav('orders')}
                </h1>
                <p className="text-zinc-500 dark:text-zinc-400 mt-2 font-medium">
                    Suivez et gérez les ventes de votre boutique en temps réel.
                </p>
            </header>

            <div className="bg-card/5 dark:bg-card/10 backdrop-blur-sm rounded-[2.5rem] border border-border p-8 shadow-sm">
                <OrderList initialOrders={orders as any} />
            </div>
        </div>
    )
}
