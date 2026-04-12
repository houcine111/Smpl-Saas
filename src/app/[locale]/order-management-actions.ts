'use server'

import { createClient } from '@/lib/supabase/server'
import { SupabaseOrderRepository } from '@/repositories/supabase/SupabaseOrderRepository'
import { Order } from '@/types/models'
import { revalidatePath } from 'next/cache'

import { handleAction } from '@/lib/action-utils'
import { z } from 'zod'

const updateOrderStatusSchema = z.object({
    orderId: z.string().uuid(),
    status: z.enum(['PENDING', 'CONFIRMED', 'SHIPPED', 'DELIVERED', 'CANCELLED']),
})

export async function updateOrderStatus(orderId: string, status: Order['status']) {
    return handleAction(updateOrderStatusSchema, { orderId, status }, async (data) => {
        const supabase = await createClient()

        // 1. Get current order status and product_id
        const { data: order, error: orderError } = await supabase
            .from('orders')
            .select('status, product_id')
            .eq('id', data.orderId)
            .single()

        if (orderError || !order) throw new Error("Commande introuvable")

        // 2. Handle Stock Management
        // If moving to CONFIRMED from another status, decrement stock
        if (data.status === 'CONFIRMED' && order.status !== 'CONFIRMED' && order.status !== 'DELIVERED') {
            const { data: product, error: pError } = await supabase
                .from('products')
                .select('stock_quantity, name')
                .eq('id', order.product_id)
                .single()

            if (pError || !product) throw new Error("Produit introuvable")
            if (product.stock_quantity <= 0) throw new Error(`Stock épuisé pour "${product.name}"`)

            const { error: stockError } = await supabase
                .from('products')
                .update({ stock_quantity: product.stock_quantity - 1 })
                .eq('id', order.product_id)
                .gt('stock_quantity', 0)

            if (stockError) throw new Error("Erreur mise à jour stock")
        }

        // If moving AWAY from CONFIRMED/DELIVERED to CANCELLED/PENDING, restore stock
        if ((order.status === 'CONFIRMED' || order.status === 'DELIVERED') && 
            (data.status === 'CANCELLED' || data.status === 'PENDING')) {
            const { data: product } = await supabase
                .from('products')
                .select('stock_quantity')
                .eq('id', order.product_id)
                .single()

            if (product) {
                await supabase
                    .from('products')
                    .update({ stock_quantity: product.stock_quantity + 1 })
                    .eq('id', order.product_id)
            }
        }

        // 3. Update Status
        const orderRepo = new SupabaseOrderRepository(supabase)
        await orderRepo.updateStatus(data.orderId, data.status)
        
        revalidatePath('/dashboard/orders')
        revalidatePath('/dashboard')
        return { success: true, updatedId: data.orderId, updatedStatus: data.status }
    })
}
