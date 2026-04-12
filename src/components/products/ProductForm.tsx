'use client'

import React, { useState, useEffect } from 'react'
import { createProductAction, updateProductAction } from '@/app/[locale]/product-actions'
import { getCategoriesAction } from '@/app/[locale]/category-actions'
import { ImageUpload } from './ImageUpload'
import { Package, DollarSign, Type, Loader2, AlertCircle, Sparkles, Save, AlignLeft, Tag } from 'lucide-react'
import { Product, Category } from '@/types/models'
import { useAction } from '@/hooks/use-action'
import { useRouter } from '@/i18n/routing'
import { Button } from '@/components/ui/Button'
import { CURRENCIES } from '@/lib/constants'

const initialState = {
    error: ''
}

interface ProductFormProps {
    initialData?: Product
}

export function ProductForm({ initialData }: ProductFormProps) {
    const [imageUrls, setImageUrls] = useState<string[]>(initialData?.imageUrls || [])
    const [categories, setCategories] = useState<Category[]>([])
    const router = useRouter()

    const [currency, setCurrency] = useState<string>(initialData?.currency || 'MAD')

    useEffect(() => {
        const fetchCategories = async () => {
            const result = await getCategoriesAction()
            if (result.success && result.data) {
                setCategories(result.data)
            }
        }
        fetchCategories()

        // Auto-detect currency for NEW products only
        if (!initialData) {
            try {
                const locale = navigator.language.toLowerCase();
                if (locale.includes('ma') || locale.includes('ar')) {
                    setCurrency('MAD');
                } else if (['fr', 'de', 'it', 'es', 'be', 'nl'].some(l => locale.includes(l))) {
                    setCurrency('EUR');
                } else if (locale.includes('en-us')) {
                    setCurrency('USD');
                }
            } catch (e) {
                console.error("Currency detection failed", e);
            }
        }
    }, [initialData])

    const { execute, isLoading, validationErrors } = useAction(
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
        await execute(formData)
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-8 animate-in fade-in duration-700">

            {/* Hidden Input for Image URLs Array (JSON) */}
            <input type="hidden" name="image_urls" value={JSON.stringify(imageUrls)} />

            <div className="mx-auto w-full max-w-4xl bg-card rounded-[2.5rem] border border-border shadow-sm overflow-hidden border-b-8 border-b-zinc-950/5 dark:border-b-white/5">
                <div className="p-6 sm:p-10 border-b border-border bg-zinc-50/30 dark:bg-zinc-900/30">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-foreground rounded-2xl flex items-center justify-center text-background shadow-xl shadow-zinc-200 dark:shadow-none">
                            {initialData ? <Save className="w-6 h-6" /> : <Sparkles className="w-6 h-6" />}
                        </div>
                        <div>
                            <h2 className="text-xl font-black text-foreground">
                                {initialData ? 'Modifier le Produit' : 'Détails du Produit'}
                            </h2>
                            <p className="text-[10px] text-muted-foreground font-black uppercase tracking-widest">
                                {initialData ? 'Mise à jour des informations' : 'Étape indispensable'}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="p-6 sm:p-10 space-y-10">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6 sm:gap-10">
                        <div className="lg:col-span-4 space-y-3">
                            <label className="text-sm font-black text-foreground flex items-center gap-2 uppercase tracking-wide">
                                <Type className="w-4 h-4 text-muted-foreground" />
                                Nom du Produit
                            </label>
                            <input
                                name="name"
                                type="text"
                                required
                                defaultValue={initialData?.name}
                                disabled={isLoading}
                                className={`w-full px-6 py-5 rounded-2xl border ${validationErrors.name ? 'border-red-500 bg-red-50/10' : 'border-border'} focus:ring-4 focus:ring-zinc-950/5 focus:border-foreground outline-none transition-all disabled:opacity-50 font-bold bg-zinc-50/50 hover:bg-card dark:bg-zinc-900/50`}
                                placeholder="ex: Collier Artisanat Tunisien"
                            />
                            {validationErrors.name && (
                                <p className="text-[10px] text-red-500 font-bold px-2 flex items-center gap-1">
                                    <AlertCircle className="w-3 h-3" /> {validationErrors.name[0]}
                                </p>
                            )}
                        </div>

                        <div className="lg:col-span-2 space-y-3">
                            <label className="text-sm font-black text-foreground flex items-center gap-2 uppercase tracking-wide">
                                <DollarSign className="w-4 h-4 text-muted-foreground" />
                                Prix & Devise
                            </label>
                            <div className="flex items-center gap-2">
                                <div className="relative flex-1 min-w-0">
                                    <input
                                        name="price"
                                        type="number"
                                        step="0.01"
                                        required
                                        defaultValue={initialData?.price}
                                        disabled={isLoading}
                                        className={`w-full px-4 sm:px-6 py-5 rounded-2xl border ${validationErrors.price ? 'border-red-500 bg-red-50/10' : 'border-border'} focus:ring-4 focus:ring-zinc-950/5 focus:border-foreground outline-none transition-all disabled:opacity-50 font-black text-xl sm:text-2xl bg-zinc-50/50 hover:bg-card dark:bg-zinc-900/50`}
                                        placeholder="0.00"
                                    />
                                </div>
                                <select
                                    name="currency"
                                    value={currency}
                                    onChange={(e) => setCurrency(e.target.value)}
                                    disabled={isLoading}
                                    className="w-24 sm:w-28 px-3 sm:px-4 py-5 rounded-2xl border border-border focus:ring-4 focus:ring-zinc-950/5 focus:border-foreground outline-none transition-all disabled:opacity-50 font-bold bg-zinc-50/50 hover:bg-card dark:bg-zinc-900/50"
                                >
                                    {CURRENCIES.map((c) => (
                                        <option key={c.code} value={c.code}>
                                            {c.symbol}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            {validationErrors.price && (
                                <p className="text-[10px] text-red-500 font-bold px-2 flex items-center gap-1">
                                    <AlertCircle className="w-3 h-3" /> {validationErrors.price[0]}
                                </p>
                            )}
                        </div>

                        <div className="lg:col-span-3 space-y-3">
                            <label className="text-sm font-black text-foreground flex items-center gap-2 uppercase tracking-wide">
                                <Tag className="w-4 h-4 text-muted-foreground" />
                                Catégorie
                            </label>
                            <select
                                name="category_id"
                                defaultValue={initialData?.categoryId || ''}
                                disabled={isLoading}
                                className="w-full px-6 py-5 rounded-2xl border border-border focus:ring-4 focus:ring-zinc-950/5 focus:border-foreground outline-none transition-all disabled:opacity-50 font-bold bg-zinc-50/50 hover:bg-card dark:bg-zinc-900/50"
                            >
                                <option value="">Choisir une catégorie</option>
                                {categories.map((cat) => (
                                    <option key={cat.id} value={cat.id}>
                                        {cat.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="lg:col-span-3 space-y-3">
                            <label className="text-sm font-black text-foreground flex items-center gap-2 uppercase tracking-wide">
                                <Package className="w-4 h-4 text-muted-foreground" />
                                Quantité en Stock
                            </label>
                            <input
                                name="stock_quantity"
                                type="number"
                                required
                                defaultValue={initialData?.stockQuantity ?? 10}
                                disabled={isLoading}
                                className={`w-full px-6 py-5 rounded-2xl border ${validationErrors.stockQuantity ? 'border-red-500 bg-red-50/10' : 'border-border'} focus:ring-4 focus:ring-zinc-950/5 focus:border-foreground outline-none transition-all disabled:opacity-50 font-black text-2xl bg-zinc-50/50 hover:bg-card dark:bg-zinc-900/50`}
                                placeholder="0"
                            />
                            {validationErrors.stockQuantity && (
                                <p className="text-[10px] text-red-500 font-bold px-2 flex items-center gap-1">
                                    <AlertCircle className="w-3 h-3" /> {validationErrors.stockQuantity[0]}
                                </p>
                            )}
                        </div>
                    </div>

                    <div className="space-y-3">
                        <label className="text-sm font-black text-foreground flex items-center gap-2 uppercase tracking-wide">
                            <AlignLeft className="w-4 h-4 text-accent" />
                            Description du Produit
                        </label>
                        <textarea
                            name="description"
                            defaultValue={initialData?.description || ''}
                            disabled={isLoading}
                            rows={6}
                            className={`w-full px-6 py-5 rounded-[2rem] border ${validationErrors.description ? 'border-red-500 bg-red-50/10' : 'border-border'} focus:ring-4 focus:ring-accent/10 focus:border-accent outline-none transition-all disabled:opacity-50 font-medium bg-zinc-50/50 hover:bg-zinc-100/50 dark:bg-zinc-900/50 dark:hover:bg-zinc-900/80 resize-none`}
                            placeholder="Décrivez les détails, la matière, ou l'histoire derrière ce produit..."
                        />
                        {validationErrors.description && (
                            <p className="text-[10px] text-red-500 font-bold px-2 flex items-center gap-1">
                                <AlertCircle className="w-3 h-3" /> {validationErrors.description[0]}
                            </p>
                        )}
                    </div>

                    <div className="space-y-4">
                        <label className="text-sm font-black text-foreground flex items-center gap-2 uppercase tracking-wide">
                            Images de présentation (Maximum 5)
                        </label>
                        <ImageUpload value={imageUrls} onChange={setImageUrls} />
                        {validationErrors.imageUrls && (
                            <p className="text-[10px] text-red-500 font-bold px-2 flex items-center gap-1">
                                <AlertCircle className="w-3 h-3" /> {validationErrors.imageUrls[0]}
                            </p>
                        )}
                    </div>

                    <div className="flex items-center gap-4 p-6 bg-zinc-50 dark:bg-zinc-900/50 rounded-[1.5rem] border border-border transition-all hover:bg-zinc-100/50">
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input
                                type="checkbox"
                                name="is_active"
                                defaultChecked={initialData ? initialData.isActive : true}
                                className="sr-only peer"
                            />
                            <div className="w-14 h-8 bg-zinc-200 dark:bg-zinc-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[4px] after:start-[4px] after:bg-white after:border-zinc-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-foreground"></div>
                        </label>
                        <div>
                            <span className="text-sm font-black text-foreground uppercase tracking-tight">Produit Visible</span>
                            <p className="text-[10px] text-muted-foreground font-bold">Désactivez pour masquer le produit de votre boutique publique.</p>
                        </div>
                    </div>
                </div>

                <div className="p-10 bg-zinc-50/30 dark:bg-zinc-900/30 border-t border-border flex justify-end">
                    <Button
                        variant="secondary"
                        size="lg"
                        isLoading={isLoading}
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
