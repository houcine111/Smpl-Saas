import { CreateUserForm } from '../users/CreateUserForm'
import { Link } from '@/i18n/routing'
import { ArrowLeft } from 'lucide-react'
import { getTranslations } from 'next-intl/server'

export default async function CreateUserPage() {
    const t = await getTranslations('Admin.create')

    return (
        <div className="max-w-4xl space-y-8">
            <Link 
                href="/admin" 
                className="inline-flex items-center gap-2 text-zinc-500 hover:text-zinc-950 transition-colors font-medium text-sm"
            >
                <ArrowLeft className="w-4 h-4" />
                {t('back')}
            </Link>

            <header>
                <h1 className="text-4xl font-serif font-black tracking-tight text-zinc-950 italic">{t('title')}</h1>
                <p className="text-zinc-500 mt-2 font-medium">{t('subtitle')}</p>
            </header>

            <div className="bg-white rounded-3xl border border-zinc-200 overflow-hidden shadow-sm">
                <CreateUserForm />
            </div>
        </div>
    )
}
