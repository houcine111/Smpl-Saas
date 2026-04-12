'use client'

import React, { useState, useRef, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { MoreVertical, Edit2, Trash2, ExternalLink } from 'lucide-react'
import { Link } from '@/i18n/routing'
import { DeleteConfirmModal } from './DeleteConfirmModal'
import { useAction } from '@/hooks/use-action'
import { deleteProductAction } from '@/app/[locale]/product-actions'
import { useRouter } from '@/i18n/routing'

interface ProductActionMenuProps {
    productId: string
    productName: string
}

export function ProductActionMenu({ productId, productName }: ProductActionMenuProps) {
    const [isOpen, setIsOpen] = useState(false)
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
    const buttonRef = useRef<HTMLButtonElement>(null)
    const menuRef = useRef<HTMLDivElement>(null)
    const router = useRouter()

    const { execute: deleteProduct, isLoading: isDeleting } = useAction(deleteProductAction, {
        onSuccess: () => {
            setIsDeleteModalOpen(false)
            setIsOpen(false)
            router.refresh()
        },
        successMessage: 'Produit supprimé !'
    })

    // Handle clicks outside to close
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node) &&
                buttonRef.current && !buttonRef.current.contains(event.target as Node)) {
                setIsOpen(false)
            }
        }
        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside)
        }
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [isOpen])

    const getMenuPosition = () => {
        if (typeof window === 'undefined' || !buttonRef.current) return { top: 0, left: 0 }
        const rect = buttonRef.current.getBoundingClientRect()
        return {
            top: rect.bottom + window.scrollY + 8,
            left: rect.right - 192 // 192px is w-48
        }
    }

    const pos = getMenuPosition()

    return (
        <>
            <button
                ref={buttonRef}
                onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    setIsOpen(!isOpen)
                }}
                className={`p-2 transition-all rounded-xl shadow-sm border border-border/50 ${isOpen 
                    ? 'bg-zinc-100 dark:bg-zinc-800 text-foreground' 
                    : 'bg-white dark:bg-zinc-900 text-muted-foreground hover:text-foreground hover:bg-zinc-50 dark:hover:bg-zinc-800 shadow-lg shadow-black/5'
                }`}
            >
                <MoreVertical className="w-5 h-5" />
            </button>

            {typeof window !== 'undefined' && createPortal(
                <AnimatePresence>
                    {isOpen && (
                        <motion.div
                            ref={menuRef}
                            initial={{ opacity: 0, scale: 0.95, y: -10 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: -10 }}
                            style={{
                                position: 'absolute',
                                top: pos.top,
                                left: pos.left,
                                width: '12rem',
                                zIndex: 100
                            }}
                            className="bg-white dark:bg-zinc-950 rounded-2xl border-2 border-zinc-100 dark:border-zinc-800 shadow-[0_20px_50px_rgba(0,0,0,0.15)] overflow-hidden"
                        >
                            <Link
                                href={`/dashboard/products/${productId}/edit`}
                                className="flex items-center gap-3 w-full px-5 py-4 text-[10px] font-black uppercase tracking-widest text-foreground hover:bg-zinc-50 dark:hover:bg-white/5 transition-colors border-b border-zinc-100 dark:border-zinc-900"
                                onClick={() => setIsOpen(false)}
                            >
                                <Edit2 className="w-3.5 h-3.5 text-muted-foreground" />
                                Modifier
                            </Link>
                            
                            <button
                                onClick={(e) => {
                                    e.preventDefault()
                                    e.stopPropagation()
                                    setIsDeleteModalOpen(true)
                                }}
                                className="flex items-center gap-3 w-full px-5 py-4 text-[10px] font-black uppercase tracking-widest text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
                            >
                                <Trash2 className="w-3.5 h-3.5" />
                                Supprimer
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>,
                document.body
            )}

            <DeleteConfirmModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={() => deleteProduct(productId)}
                isLoading={isDeleting}
                title="Supprimer le produit"
                description={`Êtes-vous sûr de vouloir supprimer "${productName}" ? Cette action est irréversible.`}
            />
        </>
    )
}
