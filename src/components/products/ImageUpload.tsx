'use client'

import React, { useState } from 'react'
import { Upload, X, Image as ImageIcon, Loader2 } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/Button'

interface ImageUploadProps {
    value: string[]
    onChange: (urls: string[]) => void
    maxImages?: number
}

export function ImageUpload({ value, onChange, maxImages = 5 }: ImageUploadProps) {
    const [isUploading, setIsUploading] = useState(false)
    const [urlInput, setUrlInput] = useState('')
    const [showUrlInput, setShowUrlInput] = useState(false)
    const supabase = createClient()

    const onUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files
        if (!files || files.length === 0) return

        const currentCount = value.length
        const remaining = maxImages - currentCount
        if (remaining <= 0) {
            alert(`Vous ne pouvez pas ajouter plus de ${maxImages} images.`)
            return
        }

        const filesToUpload = Array.from(files).slice(0, remaining)
        setIsUploading(true)

        try {
            const uploadPromises = filesToUpload.map(async (file) => {
                const { data: { user } } = await supabase.auth.getUser()
                if (!user) throw new Error('Non authentifié')

                const fileExt = file.name.split('.').pop()
                const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`
                const filePath = `${user.id}/${fileName}`

                const { error: uploadError } = await supabase.storage
                    .from('product-images')
                    .upload(filePath, file)

                if (uploadError) throw uploadError

                const { data: { publicUrl } } = supabase.storage
                    .from('product-images')
                    .getPublicUrl(filePath)

                return publicUrl
            })

            const newUrls = await Promise.all(uploadPromises)
            onChange([...value, ...newUrls])
        } catch (error: any) {
            console.error('Error uploading images:', error.message)
            alert('Erreur lors de l\'upload : ' + error.message)
        } finally {
            setIsUploading(false)
        }
    }

    const addByUrl = () => {
        if (!urlInput) return
        if (value.length >= maxImages) {
            alert(`Maximum ${maxImages} images.`)
            return
        }
        onChange([...value, urlInput])
        setUrlInput('')
        setShowUrlInput(false)
    }

    const removeImage = (urlToRemove: string) => {
        onChange(value.filter(url => url !== urlToRemove))
    }

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {value.map((url, index) => (
                    <div key={url} className="relative aspect-square rounded-2xl overflow-hidden border border-zinc-200 bg-zinc-50 group shadow-sm">
                        <img
                            src={url}
                            alt={`Produit ${index + 1}`}
                            className="w-full h-full object-cover transition-transform group-hover:scale-110"
                        />
                        <button
                            type="button"
                            onClick={() => removeImage(url)}
                            className="absolute top-2 right-2 p-1.5 bg-white/95 backdrop-blur-sm rounded-lg text-red-500 opacity-0 group-hover:opacity-100 transition-all shadow-sm hover:bg-red-50 border border-zinc-100"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                ))}

                {value.length < maxImages && (
                    <div className="space-y-2">
                        <label className={cn(
                            "relative aspect-square rounded-2xl border-2 border-dashed border-zinc-200 flex flex-col items-center justify-center gap-2 cursor-pointer hover:bg-zinc-50 hover:border-zinc-300 transition-all",
                            isUploading && "opacity-50 pointer-events-none"
                        )}>
                            {isUploading ? (
                                <Loader2 className="w-8 h-8 text-zinc-400 animate-spin" />
                            ) : (
                                <>
                                    <Upload className="w-8 h-8 text-zinc-400" />
                                    <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest text-center px-4">
                                        Upload ({value.length}/{maxImages})
                                    </span>
                                </>
                            )}
                            <input
                                type="file"
                                multiple
                                accept="image/*"
                                className="hidden"
                                onChange={onUpload}
                                disabled={isUploading}
                            />
                        </label>
                        <button
                            type="button"
                            onClick={() => setShowUrlInput(!showUrlInput)}
                            className="w-full text-[10px] font-bold text-zinc-400 uppercase tracking-tighter hover:text-zinc-600 transition-colors"
                        >
                            {showUrlInput ? 'Cacher URL' : 'Ajouter par URL'}
                        </button>
                    </div>
                )}
            </div>

            {showUrlInput && (
                <div className="flex gap-2 p-4 bg-zinc-50 rounded-2xl border border-zinc-200 animate-in slide-in-from-top-2 duration-300">
                    <input
                        type="url"
                        value={urlInput}
                        onChange={(e) => setUrlInput(e.target.value)}
                        placeholder="https://exemple.com/image.jpg"
                        className="flex-1 px-4 py-2 rounded-xl border border-zinc-200 focus:ring-2 focus:ring-zinc-900 outline-none text-sm font-medium"
                    />
                    <Button
                        type="button"
                        onClick={addByUrl}
                        variant="secondary"
                        size="sm"
                        className="rounded-xl px-6"
                    >
                        Ajouter
                    </Button>
                </div>
            )}

            <div className="p-4 bg-zinc-50/50 rounded-2xl border border-zinc-100 flex items-center gap-3">
                <ImageIcon className="w-5 h-5 text-zinc-400" />
                <p className="text-xs text-zinc-500 font-medium">
                    Importez vos photos ou collez des liens directs (Max 5).
                </p>
            </div>
        </div>
    )
}
