import { createClient } from '@/lib/supabase/server'
import { SupabaseVendorRepository } from '@/repositories/supabase/SupabaseVendorRepository'
import { SupabaseProductRepository } from '@/repositories/supabase/SupabaseProductRepository'
import { notFound } from 'next/navigation'
import { Store } from 'lucide-react'
import StorefrontFeed from './StorefrontFeed'

import type { Metadata } from 'next'

interface PageProps {
    params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { slug } = await params
    const supabase = await createClient()
    const vendorRepo = new SupabaseVendorRepository(supabase)
    const vendor = await vendorRepo.getBySlug(slug)

    if (!vendor) {
        return {
            title: 'Store Not Found',
            description: 'This store could not be found.',
        }
    }

    const title = `${vendor.storeName} – Smpl Store`
    const description = `Discover products from ${vendor.storeName} on Smpl.`

    return {
        title,
        description,
        openGraph: {
            title,
            description,
            type: 'website',
            images: ['/Smpl.jpg'],
        },
        twitter: {
            card: 'summary_large_image',
            title,
            description,
            images: ['/Smpl.jpg'],
        }
    }
}

export default async function StorefrontPage({ params }: PageProps) {
    const { slug } = await params
    const supabase = await createClient()

    const vendorRepo = new SupabaseVendorRepository(supabase)
    const productRepo = new SupabaseProductRepository(supabase)

    const vendor = await vendorRepo.getBySlug(slug)

    if (!vendor) {
        notFound()
    }

    if (!vendor.isActive) {
        return (
            <main className="min-h-screen bg-[#FDFCF8] dark:bg-[#050505] flex items-center justify-center p-6 text-center">
                <div className="max-w-md space-y-6">
                    <div className="w-24 h-24 bg-zinc-100 dark:bg-zinc-900 rounded-full flex items-center justify-center mx-auto mb-8">
                        <Store className="w-10 h-10 text-zinc-400" />
                    </div>
                    <h1 className="text-4xl font-serif font-black italic text-zinc-950 dark:text-white">Boutique en pause</h1>
                    <p className="text-zinc-500 font-medium">
                        Cette boutique n'est pas disponible pour le moment. Revenez plus tard !
                    </p>
                </div>
            </main>
        )
    }

    const products = await productRepo.getPublicByVendorSlug(slug)

    return (
        <main className="min-h-screen bg-[#FDFCF8] dark:bg-[#050505]">
            <StorefrontFeed vendor={vendor} products={products} />
        </main>
    )
}
