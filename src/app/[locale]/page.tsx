"use client";
import Image from "next/image";
import { Link } from "@/i18n/routing";
import { ArrowRight, MessageSquare, ShieldCheck, Zap, CheckCircle2, Mail, Menu, X } from "lucide-react";
import { useTranslations } from 'next-intl';
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/Button";
import Footer from "@/components/layout/Footer";

export default function Home() {
  const t = useTranslations('Landing');
  const commonT = useTranslations('Common');
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-accent/20 selection:text-foreground overflow-x-hidden">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-background/80 backdrop-blur-md z-50 border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 sm:h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 active:scale-95 transition-transform">
            <div className="relative w-8 h-8 sm:w-10 sm:h-10 overflow-hidden rounded-full border border-border bg-card">
              <Image src="/Smpl.jpg" alt="Smpl Logo" fill className="object-cover" />
            </div>
          </Link>

          {/* Mobile ThemeToggle (Center) */}
          <div className="md:hidden absolute left-1/2 -translate-x-1/2">
            <ThemeToggle />
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">
            <a href="#features" className="hover:text-foreground transition-colors">{t('nav.solution')}</a>
            <a href="#about" className="hover:text-foreground transition-colors">{t('nav.why')}</a>
          </div>

          <div className="flex items-center gap-2 sm:gap-4">
            <div className="hidden md:block">
              <ThemeToggle />
            </div>
            <Link href="/login" className="hidden sm:block">
              <Button variant="ghost" size="sm">
                {commonT('connexion')}
              </Button>
            </Link>
            <Link href="/register">
              <Button variant="primary" size="sm" className="hidden sm:flex">
                {commonT('start')}
              </Button>
              <Button variant="primary" size="sm" className="sm:hidden px-4">
                {commonT('start')}
              </Button>
            </Link>

            {/* Mobile Menu Toggle */}
            <button
              className="md:hidden p-2 text-foreground"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu Overlay */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-background border-b border-border overflow-hidden"
            >
              <div className="flex flex-col p-6 gap-6 text-[10px] font-black uppercase tracking-[0.2em]">
                <a href="#features" onClick={() => setIsMenuOpen(false)}>{t('nav.solution')}</a>
                <a href="#about" onClick={() => setIsMenuOpen(false)}>{t('nav.why')}</a>
                <Link href="/login" onClick={() => setIsMenuOpen(false)}>{commonT('connexion')}</Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      <main>
        {/* Hero Section */}
        <section className="pt-32 sm:pt-48 pb-16 sm:pb-24 px-4 sm:px-6 relative overflow-hidden">
          <div className="max-w-5xl mx-auto text-center relative z-10">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-card/10 border border-border mb-6 sm:mb-10 shadow-sm"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse"></span>
              <span className="text-[8px] sm:text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">{t('hero.badge')}</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-4xl sm:text-6xl md:text-8xl font-black tracking-tighter leading-none md:leading-tight mb-6 sm:mb-10"
            >
              {t('hero.title')} <br className="hidden sm:block" />
              <span className="text-accent">{t('hero.titleAccent')}</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-base sm:text-xl md:text-2xl text-zinc-500 max-w-2xl mx-auto font-medium leading-relaxed mb-8 sm:mb-12 px-4"
            >
              {t('hero.subtitle')}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8 px-4"
            >
              <Link href="/register" className="w-full sm:w-auto">
                <Button
                  variant="secondary"
                  size="xl"
                  className="w-full sm:w-auto"
                  rightIcon={<ArrowRight className="w-5 h-5 opacity-50 group-hover:translate-x-1 transition-transform" />}
                >
                  {t('hero.ctaPrimary')}
                </Button>
              </Link>
              <a href="#features" className="group flex items-center gap-2 text-[10px] sm:text-xs font-black uppercase tracking-[0.3em] text-zinc-400 hover:text-foreground transition-all">
                <span className="w-8 h-[1px] bg-zinc-200 dark:bg-zinc-800 group-hover:w-12 transition-all" />
                {t('hero.ctaSecondary')}
              </a>
            </motion.div>
          </div>

          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] sm:w-[800px] h-[300px] sm:h-[800px] bg-card/20 rounded-full blur-[60px] sm:blur-[120px] -z-10 rotate-12"></div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-20 sm:py-32 bg-card/5 px-4 sm:px-6 border-y border-border/50">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 sm:gap-20 items-center">
              <div className="space-y-8 sm:space-y-10 text-center lg:text-left">
                <div className="space-y-4">
                  <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-accent">{t('features.badge')}</h2>
                  <p className="text-3xl sm:text-5xl font-black leading-tight tracking-tight text-foreground">
                    {t('features.title')}
                  </p>
                </div>
                <p className="text-base sm:text-lg text-zinc-500 font-medium leading-relaxed max-w-xl mx-auto lg:mx-0">
                  {t('features.desc')}
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 text-left">
                  <FeatureItem icon={<MessageSquare className="w-5 h-5" />} text={t('features.items.whatsapp')} />
                  <FeatureItem icon={<ShieldCheck className="w-5 h-5" />} text={t('features.items.dashboard')} />
                  <FeatureItem icon={<Zap className="w-5 h-5" />} text={t('features.items.speed')} />
                  <FeatureItem icon={<CheckCircle2 className="w-5 h-5" />} text={t('features.items.commission')} />
                </div>
              </div>
              <motion.div
                whileInView={{ opacity: 1, scale: 1 }}
                initial={{ opacity: 0, scale: 0.95 }}
                className="relative aspect-square sm:aspect-auto sm:h-[500px] bg-card/10 rounded-[2rem] sm:rounded-[3rem] border border-border shadow-2xl overflow-hidden group"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-transparent to-card/30"></div>
                <div className="absolute inset-6 sm:inset-10 border border-border rounded-[1.5rem] sm:rounded-[2rem] flex items-center justify-center bg-background/50 backdrop-blur-sm shadow-inner">
                  <span className="italic text-2xl sm:text-4xl text-foreground/40 text-center px-6 sm:px-10 font-medium">{t('features.quote')}</span>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Why Section */}
        <section id="about" className="py-20 sm:py-32 bg-background px-4 sm:px-6">
          <div className="max-w-5xl mx-auto text-center space-y-12 sm:space-y-16">
            <div className="space-y-6">
              <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-accent">{t('why.badge')}</h2>
              <p className="text-3xl sm:text-5xl font-black leading-tight tracking-tight">
                {t('why.title')}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-12 text-left">
              <WhyCard
                title={t('why.speed.title')}
                desc={t('why.speed.desc')}
              />
              <WhyCard
                title={t('why.heritage.title')}
                desc={t('why.heritage.desc')}
              />
              <WhyCard
                title={t('why.aesthetic.title')}
                desc={t('why.aesthetic.desc')}
              />
            </div>
          </div>
        </section>

        {/* Newsletter Section */}
        <section className="py-20 sm:py-32 px-4 sm:px-6">
          <div className="max-w-4xl mx-auto bg-foreground rounded-[2rem] sm:rounded-[3rem] p-8 sm:p-20 text-center relative overflow-hidden group shadow-2xl">
            <div className="relative z-10 space-y-6 sm:space-y-8 text-background">
              <h2 className="text-3xl sm:text-6xl font-black leading-tight">
                {t('newsletter.title')}
              </h2>
              <p className="text-sm sm:text-base text-background/60 font-medium max-w-md mx-auto">
                {t('newsletter.desc')}
              </p>

              <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto" onSubmit={(e) => e.preventDefault()}>
                <div className="flex-1 relative group">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-background/40" />
                  <input
                    type="email"
                    placeholder={t('newsletter.placeholder')}
                    className="w-full pl-11 pr-4 py-3 sm:py-4 bg-background/10 border border-white/10 rounded-2xl text-background outline-none focus:ring-2 focus:ring-accent transition-all placeholder:text-background/20 text-sm"
                  />
                </div>
                <Button variant="primary" size="md" className="bg-background text-foreground hover:bg-zinc-200">
                  {t('newsletter.button')}
                </Button>
              </form>
            </div>
            <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] group-hover:scale-110 transition-transform duration-1000"></div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

function FeatureItem({ icon, text }: { icon: React.ReactNode, text: string }) {
  return (
    <div className="flex items-center gap-4 group cursor-default">
      <div className="w-10 h-10 bg-card/10 rounded-xl flex items-center justify-center shadow-sm border border-border group-hover:bg-accent group-hover:text-background group-hover:scale-110 transition-all duration-300">
        {icon}
      </div>
      <span className="text-sm font-bold text-zinc-600 dark:text-zinc-400 group-hover:text-foreground transition-colors">{text}</span>
    </div>
  )
}

function WhyCard({ title, desc }: { title: string, desc: string }) {
  return (
    <motion.div
      whileHover={{ y: -5 }}
      className="space-y-4 p-6 sm:p-8 rounded-[1.5rem] sm:rounded-[2rem] bg-card/5 hover:bg-card/10 hover:shadow-2xl hover:shadow-foreground/[0.02] transition-all border border-transparent hover:border-border group"
    >
      <h3 className="text-xl sm:text-2xl font-black italic group-hover:text-accent transition-colors">{title}</h3>
      <p className="text-sm text-zinc-500 leading-relaxed font-medium">{desc}</p>
    </motion.div>
  )
}
