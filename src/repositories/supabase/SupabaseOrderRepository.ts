import { SupabaseClient } from '@supabase/supabase-js'
import { Database } from '@/types/database'
import { Order, OrderWithDetails } from '@/types/models'
import { IOrderRepository } from '../interfaces'
import { mapOrderToDomain, mapOrderWithDetailsToDomain } from './mappers'

export class SupabaseOrderRepository implements IOrderRepository {
    constructor(private supabase: SupabaseClient<Database>) { }

    async getById(id: string): Promise<Order | null> {
        const { data, error } = await this.supabase
            .from('orders')
            .select('*')
            .eq('id', id)
            .single()

        if (error || !data) return null
        return mapOrderToDomain(data)
    }

    async getAll(): Promise<Order[]> {
        const { data, error } = await this.supabase
            .from('orders')
            .select('*')
            .order('created_at', { ascending: false })

        if (error || !data) return []
        return data.map(mapOrderToDomain)
    }

    async getByVendorId(vendorId: string): Promise<Order[]> {
        const { data, error } = await this.supabase
            .from('orders')
            .select('*')
            .eq('vendor_id', vendorId)
            .order('created_at', { ascending: false })

        if (error || !data) return []
        return data.map(mapOrderToDomain)
    }

    async getWithDetailsByVendorId(vendorId: string): Promise<OrderWithDetails[]> {
        const { data, error } = await this.supabase
            .from('orders')
            .select('*, products(*), profiles(*)')
            .eq('vendor_id', vendorId)
            .order('created_at', { ascending: false })

        if (error || !data) return []
        return data.map(mapOrderWithDetailsToDomain)
    }

    async getAllWithDetails(): Promise<OrderWithDetails[]> {
        const { data, error } = await this.supabase
            .from('orders')
            .select('*, products(*), profiles(*)')
            .order('created_at', { ascending: false })

        if (error || !data) return []
        return data.map(mapOrderWithDetailsToDomain)
    }

    async updateStatus(id: string, status: Order['status']): Promise<void> {
        const { error } = await this.supabase
            .from('orders')
            .update({ status })
            .eq('id', id)

        if (error) throw error
    }

    async create(item: Partial<Order>): Promise<Order> {
        throw new Error('Use createOrder action for creating orders with stock management')
    }

    async update(id: string, item: Partial<Order>): Promise<Order> {
        const { data, error } = await this.supabase
            .from('orders')
            .update({
                status: item.status,
                customer_name: item.customerName,
                customer_phone: item.customerPhone,
                customer_city: item.customerCity,
            })
            .eq('id', id)
            .select()
            .single()

        if (error) throw error
        return mapOrderToDomain(data)
    }

    async delete(id: string): Promise<void> {
        const { error } = await this.supabase
            .from('orders')
            .delete()
            .eq('id', id)

        if (error) throw error
    }
}
