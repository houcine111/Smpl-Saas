"use client"

import { useRef, useState, useEffect } from 'react'
import { ChevronLeft, ChevronRight, Package } from 'lucide-react'

export function ProductImageGallery({ imageUrls, name }: { imageUrls: string[], name: string }) {
    const scrollRef = useRef<HTMLDivElement>(null)
    const [isPaused, setIsPaused] = useState(false)

    // Gestion du scroll automatique
    useEffect(() => {
        if (!imageUrls || imageUrls.length <= 1 || isPaused) return

        const interval = setInterval(() => {
            if (scrollRef.current) {
                const { scrollLeft, clientWidth, scrollWidth } = scrollRef.current

                // Si on est à la fin, on revient au début, sinon on avance
                const isAtEnd = scrollLeft + clientWidth >= scrollWidth - 10
                const scrollTo = isAtEnd ? 0 : scrollLeft + clientWidth

                scrollRef.current.scrollTo({
                    left: scrollTo,
                    behavior: 'smooth'
                })
            }
        }, 2000) // Intervalle de 2000ms

        return () => clearInterval(interval)
    }, [imageUrls, isPaused])

    const scroll = (direction: 'left' | 'right') => {
        if (scrollRef.current) {
            const { scrollLeft, clientWidth } = scrollRef.current
            const scrollTo = direction === 'left' ? scrollLeft - clientWidth : scrollLeft + clientWidth
            scrollRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' })
        }
    }

    if (!imageUrls || imageUrls.length === 0) {
        return (
            <div className="w-full h-full flex items-center justify-center text-zinc-300 bg-zinc-50">
                <Package className="w-12 h-12" />
            </div>
        )
    }

    return (
        <div
            className="relative w-full h-full group/gallery"
            onMouseEnter={() => setIsPaused(true)} // On met en pause au survol
            onMouseLeave={() => setIsPaused(false)} // On reprend quand la souris part
        >
            {/* Conteneur de scroll masqué */}
            <div
                ref={scrollRef}
                className="flex w-full h-full overflow-x-hidden snap-x snap-mandatory scrollbar-hide"
            >
                {imageUrls.map((url, index) => (
                    <div key={index} className="w-full h-full flex-shrink-0 snap-center">
                        <img
                            src={url}
                            alt={`${name} - ${index}`}
                            className="w-full h-full object-cover transition-transform duration-700"
                        />
                    </div>
                ))}
            </div>

            {/* Flèches (uniquement si > 1 image) */}
            {imageUrls.length > 1 && (
                <>
                    <button
                        onClick={(e) => { e.preventDefault(); scroll('left'); }}
                        className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/10 backdrop-blur-md text-white opacity-0 group-hover/gallery:opacity-100 transition-all hover:bg-white/30 z-30 border border-white/10"
                    >
                        <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button
                        onClick={(e) => { e.preventDefault(); scroll('right'); }}
                        className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/10 backdrop-blur-md text-white opacity-0 group-hover/gallery:opacity-100 transition-all hover:bg-white/30 z-30 border border-white/10"
                    >
                        <ChevronRight className="w-4 h-4" />
                    </button>

                    {/* Indicateur de pagination discret */}
                    <div className="absolute bottom-4 right-4 z-30 pointer-events-none">
                        <div className="bg-black/40 backdrop-blur-xl px-2.5 py-1 rounded-full border border-white/10">
                            <p className="text-[10px] font-black text-white tracking-widest uppercase">
                                {imageUrls.length} Photos
                            </p>
                        </div>
                    </div>
                </>
            )}
        </div>
    )
}