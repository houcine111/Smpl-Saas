'use client';

import Image from 'next/image';
import { Link } from '@/i18n/routing';
import { useTranslations } from 'next-intl';

export default function Footer() {
    const t = useTranslations('Landing');

    return (
        <footer className="fixed bottom-0 left-0 w-full z-40 bg-background/60 backdrop-blur-md border-t border-border px-4 sm:px-6">
            <div className="max-w-7xl mx-auto h-16 sm:h-20 flex flex-row justify-between items-center gap-4">
                <div className="flex items-center gap-3 transition-opacity opacity-50 hover:opacity-100">
                    <div className="relative w-6 h-6 overflow-hidden rounded-full border border-border bg-card">
                        <Image src="/Smpl.jpg" alt="Smpl Logo" fill className="object-cover" />
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-foreground">&copy; 2026</span>
                </div>
                
                <div className="flex gap-6 sm:gap-8 text-[10px] font-black uppercase tracking-[0.2em] opacity-50">
                    <Link href="/privacy" className="hover:text-accent transition-colors">Privacy</Link>
                    <Link href="/terms" className="hover:text-accent transition-colors">Terms</Link>
                </div>
            </div>
        </footer>
    );
}
