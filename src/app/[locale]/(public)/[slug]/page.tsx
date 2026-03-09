import { createClient } from '@/lib/supabase/server'
import { SupabaseVendorRepository } from '@/repositories/supabase/SupabaseVendorRepository'
import { SupabaseProductRepository } from '@/repositories/supabase/SupabaseProductRepository'
import { notFound } from 'next/navigation'
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

    const products = await productRepo.getPublicByVendorSlug(slug)

    return (
        <main className="min-h-screen bg-[#FDFCF8] dark:bg-[#050505]">
            <StorefrontFeed vendor={vendor} products={products} />
        </main>
    )
}
