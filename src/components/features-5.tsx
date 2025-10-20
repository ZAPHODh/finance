'use client'
import { TrendingUp, Receipt, Clock, BarChart3 } from 'lucide-react'
import Image from 'next/image'
import { useScopedI18n } from '@/locales/client'

export default function FeaturesSection() {
    const t = useScopedI18n('shared.features')

    return (
        <section className="overflow-hidden py-16 md:py-32">
            <div className="mx-auto max-w-6xl px-6">
                <div className="grid items-center gap-12 md:grid-cols-2 md:gap-12 lg:grid-cols-5 lg:gap-24">
                    <div className="lg:col-span-2">
                        <div className="md:pr-6 lg:pr-0">
                            <h2 className="text-4xl font-semibold lg:text-5xl">{t('title')}</h2>
                            <p className="mt-6">{t('subtitle')}</p>
                        </div>
                        <ul className="mt-8 divide-y border-y *:flex *:items-center *:gap-3 *:py-3">
                            <li>
                                <Receipt className="size-5" />
                                {t('feature1')}
                            </li>
                            <li>
                                <TrendingUp className="size-5" />
                                {t('feature2')}
                            </li>
                            <li>
                                <Clock className="size-5" />
                                {t('feature3')}
                            </li>
                            <li>
                                <BarChart3 className="size-5" />
                                {t('feature4')}
                            </li>
                        </ul>
                    </div>
                    <div className="border-border/50 relative rounded-3xl border p-3 lg:col-span-3">
                        <div className="bg-linear-to-b aspect-76/59 relative rounded-2xl from-zinc-300 to-transparent p-px dark:from-zinc-700">
                            <Image src="/payments.png" className="hidden rounded-[15px] dark:block" alt="payments illustration dark" width={1207} height={929} />
                            <Image src="/payments-light.png" className="rounded-[15px] shadow dark:hidden" alt="payments illustration light" width={1207} height={929} />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
