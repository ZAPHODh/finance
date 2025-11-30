'use client'
import { Logo } from '@/components/logo'
import Link from 'next/link'
import { useScopedI18n, useCurrentLocale } from '@/locales/client'
import { usePathname } from 'next/navigation'
import { useSiteConfig } from '@/config/site-client'

export default function FooterSection() {
    const t = useScopedI18n('marketing.footer')
    const pathname = usePathname()
    const locale = useCurrentLocale()
    const name = useSiteConfig(locale).name
    if (pathname.includes('/dashboard')) {
        return null
    }

    return (
        <footer className="py-16 md:py-32">
            <div className="mx-auto max-w-5xl px-6">
                <Link
                    href="/"
                    aria-label="go home"
                    className="mx-auto block size-fit">
                    {name}
                </Link>

                <div className="my-8 flex flex-wrap justify-center gap-6 text-sm">
                    <Link
                        href="/features"
                        className="text-muted-foreground hover:text-primary block duration-150">
                        <span>{t('links.features')}</span>
                    </Link>
                    <Link
                        href="/pricing"
                        className="text-muted-foreground hover:text-primary block duration-150">
                        <span>{t('links.pricing')}</span>
                    </Link>
                    <Link
                        href="/faq"
                        className="text-muted-foreground hover:text-primary block duration-150">
                        <span>{t('links.faq')}</span>
                    </Link>
                    <Link
                        href="/terms"
                        className="text-muted-foreground hover:text-primary block duration-150">
                        <span>{t('links.terms')}</span>
                    </Link>
                    <Link
                        href="/privacy"
                        className="text-muted-foreground hover:text-primary block duration-150">
                        <span>{t('links.privacy')}</span>
                    </Link>
                    <Link
                        href="/contact"
                        className="text-muted-foreground hover:text-primary block duration-150">
                        <span>{t('links.contact')}</span>
                    </Link>
                    <Link
                        href="/login"
                        className="text-muted-foreground hover:text-primary block duration-150">
                        <span>{t('links.login')}</span>
                    </Link>
                </div>
                <span className="text-muted-foreground block text-center text-sm">{t('copyright', { year: new Date().getFullYear() })}</span>
            </div>
        </footer>
    )
}
