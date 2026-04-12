'use client'

import React from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { AlertTriangle, X } from 'lucide-react'
import { Button } from '@/components/ui/Button'

interface DeleteConfirmModalProps {
    isOpen: boolean
    onClose: () => void
    onConfirm: () => void
    title: string
    description: string
    isLoading?: boolean
}

export function DeleteConfirmModal({
    isOpen,
    onClose,
    onConfirm,
    title,
    description,
    isLoading
}: DeleteConfirmModalProps) {
    const [mounted, setMounted] = React.useState(false)

    React.useEffect(() => {
        setMounted(true)
        if (isOpen) {
            document.body.style.overflow = 'hidden'
        } else {
            document.body.style.overflow = 'unset'
        }
        return () => {
            document.body.style.overflow = 'unset'
        }
    }, [isOpen])

    if (!mounted) return null

    return createPortal(
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-zinc-950/60 backdrop-blur-sm"
                    />

                    {/* Modal Content */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="relative w-full max-w-md bg-card rounded-[2rem] shadow-2xl border border-border overflow-hidden"
                    >
                        <div className="p-8 space-y-6">
                            <div className="flex items-start justify-between">
                                <div className="w-12 h-12 rounded-2xl bg-red-50 dark:bg-red-500/10 flex items-center justify-center text-red-600 dark:text-red-400">
                                    <AlertTriangle className="w-6 h-6" />
                                </div>
                                <button
                                    onClick={onClose}
                                    className="p-2 text-muted-foreground hover:text-foreground transition-colors rounded-xl hover:bg-muted"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <div className="space-y-2">
                                <h3 className="text-xl font-black text-foreground tracking-tight">
                                    {title}
                                </h3>
                                <p className="text-sm text-muted-foreground font-medium leading-relaxed">
                                    {description}
                                </p>
                            </div>

                            <div className="flex flex-col sm:flex-row gap-3 pt-4">
                                <Button
                                    variant="secondary"
                                    onClick={onClose}
                                    className="flex-1"
                                    disabled={isLoading}
                                >
                                    Annuler
                                </Button>
                                <Button
                                    variant="primary"
                                    onClick={onConfirm}
                                    isLoading={isLoading}
                                    className="flex-1 bg-red-600 hover:bg-red-700 text-white border-transparent"
                                >
                                    Supprimer
                                </Button>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>,
        document.body
    )
}
