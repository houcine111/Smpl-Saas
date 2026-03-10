import Link from 'next/link'
import { LayoutDashboard, Users, ShoppingBag, Settings, LogOut } from 'lucide-react'
import { signOut } from '@/app/[locale]/auth/actions'
import Image from 'next/image'
import { createClient } from '@/lib/supabase/server'
import { SupabaseVendorRepository } from '@/repositories/supabase/SupabaseVendorRepository'
import { getTranslations } from 'next-intl/server'

export default async function AdminLayout({
    children,
    params: { locale }
}: {
    children: React.ReactNode
    params: { locale: string }
}) {
    const t = await getTranslations({ locale, namespace: 'Admin.nav' });
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    let adminName = 'Admin Root'
    if (user) {
        const vendorRepo = new SupabaseVendorRepository(supabase)
        const profile = await vendorRepo.getById(user.id)
        if (profile) {
            adminName = profile.storeName || user.email?.split('@')[0] || 'Admin'
        }
    }

    return (
        <div className="min-h-screen bg-[#FDFCF8] flex flex-col md:flex-row">
            {/* Sidebar for Desktop */}
            <aside className="hidden md:flex w-64 flex-col bg-white border-r border-zinc-100 p-6 fixed left-0 h-full z-30">
                <div className="flex items-center gap-3 mb-10 px-2">
                    <div className="relative w-10 h-10 overflow-hidden rounded-full border border-zinc-100 shadow-sm">
                        <Image
                            src="/Smpl.jpg"
                            alt="Smpl Logo"
                            fill
                            className="object-cover"
                        />
                    </div>
                    <div className="flex flex-col">
                        <span className="text-[10px] uppercase font-black tracking-widest text-[#25D366]">{t('platform')}</span>
                    </div>
                </div>

                <nav className="flex-1 space-y-2">
                    <NavLink href="/admin" icon={<LayoutDashboard className="w-5 h-5" />} label={t('overview')} />
                    <NavLink href="/admin/users" icon={<Users className="w-5 h-5" />} label={t('users')} />
                    <NavLink href="/admin/settings" icon={<Settings className="w-5 h-5" />} label={t('settings')} />
                </nav>

                <div className="mt-auto pt-6 border-t border-zinc-50">
                    <form action={signOut}>
                        <button
                            type="submit"
                            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-rose-500 hover:bg-rose-50 transition-all font-bold text-sm"
                        >
                            <LogOut className="w-4 h-4" />
                            {t('logout')}
                        </button>
                    </form>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 overflow-y-auto md:ml-64">
                <header className="h-20 bg-white border-b border-zinc-200 flex items-center justify-between px-10 sticky top-0 z-10 w-full">
                    <h1 className="text-sm font-bold uppercase tracking-widest text-zinc-400">{t('management')}</h1>
                    <div className="flex items-center gap-4">
                        <div className="text-right">
                            <p className="text-sm font-bold">{adminName}</p>
                            <p className="text-xs text-zinc-500">{t('connected')}</p>
                        </div>
                        <div className="w-10 h-10 bg-zinc-100 rounded-full border border-zinc-200 flex items-center justify-center font-bold text-zinc-400">
                            {adminName.charAt(0)}
                        </div>
                    </div>
                </header>

                <div className="p-10">
                    {children}
                </div>
            </main>
        </div>
    )
}

function NavLink({ href, icon, label }: { href: string; icon: React.ReactNode; label: string }) {
    return (
        <Link
            href={href}
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-zinc-600 hover:bg-zinc-50 hover:text-black transition-all font-medium text-sm"
        >
            {icon}
            {label}
        </Link>
    )
}
