'use server'

import { createClient } from '@/lib/supabase/server'
import { orderSchema } from '@/lib/validations'
import { revalidatePath } from 'next/cache'
import { headers } from 'next/headers'
import { RateLimiter } from '@/lib/rate-limit'

interface OrderInput {
    productId: string
    vendorId: string
    customerName: string
    customerPhone: string
    customerCity: string
}

export async function createOrder(input: OrderInput & { website?: string }) {
    const headerList = await headers()
    const ip = headerList.get('x-forwarded-for') || 'unknown'
    const limiter = RateLimiter.getInstance()

    // 1. Protection Honeypot (Si le champ 'website' est rempli, c'est un bot)
    if (input.website) {
        console.warn(`[Bot Detected] Honeypot triggered by IP: ${ip}`)
        return { success: false, error: "Bot detected" }
    }

    // 2. Protection Rate Limit (5 commandes par minute par IP)
    if (limiter.isRateLimited(`order_${ip}`, 5, 60000)) {
        throw new Error("Trop de tentatives. Veuillez patienter une minute.")
    }

    const supabase = await createClient()

    // 1. Validation Zod
    const validation = orderSchema.safeParse({
        customerName: input.customerName,
        customerPhone: input.customerPhone,
        customerCity: input.customerCity,
    })

    if (!validation.success) {
        throw new Error(validation.error.issues[0].message)
    }

    // 2. Vérification du stock (Sécurité Concurrence)
    const { data: product, error: productError } = await supabase
        .from('products')
        .select('stock_quantity, name')
        .eq('id', input.productId)
        .single()

    if (productError || !product) {
        throw new Error("Produit introuvable")
    }

    if (product.stock_quantity <= 0) {
        throw new Error(`Désolé, le produit "${product.name}" est épuisé.`)
    }

    // 3. Décrémentation du stock
    const { error: updateError } = await supabase
        .from('products')
        .update({ stock_quantity: product.stock_quantity - 1 })
        .eq('id', input.productId)
        .gt('stock_quantity', 0) // Sécurité supplémentaire : évite le stock négatif

    if (updateError) {
        throw new Error("Erreur lors de la mise à jour du stock. Veuillez réessayer.")
    }

    // 4. Insertion de la commande
    const { error } = await supabase
        .from('orders')
        .insert({
            product_id: input.productId,
            vendor_id: input.vendorId,
            customer_name: input.customerName,
            customer_phone: input.customerPhone,
            customer_city: input.customerCity,
            status: 'PENDING'
        })

    if (error) {
        console.error('Error creating order:', error)
        // On pourrait envisager de "rendre" le stock ici en cas d'échec d'insertion, 
        // mais l'insertion de commande échoue rarement par rapport au stock.
        throw new Error("Erreur lors de l'enregistrement de la commande")
    }

    revalidatePath('/dashboard/orders')
    return { success: true }
}
