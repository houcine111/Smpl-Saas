'use server'

import { createClient } from '@/lib/supabase/server'
import { SupabaseCategoryRepository } from '@/repositories/supabase/SupabaseCategoryRepository'

export async function getCategoriesAction() {
    const supabase = await createClient()
    const categoryRepo = new SupabaseCategoryRepository(supabase)

    try {
        const categories = await categoryRepo.getAll()
        return { data: categories, success: true }
    } catch (error) {
        console.error('Error fetching categories:', error)
        return { error: 'Failed to fetch categories', success: false }
    }
}
