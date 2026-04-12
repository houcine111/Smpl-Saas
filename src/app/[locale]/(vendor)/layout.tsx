import { Link } from '@/i18n/routing'
import Image from 'next/image'
import { Home, Package, ShoppingBag, Settings, LogOut, ExternalLink, AlertTriangle } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { signOut } from '@/app/[locale]/auth/actions'
import { getTranslations } from 'next-intl/server'

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const t = await getTranslations('Dashboard.sidebar')
    const tNav = await getTranslations('Dashboard.nav')
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    // Fetch profile for slug and active status
    const { data: profile } = await supabase
        .from('profiles')
        .select('slug, store_name, is_active')
        .eq('id', user?.id)
        .single()

    if (profile && !profile.is_active) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center p-6">
                <div className="max-w-md w-full bg-card border border-border rounded-3xl p-10 text-center space-y-6 shadow-2xl shadow-black/5">
                    <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mx-auto">
                        <ShoppingBag className="w-10 h-10 text-red-500" />
                    </div>
                    <div className="space-y-2">
                        <h1 className="text-2xl font-serif font-black italic tracking-tight">Compte Inactif</h1>
                        <p className="text-muted-foreground font-medium">
                            Votre compte vendeur est actuellement suspendu. Veuillez contacter l'administrateur pour régulariser votre situation.
                        </p>
                    </div>
                    <form action={signOut}>
                        <button
                            type="submit"
                            className="w-full py-4 rounded-2xl bg-foreground text-background font-black uppercase tracking-widest text-xs hover:opacity-90 transition-all"
                        >
                            Se déconnecter
                        </button>
                    </form>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-background pb-20 md:pb-0 md:pl-64">
            {/* Sidebar for Desktop */}
            <aside className="hidden md:flex fixed left-0 top-0 h-full w-64 flex-col bg-card/5 dark:bg-card/10 backdrop-blur-sm border-r border-border p-6 overflow-y-auto">
                <div className="flex items-center justify-between mb-10 px-2">
                    <Link href="/" className="relative w-10 h-10 overflow-hidden rounded-full border border-border shadow-sm">
                        <Image
                            src="/Smpl.jpg"
                            alt="Smpl Logo"
                            fill
                            className="object-cover"
                        />
                    </Link>
                    <div className="flex items-center gap-2">
                    </div>
                </div>

                <nav className="flex-1 space-y-2">
                    <NavLink href="/dashboard" icon={<Home className="w-5 h-5" />} label={tNav('home')} />
                    <NavLink href="/dashboard/products" icon={<Package className="w-5 h-5" />} label={tNav('products')} />
                    <NavLink href="/dashboard/orders" icon={<ShoppingBag className="w-5 h-5" />} label={tNav('orders')} />
                    <NavLink href="/dashboard/settings" icon={<Settings className="w-5 h-5" />} label={tNav('settings')} />
                </nav>

                <div className="mt-auto pt-10 space-y-3">
                    {profile?.slug && (
                        <a
                            href={`/${profile.slug}`}
                            target="_blank"
                            className="flex items-center justify-center gap-3 px-4 py-4 rounded-2xl bg-accent text-background hover:scale-[1.02] shadow-xl shadow-accent/10 hover:shadow-accent/20 transition-all duration-300 font-black uppercase tracking-[0.2em] text-[10px] group/store"
                        >
                            <ExternalLink className="w-4 h-4 group-hover/store:rotate-12 transition-transform" />
                            {t('viewStore')}
                        </a>
                    )}

                    <form action={signOut}>
                        <button
                            type="submit"
                            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-500 hover:bg-red-500/10 transition-all font-black uppercase tracking-widest text-[10px]"
                        >
                            <LogOut className="w-4 h-4" />
                            {t('signOut')}
                        </button>
                    </form>
                </div>
            </aside>

            {/* Content Area */}
            <main className="p-6 md:p-10 max-w-5xl mx-auto space-y-8">
                {(!profile?.slug || !profile?.store_name) && (
                    <div className="bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 rounded-2xl p-6 flex items-start gap-4 animate-in slide-in-from-top-4 duration-500">
                        <div className="w-10 h-10 bg-amber-500 rounded-xl flex items-center justify-center text-white shrink-0 shadow-lg shadow-amber-500/20">
                            <AlertTriangle className="w-6 h-6" />
                        </div>
                        <div className="space-y-1">
                            <h3 className="text-sm font-black text-amber-900 dark:text-amber-400 uppercase tracking-tight">Configuration Incomplète</h3>
                            <p className="text-xs text-amber-700 dark:text-amber-500/80 font-medium">
                                Votre boutique n'est pas encore visible publiquement. Veuillez définir un <strong>nom de boutique</strong> et un <strong>lien (slug)</strong> dans les paramètres.
                            </p>
                            <Link
                                href="/dashboard/settings"
                                className="inline-block mt-2 text-[10px] font-black uppercase tracking-widest text-amber-900 dark:text-amber-400 hover:underline"
                            >
                                Paramétrer ma boutique →
                            </Link>
                        </div>
                    </div>
                )}
                {children}
            </main>

            {/* Mobile Bottom Tab Bar - Floating Island Style */}
            <nav className="md:hidden fixed bottom-6 left-4 right-4 h-20 bg-background/95 backdrop-blur-2xl border border-border grid grid-cols-5 items-center px-1 z-50 rounded-[2.5rem] shadow-2xl shadow-black/20 animate-in slide-in-from-bottom-10 duration-700">
                <div className="flex justify-center">
                    <MobileNavItem href="/dashboard" icon={<Home className="w-5 h-5" />} label={tNav('home')} />
                </div>
                <div className="flex justify-center">
                    <MobileNavItem href="/dashboard/products" icon={<Package className="w-5 h-5" />} label={tNav('products')} />
                </div>
                
                {profile?.slug && (
                    <div className="flex justify-center">
                        <a
                            href={`/${profile.slug}`}
                            target="_blank"
                            className="flex flex-col items-center gap-1.5 group -mt-12 relative z-10"
                        >
                            <div className="w-16 h-16 bg-gradient-to-br from-accent to-accent/80 rounded-full flex items-center justify-center shadow-2xl shadow-accent/40 text-background border-4 border-background ring-8 ring-accent/5 animate-bounce-slow transition-transform active:scale-90 duration-500">
                                <ExternalLink className="w-7 h-7 group-hover:rotate-12 transition-transform" />
                            </div>
                            <span className="text-[9px] font-black uppercase tracking-[0.2em] text-accent drop-shadow-sm whitespace-nowrap">{t('viewStore')}</span>
                        </a>
                    </div>
                )}

                <div className="flex justify-center">
                    <MobileNavItem href="/dashboard/orders" icon={<ShoppingBag className="w-5 h-5" />} label={tNav('orders')} />
                </div>
                <div className="flex justify-center">
                    <MobileNavItem href="/dashboard/settings" icon={<Settings className="w-5 h-5" />} label={tNav('settings')} />
                </div>
            </nav>
        </div>
    )
}

function NavLink({ href, icon, label }: { href: string; icon: React.ReactNode; label: string }) {
    return (
        <Link
            href={href}
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-foreground/70 hover:bg-foreground/5 hover:text-foreground transition-all font-black uppercase tracking-widest text-[10px]"
        >
            {icon}
            {label}
        </Link>
    )
}

function MobileNavItem({ href, icon, label }: { href: string; icon: React.ReactNode; label: string }) {
    return (
        <Link
            href={href}
            className="flex flex-col items-center gap-1 text-zinc-400 active:text-foreground transition-all hover:text-foreground group"
        >
            <div className="w-10 h-10 rounded-xl flex items-center justify-center group-hover:bg-muted/50 transition-colors">
                {icon}
            </div>
            <span className="text-[8px] font-black uppercase tracking-widest whitespace-nowrap">{label}</span>
        </Link>
    )
}
