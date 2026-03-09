import { createClient } from '@/lib/supabase/server'
import { SupabaseOrderRepository } from '@/repositories/supabase/SupabaseOrderRepository'
import { SupabaseProductRepository } from '@/repositories/supabase/SupabaseProductRepository'
import { redirect } from 'next/navigation'
import { Link } from '@/i18n/routing'
import { Package, ShoppingBag, TrendingUp, Plus, AlertCircle, ChevronRight } from 'lucide-react'
import { getTranslations } from 'next-intl/server'

export default async function DashboardPage() {
    const t = await getTranslations('Dashboard')
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect('/login')
    }

    const orderRepo = new SupabaseOrderRepository(supabase)
    const productRepo = new SupabaseProductRepository(supabase)

    const [orders, products, profileRes] = await Promise.all([
        orderRepo.getWithDetailsByVendorId(user.id),
        productRepo.getByVendorId(user.id),
        supabase.from('profiles').select('store_name').eq('id', user.id).single()
    ])

    const storeName = profileRes.data?.store_name || 'Vendeur'

    const totalSales = orders.reduce((sum, order) => {
        if (order.status !== 'CANCELLED') {
            return sum + (order.product?.price || 0)
        }
        return sum
    }, 0)

    const activeProducts = products.filter(p => !p.deletedAt && p.isActive).length
    const recentOrders = orders.slice(0, 5)

    const formatDate = (dateString: string) => {
        return new Intl.DateTimeFormat('fr-FR', { day: 'numeric', month: 'long' }).format(new Date(dateString))
    }

    return (
        <div className="space-y-10">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-4xl font-black tracking-tight text-foreground">
                        {t('welcome', { name: storeName })}
                    </h1>
                    <p className="text-zinc-500 dark:text-zinc-400 font-medium mt-1">{t('subtitle')}</p>
                </div>
                <Link
                    href="/dashboard/products"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-foreground text-background rounded-2xl font-black uppercase tracking-widest text-[10px] hover:opacity-90 transition-all shadow-lg shadow-foreground/10 whitespace-nowrap"
                >
                    <Plus className="w-4 h-4" />
                    {t('newProduct')}
                </Link>
            </header>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                <StatsCard
                    title={t('stats.sales')}
                    value={`${totalSales.toFixed(2)} DH`}
                    icon={<TrendingUp className="w-5 h-5" />}
                    color="bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                />
                <StatsCard
                    title={t('stats.orders')}
                    value={orders.length.toString()}
                    icon={<ShoppingBag className="w-5 h-5" />}
                    color="bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400"
                />
                <StatsCard
                    title={t('stats.products')}
                    value={activeProducts.toString()}
                    icon={<Package className="w-5 h-5" />}
                    color="bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Recent Orders Section */}
                <section className="bg-card/5 dark:bg-card/10 backdrop-blur-sm rounded-[2.5rem] border border-border p-8 shadow-sm space-y-6">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-black tracking-tight text-foreground">{t('recentOrders.title')}</h2>
                        <Link href="/dashboard/orders" className="text-[10px] font-black uppercase tracking-widest text-zinc-400 hover:text-foreground flex items-center gap-1 transition-colors">
                            {t('recentOrders.viewAll')} <ChevronRight className="w-4 h-4" />
                        </Link>
                    </div>

                    {recentOrders.length > 0 ? (
                        <div className="space-y-4">
                            {recentOrders.map((order) => (
                                <div key={order.id} className="flex items-center justify-between p-4 rounded-2xl bg-background/50 border border-border/50 hover:bg-background transition-colors">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 bg-card/20 rounded-xl flex items-center justify-center font-black text-xs shadow-sm border border-border">
                                            {order.customerName.charAt(0).toUpperCase()}
                                        </div>
                                        <div>
                                            <p className="text-sm font-black text-foreground">{order.customerName}</p>
                                            <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">{formatDate(order.createdAt)}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm font-black text-foreground">{order.product?.price || 0} DH</p>
                                        <span className={`text-[10px] font-black uppercase tracking-widest ${order.status === 'CANCELLED' ? 'text-rose-500' :
                                            order.status === 'DELIVERED' ? 'text-emerald-500' : 'text-accent'
                                            }`}>
                                            {order.status}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="py-12 flex flex-col items-center justify-center text-center space-y-3 opacity-50">
                            <AlertCircle className="w-8 h-8 text-zinc-300" />
                            <p className="text-xs font-black uppercase tracking-widest">{t('recentOrders.empty')}</p>
                        </div>
                    )}
                </section>

                {/* Empty State / CTA Section if no products */}
                {products.length === 0 && (
                    <section className="bg-card/10 rounded-[2.5rem] border border-border p-10 flex flex-col items-center justify-center text-center space-y-6">
                        <div className="w-20 h-20 bg-background rounded-full flex items-center justify-center text-zinc-300 shadow-xl border border-border">
                            <Package className="w-10 h-10" />
                        </div>
                        <div className="space-y-2">
                            <h2 className="text-2xl font-black tracking-tight text-foreground">{t('empty')}</h2>
                            <p className="text-zinc-500 font-medium max-w-xs mx-auto text-sm">
                                {t('emptyDesc')}
                            </p>
                        </div>
                        <Link
                            href="/dashboard/products"
                            className="inline-flex items-center gap-2 px-8 py-4 bg-foreground text-background rounded-2xl font-black uppercase tracking-widest text-xs hover:scale-[1.02] active:scale-[0.98] transition-all shadow-2xl shadow-foreground/20"
                        >
                            <Plus className="w-5 h-5 opacity-50" />
                            {t('addProduct')}
                        </Link>
                    </section>
                )}
            </div>
        </div>
    )
}

function StatsCard({ title, value, icon, color }: { title: string; value: string; icon: React.ReactNode; color: string }) {
    return (
        <div className="bg-card/5 dark:bg-card/10 backdrop-blur-sm p-6 sm:p-8 rounded-[1.5rem] sm:rounded-[2rem] border border-border shadow-sm relative overflow-hidden group hover:border-accent/20 transition-colors">
            <div className="relative z-10 flex flex-col gap-3 sm:gap-4">
                <div className={`w-10 h-10 sm:w-12 sm:h-12 ${color} rounded-xl sm:rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110`}>
                    {icon}
                </div>
                <div>
                    <h3 className="text-[9px] sm:text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em]">{title}</h3>
                    <p className="text-2xl sm:text-3xl font-black mt-1 sm:mt-2 text-foreground tracking-tighter">{value}</p>
                </div>
            </div>
            <div className={`absolute -right-4 -bottom-4 w-20 h-20 sm:w-24 sm:h-24 ${color} opacity-10 rounded-full blur-2xl transform group-hover:scale-150 transition-transform duration-700`} />
        </div>
    )
}
