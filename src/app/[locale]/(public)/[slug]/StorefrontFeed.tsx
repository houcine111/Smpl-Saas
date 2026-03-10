'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Vendor, Product } from '@/types/models'
import { ShoppingBag, Check, Plus, Minus, MessageCircle, Store } from 'lucide-react'
import { Drawer } from 'vaul'
import { ProductImageGallery } from '@/components/products/ProductImageGallery'

import OrderDrawer from './OrderDrawer'

import { useTranslations } from 'next-intl'

interface StorefrontFeedProps {
    vendor: Vendor
    products: Product[]
}

export default function StorefrontFeed({ vendor, products }: StorefrontFeedProps) {
    const t = useTranslations('Storefront')
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
        <div className="max-w-3xl mx-auto pb-40">
            {/* Header */}
            <header className="sticky top-0 z-30 bg-[#FDFCF8]/90 backdrop-blur-2xl border-b border-zinc-100 px-4 sm:px-6 py-6 sm:py-8">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 sm:gap-5">
                        <div className="w-12 h-12 sm:w-14 sm:h-14 bg-black rounded-[1.25rem] flex items-center justify-center shadow-2xl shadow-black/10 transition-transform hover:scale-105 duration-500">
                            <span className="text-white font-serif italic text-xl sm:text-2xl">{vendor.storeName?.charAt(0)}</span>
                        </div>
                        <div>
                            <h1 className="text-xl sm:text-2xl font-serif font-black tracking-tight text-zinc-950 italic">
                                {vendor.storeName}
                            </h1>
                            <div className="flex items-center gap-2 mt-0.5">
                                <div className="w-1 h-1 rounded-full bg-[#8FA998]"></div>
                                <p className="text-[10px] text-zinc-400 font-black uppercase tracking-[0.2em]">
                                    {t('officialStore')}
                                </p>
                            </div>
                        </div>
                    </div>
                    <a
                        href={`https://wa.me/${vendor.whatsappNumber?.replace('+', '')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-10 h-10 sm:w-12 sm:h-12 shrink-0 bg-[#8FA998]/10 text-[#8FA998] rounded-xl sm:rounded-2xl flex items-center justify-center hover:bg-[#8FA998] hover:text-white transition-all duration-500"
                    >
                        <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5" />
                    </a>
                </div>
            </header>

            {/* Product Feed */}
            <div className="px-4 sm:px-6 py-8 space-y-4">
                {products.length === 0 ? (
                    <div className="text-center py-20 space-y-4">
                        <ShoppingBag className="w-12 h-12 text-zinc-200 mx-auto mb-4" />
                        <h2 className="text-xl font-serif font-black italic text-zinc-400">{t('emptyTitle')}</h2>
                        <p className="text-zinc-500 text-sm font-medium">{t('emptyDesc')}</p>
                    </div>
                ) : (
                    products.map((product, idx) => (
                        <motion.div
                            key={product.id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: idx * 0.05 }}
                            className="group flex flex-row items-center gap-4 bg-white p-3 sm:p-4 rounded-[1.5rem] sm:rounded-[2rem] border border-zinc-100 shadow-sm hover:shadow-xl hover:shadow-black/5 transition-all duration-500"
                        >
                            <div className="w-24 h-24 sm:w-32 sm:h-32 shrink-0 bg-[#FAF9F6] rounded-[1rem] sm:rounded-[1.5rem] overflow-hidden relative border border-zinc-100">
                                <ProductImageGallery imageUrls={product.imageUrls} name={product.name} />
                            </div>

                            <div className="flex-1 min-w-0 py-1 flex flex-col justify-between self-stretch">
                                <div className="space-y-1">
                                    <h3 className="text-lg sm:text-2xl font-serif font-black text-zinc-950 truncate italic group-hover:text-zinc-600 transition-colors">
                                        {product.name}
                                    </h3>
                                    <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400 truncate">
                                        {t('collection')}
                                    </p>
                                </div>
                                <div className="mt-auto flex items-center justify-between pt-2">
                                    <p className="font-black text-zinc-900 text-sm sm:text-base bg-zinc-50 px-3 py-1 rounded-lg border border-zinc-100">{product.price.toFixed(2)} {t('currency')}</p>
                                </div>
                            </div>

                            <div className="shrink-0 flex items-center pl-2">
                                <div className="flex flex-col sm:flex-row items-center gap-2 bg-zinc-50 rounded-[1.25rem] p-1.5 border border-zinc-100 shadow-inner">
                                    {cart[product.id] ? (
                                        <>
                                            <button
                                                onClick={() => updateQuantity(product.id, -1)}
                                                className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-white flex items-center justify-center hover:bg-zinc-100 transition-colors shadow-sm"
                                            >
                                                <Minus className="w-3 h-3 sm:w-4 sm:h-4 text-zinc-400" />
                                            </button>
                                            <span className="w-6 sm:w-8 text-center font-black text-xs sm:text-sm text-zinc-950">
                                                {cart[product.id]}
                                            </span>
                                            <button
                                                onClick={() => updateQuantity(product.id, 1)}
                                                className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-black text-white flex items-center justify-center hover:opacity-90 transition-opacity shadow-md"
                                            >
                                                <Plus className="w-3 h-3 sm:w-4 sm:h-4" />
                                            </button>
                                        </>
                                    ) : (
                                        <button
                                            onClick={() => updateQuantity(product.id, 1)}
                                            className="w-10 h-10 sm:w-auto sm:px-6 sm:py-3 bg-black text-white rounded-[1rem] sm:rounded-xl font-black uppercase tracking-widest text-[10px] flex items-center justify-center gap-2 hover:scale-[1.02] transition-transform shadow-md"
                                        >
                                            <Plus className="w-4 h-4 sm:w-3 sm:h-3" />
                                            <span className="hidden sm:inline">{t('addToCart')}</span>
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
                                        {t('selection', { count: totalItems })}
                                    </p>
                                    <p className="text-lg font-black tracking-tight">
                                        {t('checkout')}
                                    </p>
                                </div>
                            </div>
                            <div className="relative z-10 text-right">
                                <p className="text-2xl font-black italic">
                                    {totalPrice.toLocaleString()} <span className="text-[10px] font-medium opacity-50 not-italic uppercase ml-1">{t('currency')}</span>
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
