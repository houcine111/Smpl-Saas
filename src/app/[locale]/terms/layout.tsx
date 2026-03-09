import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';

export async function generateMetadata({
    params
}: {
    params: Promise<{ locale: string }>;
}): Promise<Metadata> {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: 'Legal.terms' });
    const seoT = await getTranslations({ locale, namespace: 'Seo' });

    return {
        title: `${t('title')} – Smpl`,
        description: seoT('description'),
        openGraph: {
            title: `${t('title')} – Smpl`,
            description: seoT('description'),
        }
    };
}

export default function TermsLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
