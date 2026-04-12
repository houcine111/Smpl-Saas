'use client'

import { useState } from 'react'
import { Product, Category } from '@/types/models'
import { motion, AnimatePresence } from 'framer-motion'
import {
    Package,
    Plus,
    Search,
    Edit2,
    Trash2,
    MoreVertical,
    ChevronRight,
    AlertCircle
} from 'lucide-react'
import Link from 'next/link'
import { ProductImageGallery } from './ProductImageGallery'
import { ProductActionMenu } from './ProductActionMenu'

interface ProductListProps {
    initialProducts: Product[]
    categories: Category[]
}

export default function ProductList({ initialProducts, categories }: ProductListProps) {
    const [searchTerm, setSearchTerm] = useState('')
    const [selectedCategory, setSelectedCategory] = useState<string>('all')
    const [currentPage, setCurrentPage] = useState(1)
    const productsPerPage = 6

    const filteredProducts = initialProducts.filter(product => {
        const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase())
        const matchesCategory = selectedCategory === 'all' || product.categoryId === selectedCategory
        return matchesSearch && matchesCategory
    })

    const totalPages = Math.ceil(filteredProducts.length / productsPerPage)
    const indexOfLastProduct = currentPage * productsPerPage
    const indexOfFirstProduct = indexOfLastProduct - productsPerPage
    const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct)

    return (
        <div className="space-y-8">
            {/* Filter Bar */}
            <div className="flex flex-col pt-6 lg:pt-0 lg:flex-row lg:items-center justify-between gap-6 animate-in slide-in-from-top-4 duration-700 delay-100">
                <div className="flex flex-col md:flex-row gap-4 flex-1 max-w-2xl">
                    <div className="relative group flex-1">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-foreground transition-colors" />
                        <input
                            type="text"
                            placeholder="Rechercher dans votre catalogue..."
                            value={searchTerm}
                            onChange={(e) => {
                                setSearchTerm(e.target.value)
                                setCurrentPage(1)
                            }}
                            className="w-full pl-11 pr-4 py-4 bg-card border border-border rounded-2xl focus:ring-2 focus:ring-foreground outline-none transition-all shadow-sm font-medium"
                        />
                    </div>

                    <select
                        value={selectedCategory}
                        onChange={(e) => {
                            setSelectedCategory(e.target.value)
                            setCurrentPage(1)
                        }}
                        className="px-6 py-4 bg-card border border-border rounded-2xl focus:ring-2 focus:ring-foreground outline-none transition-all shadow-sm font-bold min-w-[200px]"
                    >
                        <option value="all">Toutes les catégories</option>
                        {categories.map(cat => (
                            <option key={cat.id} value={cat.id}>{cat.name}</option>
                        ))}
                    </select>
                </div>

                <div className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground">
                    {filteredProducts.length} Produits au total
                </div>
            </div>

            {filteredProducts.length === 0 ? (
                <div className="bg-muted/50 rounded-[3rem] border border-dashed border-border py-32 text-center">
                    <div className="w-20 h-20 bg-card rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl border border-border">
                        <AlertCircle className="w-8 h-8 text-muted-foreground/30" />
                    </div>
                    <h3 className="text-xl font-serif font-black italic text-muted-foreground/50">Aucun produit trouvé</h3>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    <AnimatePresence mode="popLayout">
                        {currentProducts.map((product, idx) => (
                            <motion.div
                                key={product.id}
                                layout
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: idx * 0.05 }}
                                className="group bg-card rounded-[2.5rem] border border-border shadow-sm overflow-hidden hover:shadow-2xl hover:shadow-black/5 transition-all duration-500 active:scale-[0.98] relative"
                            >
                                <div className="aspect-[5/4] relative bg-muted/30 overflow-hidden">
                                    <ProductImageGallery imageUrls={product.imageUrls} name={product.name} />

                                    <div className="absolute bottom-4 left-4 z-10">
                                        <div className="bg-foreground/80 backdrop-blur-md px-4 py-2 rounded-xl shadow-lg border border-white/10 dark:border-white/5">
                                            <p className="font-black text-background text-xs tracking-wider">{product.price.toFixed(2)} {product.currency || 'DH'}</p>
                                        </div>
                                    </div>

                                    {/* Category Badge */}
                                    {product.categoryId && (
                                        <div className="absolute top-4 left-4 z-10">
                                            <div className="bg-background/90 backdrop-blur-md px-3 py-1.5 rounded-lg shadow-sm border border-border">
                                                <p className="font-black text-foreground text-[8px] uppercase tracking-widest">
                                                    {categories.find(c => c.id === product.categoryId)?.name}
                                                </p>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <div className="p-8 space-y-4">
                                    <div className="flex items-start justify-between gap-4">
                                        <div className="space-y-1 flex-1">
                                            <h3 className="text-xl font-serif font-black text-foreground group-hover:text-muted-foreground transition-colors line-clamp-1 italic">
                                                {product.name}
                                            </h3>
                                            <div className="flex items-center gap-2">
                                                {product.isActive ? (
                                                    product.stockQuantity > 0 ? (
                                                        <div className="flex items-center gap-1.5">
                                                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                                                            <p className="text-[10px] font-black uppercase tracking-widest text-emerald-600 dark:text-emerald-400">En stock • {product.stockQuantity}</p>
                                                        </div>
                                                    ) : (
                                                        <div className="flex items-center gap-1.5">
                                                            <div className="w-1.5 h-1.5 rounded-full bg-amber-500"></div>
                                                            <p className="text-[10px] font-black uppercase tracking-widest text-amber-600 dark:text-amber-400">Indisponible</p>
                                                        </div>
                                                    )
                                                ) : (
                                                    <div className="flex items-center gap-1.5">
                                                        <div className="w-1.5 h-1.5 rounded-full bg-zinc-300 dark:bg-zinc-600"></div>
                                                        <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Masqué</p>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                        <ProductActionMenu 
                                            productId={product.id} 
                                            productName={product.name} 
                                        />
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            )}

            {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 pt-10">
                    <button
                        onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                        disabled={currentPage === 1}
                        className="px-6 py-3 bg-card border border-border rounded-2xl text-xs font-black uppercase tracking-widest disabled:opacity-30 hover:bg-muted/50 transition-colors"
                    >
                        Précédent
                    </button>

                    <div className="flex gap-2">
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                            <button
                                key={page}
                                onClick={() => setCurrentPage(page)}
                                className={`w-10 h-10 rounded-xl text-xs font-black flex items-center justify-center transition-all ${currentPage === page
                                    ? 'bg-foreground text-background shadow-lg shadow-black/10 scale-110'
                                    : 'bg-card border border-border text-muted-foreground hover:text-foreground'
                                    }`}
                            >
                                {page}
                            </button>
                        ))}
                    </div>

                    <button
                        onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                        disabled={currentPage === totalPages}
                        className="px-6 py-3 bg-card border border-border rounded-2xl text-xs font-black uppercase tracking-widest disabled:opacity-30 hover:bg-muted/50 transition-colors"
                    >
                        Suivant
                    </button>
                </div>
            )}
        </div>
    )
}
