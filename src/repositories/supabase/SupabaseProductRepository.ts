import { SupabaseClient } from '@supabase/supabase-js'
import { Database } from '@/types/database'
import { Product } from '@/types/models'
import { IProductRepository } from '../interfaces'
import { mapProductToDomain } from './mappers'

export class SupabaseProductRepository implements IProductRepository {
    constructor(private supabase: SupabaseClient<Database>) { }

    async getById(id: string): Promise<Product | null> {
        const { data, error } = await this.supabase
            .from('products')
            .select('*')
            .eq('id', id)
            .single()

        if (error || !data) return null
        return mapProductToDomain(data)
    }

    async getAll(): Promise<Product[]> {
        const { data, error } = await this.supabase
            .from('products')
            .select('*')
            .is('deleted_at', null)

        if (error || !data) return []
        return data.map(mapProductToDomain)
    }

    async getByVendorId(vendorId: string): Promise<Product[]> {
        const { data, error } = await this.supabase
            .from('products')
            .select('*')
            .eq('vendor_id', vendorId)
            .is('deleted_at', null)

        if (error || !data) return []
        return data.map(mapProductToDomain)
    }

    async getPublicByVendorSlug(slug: string): Promise<Product[]> {
        // First get the vendor ID from the slug
        const { data: vendor, error: vendorError } = await this.supabase
            .from('profiles')
            .select('id')
            .eq('slug', slug)
            .single()

        if (vendorError || !vendor) return []

        const { data, error } = await this.supabase
            .from('products')
            .select('*')
            .eq('vendor_id', vendor.id)
            .eq('is_active', true)
            .is('deleted_at', null)

        if (error || !data) return []
        return data.map(mapProductToDomain)
    }

    async create(item: { vendorId: string; name: string; price: number; stockQuantity?: number } & Partial<Product>): Promise<Product> {
        const { data, error } = await this.supabase
            .from('products')
            .insert({
                vendor_id: item.vendorId,
                name: item.name,
                price: item.price,
                image_urls: item.imageUrls || [],
                is_active: item.isActive ?? true,
                stock_quantity: item.stockQuantity ?? 0,
            })
            .select()
            .single()

        if (error) throw error
        return mapProductToDomain(data)
    }

    async update(id: string, item: Partial<Product>): Promise<Product> {
        const { data, error } = await this.supabase
            .from('products')
            .update({
                name: item.name,
                price: item.price,
                image_urls: item.imageUrls,
                is_active: item.isActive,
                stock_quantity: item.stockQuantity,
            })
            .eq('id', id)
            .select()
            .single()

        if (error) throw error
        return mapProductToDomain(data)
    }

    async delete(id: string): Promise<void> {
        const { error } = await this.supabase
            .from('products')
            .update({ deleted_at: new Date().toISOString() })
            .eq('id', id)

        if (error) throw error
    }
}
