'use server'

import { createAdminClient } from '@/lib/supabase/admin'
import { revalidatePath } from 'next/cache'
import { adminUserSchema } from '@/lib/validations'
import { Vendor } from '@/types/models'

export async function createManagedUser(prevState: any, formData: FormData): Promise<{ error?: string; success?: boolean }> {
    const rawData = {
        email: formData.get('email') as string,
        password: formData.get('password') as string,
        is_admin: formData.get('is_admin') === 'true',
        store_name: formData.get('store_name') as string,
        slug: formData.get('slug') as string,
        whatsapp_number: (formData.get('whatsapp_number') as string) || undefined,
    }

    // Validation Zod
    const validation = adminUserSchema.safeParse(rawData)

    if (!validation.success) {
        return { error: validation.error.issues[0].message }
    }

    const { email, password, is_admin, store_name, slug, whatsapp_number } = validation.data

    const supabase = createAdminClient()

    // 1. Create the user in Auth
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
        user_metadata: {
            store_name,
            slug,
            whatsapp_number
        }
    })

    if (authError) {
        return { error: authError.message }
    }

    // 2. Update the profile with extra info
    // The public trigger created the initial record, we now enrich it
    const { error: profileError } = await supabase
        .from('profiles')
        .update({
            is_admin: is_admin,
            whatsapp_number: whatsapp_number
        })
        .eq('id', authData.user.id)

    if (profileError) {
        // Optionnel: supprimer l'utilisateur auth si le profil échoue ?
        return { error: profileError.message }
    }

    revalidatePath('/admin/users')
    return { success: true }
}

export async function updateVendorProfile(vendorId: string, data: Partial<Vendor>): Promise<{ error?: string; success?: boolean }> {
    const supabase = createAdminClient()

    const { error } = await supabase
        .from('profiles')
        .update({
            store_name: data.storeName,
            slug: data.slug,
            whatsapp_number: data.whatsappNumber,
            is_active: data.isActive,
            is_admin: data.isAdmin
        })
        .eq('id', vendorId)

    if (error) {
        return { error: error.message }
    }

    revalidatePath('/admin/users')
    revalidatePath('/admin/vendors')
    return { success: true }
}
