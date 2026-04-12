'use client'

import { useState } from 'react'
import { Drawer } from 'vaul'
import { motion, AnimatePresence } from 'framer-motion'
import { Vendor, Product } from '@/types/models'
import { X, Send, User, Phone, MapPin, ShoppingBag, Loader2, MessageCircle, Check } from 'lucide-react'
import { createOrder } from '../../order-actions'
import PhoneInput from 'react-phone-number-input'
import 'react-phone-number-input/style.css'
import { useTranslations } from 'next-intl'

interface OrderDrawerProps {
    isOpen: boolean
    onOpenChange: (open: boolean) => void
    cart: { [productId: string]: number }
    products: Product[]
    vendor: Vendor
}

export default function OrderDrawer({ isOpen, onOpenChange, cart, products, vendor }: OrderDrawerProps) {
    const t = useTranslations('Storefront')
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [isSubmitted, setIsSubmitted] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [customerPhone, setCustomerPhone] = useState<string | undefined>()
    const [whatsappUrl, setWhatsappUrl] = useState<string>('')

    const selectedProducts = products.filter(p => cart[p.id] > 0)
    const totalPrice = selectedProducts.reduce((sum, p) => sum + p.price * cart[p.id], 0)

    const handleCheckout = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setIsSubmitting(true)
        setError(null)

        const formData = new FormData(e.currentTarget)
        const customerName = formData.get('customerName') as string
        const customerCity = formData.get('customerCity') as string
        const website = formData.get('website') as string // Honeypot

        if (!customerPhone) {
            setError("Numéro de téléphone requis")
            setIsSubmitting(false)
            return
        }

        try {
            // 1. Capture order in database
            // Note: Currently the schema only supports one product per order row.
            // We will create multiple order entries for now to maintain history.
            for (const product of selectedProducts) {
                const qty = cart[product.id]
                for (let i = 0; i < qty; i++) {
                    await createOrder({
                        productId: product.id,
                        vendorId: vendor.id,
                        customerName,
                        customerPhone,
                        customerCity,
                        website, // Pass honeypot
                    })
                }
            }

            // 2. Generate WhatsApp message
            const itemsList = selectedProducts
                .map(p => `- *${p.name}* (x${cart[p.id]})`)
                .join('\n')

            const message = encodeURIComponent(
                t('whatsappMessage', {
                    store: vendor.storeName || '',
                    items: itemsList,
                    total: totalPrice,
                    currency: t('currency'),
                    name: customerName,
                    city: customerCity,
                    phone: customerPhone
                })
            )

            // 3. Prepare WhatsApp URL and set submitted state
            const cleanPhone = vendor.whatsappNumber?.replace(/\D/g, '') || ''
            setWhatsappUrl(`https://wa.me/${cleanPhone}?text=${message}`)
            setIsSubmitted(true)
        } catch (err: any) {
            setError(err.message || "Une erreur est survenue")
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <Drawer.Root open={isOpen} onOpenChange={onOpenChange} shouldScaleBackground>
            <Drawer.Portal>
                <Drawer.Overlay className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50" />
                <Drawer.Content className="fixed bottom-0 left-0 right-0 max-h-[92vh] outline-none z-50 flex flex-col">
                    <style jsx global>{`
                        .PhoneInput {
                            display: flex;
                            align-items: center;
                            width: 100%;
                        }
                        .PhoneInputInput {
                            flex: 1;
                            min-width: 0;
                            padding-left: 1rem;
                            padding-right: 1rem;
                            padding-top: 0.875rem;
                            padding-bottom: 0.875rem;
                            background-color: transparent;
                            border: none;
                            outline: none;
                            color: inherit;
                            font-size: 1rem;
                        }
                        .PhoneInputCountry {
                            display: flex;
                            align-items: center;
                            padding-left: 1rem;
                        }
                    `}</style>
                    <div className="bg-[#FDFCF8] dark:bg-[#0a0a0a] rounded-t-[3rem] px-6 pb-12 pt-4 flex-1 overflow-y-auto">
                        <div className="mx-auto w-12 h-1.5 flex-shrink-0 rounded-full bg-zinc-200 dark:bg-zinc-800 mb-8" />

                        <div className="max-w-md mx-auto">
                            <Drawer.Title className="text-2xl font-bold text-zinc-900 dark:text-white mb-2">
                                {t('drawerTitle')}
                            </Drawer.Title>
                            <Drawer.Description className="text-zinc-500 dark:text-zinc-400 mb-8">
                                {t('drawerDesc')}
                            </Drawer.Description>

                            {/* Summary */}
                            <div className="bg-zinc-50 dark:bg-zinc-900/50 rounded-2xl p-6 mb-8 border border-zinc-100 dark:border-zinc-800">
                                <div className="space-y-4 mb-6">
                                    {selectedProducts.map(product => (
                                        <div key={product.id} className="flex justify-between items-center">
                                            <div className="flex items-center gap-3">
                                                <span className="w-6 h-6 bg-black dark:bg-white text-white dark:text-black text-[10px] font-bold rounded-lg flex items-center justify-center">
                                                    {cart[product.id]}
                                                </span>
                                                <span className="text-sm font-medium">{product.name}</span>
                                            </div>
                                            <span className="text-sm font-bold">{(product.price * cart[product.id]).toLocaleString()} DH</span>
                                        </div>
                                    ))}
                                </div>
                                <div className="h-px bg-zinc-200 dark:bg-zinc-800 mb-4" />
                                <div className="flex justify-between items-center">
                                    <span className="text-sm font-medium text-zinc-500">{t('totalToPay')}</span>
                                    <span className="text-xl font-black">{totalPrice.toLocaleString()} {t('currency')}</span>
                                </div>
                            </div>                            <AnimatePresence mode="wait">
                                {!isSubmitted ? (
                                    <motion.form 
                                        key="order-form"
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -20 }}
                                        onSubmit={handleCheckout} 
                                        className="space-y-5"
                                    >
                                        <div className="grid grid-cols-1 gap-5">
                                            <div className="space-y-2">
                                                <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">
                                                    {t('fullName')}
                                                </label>
                                                <div className="relative group">
                                                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-foreground transition-colors" />
                                                    <input
                                                        required
                                                        name="customerName"
                                                        placeholder="Mohammed Alami"
                                                        className="w-full pl-11 pr-4 py-3.5 bg-muted/50 border border-border rounded-xl focus:ring-2 focus:ring-foreground outline-none transition-all"
                                                    />
                                                </div>
                                            </div>

                                            <div className="space-y-2">
                                                <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">
                                                    {t('phone')}
                                                </label>
                                                <div className="relative group overflow-hidden bg-muted/50 border border-border rounded-xl focus-within:ring-2 focus-within:ring-foreground transition-all">
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

                                            <div className="space-y-2">
                                                <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">
                                                    {t('city')}
                                                </label>
                                                <div className="relative group">
                                                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-foreground transition-colors" />
                                                    <input
                                                        required
                                                        name="customerCity"
                                                        placeholder="Casablanca"
                                                        className="w-full pl-11 pr-4 py-3.5 bg-muted/50 border border-border rounded-xl focus:ring-2 focus:ring-foreground outline-none transition-all"
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        {error && (
                                            <p className="text-sm text-destructive bg-destructive/10 px-4 py-3 rounded-xl border border-destructive/20 transition-all">
                                                {error}
                                            </p>
                                        )}

                                        <button
                                            disabled={isSubmitting}
                                            type="submit"
                                            className="w-full py-4 bg-[#25D366] text-white rounded-2xl font-bold flex items-center justify-center gap-3 hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-50 shadow-xl shadow-[#25D366]/20 mt-4"
                                        >
                                            {isSubmitting ? (
                                                <Loader2 className="w-5 h-5 animate-spin" />
                                            ) : (
                                                <>
                                                    <Check className="w-5 h-5" />
                                                    Confirmer la commande
                                                </>
                                            )}
                                        </button>
                                    </motion.form>
                                ) : (
                                    <motion.div 
                                        key="success-view"
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        className="text-center py-10 space-y-8"
                                    >
                                        <div className="w-20 h-20 bg-emerald-500/10 text-emerald-500 rounded-full flex items-center justify-center mx-auto border-4 border-emerald-500/20">
                                            <Check className="w-10 h-10 stroke-[3]" />
                                        </div>
                                        <div className="space-y-3">
                                            <h3 className="text-3xl font-serif font-black italic text-foreground">Commande Prête !</h3>
                                            <p className="text-muted-foreground font-medium">Votre commande a été enregistrée. Cliquez ci-dessous pour l'envoyer directement via WhatsApp.</p>
                                        </div>
                                        <a
                                            href={whatsappUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex w-full py-5 bg-[#25D366] text-white rounded-[2rem] font-black uppercase tracking-[0.2em] text-xs items-center justify-center gap-4 hover:scale-105 transition-all shadow-2xl shadow-[#25D366]/30"
                                        >
                                            <MessageCircle className="w-6 h-6" />
                                            Envoyer sur WhatsApp
                                        </a>
                                        <button 
                                            onClick={() => onOpenChange(false)}
                                            className="text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors"
                                        >
                                            Fermer
                                        </button>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                </Drawer.Content>
            </Drawer.Portal>
        </Drawer.Root>
    )
}
