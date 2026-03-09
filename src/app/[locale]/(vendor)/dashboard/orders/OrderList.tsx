'use client'

import { useState } from 'react'
import { Link } from '@/i18n/routing'
import { OrderWithDetails, OrderStatus } from '@/types/models'
import { useAction } from '@/hooks/use-action'
import { updateOrderStatus } from '@/app/[locale]/order-management-actions'
import { motion, AnimatePresence } from 'framer-motion'
import {
    Package,
    Calendar,
    User,
    MapPin,
    Phone,
    MessageCircle,
    ChevronRight,
    Clock,
    CheckCircle2,
    Truck,
    PackageCheck,
    XCircle,
    Loader2,
    Search
} from 'lucide-react'
import { toast } from 'sonner'
import { useTranslations } from 'next-intl'
import { Button } from '@/components/ui/Button'

interface OrderListProps {
    initialOrders: OrderWithDetails[]
}

export default function OrderList({ initialOrders }: OrderListProps) {
    const t = useTranslations('Dashboard.ordersList')
    const [orders, setOrders] = useState(initialOrders)
    const [searchTerm, setSearchTerm] = useState('')
    const [currentPage, setCurrentPage] = useState(1)
    const ordersPerPage = 8

    const statusConfig: Record<OrderStatus, { label: string, color: string, icon: any }> = {
        'PENDING': { label: t('statusLabels.PENDING'), color: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400', icon: Clock },
        'CONFIRMED': { label: t('statusLabels.CONFIRMED'), color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400', icon: CheckCircle2 },
        'SHIPPED': { label: t('statusLabels.SHIPPED'), color: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400', icon: Truck },
        'DELIVERED': { label: t('statusLabels.DELIVERED'), color: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400', icon: PackageCheck },
        'CANCELLED': { label: t('statusLabels.CANCELLED'), color: 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400', icon: XCircle },
    }

    const filteredOrders = orders.filter(order =>
        order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.customerCity.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.product?.name.toLowerCase().includes(searchTerm.toLowerCase())
    )

    const totalPages = Math.ceil(filteredOrders.length / ordersPerPage)
    const indexOfLastOrder = currentPage * ordersPerPage
    const indexOfFirstOrder = indexOfLastOrder - ordersPerPage
    const currentOrders = filteredOrders.slice(indexOfFirstOrder, indexOfLastOrder)

    const statusAction = useAction(
        async ({ id, status }: { id: string; status: OrderStatus }) => {
            const result = await updateOrderStatus(id, status)

            if (result?.error === 'AUTH_EXPIRED') {
                toast.error(t('session_expired')) // "Session expirée"
                setTimeout(() => window.location.href = '/login', 2000)
                return result
            }
            return result
        },
        {
            // Correction TS : un seul argument 'data'
            onSuccess: (data: any) => {
                if (data?.success && data.updatedId) {
                    setOrders(prev =>
                        prev.map(o => o.id === data.updatedId ? { ...o, status: data.updatedStatus } : o)
                    )
                }
            },
            successMessage: t('toast.updated')
        }
    )

    const handleStatusUpdate = async (orderId: string, newStatus: OrderStatus) => {
        await statusAction.execute({ id: orderId, status: newStatus })
    }

    return (
        <div className="space-y-8">
            {/* Filter Bar */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="relative group w-full max-w-md">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 group-focus-within:text-foreground transition-colors" />
                    <input
                        type="text"
                        placeholder={t('searchPlaceholder')}
                        value={searchTerm}
                        onChange={(e) => {
                            setSearchTerm(e.target.value)
                            setCurrentPage(1)
                        }}
                        className="w-full pl-11 pr-4 py-4 bg-background border border-border rounded-2xl focus:ring-2 focus:ring-accent outline-none transition-all shadow-sm font-black uppercase tracking-widest text-[10px] placeholder:text-zinc-400"
                    />
                </div>

                <div className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">
                    {t('totalCount', { count: filteredOrders.length })}
                </div>
            </div>

            {/* Orders List */}
            <div className="grid grid-cols-1 gap-6">
                <AnimatePresence mode="popLayout">
                    {currentOrders.length === 0 ? (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="bg-card/5 dark:bg-card/10 rounded-[3rem] border border-dashed border-border py-32 text-center"
                        >
                            <div className="w-20 h-20 bg-background rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl border border-border text-zinc-300">
                                <Package className="w-8 h-8" />
                            </div>
                            <h3 className="text-xl font-black tracking-tight text-zinc-400 uppercase italic">{t('noResults')}</h3>
                        </motion.div>
                    ) : (
                        currentOrders.map((order, idx) => (
                            <motion.div
                                key={order.id}
                                layout
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.05 }}
                                className="bg-card/5 dark:bg-card/10 backdrop-blur-sm rounded-[1.5rem] sm:rounded-[2.5rem] border border-border p-5 sm:p-8 shadow-sm hover:shadow-xl hover:shadow-foreground/5 transition-all group"
                            >
                                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 sm:gap-8">
                                    {/* Left: Product & Customer Info */}
                                    <div className="flex items-start sm:items-center gap-4 sm:gap-6 flex-1">
                                        <div className="w-16 h-16 sm:w-20 sm:h-20 bg-background rounded-xl sm:rounded-[1.5rem] overflow-hidden flex-shrink-0 border border-border group-hover:scale-105 transition-transform duration-500">
                                            {order.product?.imageUrls?.[0] ? (
                                                <img src={order.product.imageUrls[0]} alt="" className="w-full h-full object-cover" />
                                            ) : (
                                                <Package className="w-full h-full p-4 sm:p-6 text-zinc-400" />
                                            )}
                                        </div>
                                        <div className="space-y-1 sm:space-y-2 flex-1 min-w-0">
                                            <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
                                                <h3 className="text-lg sm:text-xl font-black tracking-tight text-foreground truncate">
                                                    {order.product?.name || 'Produit inconnu'}
                                                </h3>
                                                <span className="inline-flex w-fit text-[8px] sm:text-[10px] font-black uppercase tracking-widest px-2 sm:px-3 py-0.5 sm:py-1 bg-background border border-border rounded-full text-zinc-500">
                                                    {order.product?.price} DH
                                                </span>
                                            </div>
                                            <div className="flex flex-wrap items-center gap-x-4 sm:gap-x-6 gap-y-1 sm:gap-y-2 text-xs">
                                                <span className="flex items-center gap-1.5 sm:gap-2 font-black text-foreground uppercase tracking-widest text-[9px] sm:text-[10px]">
                                                    <User className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-zinc-400" />
                                                    {order.customerName}
                                                    <span className="ml-1 text-[8px] opacity-40 lowercase font-medium">
                                                        ({order.customerPhone.replace(/(\d{3})\d+(\d{2})/, '$1****$2')})
                                                    </span>
                                                </span>
                                                <span className="flex items-center gap-1.5 sm:gap-2 text-zinc-500 font-medium text-[11px] sm:text-sm">
                                                    <MapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-zinc-400" />
                                                    {order.customerCity}
                                                </span>
                                                <span className="flex items-center gap-1.5 text-[9px] text-zinc-400 font-black uppercase tracking-widest">
                                                    <Calendar className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                                                    {new Date(order.createdAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Right: Actions & Status */}
                                    <div className="flex flex-row sm:flex-wrap items-center gap-3 sm:gap-4 w-full lg:w-auto">
                                        <Link
                                            href={`https://wa.me/${order.customerPhone.replace('+', '')}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex-1 sm:flex-none"
                                        >
                                            <Button
                                                variant="secondary"
                                                size="sm"
                                                className="w-full"
                                                leftIcon={<MessageCircle className="w-4 h-4" />}
                                            >
                                                {t('whatsapp')}
                                            </Button>
                                        </Link>

                                        <div className="flex-1 sm:flex-none relative group/select">
                                            {statusAction.isLoading && (
                                                <div className="absolute inset-0 bg-background/50 backdrop-blur-[1px] z-10 rounded-2xl flex items-center justify-center">
                                                    <Loader2 className="w-3.5 h-3.5 animate-spin text-foreground" />
                                                </div>
                                            )}
                                            <div className={`flex items-center justify-between sm:justify-start gap-2 sm:gap-3 px-4 sm:px-6 py-3 rounded-xl sm:rounded-2xl text-[9px] sm:text-[10px] font-black uppercase tracking-widest ${statusConfig[order.status].color} border border-transparent shadow-sm group-hover/select:shadow-md transition-all`}>
                                                <div className="flex items-center gap-2">
                                                    {(() => {
                                                        const Icon = statusConfig[order.status].icon
                                                        return <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                                                    })()}
                                                    <select
                                                        value={order.status}
                                                        onChange={(e) => handleStatusUpdate(order.id, e.target.value as OrderStatus)}
                                                        className="bg-transparent border-none focus:ring-0 cursor-pointer appearance-none pr-1 outline-none text-current font-black"
                                                    >
                                                        {Object.entries(statusConfig).map(([val, { label }]) => (
                                                            <option key={val} value={val} className="text-foreground bg-background">
                                                                {label}
                                                            </option>
                                                        ))}
                                                    </select>
                                                </div>
                                                <ChevronRight className="w-3 h-3 opacity-50 rotate-90" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))
                    )}
                </AnimatePresence>
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
                <div className="flex items-center justify-center gap-4 pt-10">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                        disabled={currentPage === 1}
                    >
                        {t('prev')}
                    </Button>

                    <div className="flex gap-2">
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                            <Button
                                key={page}
                                variant={currentPage === page ? 'secondary' : 'ghost'}
                                size="sm"
                                onClick={() => setCurrentPage(page)}
                                className={`w-10 h-10 p-0 ${currentPage === page ? 'scale-110 shadow-lg px-0' : 'text-zinc-400 px-0'}`}
                            >
                                {page}
                            </Button>
                        ))}
                    </div>

                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                        disabled={currentPage === totalPages}
                    >
                        {t('next')}
                    </Button>
                </div>
            )}
        </div>
    )
}
