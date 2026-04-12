import { SupabaseClient } from '@supabase/supabase-js'
import { Database } from '@/types/database'
import { Category } from '@/types/models'
import { ICategoryRepository } from '../interfaces'
import { mapCategoryToDomain } from './mappers'

export class SupabaseCategoryRepository implements ICategoryRepository {
    constructor(private supabase: SupabaseClient<Database>) { }

    async getById(id: string): Promise<Category | null> {
        const { data, error } = await this.supabase
            .from('categories')
            .select('*')
            .eq('id', id)
            .single()

        if (error || !data) return null
        return mapCategoryToDomain(data)
    }

    async getAll(): Promise<Category[]> {
        const { data, error } = await this.supabase
            .from('categories')
            .select('*')
            .order('name', { ascending: true })

        if (error || !data) return []
        return data.map(mapCategoryToDomain)
    }

    async getBySlug(slug: string): Promise<Category | null> {
        const { data, error } = await this.supabase
            .from('categories')
            .select('*')
            .eq('slug', slug)
            .single()

        if (error || !data) return null
        return mapCategoryToDomain(data)
    }

    async create(item: Partial<Category>): Promise<Category> {
        const { data, error } = await this.supabase
            .from('categories')
            .insert({
                name: item.name!,
                slug: item.slug!,
            })
            .select()
            .single()

        if (error) throw error
        return mapCategoryToDomain(data)
    }

    async update(id: string, item: Partial<Category>): Promise<Category> {
        const { data, error } = await this.supabase
            .from('categories')
            .update({
                name: item.name,
                slug: item.slug,
            })
            .eq('id', id)
            .select()
            .single()

        if (error) throw error
        return mapCategoryToDomain(data)
    }

    async delete(id: string): Promise<void> {
        const { error } = await this.supabase
            .from('categories')
            .delete()
            .eq('id', id)

        if (error) throw error
    }
}
