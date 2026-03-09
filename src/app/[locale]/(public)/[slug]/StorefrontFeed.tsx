'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Vendor, Product } from '@/types/models'
import { ShoppingBag, Check, Plus, Minus, MessageCircle, Store } from 'lucide-react'
import { Drawer } from 'vaul'
import { ProductImageGallery } from '@/components/products/ProductImageGallery'

import OrderDrawer from './OrderDrawer'

interface StorefrontFeedProps {
    vendor: Vendor
    products: Product[]
}

export default function StorefrontFeed({ vendor, products }: StorefrontFeedProps) {
    const [cart, setCart] = useState<{ [productId: string]: number }>({})
    const [isDrawerOpen, setIsDrawerOpen] = useState(false)

    const totalItems = Object.values(cart).reduce((sum, q) => sum + q, 0)
    const totalPrice = products.reduce((sum, p) => {
        const qty = cart[p.id] || 0
        return sum + (p.price * qty)
    }, 0)

    const updateQuantity = (productId: string, delta: number) => {
        setCart(prev => {
            const currentQty = prev[productId] || 0
            const newQty = Math.max(0, currentQty + delta)
            if (newQty === 0) {
                const { [productId]: _, ...rest } = prev
                return rest
            }
            return { ...prev, [productId]: newQty }
        })
    }

    return (
        <div className="max-w-2xl mx-auto pb-40">
            {/* Header */}
            <header className="sticky top-0 z-30 bg-[#FDFCF8]/90 backdrop-blur-2xl border-b border-zinc-100 px-6 py-8">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-5">
                        <div className="w-14 h-14 bg-black rounded-[1.25rem] flex items-center justify-center shadow-2xl shadow-black/10 transition-transform hover:scale-105 duration-500">
                            <span className="text-white font-serif italic text-2xl">{vendor.storeName?.charAt(0)}</span>
                        </div>
                        <div>
                            <h1 className="text-2xl font-serif font-black tracking-tight text-zinc-950 italic">
                                {vendor.storeName}
                            </h1>
                            <div className="flex items-center gap-2 mt-0.5">
                                <div className="w-1 h-1 rounded-full bg-[#8FA998]"></div>
                                <p className="text-[10px] text-zinc-400 font-black uppercase tracking-[0.2em]">
                                    Boutique Officielle
                                </p>
                            </div>
                        </div>
                    </div>
                    <a
                        href={`https://wa.me/${vendor.whatsappNumber?.replace('+', '')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-12 h-12 bg-[#8FA998]/10 text-[#8FA998] rounded-2xl flex items-center justify-center hover:bg-[#8FA998] hover:text-white transition-all duration-500"
                    >
                        <MessageCircle className="w-5 h-5" />
                    </a>
                </div>
            </header>

            {/* Product Feed */}
            <div className="px-6 py-12 space-y-16">
                {products.length === 0 ? (
                    <div className="text-center py-32 space-y-4">
                        <ShoppingBag className="w-16 h-16 text-zinc-100 mx-auto mb-6" />
                        <h2 className="text-2xl font-serif font-black italic text-zinc-300">Catalogue en préparation</h2>
                        <p className="text-zinc-400 text-sm font-medium">Revenez très bientôt pour découvrir nos nouveautés.</p>
                    </div>
                ) : (
                    products.map((product, idx) => (
                        <motion.div
                            key={product.id}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8, delay: idx * 0.1 }}
                            className="group relative"
                        >
                            <div className="aspect-[4/5] bg-[#FAF9F6] rounded-[3rem] overflow-hidden mb-8 shadow-sm group-hover:shadow-2xl group-hover:shadow-black/5 transition-all duration-700 border border-zinc-100 relative">
                                <ProductImageGallery imageUrls={product.imageUrls} name={product.name} />

                                <div className="absolute bottom-6 left-6 z-10">
                                    <div className="bg-black/80 backdrop-blur-xl px-5 py-2.5 rounded-2xl border border-white/10 shadow-2xl">
                                        <p className="font-black text-white text-sm tracking-widest">{product.price.toFixed(2)} DH</p>
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-between items-end px-2 gap-4">
                                <div className="space-y-2">
                                    <h3 className="text-3xl font-serif font-black text-zinc-950 group-hover:text-zinc-600 transition-colors italic leading-none">
                                        {product.name}
                                    </h3>
                                    <p className="text-xs font-black uppercase tracking-[0.2em] text-zinc-400">
                                        Collection Signature
                                    </p>
                                </div>

                                <div className="flex items-center gap-3 bg-white rounded-2xl p-2 border border-zinc-100 shadow-xl shadow-black/5">
                                    {cart[product.id] ? (
                                        <>
                                            <button
                                                onClick={() => updateQuantity(product.id, -1)}
                                                className="w-10 h-10 rounded-xl bg-zinc-50 flex items-center justify-center hover:bg-zinc-100 transition-colors"
                                            >
                                                <Minus className="w-4 h-4 text-zinc-400" />
                                            </button>
                                            <span className="w-8 text-center font-black text-sm text-zinc-950">
                                                {cart[product.id]}
                                            </span>
                                            <button
                                                onClick={() => updateQuantity(product.id, 1)}
                                                className="w-10 h-10 rounded-xl bg-black text-white flex items-center justify-center hover:opacity-90 transition-opacity"
                                            >
                                                <Plus className="w-4 h-4" />
                                            </button>
                                        </>
                                    ) : (
                                        <button
                                            onClick={() => updateQuantity(product.id, 1)}
                                            className="px-8 py-3 bg-black text-white rounded-[1.25rem] font-black uppercase tracking-widest text-[10px] flex items-center gap-3 hover:translate-y-[-2px] transition-all shadow-xl shadow-black/10 active:scale-95"
                                        >
                                            <Plus className="w-3 h-3" />
                                            Ajouter au Panier
                                        </button>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    ))
                )}
            </div>

            {/* Floating Cart Bar */}
            <AnimatePresence>
                {totalItems > 0 && (
                    <motion.div
                        initial={{ y: 100, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: 100, opacity: 0 }}
                        className="fixed bottom-10 left-0 right-0 z-40 px-6"
                    >
                        <button
                            onClick={() => setIsDrawerOpen(true)}
                            className="max-w-md mx-auto w-full bg-black text-white p-6 rounded-[2.5rem] flex items-center justify-between shadow-3xl shadow-black/40 hover:scale-[1.02] active:scale-[0.98] transition-all relative overflow-hidden group"
                        >
                            <div className="relative z-10 flex items-center gap-5">
                                <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center backdrop-blur-md">
                                    <ShoppingBag className="w-6 h-6 text-[#8FA998]" />
                                </div>
                                <div className="text-left">
                                    <p className="text-[10px] opacity-50 font-black uppercase tracking-[0.2em] mb-0.5">
                                        Votre Sélection ({totalItems})
                                    </p>
                                    <p className="text-lg font-black tracking-tight">
                                        Finaliser la Commande
                                    </p>
                                </div>
                            </div>
                            <div className="relative z-10 text-right">
                                <p className="text-2xl font-black italic">
                                    {totalPrice.toLocaleString()} <span className="text-[10px] font-medium opacity-50 not-italic uppercase ml-1">DH</span>
                                </p>
                            </div>

                            {/* Animated background flare */}
                            <div className="absolute top-0 -inset-full h-full w-1/2 z-5 block transform -skew-x-12 bg-gradient-to-r from-transparent via-white/10 to-transparent group-hover:animate-shine" />
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Order Drawer */}
            <OrderDrawer
                isOpen={isDrawerOpen}
                onOpenChange={setIsDrawerOpen}
                cart={cart}
                products={products}
                vendor={vendor}
            />
        </div>
    )
}
