'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { registerSchema } from '@/lib/validations'

export async function signUp(formData: FormData) {
    const supabase = await createClient()

    const inputStoreName = formData.get('storeName') as string
    let inputSlug = formData.get('slug') as string

    // Auto-génération du slug si manquant dans le formulaire
    if (!inputSlug && inputStoreName) {
        inputSlug = inputStoreName
            .toLowerCase()
            .trim()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '') // Enlever les accents
            .replace(/[^a-z0-9]+/g, '-')     // Remplacer non-alphanum par -
            .replace(/^-+|-+$/g, '')         // Enlever les tirets au début/fin
    }

    const rawData = {
        email: formData.get('email') as string,
        password: formData.get('password') as string,
        confirmPassword: formData.get('confirmPassword') as string,
        storeName: inputStoreName,
        slug: inputSlug,
        whatsapp_number: formData.get('whatsapp_number') as string,
    }

    // Validation Zod
    const validation = registerSchema.safeParse(rawData)

    if (!validation.success) {
        return { error: validation.error.issues[0].message }
    }

    const { email, password, storeName, slug, whatsapp_number } = validation.data

    // Vérifier si le nom de boutique, le slug ou le WhatsApp est déjà pris
    const { data: existingStore } = await supabase
        .from('profiles')
        .select('id')
        .or(`slug.eq.${slug},store_name.eq.${storeName},whatsapp_number.eq.${whatsapp_number}`)
        .maybeSingle()

    if (existingStore) {
        return { error: "Le nom de boutique, l'URL ou le numéro WhatsApp est déjà utilisé." }
    }

    const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
            data: {
                store_name: storeName,
                slug: slug,
                whatsapp_number: whatsapp_number,
            },
        },
    })

    if (error) {
        return { error: error.message }
    }

    // Success - Redirect to login after registration
    redirect('/login')
}

export async function signIn(formData: FormData) {
    const supabase = await createClient()

    const email = formData.get('email') as string
    const password = formData.get('password') as string

    const { data: authData, error } = await supabase.auth.signInWithPassword({
        email,
        password,
    })

    if (error || !authData.user) {
        return { error: error?.message || 'Erreur de connexion' }
    }

    // Check role from profiles
    const { data: profile } = await supabase
        .from('profiles')
        .select('is_admin')
        .eq('id', authData.user.id)
        .single()

    if (profile?.is_admin) {
        redirect('/admin')
    } else {
        redirect('/dashboard')
    }
}

export async function signOut() {
    const supabase = await createClient()
    await supabase.auth.signOut()
    redirect('/login')
}
