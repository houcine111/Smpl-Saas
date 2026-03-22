'use client'

import { useState } from 'react'
import { Vendor } from '@/types/models'
import { motion, AnimatePresence } from 'framer-motion'
import { Users, Store, Calendar, Shield, Search, Edit3, X, Check, Save, Loader2 } from 'lucide-react'
import { updateVendorProfile } from '@/app/[locale]/admin-actions'

interface VendorTableProps {
    initialVendors: Vendor[]
    hideStats?: boolean
}

export default function VendorTable({ initialVendors, hideStats }: VendorTableProps) {
    const [searchTerm, setSearchTerm] = useState('')
    const [currentPage, setCurrentPage] = useState(1)
    const [editingVendor, setEditingVendor] = useState<Vendor | null>(null)
    const [isSaving, setIsSaving] = useState(false)
    const vendorsPerPage = 10

    const filteredVendors = initialVendors.filter(vendor =>
        (vendor.storeName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (vendor.slug || '').toLowerCase().includes(searchTerm.toLowerCase())
    )

    const totalPages = Math.ceil(filteredVendors.length / vendorsPerPage)
    const indexOfLastVendor = currentPage * vendorsPerPage
    const indexOfFirstVendor = indexOfLastVendor - vendorsPerPage
    const currentVendors = filteredVendors.slice(indexOfFirstVendor, indexOfLastVendor)

    const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        if (!editingVendor) return

        setIsSaving(true)
        const result = await updateVendorProfile(editingVendor.id, editingVendor)
        setIsSaving(false)

        if (result.success) {
            setEditingVendor(null)
            // Note: revalidation is handled server-side, but 
            // the client-side state in initialVendors might need a refresh 
            // if we were using a more complex state management.
            // For now, we rely on the page reload/revalidation.
            window.location.reload() 
        } else {
            alert(result.error)
        }
    }

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
                                <th className="px-8 py-6 text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em]">Statut</th>
                                <th className="px-8 py-6 text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em]">Rôle</th>
                                <th className="px-8 py-6 text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em]">Actions</th>
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
                                                <div className="flex flex-col">
                                                    <p className="font-serif font-black text-lg text-zinc-950">
                                                        {vendor.storeName || (vendor.isAdmin ? 'Administrateur' : 'Utilisateur')}
                                                    </p>
                                                    <p className="text-[10px] text-zinc-400 font-bold">
                                                        {new Date(vendor.createdAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })}
                                                    </p>
                                                </div>
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
                                            <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-lg text-[9px] font-black tracking-widest uppercase border ${vendor.isActive 
                                                ? 'bg-emerald-50 text-emerald-600 border-emerald-100' 
                                                : 'bg-red-50 text-red-600 border-red-100'
                                            }`}>
                                                <div className={`w-1.5 h-1.5 rounded-full ${vendor.isActive ? 'bg-emerald-500' : 'bg-red-500'}`} />
                                                {vendor.isActive ? 'Actif' : 'Inactif'}
                                            </span>
                                        </td>
                                        <td className="px-8 py-6">
                                            {vendor.isAdmin ? (
                                                <span className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-black text-white text-[9px] font-black tracking-widest uppercase shadow-xl shadow-black/10">
                                                    <Shield className="w-3 h-3 text-[#8FA998]" />
                                                    Admin
                                                </span>
                                            ) : (
                                                <div className="flex flex-col gap-2">
                                                    <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-[9px] font-black tracking-widest uppercase border shadow-sm w-fit ${vendor.storeName
                                                            ? 'bg-white text-zinc-400 border-zinc-100'
                                                            : 'bg-zinc-50 text-zinc-300 border-transparent'
                                                        }`}>
                                                        <Store className="w-3 h-3" />
                                                        {vendor.storeName ? 'Vendeur' : 'Nouvel Inscrit'}
                                                    </span>
                                                </div>
                                            )}
                                        </td>
                                        <td className="px-8 py-6">
                                            <button 
                                                onClick={() => setEditingVendor(vendor)}
                                                className="w-10 h-10 bg-zinc-50 rounded-xl flex items-center justify-center text-zinc-400 hover:bg-black hover:text-white transition-all duration-300 border border-zinc-100 hover:border-black"
                                            >
                                                <Edit3 className="w-4 h-4" />
                                            </button>
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

            {/* Edit Modal */}
            <AnimatePresence>
                {editingVendor && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setEditingVendor(null)}
                            className="absolute inset-0 bg-black/40 backdrop-blur-md"
                        />
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            className="relative w-full max-w-lg bg-white rounded-[2.5rem] shadow-2xl overflow-hidden border border-zinc-100"
                        >
                            <div className="p-8 sm:p-10">
                                <div className="flex items-center justify-between mb-8">
                                    <h3 className="text-2xl font-serif font-black italic tracking-tight">Modifier le Profil</h3>
                                    <button 
                                        onClick={() => setEditingVendor(null)}
                                        className="p-3 hover:bg-zinc-50 rounded-2xl transition-colors"
                                    >
                                        <X className="w-5 h-5 text-zinc-400" />
                                    </button>
                                </div>

                                <form onSubmit={handleUpdate} className="space-y-6">
                                    <div className="space-y-4">
                                        <div>
                                            <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-2 block">Nom de la Boutique</label>
                                            <input 
                                                type="text"
                                                value={editingVendor.storeName || ''}
                                                onChange={(e) => setEditingVendor({...editingVendor, storeName: e.target.value})}
                                                className="w-full px-6 py-4 bg-zinc-50 border border-zinc-100 rounded-2xl focus:ring-2 focus:ring-black outline-none transition-all font-bold text-zinc-900"
                                            />
                                        </div>
                                        <div>
                                            <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-2 block">Slug (URL)</label>
                                            <div className="relative">
                                                <span className="absolute left-6 top-1/2 -translate-y-1/2 text-zinc-400 font-bold">/</span>
                                                <input 
                                                    type="text"
                                                    value={editingVendor.slug || ''}
                                                    onChange={(e) => setEditingVendor({...editingVendor, slug: e.target.value})}
                                                    className="w-full pl-10 pr-6 py-4 bg-zinc-50 border border-zinc-100 rounded-2xl focus:ring-2 focus:ring-black outline-none transition-all font-bold text-zinc-900"
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-2 block">Numéro WhatsApp</label>
                                            <input 
                                                type="text"
                                                placeholder="+33..."
                                                value={editingVendor.whatsappNumber || ''}
                                                onChange={(e) => setEditingVendor({...editingVendor, whatsappNumber: e.target.value})}
                                                className="w-full px-6 py-4 bg-zinc-50 border border-zinc-100 rounded-2xl focus:ring-2 focus:ring-black outline-none transition-all font-bold text-zinc-900"
                                            />
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between p-6 bg-zinc-50 rounded-3xl border border-zinc-100">
                                        <div>
                                            <p className="font-bold text-sm text-zinc-900">Activation du Compte</p>
                                            <p className="text-[10px] text-zinc-400 font-medium">Boutique visible et accès dashboard</p>
                                        </div>
                                        <button 
                                            type="button"
                                            onClick={() => setEditingVendor({...editingVendor, isActive: !editingVendor.isActive})}
                                            className={`w-14 h-8 rounded-full relative transition-colors duration-500 ${editingVendor.isActive ? 'bg-black' : 'bg-zinc-200'}`}
                                        >
                                            <div className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-all duration-500 shadow-sm ${editingVendor.isActive ? 'left-7' : 'left-1'}`} />
                                        </button>
                                    </div>

                                    <div className="pt-4">
                                        <button 
                                            type="submit"
                                            disabled={isSaving}
                                            className="w-full py-5 bg-black text-white rounded-[1.5rem] font-black uppercase tracking-widest text-xs flex items-center justify-center gap-3 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl shadow-black/10 disabled:opacity-50 disabled:scale-100"
                                        >
                                            {isSaving ? (
                                                <Loader2 className="w-5 h-5 animate-spin" />
                                            ) : (
                                                <>
                                                    <Save className="w-4 h-4" />
                                                    Enregistrer les modifications
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    )
}
