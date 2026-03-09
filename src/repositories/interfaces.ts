import { Vendor, Product, Order, OrderWithDetails } from '@/types/models'
import { IRepository } from './IRepository'

export interface IVendorRepository extends IRepository<Vendor> {
    create(item: { id: string } & Partial<Vendor>): Promise<Vendor>
    getBySlug(slug: string): Promise<Vendor | null>

}

export interface IProductRepository extends IRepository<Product> {
    create(item: { vendorId: string; name: string; price: number; stockQuantity?: number } & Partial<Product>): Promise<Product>;
    getByVendorId(vendorId: string): Promise<Product[]>
    getPublicByVendorSlug(slug: string): Promise<Product[]>
}

export interface IOrderRepository extends IRepository<Order> {
    getByVendorId(vendorId: string): Promise<Order[]>
    getWithDetailsByVendorId(vendorId: string): Promise<OrderWithDetails[]>
    getAllWithDetails(): Promise<OrderWithDetails[]>
    updateStatus(id: string, status: Order['status']): Promise<void>
}
