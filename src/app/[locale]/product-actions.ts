'use server'

import { createClient } from '@/lib/supabase/server'
import { SupabaseProductRepository } from '@/repositories/supabase/SupabaseProductRepository'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { productSchema } from '@/lib/validations'

import { handleAction } from '@/lib/action-utils'
import { z } from 'zod'

export async function createProductAction(formData: FormData) {
    const rawData = {
        name: formData.get('name') as string,
        price: parseFloat(formData.get('price') as string || '0'),
        stockQuantity: parseInt(formData.get('stock_quantity') as string || '0'),
        imageUrls: JSON.parse(formData.get('image_urls') as string || '[]'),
        isActive: true
    }

    return handleAction(productSchema, rawData, async (data, userId) => {
        const supabase = await createClient()
        const productRepo = new SupabaseProductRepository(supabase)

        await productRepo.create({
            vendorId: userId,
            ...data
        })

        revalidatePath('/dashboard/products')
        return { success: true }
    })
}

export async function updateProductAction(id: string, formData: FormData) {
    const rawData = {
        name: formData.get('name') as string,
        price: parseFloat(formData.get('price') as string || '0'),
        stockQuantity: parseInt(formData.get('stock_quantity') as string || '0'),
        isActive: formData.get('is_active') === 'on',
        imageUrls: JSON.parse(formData.get('image_urls') as string || '[]')
    }

    return handleAction(productSchema, rawData, async (data) => {
        const supabase = await createClient()
        const productRepo = new SupabaseProductRepository(supabase)

        await productRepo.update(id, data)
        revalidatePath('/dashboard/products')
        return { success: true }
    })
}

export async function deleteProductAction(id: string) {
    return handleAction(z.object({ id: z.string().uuid() }), { id }, async (data) => {
        const supabase = await createClient()
        const productRepo = new SupabaseProductRepository(supabase)

        await productRepo.delete(data.id)
        revalidatePath('/dashboard/products')
        return { success: true }
    })
}
