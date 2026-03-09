import { z } from 'zod'
import { isValidPhoneNumber } from 'libphonenumber-js'
export const productSchema = z.object({
    name: z.string().min(3, "Le nom doit contenir au moins 3 caractères").max(100),
    price: z.number().positive("Le prix doit être supérieur à 0"),
    stockQuantity: z.number().int().min(0, "Le stock ne peut pas être négatif").default(0),
    imageUrls: z.array(z.string().url()).min(1, "Ajoutez au moins une image"),
    isActive: z.boolean().default(true),
})

export const registerSchema = z.object({
    storeName: z.string().min(3, "Le nom de la boutique est trop court").max(50),
    slug: z.string().regex(/^[a-z0-9-]*$/, "Le slug ne doit contenir que des lettres minuscules, chiffres et tirets").optional().or(z.literal('')),
    email: z.string().email("Email invalide"),
    password: z.string().min(8, "Le mot de passe doit contenir au moins 8 caractères"),
    confirmPassword: z.string().min(8, "Veuillez confirmer votre mot de passe"),
    whatsapp_number: z.string().refine((val) => isValidPhoneNumber(val), {
        message: "Numéro WhatsApp invalide (format international requis)",
    }),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Les mots de passe ne correspondent pas",
    path: ["confirmPassword"],
})
export const adminUserSchema = z.object({
    email: z.string().email("Email invalide"),
    password: z.string().min(8, "Le mot de passe doit contenir au moins 8 caractères"),
    is_admin: z.boolean().default(false),
    whatsapp_number: z.string().optional().refine((val) => !val || isValidPhoneNumber(val), {
        message: "Numéro WhatsApp invalide",
    }),
    store_name: z.string().optional().or(z.literal('')),
    slug: z.string().optional().or(z.literal('')),
}).superRefine((data, ctx) => {
    if (!data.is_admin) {
        if (!data.store_name || data.store_name.length < 3) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: "Le nom de la boutique est requis pour un vendeur (min 3 car.)",
                path: ["store_name"],
            });
        }
        if (!data.slug || data.slug.length < 3) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: "Le slug est requis pour un vendeur (min 3 car.)",
                path: ["slug"],
            });
        }
        if (!data.whatsapp_number) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: "Le numéro WhatsApp est requis pour un vendeur",
                path: ["whatsapp_number"],
            });
        }
    }
})

export const orderSchema = z.object({
    customerName: z.string().min(3, "Nom complet requis"),
    customerPhone: z.string().refine((val) => isValidPhoneNumber(val), {
        message: "Numéro de téléphone invalide (format international requis)",
    }),
    customerCity: z.string().min(2, "Ville requise"),
})

export const storeSettingsSchema = z.object({
    storeName: z.string().min(3, "Le nom de la boutique est trop court").max(50),
    slug: z.string().regex(/^[a-z0-9-]*$/, "Le slug ne doit contenir que des lettres minuscules, chiffres et tirets").optional().or(z.literal('')),
    whatsapp_number: z.string().refine((val) => isValidPhoneNumber(val), {
        message: "Numéro WhatsApp invalide (format international requis)",
    }),
})
export const updatePasswordSchema = z.object({
    password: z.string().min(8, "Le mot de passe doit contenir au moins 8 caractères"),
    confirmPassword: z.string().min(8, "Veuillez confirmer votre mot de passe"),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Les mots de passe ne correspondent pas",
    path: ["confirmPassword"],
})
