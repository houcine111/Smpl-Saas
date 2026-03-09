"use client"
import { NewProductForm } from '@/components/products/NewProductForm'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default function NewProductPage() {
    return (
        <div className="max-w-4xl mx-auto space-y-12">
            <header className="flex items-center justify-between">
                <div className="space-y-3">
                    <Link
                        href="/dashboard/products"
                        className="inline-flex items-center gap-2 text-zinc-400 hover:text-zinc-950 transition-colors text-xs font-black uppercase tracking-widest group bg-white px-4 py-2 rounded-xl border border-zinc-100 shadow-sm"
                    >
                        <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
                        Retour au catalogue
                    </Link>
                    <h1 className="text-5xl font-black tracking-tight text-zinc-950">Nouveau Produit</h1>
                    <p className="text-zinc-500 font-medium">Capturez l'essence de votre création et partagez-la avec le monde.</p>
                </div>
            </header>

            <NewProductForm />
        </div>
    )
}
