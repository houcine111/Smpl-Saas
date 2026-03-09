'use client'

import { useState } from 'react'
import { Drawer } from 'vaul'
import { motion, AnimatePresence } from 'framer-motion'
import { Vendor, Product } from '@/types/models'
import { X, Send, User, Phone, MapPin, ShoppingBag, Loader2, MessageCircle } from 'lucide-react'
import { createOrder } from '../../order-actions'
import PhoneInput from 'react-phone-number-input'
import 'react-phone-number-input/style.css'

interface OrderDrawerProps {
    isOpen: boolean
    onOpenChange: (open: boolean) => void
    cart: { [productId: string]: number }
    products: Product[]
    vendor: Vendor
}

export default function OrderDrawer({ isOpen, onOpenChange, cart, products, vendor }: OrderDrawerProps) {
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [customerPhone, setCustomerPhone] = useState<string | undefined>()

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
                `Bonjour *${vendor.storeName}* !\n\n` +
                `Je souhaite commander :\n${itemsList}\n\n` +
                `💰 *Total : ${totalPrice} DH*\n\n` +
                `📍 *Mes informations :*\n` +
                `- Nom : ${customerName}\n` +
                `- Ville : ${customerCity}\n` +
                `- Tel : ${customerPhone}\n\n` +
                `Merci de me confirmer la disponibilité !`
            )

            // 3. Redirect to WhatsApp
            window.open(`https://wa.me/${vendor.whatsappNumber?.replace('+', '')}?text=${message}`, '_blank')

            // Close drawer and maybe clear cart (optional)
            onOpenChange(false)
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
                                Votre Commande
                            </Drawer.Title>
                            <Drawer.Description className="text-zinc-500 dark:text-zinc-400 mb-8">
                                Finalisez votre commande et contactez le vendeur sur WhatsApp.
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
                                    <span className="text-sm font-medium text-zinc-500">Total à payer</span>
                                    <span className="text-xl font-black">{totalPrice.toLocaleString()} DH</span>
                                </div>
                            </div>

                            {/* Form */}
                            <form onSubmit={handleCheckout} className="space-y-5">
                                <div className="grid grid-cols-1 gap-5">
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold uppercase tracking-widest text-zinc-400 ml-1">
                                            Nom Complet
                                        </label>
                                        <div className="relative group">
                                            <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 group-focus-within:text-black dark:group-focus-within:text-white transition-colors" />
                                            <input
                                                required
                                                name="customerName"
                                                placeholder="Mohammed Alami"
                                                className="w-full pl-11 pr-4 py-3.5 bg-zinc-100 dark:bg-zinc-900 border-none rounded-xl focus:ring-2 focus:ring-black dark:focus:ring-white outline-none transition-all"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-xs font-bold uppercase tracking-widest text-zinc-400 ml-1">
                                            Téléphone
                                        </label>
                                        <div className="relative group overflow-hidden bg-zinc-100 dark:bg-zinc-900 border-none rounded-xl focus-within:ring-2 focus-within:ring-black dark:focus-within:ring-white transition-all">
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
                                        <label className="text-xs font-bold uppercase tracking-widest text-zinc-400 ml-1">
                                            Ville de livraison
                                        </label>
                                        <div className="relative group">
                                            <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 group-focus-within:text-black dark:group-focus-within:text-white transition-colors" />
                                            <input
                                                required
                                                name="customerCity"
                                                placeholder="Casablanca"
                                                className="w-full pl-11 pr-4 py-3.5 bg-zinc-100 dark:bg-zinc-900 border-none rounded-xl focus:ring-2 focus:ring-black dark:focus:ring-white outline-none transition-all"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {error && (
                                    <p className="text-sm text-red-500 bg-red-50 dark:bg-red-950/20 px-4 py-3 rounded-xl border border-red-100 dark:border-red-900/30">
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
                                            <MessageCircle className="w-5 h-5" />
                                            Commander via WhatsApp
                                        </>
                                    )}
                                </button>
                            </form>
                        </div>
                    </div>
                </Drawer.Content>
            </Drawer.Portal>
        </Drawer.Root>
    )
}
