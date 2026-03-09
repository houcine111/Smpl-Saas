import { Database } from '@/types/database'
import { Vendor, Product, Order } from '@/types/models'

type DBProfile = Database['public']['Tables']['profiles']['Row']
type DBProduct = Database['public']['Tables']['products']['Row']
type DBOrder = Database['public']['Tables']['orders']['Row']

export const mapProfileToVendor = (profile: DBProfile): Vendor => ({
    id: profile.id,
    storeName: profile.store_name,
    slug: profile.slug,
    whatsappNumber: profile.whatsapp_number,
    isAdmin: profile.is_admin,
    createdAt: profile.created_at,
})

export const mapProductToDomain = (product: DBProduct): Product => ({
    id: product.id,
    vendorId: product.vendor_id,
    name: product.name,
    price: Number(product.price),
    imageUrls: product.image_urls || [],
    isActive: product.is_active,
    deletedAt: product.deleted_at,
    stockQuantity: product.stock_quantity || 0,
    createdAt: product.created_at,
})

export const mapOrderToDomain = (order: DBOrder): Order => ({
    id: order.id,
    productId: order.product_id,
    vendorId: order.vendor_id,
    customerName: order.customer_name,
    customerPhone: order.customer_phone,
    customerCity: order.customer_city,
    status: order.status,
    createdAt: order.created_at,
})

export const mapOrderWithDetailsToDomain = (order: any): any => ({
    ...mapOrderToDomain(order),
    product: order.products ? mapProductToDomain(order.products) : undefined,
    vendor: order.profiles ? mapProfileToVendor(order.profiles) : undefined
})
