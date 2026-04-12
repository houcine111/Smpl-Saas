"use client"

import { useState, useEffect } from 'react'
import { ChevronLeft, ChevronRight, Package } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

export function ProductImageGallery({ imageUrls, name }: { imageUrls: string[], name: string }) {
    const [currentIndex, setCurrentIndex] = useState(0)
    const [isPaused, setIsPaused] = useState(false)

    // Auto-play logic
    useEffect(() => {
        if (!imageUrls || imageUrls.length <= 1 || isPaused) return

        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % imageUrls.length)
        }, 4000) // Slower, more elegant interval

        return () => clearInterval(interval)
    }, [imageUrls, isPaused])

    const next = () => {
        if (!imageUrls) return
        setCurrentIndex((prev) => (prev + 1) % imageUrls.length)
    }

    const prev = () => {
        if (!imageUrls) return
        setCurrentIndex((prev) => (prev - 1 + imageUrls.length) % imageUrls.length)
    }

    if (!imageUrls || imageUrls.length === 0) {
        return (
            <div className="w-full h-full flex items-center justify-center text-zinc-300 bg-zinc-50 dark:bg-zinc-900/50">
                <Package className="w-12 h-12" />
            </div>
        )
    }

    return (
        <div
            className="relative w-full h-full group/gallery overflow-hidden cursor-grab active:cursor-grabbing"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
        >
            {/* Smooth Motion Gallery */}
            <div className="w-full h-full flex">
                <AnimatePresence initial={false}>
                    <motion.div
                        key={currentIndex}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ 
                            type: "spring", 
                            stiffness: 300, 
                            damping: 30,
                            opacity: { duration: 0.4 }
                        }}
                        className="w-full h-full flex-shrink-0"
                    >
                        <img
                            src={imageUrls[currentIndex]}
                            alt={`${name} - ${currentIndex}`}
                            className="w-full h-full object-cover select-none"
                            draggable={false}
                        />
                    </motion.div>
                </AnimatePresence>
            </div>

            {/* Navigation Controls */}
            {imageUrls.length > 1 && (
                <>
                    <div className="absolute inset-y-0 left-0 flex items-center pl-4 opacity-0 group-hover/gallery:opacity-100 transition-opacity">
                        <button
                            onClick={(e) => { e.preventDefault(); e.stopPropagation(); prev(); }}
                            className="p-3 rounded-full bg-black/20 backdrop-blur-xl text-white border border-white/10 hover:bg-black/40 transition-all active:scale-90"
                        >
                            <ChevronLeft className="w-5 h-5" />
                        </button>
                    </div>
                    <div className="absolute inset-y-0 right-0 flex items-center pr-4 opacity-0 group-hover/gallery:opacity-100 transition-opacity">
                        <button
                            onClick={(e) => { e.preventDefault(); e.stopPropagation(); next(); }}
                            className="p-3 rounded-full bg-black/20 backdrop-blur-xl text-white border border-white/10 hover:bg-black/40 transition-all active:scale-90"
                        >
                            <ChevronRight className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Indicators */}
                    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-1.5 z-30">
                        {imageUrls.map((_, i) => (
                            <div 
                                key={i}
                                className={`h-1 rounded-full transition-all duration-500 ${
                                    i === currentIndex ? 'w-8 bg-white' : 'w-2 bg-white/40'
                                }`}
                            />
                        ))}
                    </div>

                    <div className="absolute top-4 right-4 z-30 pointer-events-none">
                        <div className="bg-black/40 backdrop-blur-xl px-3 py-1.5 rounded-xl border border-white/10 shadow-2xl">
                            <p className="text-[10px] font-black text-white tracking-[0.2em] uppercase">
                                {currentIndex + 1} / {imageUrls.length}
                            </p>
                        </div>
                    </div>
                </>
            )}
        </div>
    )
}