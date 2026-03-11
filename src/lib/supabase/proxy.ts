import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest, existingResponse?: NextResponse) {
    const pathname = request.nextUrl.pathname

    // Explicitly define locales matching routing.ts
    const supportedLocales = ['en', 'fr', 'ar']
    const segments = pathname.split('/')
    const firstSegment = segments[1]

    const isLocalePath = supportedLocales.includes(firstSegment)
    const locale = isLocalePath ? firstSegment : 'fr'

    // Normalize path to check protections regardless of locale prefix
    const pathWithoutLocale = isLocalePath ? '/' + segments.slice(2).join('/') : pathname
    const normalizedPath = pathWithoutLocale.replace(/\/$/, '') || '/'

    let response = existingResponse || NextResponse.next({
        request: {
            headers: request.headers,
        },
    })

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() {
                    return request.cookies.getAll()
                },
                setAll(cookiesToSet) {
                    cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))

                    cookiesToSet.forEach(({ name, value }) =>
                        response.cookies.set(name, value)
                    )
                },
            },

        }
    )

    // Refreshing the auth token
    const { data: { user } } = await supabase.auth.getUser()

    // 1. Protection for /dashboard
    if (normalizedPath.startsWith('/dashboard') && !user) {
        return NextResponse.redirect(new URL(`/${locale}/login`, request.url))
    }

    // 2. Protection for /admin (Superuser)
    if (normalizedPath.startsWith('/admin')) {
        if (!user) {
            return NextResponse.redirect(new URL(`/${locale}/login`, request.url))
        }

        // Check is_admin flag in profiles
        const { data: profile } = await supabase
            .from('profiles')
            .select('is_admin')
            .eq('id', user.id)
            .single()

        if (!profile || !profile.is_admin) {
            // If not admin, redirect to vendor dashboard or home
            return NextResponse.redirect(new URL(`/${locale}/dashboard`, request.url))
        }
    }

    // Security Headers
    response.headers.set('X-DNS-Prefetch-Control', 'on')
    response.headers.set('Strict-Transport-Security', 'max-age=63072000; includeSubDomains; preload')
    response.headers.set('X-XSS-Protection', '1; mode=block')
    response.headers.set('X-Frame-Options', 'SAMEORIGIN')
    response.headers.set('X-Content-Type-Options', 'nosniff')
    response.headers.set('Referrer-Policy', 'origin-when-cross-origin')

    // Basic CSP (More restrictive can be added later as needed)
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://flmahiodeflpxlobvdal.supabase.co';
    const supabaseHost = new URL(supabaseUrl).hostname;
    
    response.headers.set(
        'Content-Security-Policy',
        `default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' blob: data: https://*.supabase.co; font-src 'self' data:; connect-src 'self' https://${supabaseHost} wss://${supabaseHost};`
    )

    return response
}
