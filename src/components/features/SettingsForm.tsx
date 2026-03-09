'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Vendor } from '@/types/models'
import { updateStoreSettings, updatePassword } from '@/app/[locale]/vendor-actions'
import { toast } from 'sonner'
import { User, Phone, Lock, Eye, EyeOff, Loader2, Save, MessageCircle, Store } from 'lucide-react'
import PhoneInput from 'react-phone-number-input'
import 'react-phone-number-input/style.css'

import { useAction } from '@/hooks/use-action'
import { useTranslations } from 'next-intl'
import { Button } from '@/components/ui/Button'

interface SettingsFormProps {
    vendor: Vendor
    isAdmin?: boolean
}

export default function SettingsForm({ vendor, isAdmin = false }: SettingsFormProps) {
    const router = useRouter()
    const t = useTranslations('Dashboard.settings')
    const [customerPhone, setCustomerPhone] = useState<string | undefined>(vendor.whatsappNumber ?? undefined)
    const [showPassword, setShowPassword] = useState(false)

    const profileAction = useAction(updateStoreSettings, {
        onSuccess: () => router.refresh(),
        successMessage: 'Succès : Paramètres mis à jour !'
    })

    const passwordAction = useAction(updatePassword, {
        onSuccess: () => {
            // Reset form could be handled via a ref if needed, or by resetting state
        },
        successMessage: 'Succès : Mot de passe mis à jour !'
    })

    const handleProfileUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        const formData = new FormData(e.currentTarget)
        formData.set('whatsapp_number', customerPhone || '')
        await profileAction.execute(formData)
    }

    const handlePasswordUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        const formData = new FormData(e.currentTarget)
        await passwordAction.execute(formData)
        e.currentTarget.reset()
    }

    return (
        <div className="space-y-12 max-w-2xl">
            {/* Section 1: Profil / Boutique */}
            <section className="space-y-6">
                <div className="flex items-center gap-3 border-b border-zinc-100 dark:border-zinc-800 pb-4">
                    <div className="w-10 h-10 bg-[#E3D5CA] dark:bg-[#E3D5CA]/10 rounded-xl flex items-center justify-center text-[#2D3436] dark:text-[#E3D5CA]">
                        {isAdmin ? <User className="w-5 h-5" /> : <Store className="w-5 h-5" />}
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-zinc-900 dark:text-white">
                            {isAdmin ? 'Mon Profil' : 'Infos Boutique'}
                        </h2>
                        <p className="text-sm text-zinc-500 font-medium">
                            {isAdmin ? 'Gérez vos informations personnelles' : "Gérez l'identité visuelle de votre storefront"}
                        </p>
                    </div>
                </div>

                <form onSubmit={handleProfileUpdate} className="space-y-6 bg-white dark:bg-zinc-900/50 p-8 rounded-[2rem] border border-zinc-100 dark:border-zinc-800 shadow-sm">
                    <div className="space-y-6">
                        {isAdmin ? (
                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase tracking-widest text-zinc-400 ml-1">
                                    Nom Complet / Pseudo
                                </label>
                                <div className="relative group">
                                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 group-focus-within:text-black dark:group-focus-within:text-white transition-colors" />
                                    <input
                                        required
                                        name="storeName"
                                        defaultValue={vendor.storeName || 'Admin'}
                                        placeholder="Votre nom"
                                        className="w-full pl-11 pr-4 py-3.5 bg-zinc-50 dark:bg-zinc-900 border-none rounded-xl focus:ring-2 focus:ring-black dark:focus:ring-white outline-none transition-all"
                                    />
                                </div>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold uppercase tracking-widest text-zinc-400 ml-1">
                                        Nom de la Boutique
                                    </label>
                                    <div className="relative group">
                                        <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 group-focus-within:text-black dark:group-focus-within:text-white transition-colors" />
                                        <input
                                            required
                                            name="storeName"
                                            defaultValue={vendor.storeName || ''}
                                            placeholder="Ma Super Boutique"
                                            className="w-full pl-11 pr-4 py-3.5 bg-zinc-50 dark:bg-zinc-900 border-none rounded-xl focus:ring-2 focus:ring-black dark:focus:ring-white outline-none transition-all"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-bold uppercase tracking-widest text-zinc-400 ml-1">
                                        URL de la Boutique (Slug)
                                    </label>
                                    <div className="relative group">
                                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 text-xs font-bold">@</span>
                                        <input
                                            name="slug"
                                            defaultValue={vendor.slug || ''}
                                            placeholder="laisser vide pour auto-générer"
                                            className="w-full pl-10 pr-4 py-3.5 bg-zinc-50 dark:bg-zinc-900 border-none rounded-xl focus:ring-2 focus:ring-black dark:focus:ring-white outline-none transition-all font-mono text-sm"
                                        />
                                    </div>
                                </div>
                            </div>
                        )}

                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase tracking-widest text-zinc-400 ml-1">
                                Numéro WhatsApp
                            </label>
                            <div className="relative group overflow-hidden bg-zinc-50 dark:bg-zinc-900 border-none rounded-xl focus-within:ring-2 focus-within:ring-black dark:focus-within:ring-white transition-all">
                                <style jsx global>{`
                                    .PhoneInput {
                                        padding-left: 1rem;
                                    }
                                    .PhoneInputInput {
                                        padding: 0.875rem 1rem;
                                        background: transparent;
                                        border: none;
                                        outline: none;
                                        width: 100%;
                                    }
                                `}</style>
                                <PhoneInput
                                    international
                                    defaultCountry="MA"
                                    value={customerPhone}
                                    onChange={setCustomerPhone}
                                    placeholder="06 12 34 56 78"
                                    className="w-full"
                                />
                            </div>
                        </div>
                    </div>

                    <Button
                        variant="secondary"
                        size="lg"
                        isLoading={profileAction.isLoading}
                        type="submit"
                        className="w-full"
                        leftIcon={<Save className="w-5 h-5" />}
                    >
                        {isAdmin ? 'Mettre à jour mon profil' : 'Sauvegarder les modifications'}
                    </Button>
                </form>
            </section>

            {/* Section 2: Sécurité */}
            <section className="space-y-6">
                <div className="flex items-center gap-3 border-b border-zinc-100 dark:border-zinc-800 pb-4">
                    <div className="w-10 h-10 bg-[#8FA998]/10 rounded-xl flex items-center justify-center text-[#8FA998]">
                        <Lock className="w-5 h-5" />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-zinc-900 dark:text-white">Sécurité</h2>
                        <p className="text-sm text-zinc-500 font-medium">Mettez à jour vos identifiants de connexion</p>
                    </div>
                </div>

                <form onSubmit={handlePasswordUpdate} className="space-y-6 bg-white dark:bg-zinc-900/50 p-8 rounded-[2rem] border border-zinc-100 dark:border-zinc-800 shadow-sm">
                    <div className="space-y-5">
                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase tracking-widest text-zinc-400 ml-1">
                                Nouveau mot de passe
                            </label>
                            <div className="relative group">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                                <input
                                    required
                                    name="password"
                                    type={showPassword ? "text" : "password"}
                                    placeholder="••••••••"
                                    className="w-full pl-11 pr-12 py-3.5 bg-zinc-50 dark:bg-zinc-900 border-none rounded-xl focus:ring-2 focus:ring-black dark:focus:ring-white outline-none transition-all"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-black dark:hover:text-white"
                                >
                                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase tracking-widest text-zinc-400 ml-1">
                                Confirmer le mot de passe
                            </label>
                            <input
                                required
                                name="confirmPassword"
                                type={showPassword ? "text" : "password"}
                                placeholder="••••••••"
                                className="w-full px-4 py-3.5 bg-zinc-50 dark:bg-zinc-900 border-none rounded-xl focus:ring-2 focus:ring-black dark:focus:ring-white outline-none transition-all"
                            />
                        </div>
                    </div>

                    <Button
                        variant="secondary"
                        size="lg"
                        isLoading={passwordAction.isLoading}
                        type="submit"
                        className="w-full"
                        leftIcon={<Lock className="w-5 h-5" />}
                    >
                        Modifier le mot de passe
                    </Button>
                </form>
            </section>
        </div>
    )
}
