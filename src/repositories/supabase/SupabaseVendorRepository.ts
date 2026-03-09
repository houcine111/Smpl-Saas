import { SupabaseClient } from '@supabase/supabase-js'
import { Database } from '@/types/database'
import { Vendor } from '@/types/models'
import { IVendorRepository } from '../interfaces'
import { mapProfileToVendor } from './mappers'

export class SupabaseVendorRepository implements IVendorRepository {
    constructor(private supabase: SupabaseClient<Database>) { }

    async getById(id: string): Promise<Vendor | null> {
        const { data, error } = await this.supabase
            .from('profiles')
            .select('*')
            .eq('id', id)
            .single()

        if (error || !data) return null
        return mapProfileToVendor(data)
    }

    async getBySlug(slug: string): Promise<Vendor | null> {
        const { data, error } = await this.supabase
            .from('profiles')
            .select('*')
            .eq('slug', slug)
            .single()

        if (error || !data) return null
        return mapProfileToVendor(data)
    }

    async getAll(): Promise<Vendor[]> {
        const { data, error } = await this.supabase
            .from('profiles')
            .select('*')

        if (error || !data) return []
        return data.map(mapProfileToVendor)
    }

    async create(item: { id: string } & Partial<Vendor>): Promise<Vendor> {
        const { data, error } = await this.supabase
            .from('profiles')
            .insert({
                id: item.id,
                store_name: item.storeName,
                slug: item.slug,
                whatsapp_number: item.whatsappNumber,
                is_admin: item.isAdmin,
            })
            .select()
            .single()

        if (error) throw error
        return mapProfileToVendor(data)
    }

    async update(id: string, item: Partial<Vendor>): Promise<Vendor> {
        const { data, error } = await this.supabase
            .from('profiles')
            .update({
                store_name: item.storeName,
                slug: item.slug,
                whatsapp_number: item.whatsappNumber,
                is_admin: item.isAdmin,
            })
            .eq('id', id)
            .select()
            .single()

        if (error) throw error
        return mapProfileToVendor(data)
    }

    async delete(id: string): Promise<void> {
        const { error } = await this.supabase
            .from('profiles')
            .delete()
            .eq('id', id)

        if (error) throw error
    }
}
