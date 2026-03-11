import { getRequestConfig } from 'next-intl/server';
import { routing } from './routing';

export default getRequestConfig(async ({ requestLocale }) => {
    // This typically corresponds to the `[locale]` segment
    let locale = await requestLocale;

    // Ensure that a valid locale is used
    if (!locale || !routing.locales.includes(locale as any)) {
        locale = routing.defaultLocale;
    }

    try {
        const messages = (await import(`../../messages/${locale}.json`)).default;
        return {
            locale,
            messages
        };
    } catch (error) {
        // Fallback to default locale if translation file is missing
        console.warn(`Missing translation file for locale: ${locale}, falling back to ${routing.defaultLocale}`);
        const fallbackMessages = (await import(`../../messages/${routing.defaultLocale}.json`)).default;
        return {
            locale: routing.defaultLocale,
            messages: fallbackMessages
        };
    }
});
