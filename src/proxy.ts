import { type NextRequest } from 'next/server'
import { updateSession } from '@/lib/supabase/proxy'
import createIntlMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';

const intlMiddleware = createIntlMiddleware(routing);

export async function proxy(request: NextRequest) {
    // 1. Handle internationalization
    const response = intlMiddleware(request);

    // 2. Handle Supabase session (auth and security headers)
    // We pass the response from intlMiddleware to updateSession so it can append auth cookies
    return await updateSession(request, response);
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * Feel free to modify this pattern to include more paths.
         */
        '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    ],
}
