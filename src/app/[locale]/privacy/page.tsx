'use client';

import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import Footer from '@/components/layout/Footer';

export default function PrivacyPage() {
    const t = useTranslations('Legal.privacy');

    return (
        <div className="min-h-screen bg-background text-foreground pb-32">
            <main className="max-w-3xl mx-auto px-6 pt-32 sm:pt-48 space-y-12">
                <motion.header
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-4"
                >
                    <h1 className="text-4xl sm:text-6xl font-black tracking-tighter leading-none">
                        {t('title')}
                    </h1>
                    <p className="text-sm font-black uppercase tracking-widest text-zinc-500">
                        {t('lastUpdated')}
                    </p>
                </motion.header>

                <div className="space-y-12 pb-20">
                    {['collection', 'usage', 'sharing'].map((section, idx) => (
                        <motion.section
                            key={section}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 * (idx + 1) }}
                            className="space-y-4"
                        >
                            <h2 className="text-xl font-black italic tracking-tight text-accent">
                                {t(`sections.${section}.title`)}
                            </h2>
                            <p className="text-zinc-500 font-medium leading-relaxed">
                                {t(`sections.${section}.content`)}
                            </p>
                        </motion.section>
                    ))}
                </div>
            </main>
            <Footer />
        </div>
    );
}
