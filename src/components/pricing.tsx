'use client'
import { Button } from '@/components/ui/button'
import { Check } from 'lucide-react'
import Link from 'next/link'
import { useScopedI18n, useCurrentLocale } from '@/locales/client'
import { getPricingForLocale } from '@/lib/pricing'

export default function Pricing() {
    const t = useScopedI18n('marketing.pricing')
    const locale = useCurrentLocale()
    const pricing = getPricingForLocale(locale)

    return (
        <section className="py-16 md:py-32">
            <div className="mx-auto max-w-5xl px-6">
                <div className="mx-auto max-w-2xl space-y-6 text-center">
                    <h1 className="text-center text-4xl font-semibold lg:text-5xl">{t('title')}</h1>
                    <p>{t('subtitle')}</p>
                </div>

                <div className="mt-8 grid gap-6 md:mt-20 md:grid-cols-5 md:gap-0">
                    <div className="rounded-(--radius) flex flex-col justify-between space-y-8 border p-6 md:col-span-2 md:my-2 md:rounded-r-none md:border-r-0 lg:p-10">
                        <div className="space-y-4">
                            <div>
                                <h2 className="font-medium">{t('free.name')}</h2>
                                <span className="my-3 block text-2xl font-semibold">{pricing.simple.currencySymbol}0 / {t('perMonth')}</span>
                                <p className="text-muted-foreground text-sm">{t('perDriver')}</p>
                            </div>

                            <Button
                                asChild
                                variant="outline"
                                className="w-full">
                                <Link href="/login">{t('getStarted')}</Link>
                            </Button>

                            <hr className="border-dashed" />

                            <ul className="list-outside space-y-3 text-sm">
                                <li className="flex items-center gap-2">
                                    <Check className="size-3" />
                                    {t('free.feature1')}
                                </li>
                                <li className="flex items-center gap-2">
                                    <Check className="size-3" />
                                    {t('free.feature2')}
                                </li>
                                <li className="flex items-center gap-2">
                                    <Check className="size-3" />
                                    {t('free.feature3')}
                                </li>
                            </ul>
                        </div>
                    </div>

                    <div className="dark:bg-muted rounded-(--radius) border p-6 shadow-lg shadow-gray-950/5 md:col-span-3 lg:p-10 dark:[--color-muted:var(--color-zinc-900)]">
                        <div className="grid gap-6 sm:grid-cols-2">
                            <div className="space-y-4">
                                <div>
                                    <h2 className="font-medium">{t('pro.name')}</h2>
                                    <span className="my-3 block text-2xl font-semibold">{pricing.pro.monthlyPriceFormatted} / {t('perMonth')}</span>
                                    <p className="text-muted-foreground text-sm">{t('perDriver')}</p>
                                </div>

                                <Button
                                    asChild
                                    className="w-full">
                                    <Link href="/login">{t('getStarted')}</Link>
                                </Button>
                            </div>

                            <div>
                                <div className="text-sm font-medium">{t('pro.includes')}</div>

                                <ul className="mt-4 list-outside space-y-3 text-sm">
                                    <li className="flex items-center gap-2">
                                        <Check className="size-3" />
                                        {t('pro.feature1')}
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <Check className="size-3" />
                                        {t('pro.feature2')}
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <Check className="size-3" />
                                        {t('pro.feature3')}
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <Check className="size-3" />
                                        {t('pro.feature4')}
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <Check className="size-3" />
                                        {t('pro.feature5')}
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <Check className="size-3" />
                                        {t('pro.feature6')}
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <Check className="size-3" />
                                        {t('pro.feature7')}
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <Check className="size-3" />
                                        {t('pro.feature8')}
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <Check className="size-3" />
                                        {t('pro.feature9')}
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <Check className="size-3" />
                                        {t('pro.feature10')}
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
