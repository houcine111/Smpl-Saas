import { Link } from '@/i18n/routing'
import Image from 'next/image'
import { Home, Package, ShoppingBag, Settings, LogOut, ExternalLink } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { signOut } from '@/app/[locale]/auth/actions'
import { getTranslations } from 'next-intl/server'
import { ThemeToggle } from '@/components/ui/ThemeToggle'

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const t = await getTranslations('Dashboard.sidebar')
    const tNav = await getTranslations('Dashboard.nav')
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    // Fetch profile for slug
    const { data: profile } = await supabase
        .from('profiles')
        .select('slug, store_name')
        .eq('id', user?.id)
        .single()

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
                        <ThemeToggle />
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
                            className="flex items-center gap-3 px-4 py-3 rounded-xl bg-foreground text-background hover:opacity-90 transition-all font-black uppercase tracking-widest text-[10px]"
                        >
                            <ExternalLink className="w-4 h-4" />
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
            <main className="p-6 md:p-10 max-w-5xl mx-auto">
                {children}
            </main>

            {/* Mobile Bottom Tab Bar */}
            <nav className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-background/80 backdrop-blur-lg border-t border-border flex items-center justify-around px-4 z-50">
                <MobileNavItem href="/dashboard" icon={<Home className="w-6 h-6" />} label={tNav('home')} />
                <MobileNavItem href="/dashboard/products" icon={<Package className="w-6 h-6" />} label={tNav('products')} />
                <MobileNavItem href="/dashboard/orders" icon={<ShoppingBag className="w-6 h-6" />} label={tNav('orders')} />
                <MobileNavItem href="/dashboard/settings" icon={<Settings className="w-6 h-6" />} label={tNav('settings')} />
                <div className="flex flex-col items-center gap-1 group">
                    <div className="scale-75"><ThemeToggle /></div>
                    <span className="text-[8px] font-black uppercase tracking-wider text-zinc-400">Theme</span>
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
            className="flex flex-col items-center gap-1 text-foreground/60 active:text-foreground transition-colors"
        >
            {icon}
            <span className="text-[10px] font-black uppercase tracking-wider">{label}</span>
        </Link>
    )
}
