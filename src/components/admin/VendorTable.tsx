'use client'

import { useState } from 'react'
import { Vendor } from '@/types/models'
import { motion, AnimatePresence } from 'framer-motion'
import { Users, Store, Calendar, Shield, Search, ChevronRight } from 'lucide-react'

interface VendorTableProps {
    initialVendors: Vendor[]
    hideStats?: boolean
}

export default function VendorTable({ initialVendors, hideStats }: VendorTableProps) {
    const [searchTerm, setSearchTerm] = useState('')
    const [currentPage, setCurrentPage] = useState(1)
    const vendorsPerPage = 10

    const filteredVendors = initialVendors.filter(vendor =>
        (vendor.storeName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (vendor.slug || '').toLowerCase().includes(searchTerm.toLowerCase())
    )

    const totalPages = Math.ceil(filteredVendors.length / vendorsPerPage)
    const indexOfLastVendor = currentPage * vendorsPerPage
    const indexOfFirstVendor = indexOfLastVendor - vendorsPerPage
    const currentVendors = filteredVendors.slice(indexOfFirstVendor, indexOfLastVendor)

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="relative group w-full max-w-md">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 group-focus-within:text-black transition-colors" />
                    <input
                        type="text"
                        placeholder="Rechercher..."
                        value={searchTerm}
                        onChange={(e) => {
                            setSearchTerm(e.target.value)
                            setCurrentPage(1)
                        }}
                        className="w-full pl-11 pr-4 py-4 bg-white border border-zinc-100 rounded-2xl focus:ring-2 focus:ring-black outline-none transition-all shadow-sm font-medium"
                    />
                </div>

                <div className="flex items-center gap-3 bg-[#FAF9F6] px-6 py-3 rounded-2xl border border-zinc-100 shadow-sm">
                    <Users className="w-4 h-4 text-[#8FA998]" />
                    <span className="text-xs font-black uppercase tracking-widest text-zinc-600">{filteredVendors.length} membres</span>
                </div>
            </div>

            <div className="bg-white rounded-[2.5rem] border border-zinc-100 shadow-sm overflow-hidden border-b-8 border-b-black/5">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-zinc-50/30 border-b border-zinc-100">
                                <th className="px-8 py-6 text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em]">Membre</th>
                                <th className="px-8 py-6 text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em]">Identifiant</th>
                                <th className="px-8 py-6 text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em]">Rôle / Statut</th>
                                <th className="px-8 py-6 text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em]">Inscription</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-50">
                            <AnimatePresence mode="popLayout">
                                {currentVendors.map((vendor, idx) => (
                                    <motion.tr
                                        key={vendor.id}
                                        initial={{ opacity: 0, y: 5 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, scale: 0.95 }}
                                        transition={{ delay: idx * 0.03 }}
                                        className="hover:bg-zinc-50/50 transition-colors group cursor-default"
                                    >
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 bg-black rounded-2xl flex items-center justify-center text-white font-serif italic text-xl shrink-0 shadow-lg group-hover:scale-110 transition-transform duration-500">
                                                    {(vendor.storeName || (vendor.isAdmin ? 'A' : 'V')).substring(0, 1)}
                                                </div>
                                                <p className="font-serif font-black text-lg text-zinc-950">
                                                    {vendor.storeName || (vendor.isAdmin ? 'Administrateur' : 'Utilisateur')}
                                                </p>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-2">
                                                <span className="text-[9px] text-[#8FA998] font-black uppercase tracking-widest bg-[#8FA998]/10 px-2 py-1 rounded-md">
                                                    {vendor.isAdmin ? 'Accès' : 'Slug'}
                                                </span>
                                                <p className="text-sm text-zinc-500 font-medium">
                                                    {vendor.isAdmin ? 'Admin Panel' : `/${vendor.slug || 'non-fini'}`}
                                                </p>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            {vendor.isAdmin ? (
                                                <span className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-black text-white text-[9px] font-black tracking-widest uppercase shadow-xl shadow-black/10">
                                                    <Shield className="w-3 h-3 text-[#8FA998]" />
                                                    Administrateur
                                                </span>
                                            ) : (
                                                <div className="flex flex-col gap-2">
                                                    <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-[9px] font-black tracking-widest uppercase border shadow-sm w-fit ${vendor.storeName
                                                            ? 'bg-white text-zinc-400 border-zinc-100'
                                                            : 'bg-zinc-50 text-zinc-300 border-transparent'
                                                        }`}>
                                                        <Store className="w-3 h-3" />
                                                        {vendor.storeName ? 'Boutique Active' : 'Sans Boutique'}
                                                    </span>
                                                    {!hideStats && ((vendor as any).orderCount || 0) > 5 && (
                                                        <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-lg bg-emerald-50 text-emerald-600 text-[8px] font-black tracking-widest uppercase border border-emerald-100 w-fit">
                                                            Top Vendeur
                                                        </span>
                                                    )}
                                                </div>
                                            )}
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex flex-col gap-1">
                                                <div className="flex items-center gap-2 text-xs text-zinc-400 font-bold">
                                                    <Calendar className="w-4 h-4 opacity-50" />
                                                    {new Date(vendor.createdAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })}
                                                </div>
                                                {!hideStats && !(vendor.isAdmin) && (
                                                    <p className="text-[10px] font-black text-[#8FA998] uppercase tracking-widest">
                                                        {(vendor as any).orderCount || 0} commandes
                                                    </p>
                                                )}
                                            </div>
                                        </td>
                                    </motion.tr>
                                ))}
                            </AnimatePresence>
                        </tbody>
                    </table>
                </div>

                {filteredVendors.length === 0 && (
                    <div className="p-32 text-center space-y-6">
                        <div className="w-20 h-20 bg-[#FAF9F6] rounded-full flex items-center justify-center mx-auto shadow-inner border border-zinc-50">
                            <Users className="w-8 h-8 text-zinc-200" />
                        </div>
                        <h3 className="text-2xl font-serif font-black italic text-zinc-300">Aucun membre trouvé</h3>
                    </div>
                )}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 pt-6">
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
