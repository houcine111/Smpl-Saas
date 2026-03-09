'use client'

import { useState } from 'react'
import { OrderWithDetails, OrderStatus } from '@/types/models'
import { motion, AnimatePresence } from 'framer-motion'
import {
    Package,
    Calendar,
    User,
    MapPin,
    Clock,
    CheckCircle2,
    Truck,
    PackageCheck,
    XCircle,
    Search,
    Store
} from 'lucide-react'
import { useTranslations } from 'next-intl'

interface AdminOrderListProps {
    initialOrders: OrderWithDetails[]
}

export default function AdminOrderList({ initialOrders }: AdminOrderListProps) {
    const t = useTranslations('Dashboard.ordersList')
    const [searchTerm, setSearchTerm] = useState('')
    const [currentPage, setCurrentPage] = useState(1)
    const ordersPerPage = 10

    const statusConfig: Record<OrderStatus, { label: string, color: string, icon: any }> = {
        'PENDING': { label: t('statusLabels.PENDING'), color: 'bg-amber-100 text-amber-700', icon: Clock },
        'CONFIRMED': { label: t('statusLabels.CONFIRMED'), color: 'bg-blue-100 text-blue-700', icon: CheckCircle2 },
        'SHIPPED': { label: t('statusLabels.SHIPPED'), color: 'bg-indigo-100 text-indigo-700', icon: Truck },
        'DELIVERED': { label: t('statusLabels.DELIVERED'), color: 'bg-emerald-100 text-emerald-700', icon: PackageCheck },
        'CANCELLED': { label: t('statusLabels.CANCELLED'), color: 'bg-rose-100 text-rose-700', icon: XCircle },
    }

    const filteredOrders = initialOrders.filter(order =>
        order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (order.vendor?.storeName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (order.product?.name || '').toLowerCase().includes(searchTerm.toLowerCase())
    )

    const totalPages = Math.ceil(filteredOrders.length / ordersPerPage)
    const currentOrders = filteredOrders.slice((currentPage - 1) * ordersPerPage, currentPage * ordersPerPage)

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="relative group w-full max-w-md">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 group-focus-within:text-black transition-colors" />
                    <input
                        type="text"
                        placeholder="Rechercher par client, boutique ou produit..."
                        value={searchTerm}
                        onChange={(e) => {
                            setSearchTerm(e.target.value)
                            setCurrentPage(1)
                        }}
                        className="w-full pl-11 pr-4 py-4 bg-white border border-zinc-100 rounded-2xl focus:ring-2 focus:ring-black outline-none transition-all shadow-sm font-medium"
                    />
                </div>
                <div className="text-[10px] font-black uppercase tracking-widest text-[#8FA998] bg-[#8FA998]/10 px-4 py-2 rounded-full">
                    {filteredOrders.length} commandes au total
                </div>
            </div>

            <div className="bg-white rounded-[2.5rem] border border-zinc-100 shadow-sm overflow-hidden border-b-8 border-b-black/5">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-zinc-50/30 border-b border-zinc-100">
                                <th className="px-8 py-6 text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em]">Boutique & Client</th>
                                <th className="px-8 py-6 text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em]">Produit</th>
                                <th className="px-8 py-6 text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em]">Statut</th>
                                <th className="px-8 py-6 text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em]">Date</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-50">
                            <AnimatePresence mode="popLayout">
                                {currentOrders.map((order, idx) => (
                                    <motion.tr
                                        key={order.id}
                                        initial={{ opacity: 0, y: 5 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: idx * 0.03 }}
                                        className="hover:bg-zinc-50/50 transition-colors group cursor-default"
                                    >
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 bg-[#FAF9F6] border border-zinc-100 rounded-xl flex items-center justify-center text-zinc-400 shrink-0">
                                                    <Store className="w-5 h-5" />
                                                </div>
                                                <div className="space-y-0.5">
                                                    <p className="font-bold text-zinc-950 text-sm">{order.vendor?.storeName || 'Administrateur'}</p>
                                                    <div className="flex items-center gap-1.5 text-[11px] text-zinc-400 font-medium">
                                                        <User className="w-3 h-3" />
                                                        <span>{order.customerName}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 bg-zinc-50 rounded-lg overflow-hidden border border-zinc-100 flex-shrink-0">
                                                    {order.product?.imageUrls?.[0] ? (
                                                        <img src={order.product.imageUrls[0]} alt="" className="w-full h-full object-cover" />
                                                    ) : (
                                                        <Package className="w-full h-full p-2 text-zinc-200" />
                                                    )}
                                                </div>
                                                <div>
                                                    <p className="font-bold text-sm text-zinc-900 line-clamp-1">{order.product?.name || 'Produit inconnu'}</p>
                                                    <p className="text-[10px] text-zinc-400 font-black tracking-widest">{order.product?.price} DH</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest ${statusConfig[order.status].color} border border-transparent`}>
                                                {(() => {
                                                    const Icon = statusConfig[order.status].icon
                                                    return <Icon className="w-3 h-3" />
                                                })()}
                                                {statusConfig[order.status].label}
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-2 text-[11px] text-zinc-400 font-bold whitespace-nowrap">
                                                <Calendar className="w-3.5 h-3.5 opacity-50" />
                                                {new Date(order.createdAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })}
                                            </div>
                                        </td>
                                    </motion.tr>
                                ))}
                            </AnimatePresence>
                        </tbody>
                    </table>
                </div>

                {filteredOrders.length === 0 && (
                    <div className="p-32 text-center space-y-6">
                        <div className="w-20 h-20 bg-[#FAF9F6] rounded-full flex items-center justify-center mx-auto shadow-inner border border-zinc-50">
                            <Package className="w-8 h-8 text-zinc-200" />
                        </div>
                        <h3 className="text-2xl font-serif font-black italic text-zinc-300 uppercase tracking-widest">Aucune commande</h3>
                    </div>
                )}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 pt-6">
                    <button
                        onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                        disabled={currentPage === 1}
                        className="px-6 py-3 bg-white border border-zinc-100 rounded-2xl text-xs font-black uppercase tracking-widest disabled:opacity-30 hover:bg-zinc-50 transition-colors shadow-sm"
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
                        className="px-6 py-3 bg-white border border-zinc-100 rounded-2xl text-xs font-black uppercase tracking-widest disabled:opacity-30 hover:bg-zinc-50 transition-colors shadow-sm"
                    >
                        Suivant
                    </button>
                </div>
            )}
        </div>
    )
}
