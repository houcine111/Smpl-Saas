import { Database } from './database'

export type OrderStatus = Database['public']['Enums']['order_status']

export interface Vendor {
    id: string
    storeName: string | null
    slug: string | null
    whatsappNumber: string | null
    isAdmin: boolean
    isActive: boolean
    createdAt: string
}

export interface Product {
    id: string
    vendorId: string
    name: string
    price: number
    imageUrls: string[]
    isActive: boolean
    deletedAt: string | null
    stockQuantity: number
    createdAt: string
}

export interface Order {
    id: string
    productId: string
    vendorId: string
    customerName: string
    customerPhone: string
    customerCity: string
    status: OrderStatus
    createdAt: string
}

// Extended types for UI
export interface ProductWithVendor extends Product {
    vendor?: Vendor
}

export interface OrderWithDetails extends Order {
    product?: Product
    vendor?: Vendor
}
