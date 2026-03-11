import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import { ThemeProvider } from 'next-themes';
import { Geist, Readex_Pro } from "next/font/google";
import "../globals.css";
import { Toaster } from 'sonner';

const geist = Geist({
  variable: "--font-geist",
  subsets: ["latin"],
});

const readexPro = Readex_Pro({
  variable: "--font-readex",
  subsets: ["arabic", "latin"],
});

import { getTranslations } from 'next-intl/server';
import type { Metadata } from 'next';

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  console.log(`>>> Building metadata for locale: ${locale}`);
  try {
  const t = await getTranslations({ locale, namespace: 'Seo' });
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

  return {
    title: t('title'),
    description: t('description'),
    metadataBase: new URL(siteUrl),
    alternates: {
      canonical: `/${locale}`,
    },
    openGraph: {
      title: t('title'),
      description: t('description'),
      url: `/${locale}`,
      siteName: 'Smpl',
      images: [
        {
          url: '/Smpl.jpg',
          width: 800,
          height: 800,
          alt: 'Smpl Logo',
        },
      ],
      locale: locale,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: t('title'),
      description: t('description'),
      images: ['/Smpl.jpg'],
    },
  };
  } catch (error) {
    console.error(`>>> Error building metadata for locale ${locale}:`, error);
    return {
      title: 'Smpl – La plateforme eCommerce pour les puristes',
      description: 'Transformez votre passion en business en 60 secondes. Encaissez sur WhatsApp, gérez votre inventaire et offrez une expérience premium à vos clients.',
    };
  }
}

export default async function RootLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  // Ensure that the incoming `locale` is valid
  if (!routing.locales.includes(locale as any)) {
    notFound();
  }

  // Receiving messages provided in `i18n/request.ts`
  const messages = await getMessages();

  const isRtl = locale === 'ar';

  return (
    <html lang={locale} dir={isRtl ? 'rtl' : 'ltr'} suppressHydrationWarning>
      <body
        className={`${geist.variable} ${readexPro.variable} antialiased`}
      >
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
          <NextIntlClientProvider messages={messages}>
            {children}
            <Toaster position="top-center" richColors />
          </NextIntlClientProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
