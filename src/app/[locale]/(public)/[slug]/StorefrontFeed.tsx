'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Vendor, Product, Category } from '@/types/models'
import { ShoppingBag, Check, Plus, Minus, MessageCircle, Search, X, AlignLeft, AlertCircle } from 'lucide-react'
import { Drawer } from 'vaul'
import { ProductImageGallery } from '@/components/products/ProductImageGallery'
import OrderDrawer from './OrderDrawer'
import { useTranslations } from 'next-intl'

interface StorefrontFeedProps {
    vendor: Vendor
    products: Product[]
    categories: Category[]
}

export default function StorefrontFeed({ vendor, products, categories }: StorefrontFeedProps) {
    const t = useTranslations('Storefront')
    const [cart, setCart] = useState<{ [productId: string]: number }>({})
    const [isDrawerOpen, setIsDrawerOpen] = useState(false)
    const [searchTerm, setSearchTerm] = useState('')
    const [selectedCategory, setSelectedCategory] = useState<string>('all')
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
    const [visibleCount, setVisibleCount] = useState(8)

    const filteredProducts = products.filter(product => {
        const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (product.description?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false)
        const matchesCategory = selectedCategory === 'all' || product.categoryId === selectedCategory
        return matchesSearch && matchesCategory
    })

    const paginatedProducts = filteredProducts.slice(0, visibleCount)
    const hasMore = visibleCount < filteredProducts.length

    const totalItems = Object.values(cart).reduce((sum, q) => sum + q, 0)
    const totalPrice = products.reduce((sum, p) => {
        const qty = cart[p.id] || 0
        return sum + (p.price * qty)
    }, 0)

    const updateQuantity = (productId: string, delta: number) => {
        setCart(prev => {
            const currentItem = prev[productId] || 0
            const newQty = Math.max(0, currentItem + delta)
            if (newQty === 0) {
                const { [productId]: _, ...rest } = prev
                return rest
            }
            return { ...prev, [productId]: newQty }
        })
    }

    const clearCart = () => setCart({})

    return (
        <div className="max-w-7xl mx-auto pb-40 min-h-screen">
            {/* Header */}
            <header className="sticky top-0 z-50 bg-white/95 dark:bg-black/95 backdrop-blur-2xl border-b border-border shadow-sm px-4 py-4 space-y-4">
                <div className="max-w-6xl mx-auto space-y-4">
                    <div className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-3 min-w-0">
                            <div className="w-10 h-10 bg-foreground rounded-2xl flex items-center justify-center shrink-0 shadow-xl border border-white/10">
                                <span className="text-background font-serif italic text-lg">{vendor.storeName?.charAt(0)}</span>
                            </div>
                            <div className="min-w-0">
                                <h1 className="text-lg font-serif font-black tracking-tight text-foreground italic truncate leading-tight uppercase">
                                    {vendor.storeName}
                                </h1>
                                <div className="flex items-center gap-1.5 mt-0.5">
                                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                                    <p className="text-[9px] text-muted-foreground font-black uppercase tracking-widest truncate">
                                        {t('officialStore')}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <a
                            href={`https://wa.me/${vendor.whatsappNumber?.replace('+', '')}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-10 h-10 bg-emerald-500/10 text-emerald-600 rounded-2xl flex items-center justify-center hover:bg-emerald-500 hover:text-white transition-all shadow-sm active:scale-90"
                        >
                            <MessageCircle className="w-5 h-5" />
                        </a>
                    </div>

                    <div className="flex items-center gap-2">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <input
                                type="text"
                                placeholder="Rechercher un article..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-3 py-3 bg-muted/40 border border-border/50 rounded-2xl focus:ring-2 focus:ring-foreground/5 outline-none transition-all text-xs font-bold"
                            />
                        </div>

                        <div className="relative shrink-0">
                            <select
                                value={selectedCategory}
                                onChange={(e) => setSelectedCategory(e.target.value)}
                                className="appearance-none pl-4 pr-10 py-3 bg-muted/40 border border-border/50 rounded-2xl outline-none text-[10px] font-black uppercase tracking-widest cursor-pointer"
                            >
                                <option value="all">Tout</option>
                                {categories
                                    .filter(cat => products.some(p => p.categoryId === cat.id))
                                    .map(cat => (
                                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                                    ))
                                }
                            </select>
                            <Plus className="absolute right-3 top-1/2 -translate-y-1/2 w-3 h-3 rotate-45 opacity-40 pointer-events-none" />
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content Area */}
            <main className="px-4 py-12 lg:px-8 max-w-6xl mx-auto space-y-16 transition-all min-h-screen">
                {filteredProducts.length === 0 ? (
                    <div className="text-center py-40 bg-zinc-50/50 dark:bg-zinc-900/50 rounded-[4rem] border-2 border-dashed border-border/40">
                        <ShoppingBag className="w-20 h-20 text-muted-foreground/10 mx-auto mb-8" />
                        <h2 className="text-3xl font-serif font-black italic text-muted-foreground/30">{t('emptyTitle')}</h2>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10">
                        {paginatedProducts.map((product, idx) => (
                            <motion.div
                                key={product.id}
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: idx * 0.05, duration: 0.8 }}
                                className="group cursor-pointer"
                                onClick={() => setSelectedProduct(product)}
                            >
                                <div className="aspect-[3/4] relative bg-muted/10 rounded-[3rem] overflow-hidden border border-border/30 shadow-sm group-hover:shadow-3xl group-hover:-translate-y-3 transition-all duration-700">
                                    <ProductImageGallery imageUrls={product.imageUrls} name={product.name} />
                                    <div className="absolute top-5 left-5 z-20">
                                        <div className="px-4 py-2 bg-white/90 dark:bg-black/90 backdrop-blur-2xl rounded-2xl border border-white/20 shadow-2xl">
                                            <p className="font-black text-xs tracking-tight">{product.price.toLocaleString()} {product.currency || 'DH'}</p>
                                        </div>
                                    </div>
                                    
                                    {/* Hover Overlay */}
                                    <div className="absolute inset-x-0 bottom-0 p-6 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500">
                                        <div className="w-full py-4 bg-white text-black rounded-[2rem] font-black uppercase text-[10px] tracking-[0.2em] text-center shadow-2xl scale-90 group-hover:scale-100 transition-transform">
                                            Explorer l'article
                                        </div>
                                    </div>
                                </div>
                                <div className="mt-6 px-4 flex items-end justify-between gap-4 min-h-[50px]">
                                    <div className="space-y-1 min-w-0">
                                        <h3 className="text-[11px] font-black uppercase tracking-widest text-foreground/80 group-hover:text-foreground transition-colors truncate">{product.name}</h3>
                                        <p className="text-[9px] font-black text-muted-foreground/50 uppercase tracking-tighter">{categories.find(c => c.id === product.categoryId)?.name || 'Vêtements'}</p>
                                    </div>

                                    {/* Responsive Quantity Selector or Quick Add */}
                                    <div className="shrink-0 flex items-center bg-white dark:bg-zinc-800 rounded-2xl border-2 border-zinc-200 dark:border-zinc-700 overflow-hidden shadow-xl">
                                        {cart[product.id] ? (
                                            <div className="flex items-center">
                                                <button
                                                    onClick={(e) => { e.stopPropagation(); updateQuantity(product.id, -1); }}
                                                    className="w-10 h-12 flex items-center justify-center hover:bg-zinc-100 dark:hover:bg-zinc-700 active:scale-90 transition-all border-r border-zinc-100 dark:border-zinc-700"
                                                >
                                                    <Minus className="w-4 h-4" />
                                                </button>
                                                <span className="w-10 text-center text-xs font-black tabular-nums bg-zinc-50 dark:bg-zinc-900 h-12 flex items-center justify-center">
                                                    {cart[product.id]}
                                                </span>
                                                <button
                                                    onClick={(e) => { e.stopPropagation(); updateQuantity(product.id, 1); }}
                                                    className="w-10 h-12 flex items-center justify-center hover:bg-zinc-100 dark:hover:bg-zinc-700 active:scale-90 transition-all border-l border-zinc-100 dark:border-zinc-700"
                                                >
                                                    <Plus className="w-4 h-4" />
                                                </button>
                                            </div>
                                        ) : (
                                            <button
                                                onClick={(e) => {
                                                    e.preventDefault()
                                                    e.stopPropagation()
                                                    updateQuantity(product.id, 1)
                                                }}
                                                className="w-14 h-12 bg-zinc-900 dark:bg-white text-white dark:text-black flex items-center justify-center hover:scale-105 active:scale-95 transition-all"
                                            >
                                                <Plus className="w-5 h-5" />
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}

                {hasMore && (
                    <div className="pt-20 flex justify-center">
                        <button
                            onClick={() => setVisibleCount(v => v + 8)}
                            className="px-16 py-6 bg-transparent border-2 border-zinc-200 dark:border-zinc-800 rounded-[2.5rem] font-black uppercase text-[10px] tracking-[0.4em] text-muted-foreground hover:text-foreground hover:border-foreground transition-all active:scale-95"
                        >
                            Voir Plus d'Articles
                        </button>
                    </div>
                )}
            </main>

            {/* Product Details Drawer/Modal Hybrid */}
            <Drawer.Root
                open={!!selectedProduct}
                onOpenChange={(open) => !open && setSelectedProduct(null)}
            >
                <Drawer.Portal>
                    <Drawer.Overlay className="fixed inset-0 bg-black/80 backdrop-blur-xl z-[100]" />
                    <Drawer.Content className="fixed bottom-0 left-0 right-0 lg:left-1/2 lg:-translate-x-1/2 lg:bottom-12 lg:w-full lg:max-w-5xl z-[101] flex flex-col bg-white dark:bg-[#0c0c0c] lg:rounded-[3rem] rounded-t-[3rem] h-[90vh] lg:h-[80vh] outline-none border border-white/10 shadow-3xl overflow-hidden animate-in slide-in-from-bottom duration-500">
                        <Drawer.Title className="sr-only">{selectedProduct?.name || 'Détails du produit'}</Drawer.Title>
                        <Drawer.Description className="sr-only">
                            {selectedProduct?.description || 'Détails et commande pour ' + selectedProduct?.name}
                        </Drawer.Description>
                        
                        {/* Drag Handle Mobile */}
                        <div className="mx-auto w-12 h-1.5 rounded-full bg-zinc-200 dark:bg-zinc-800 my-4 shrink-0 lg:hidden" />

                        <div className="flex-1 overflow-y-auto overflow-x-hidden scroll-smooth transition-all duration-300">
                            <div className="grid grid-cols-1 lg:grid-cols-2 h-full items-stretch">
                                
                                {/* Image Section (Limited Height/Width) */}
                                <div className="relative bg-muted/5 min-h-[45vh] lg:min-h-0 border-r border-border/30">
                                    <div className="h-full w-full">
                                        <ProductImageGallery imageUrls={selectedProduct?.imageUrls || []} name={selectedProduct?.name || ''} />
                                    </div>
                                    <button
                                        onClick={() => setSelectedProduct(null)}
                                        className="absolute top-6 right-6 p-4 bg-black/30 backdrop-blur-2xl rounded-full text-white hover:bg-black/50 transition-all z-20 group"
                                    >
                                        <X className="w-5 h-5 group-hover:rotate-90 transition-transform" />
                                    </button>
                                </div>

                                {/* Content Section */}
                                <div className="p-8 lg:p-12 flex flex-col justify-between space-y-10">
                                    <div className="space-y-8">
                                        <div className="space-y-4">
                                            <div className="flex items-center gap-2">
                                                <div className="px-3 py-1 bg-zinc-100 dark:bg-zinc-900 rounded-full border border-border/50">
                                                    <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">
                                                        {categories.find(c => c.id === selectedProduct?.categoryId)?.name || 'Vêtement'}
                                                    </p>
                                                </div>
                                                <div className="flex items-center gap-1.5 text-[10px] font-black uppercase text-emerald-500">
                                                    <div className="w-1 h-1 rounded-full bg-emerald-500" />
                                                    En Stock
                                                </div>
                                            </div>
                                            <h2 className="text-4xl lg:text-5xl font-serif font-black italic tracking-tighter leading-none uppercase">
                                                {selectedProduct?.name}
                                            </h2>
                                            <p className="text-3xl font-black tracking-tight flex items-baseline gap-2">
                                                {selectedProduct?.price.toLocaleString()} 
                                                <span className="text-sm font-black text-muted-foreground uppercase">{selectedProduct?.currency || 'DH'}</span>
                                            </p>
                                        </div>

                                        <div className="h-px bg-zinc-100 dark:bg-zinc-900" />

                                        {selectedProduct?.description ? (
                                            <div className="space-y-3">
                                                <div className="flex items-center gap-2 opacity-30">
                                                    <AlignLeft className="w-3.5 h-3.5" />
                                                    <span className="text-[10px] font-black uppercase tracking-widest">Description</span>
                                                </div>
                                                <p className="text-sm font-medium leading-loose text-foreground/80 whitespace-pre-wrap max-w-sm">
                                                    {selectedProduct.description}
                                                </p>
                                            </div>
                                        ) : (
                                            <div className="flex flex-col items-center justify-center py-10 opacity-20 border-2 border-dashed border-border rounded-3xl">
                                                <AlertCircle className="w-6 h-6 mb-2" />
                                                <p className="text-[10px] font-black uppercase tracking-widest">Aucune description</p>
                                            </div>
                                        )}
                                    </div>

                                    {/* Actions */}
                                    <div className="space-y-6">
                                        <div className="flex items-center justify-between p-3 bg-zinc-50 dark:bg-zinc-950/50 rounded-[2.5rem] border border-border/50">
                                            <button
                                                onClick={() => selectedProduct && updateQuantity(selectedProduct.id, -1)}
                                                className="w-16 h-16 rounded-full bg-background border-2 border-border/50 flex items-center justify-center hover:bg-muted active:scale-90 transition-all shadow-sm"
                                            >
                                                <Minus className="w-6 h-6" />
                                            </button>
                                            <div className="flex flex-col items-center">
                                                <span className="text-3xl font-black tabular-nums font-serif italic">
                                                    {selectedProduct ? (cart[selectedProduct.id] || 0) : 0}
                                                </span>
                                                <p className="text-[8px] font-black uppercase tracking-[0.2em] text-muted-foreground">Quantité</p>
                                            </div>
                                            <button
                                                onClick={() => selectedProduct && updateQuantity(selectedProduct.id, 1)}
                                                className="w-16 h-16 rounded-full bg-foreground text-background flex items-center justify-center hover:scale-110 active:scale-90 transition-all shadow-xl shadow-foreground/10"
                                            >
                                                <Plus className="w-6 h-6" />
                                            </button>
                                        </div>

                                        {(cart[selectedProduct?.id || ''] || 0) > 0 && (
                                            <button
                                                onClick={() => { setSelectedProduct(null); setIsDrawerOpen(true); }}
                                                className="w-full py-7 bg-[#25D366] text-white rounded-[2.5rem] font-black uppercase tracking-[0.3em] text-[10px] shadow-3xl shadow-emerald-500/30 flex items-center justify-center gap-4 hover:scale-[1.02] active:scale-95 transition-all animate-in slide-in-from-bottom"
                                            >
                                                <MessageCircle className="w-6 h-6" />
                                                Passer ma commande
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Drawer.Content>
                </Drawer.Portal>
            </Drawer.Root>

            {/* Floating Cart Bar */}
            <AnimatePresence>
                {totalItems > 0 && (
                    <motion.div
                        initial={{ y: 100, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: 100, opacity: 0 }}
                        className="fixed bottom-8 left-0 right-0 z-40 px-6"
                    >
                        <div className="max-w-md mx-auto relative">
                            <button
                                onClick={() => setIsDrawerOpen(true)}
                                className="w-full bg-black dark:bg-white text-white dark:text-black p-5 rounded-[2.5rem] flex items-center justify-between shadow-3xl hover:scale-[1.02] active:scale-95 transition-all overflow-hidden border border-white/10 !bg-opacity-100"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-accent rounded-2xl flex items-center justify-center shadow-lg">
                                        <ShoppingBag className="w-6 h-6 text-accent-foreground" />
                                    </div>
                                    <div className="text-left">
                                        <p className="text-[10px] font-black uppercase opacity-60 tracking-widest">{totalItems} Articles</p>
                                        <p className="text-sm font-black uppercase tracking-tight">Commander</p>
                                    </div>
                                </div>
                                <div className="text-right pr-4">
                                    <p className="text-xl font-black italic">{totalPrice.toLocaleString()} <span className="text-[10px] not-italic">{t('currency')}</span></p>
                                </div>
                            </button>

                            <button
                                onClick={(e) => { e.stopPropagation(); clearCart(); }}
                                className="absolute -top-2 -right-2 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center shadow-xl border-2 border-background"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

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