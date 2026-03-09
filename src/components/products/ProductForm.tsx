'use client'

import React, { useState } from 'react'
import { createProductAction, updateProductAction } from '@/app/[locale]/product-actions'
import { ImageUpload } from './ImageUpload'
import { Package, DollarSign, Type, Loader2, AlertCircle, Sparkles, Save } from 'lucide-react'
import { Product } from '@/types/models'
import { useAction } from '@/hooks/use-action'
import { useRouter } from '@/i18n/routing'
import { Button } from '@/components/ui/Button'

const initialState = {
    error: ''
}

interface ProductFormProps {
    initialData?: Product
}

export function ProductForm({ initialData }: ProductFormProps) {
    const [imageUrls, setImageUrls] = useState<string[]>(initialData?.imageUrls || [])
    const router = useRouter()

    const action = useAction(
        async (formData: FormData) => {
            if (initialData) {
                return updateProductAction(initialData.id, formData)
            }
            return createProductAction(formData)
        },
        {
            onSuccess: () => {
                router.push('/dashboard/products')
                router.refresh()
            },
            successMessage: initialData ? 'Produit mis à jour !' : 'Produit publié !'
        }
    )

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        const formData = new FormData(e.currentTarget)
        await action.execute(formData)
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-8 animate-in fade-in duration-700">

            {/* Hidden Input for Image URLs Array (JSON) */}
            <input type="hidden" name="image_urls" value={JSON.stringify(imageUrls)} />

            <div className="bg-white rounded-[2.5rem] border border-zinc-200 shadow-sm overflow-hidden border-b-8 border-b-zinc-950/5">
                <div className="p-10 border-b border-zinc-100 bg-zinc-50/30">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-zinc-950 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-zinc-200">
                            {initialData ? <Save className="w-6 h-6" /> : <Sparkles className="w-6 h-6" />}
                        </div>
                        <div>
                            <h2 className="text-xl font-black text-zinc-950">
                                {initialData ? 'Modifier le Produit' : 'Détails du Produit'}
                            </h2>
                            <p className="text-[10px] text-zinc-400 font-black uppercase tracking-widest">
                                {initialData ? 'Mise à jour des informations' : 'Étape indispensable'}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="p-10 space-y-10">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                        <div className="md:col-span-1 space-y-3">
                            <label className="text-sm font-black text-zinc-950 flex items-center gap-2 uppercase tracking-wide">
                                <Type className="w-4 h-4 text-zinc-400" />
                                Nom du Produit
                            </label>
                            <input
                                name="name"
                                type="text"
                                required
                                defaultValue={initialData?.name}
                                disabled={action.isLoading}
                                className="w-full px-6 py-5 rounded-2xl border border-zinc-200 focus:ring-4 focus:ring-zinc-950/5 focus:border-zinc-950 outline-none transition-all disabled:opacity-50 font-bold bg-zinc-50/50 hover:bg-white"
                                placeholder="ex: Collier Artisanat Tunisien"
                            />
                        </div>

                        <div className="space-y-3">
                            <label className="text-sm font-black text-zinc-950 flex items-center gap-2 uppercase tracking-wide">
                                <DollarSign className="w-4 h-4 text-zinc-400" />
                                Prix (TND)
                            </label>
                            <input
                                name="price"
                                type="number"
                                step="0.01"
                                required
                                defaultValue={initialData?.price}
                                disabled={action.isLoading}
                                className="w-full px-6 py-5 rounded-2xl border border-zinc-200 focus:ring-4 focus:ring-zinc-950/5 focus:border-zinc-950 outline-none transition-all disabled:opacity-50 font-black text-2xl bg-zinc-50/50 hover:bg-white"
                                placeholder="0.00"
                            />
                        </div>

                        <div className="space-y-3">
                            <label className="text-sm font-black text-zinc-950 flex items-center gap-2 uppercase tracking-wide">
                                <Package className="w-4 h-4 text-zinc-400" />
                                Quantité en Stock
                            </label>
                            <input
                                name="stock_quantity"
                                type="number"
                                required
                                defaultValue={initialData?.stockQuantity ?? 10}
                                disabled={action.isLoading}
                                className="w-full px-6 py-5 rounded-2xl border border-zinc-200 focus:ring-4 focus:ring-zinc-950/5 focus:border-zinc-950 outline-none transition-all disabled:opacity-50 font-black text-2xl bg-zinc-50/50 hover:bg-white"
                                placeholder="0"
                            />
                        </div>
                    </div>

                    <div className="space-y-4">
                        <label className="text-sm font-black text-zinc-950 flex items-center gap-2 uppercase tracking-wide">
                            Images de présentation (Maximum 5)
                        </label>
                        <ImageUpload value={imageUrls} onChange={setImageUrls} />
                    </div>

                    <div className="flex items-center gap-4 p-6 bg-zinc-50 rounded-[1.5rem] border border-zinc-100 transition-all hover:bg-zinc-100/50">
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input
                                type="checkbox"
                                name="is_active"
                                defaultChecked={initialData ? initialData.isActive : true}
                                className="sr-only peer"
                            />
                            <div className="w-14 h-8 bg-zinc-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[4px] after:start-[4px] after:bg-white after:border-zinc-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-zinc-950"></div>
                        </label>
                        <div>
                            <span className="text-sm font-black text-zinc-950 uppercase tracking-tight">Produit Visible</span>
                            <p className="text-[10px] text-zinc-400 font-bold">Désactivez pour masquer le produit de votre boutique publique.</p>
                        </div>
                    </div>
                </div>

                <div className="p-10 bg-zinc-50/30 border-t border-zinc-100 flex justify-end">
                    <Button
                        variant="secondary"
                        size="lg"
                        isLoading={action.isLoading}
                        type="submit"
                        className="px-12"
                        leftIcon={<Save className="w-6 h-6" />}
                    >
                        {initialData ? 'Mettre à jour le produit' : 'Publier le produit'}
                    </Button>
                </div>
            </div>
        </form>
    )
}
