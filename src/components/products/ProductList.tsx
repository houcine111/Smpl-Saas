'use client'

import { useState } from 'react'
import { Product } from '@/types/models'
import { motion, AnimatePresence } from 'framer-motion'
import {
    Package,
    Plus,
    Search,
    Edit2,
    MoreVertical,
    ChevronRight,
    AlertCircle
} from 'lucide-react'
import Link from 'next/link'
import { ProductImageGallery } from './ProductImageGallery'
import { DeleteProductButton } from './Deleteproduct'

interface ProductListProps {
    initialProducts: Product[]
}

export default function ProductList({ initialProducts }: ProductListProps) {
    const [searchTerm, setSearchTerm] = useState('')
    const [currentPage, setCurrentPage] = useState(1)
    const productsPerPage = 6

    const filteredProducts = initialProducts.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase())
    )

    const totalPages = Math.ceil(filteredProducts.length / productsPerPage)
    const indexOfLastProduct = currentPage * productsPerPage
    const indexOfFirstProduct = indexOfLastProduct - productsPerPage
    const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct)

    return (
        <div className="space-y-8">
            {/* Filter Bar */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="relative group w-full max-w-md">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 group-focus-within:text-black transition-colors" />
                    <input
                        type="text"
                        placeholder="Rechercher dans votre catalogue..."
                        value={searchTerm}
                        onChange={(e) => {
                            setSearchTerm(e.target.value)
                            setCurrentPage(1)
                        }}
                        className="w-full pl-11 pr-4 py-4 bg-white border border-zinc-100 rounded-2xl focus:ring-2 focus:ring-black outline-none transition-all shadow-sm font-medium"
                    />
                </div>

                <div className="text-xs font-black uppercase tracking-[0.2em] text-zinc-400">
                    {filteredProducts.length} Produits au total
                </div>
            </div>

            {filteredProducts.length === 0 ? (
                <div className="bg-zinc-50 rounded-[3rem] border border-dashed border-zinc-200 py-32 text-center">
                    <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl border border-zinc-100">
                        <AlertCircle className="w-8 h-8 text-zinc-300" />
                    </div>
                    <h3 className="text-xl font-serif font-black italic text-zinc-400">Aucun produit trouvé</h3>
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
                                className="group bg-white rounded-[2.5rem] border border-zinc-100 shadow-sm overflow-hidden hover:shadow-2xl hover:shadow-black/5 transition-all duration-500 active:scale-[0.98] relative"
                            >
                                <div className="aspect-[5/4] relative bg-zinc-50 overflow-hidden">
                                    <ProductImageGallery imageUrls={product.imageUrls} name={product.name} />

                                    <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-all translate-y-2 group-hover:translate-y-0 z-10">
                                        <Link
                                            href={`/dashboard/products/${product.id}/edit`}
                                            className="p-3 bg-white/90 backdrop-blur shadow-sm rounded-xl text-zinc-950 hover:bg-black hover:text-white transition-all scale-90 hover:scale-100"
                                        >
                                            <Edit2 className="w-4 h-4" />
                                        </Link>
                                        <DeleteProductButton productId={product.id} />
                                    </div>

                                    <div className="absolute bottom-4 left-4 z-10">
                                        <div className="bg-black/80 backdrop-blur-md px-4 py-2 rounded-xl shadow-lg border border-white/10">
                                            <p className="font-black text-white text-xs tracking-wider">{product.price.toFixed(2)} DH</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="p-8 space-y-4">
                                    <div className="flex items-start justify-between gap-4">
                                        <div className="space-y-1">
                                            <h3 className="text-xl font-serif font-black text-zinc-950 group-hover:text-zinc-600 transition-colors line-clamp-1 italic">
                                                {product.name}
                                            </h3>
                                            <div className="flex items-center gap-2">
                                                {product.isActive ? (
                                                    product.stockQuantity > 0 ? (
                                                        <div className="flex items-center gap-1.5">
                                                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                                                            <p className="text-[10px] font-black uppercase tracking-widest text-emerald-600">En stock • {product.stockQuantity}</p>
                                                        </div>
                                                    ) : (
                                                        <div className="flex items-center gap-1.5">
                                                            <div className="w-1.5 h-1.5 rounded-full bg-amber-500"></div>
                                                            <p className="text-[10px] font-black uppercase tracking-widest text-amber-600">Indisponible</p>
                                                        </div>
                                                    )
                                                ) : (
                                                    <div className="flex items-center gap-1.5">
                                                        <div className="w-1.5 h-1.5 rounded-full bg-zinc-300"></div>
                                                        <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Masqué</p>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                        <button className="p-2 text-zinc-300 hover:text-black transition-colors rounded-xl hover:bg-zinc-50">
                                            <MoreVertical className="w-5 h-5" />
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            )}

            {/* Pagination Controls */}
            {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 pt-10">
                    <button
                        onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                        disabled={currentPage === 1}
                        className="px-6 py-3 bg-white border border-zinc-100 rounded-2xl text-xs font-black uppercase tracking-widest disabled:opacity-30 hover:bg-zinc-50 transition-colors"
                    >
                        Précédent
                    </button>

                    <div className="flex gap-2">
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                            <button
                                key={page}
                                onClick={() => setCurrentPage(page)}
                                className={`w-10 h-10 rounded-xl text-xs font-black flex items-center justify-center transition-all ${currentPage === page
                                        ? 'bg-black text-white shadow-lg shadow-black/10 scale-110'
                                        : 'bg-white border border-zinc-100 text-zinc-400 hover:text-black'
                                    }`}
                            >
                                {page}
                            </button>
                        ))}
                    </div>

                    <button
                        onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                        disabled={currentPage === totalPages}
                        className="px-6 py-3 bg-white border border-zinc-100 rounded-2xl text-xs font-black uppercase tracking-widest disabled:opacity-30 hover:bg-zinc-50 transition-colors"
                    >
                        Suivant
                    </button>
                </div>
            )}
        </div>
    )
}
