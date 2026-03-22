'use client';

import Image from 'next/image';
import { Link } from '@/i18n/routing';
import { useTranslations } from 'next-intl';

export default function Footer() {
    const t = useTranslations('Legal');

    return (
        <footer className="w-full bg-background/60 backdrop-blur-md border-t border-border px-4 sm:px-6">
            <div className="max-w-7xl mx-auto h-16 sm:h-20 flex justify-between items-center gap-4">
                <div className="flex items-center gap-3 transition-opacity opacity-50 hover:opacity-100 shrink-0">
                    <div className="relative w-6 h-6 overflow-hidden rounded-full border border-border bg-card">
                        <Image src="/Smpl.jpg" alt="Smpl Logo" fill className="object-cover" />
                    </div>
                    <bdo dir="ltr" className="text-[10px] font-black tracking-widest text-foreground">&copy; {new Date().getFullYear()}</bdo>
                </div>
                
                <div className="flex gap-4 sm:gap-8 text-xs font-bold opacity-50">
                    <Link href="/privacy" className="hover:text-accent transition-colors">{t('privacy.title')}</Link>
                    <Link href="/terms" className="hover:text-accent transition-colors">{t('terms.title')}</Link>
                </div>
            </div>
        </footer>
    );
}
