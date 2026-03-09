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
        const orderRepo = new SupabaseOrderRepository(supabase)

        await orderRepo.updateStatus(data.orderId, data.status)
        revalidatePath('/dashboard/orders')
        return { success: true, updatedId: data.orderId, updatedStatus: data.status }
    })
}
