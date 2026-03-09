import { createClient } from '@/lib/supabase/server'
import { SupabaseProductRepository } from '@/repositories/supabase/SupabaseProductRepository'
import { ProductForm } from '@/components/products/ProductForm'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { notFound } from 'next/navigation'

export default async function EditProductPage({ params }: { params: { id: string } }) {
    const { id } = await params
    const supabase = await createClient()
    const productRepo = new SupabaseProductRepository(supabase)

    const product = await productRepo.getById(id)

    if (!product) {
        notFound()
    }

    return (
        <div className="max-w-4xl mx-auto space-y-12">
            <header className="flex items-center justify-between">
                <div className="space-y-3">
                    <Link
                        href="/dashboard/products"
                        className="inline-flex items-center gap-2 text-zinc-400 hover:text-zinc-950 transition-colors text-xs font-black uppercase tracking-widest group bg-white px-4 py-2 rounded-xl border border-zinc-100 shadow-sm"
                    >
                        <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
                        Annuler les modifications
                    </Link>
                    <h1 className="text-5xl font-black tracking-tight text-zinc-950">Modifier Produit</h1>
                    <p className="text-zinc-500 font-medium font-mono text-sm uppercase">Edition du catalogue</p>
                </div>
            </header>

            <ProductForm initialData={product} />
        </div>
    )
}
