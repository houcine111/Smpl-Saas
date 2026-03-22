export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json | undefined }
    | Json[]

export interface Database {
    public: {
        Tables: {
            orders: {
                Row: {
                    created_at: string
                    customer_city: string
                    customer_name: string
                    customer_phone: string
                    id: string
                    product_id: string
                    status: Database["public"]["Enums"]["order_status"]
                    vendor_id: string
                }
                Insert: {
                    created_at?: string
                    customer_city: string
                    customer_name: string
                    customer_phone: string
                    id?: string
                    product_id: string
                    status?: Database["public"]["Enums"]["order_status"]
                    vendor_id: string
                }
                Update: {
                    created_at?: string
                    customer_city?: string
                    customer_name?: string
                    customer_phone?: string
                    id?: string
                    product_id?: string
                    status?: Database["public"]["Enums"]["order_status"]
                    vendor_id?: string
                }
                Relationships: [
                    {
                        foreignKeyName: "orders_product_id_fkey"
                        columns: ["product_id"]
                        isOneToOne: false
                        referencedRelation: "products"
                        referencedColumns: ["id"]
                    },
                    {
                        foreignKeyName: "orders_vendor_id_fkey"
                        columns: ["vendor_id"]
                        isOneToOne: false
                        referencedRelation: "profiles"
                        referencedColumns: ["id"]
                    }
                ]
            }
            products: {
                Row: {
                    created_at: string

                    id: string
                    image_urls: string[] | null
                    is_active: boolean
                    name: string
                    price: number
                    vendor_id: string
                    deleted_at: string | null
                    stock_quantity: number
                }
                Insert: {
                    created_at?: string
                    id?: string
                    image_url?: string | null
                    is_active?: boolean
                    name: string
                    price: number
                    vendor_id: string
                    deleted_at?: string | null
                    stock_quantity?: number
                }
                Update: {
                    created_at?: string
                    id?: string
                    image_url?: string | null
                    is_active?: boolean
                    name?: string
                    price?: number
                    vendor_id?: string
                    deleted_at?: string | null
                    stock_quantity?: number
                }
                Relationships: [
                    {
                        foreignKeyName: "products_vendor_id_fkey"
                        columns: ["vendor_id"]
                        isOneToOne: false
                        referencedRelation: "profiles"
                        referencedColumns: ["id"]
                    }
                ]
            }
            profiles: {
                Row: {
                    created_at: string
                    id: string
                    is_admin: boolean
                    is_active: boolean
                    slug: string | null
                    store_name: string | null
                    whatsapp_number: string | null
                }
                Insert: {
                    created_at?: string
                    id: string
                    is_admin?: boolean
                    is_active?: boolean
                    slug?: string | null
                    store_name?: string | null
                    whatsapp_number?: string | null
                }
                Update: {
                    created_at?: string
                    id?: string
                    is_admin?: boolean
                    is_active?: boolean
                    slug?: string | null
                    store_name?: string | null
                    whatsapp_number?: string | null
                }
                Relationships: []
            }
        }
        Views: {
            [_ in never]: never
        }
        Functions: {
            [_ in never]: never
        }
        Enums: {
            order_status: "PENDING" | "CONFIRMED" | "SHIPPED" | "DELIVERED" | "CANCELLED"
        }
        CompositeTypes: {
            [_ in never]: never
        }
    }
}
