import { createClient } from '@/lib/supabase/server'
import { SupabaseProductRepository } from '@/repositories/supabase/SupabaseProductRepository'
import Link from 'next/link'
import { Plus, Package } from 'lucide-react'
import ProductList from '@/components/products/ProductList'
import { getTranslations } from 'next-intl/server'

export default async function ProductsPage({ params: { locale } }: { params: { locale: string } }) {
    const t = await getTranslations({ locale, namespace: 'Dashboard' });
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return null

    const productRepo = new SupabaseProductRepository(supabase)
    const products = await productRepo.getByVendorId(user.id)

    return (
        <div className="space-y-10">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-[#8FA998] mb-2">{t('nav.products')}</h2>
                    <h1 className="text-4xl font-serif font-black tracking-tight text-zinc-950 italic">{t('nav.products')}</h1>
                    <p className="text-zinc-500 mt-2 font-medium">{t('subtitle')}</p>
                </div>
                <Link
                    href="/dashboard/products/new"
                    className="inline-flex items-center gap-2 px-8 py-4 bg-black text-white rounded-2xl font-black uppercase tracking-widest hover:opacity-90 transition-all shadow-2xl shadow-black/10 active:scale-95 text-xs"
                >
                    <Plus className="w-5 h-5 text-zinc-400" />
                    {t('addProduct')}
                </Link>
            </header>

            {products.length === 0 ? (
                <div className="bg-[#FAF9F6] rounded-[3rem] border border-zinc-100 p-20 text-center space-y-8">
                    <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mx-auto shadow-xl border border-zinc-50">
                        <Package className="w-10 h-10 text-zinc-200" />
                    </div>
                    <div className="space-y-3 max-w-sm mx-auto">
                        <h3 className="text-2xl font-serif font-black italic text-zinc-950">{t('empty')}</h3>
                        <p className="text-zinc-500 font-medium">{t('emptyDesc')}</p>
                    </div>
                    <Link
                        href="/dashboard/products/new"
                        className="inline-flex items-center gap-3 px-10 py-5 bg-black text-white rounded-[2rem] font-black uppercase tracking-widest text-xs hover:scale-105 transition-all shadow-2xl shadow-black/20"
                    >
                        {t('newProduct')}
                    </Link>
                </div>
            ) : (
                <ProductList initialProducts={products} />
            )}
        </div>
    )
}
