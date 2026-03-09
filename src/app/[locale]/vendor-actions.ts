'use server'

import { createClient } from '@/lib/supabase/server'
import { storeSettingsSchema, updatePasswordSchema } from '@/lib/validations'
import { revalidatePath } from 'next/cache'

import { handleAction } from '@/lib/action-utils'
import { z } from 'zod'

const storeSettingsActionSchema = z.object({
    storeName: z.string().min(2).optional().or(z.literal('')),
    slug: z.string().min(2).optional().or(z.literal('')),
    whatsapp_number: z.string().min(10),
})

export async function updateStoreSettings(formData: FormData) {
    const rawData = {
        storeName: formData.get('storeName') as string,
        slug: formData.get('slug') as string,
        whatsapp_number: formData.get('whatsapp_number') as string,
    }

    return handleAction(storeSettingsActionSchema, rawData, async (data, userId) => {
        const supabase = await createClient()

        // 1. Check if user is admin to determine if we enforce slug
        const { data: profile } = await supabase
            .from('profiles')
            .select('is_admin')
            .eq('id', userId)
            .single()

        const isAdmin = profile?.is_admin || false

        // 2. Check slug availability if provided
        if (data.slug && data.slug.length > 0) {
            const { data: existingSlug } = await supabase
                .from('profiles')
                .select('id')
                .eq('slug', data.slug)
                .neq('id', userId)
                .maybeSingle()

            if (existingSlug) {
                throw new Error('SLUG_TAKEN')
            }
        }

        // 3. Update
        const updateData: any = {
            whatsapp_number: data.whatsapp_number,
        }

        if (data.storeName) updateData.store_name = data.storeName
        if (data.slug) updateData.slug = data.slug

        const { error } = await supabase
            .from('profiles')
            .update(updateData)
            .eq('id', userId)

        if (error) throw error

        revalidatePath(isAdmin ? '/admin/settings' : '/dashboard/settings')
        return { success: true }
    })
}

export async function updatePassword(formData: FormData) {
    const rawData = {
        password: formData.get('password') as string,
        confirmPassword: formData.get('confirmPassword') as string,
    }

    return handleAction(updatePasswordSchema, rawData, async (data) => {
        const supabase = await createClient()
        const { error } = await supabase.auth.updateUser({
            password: data.password
        })

        if (error) throw error

        return { success: true }
    })
}
