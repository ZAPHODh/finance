'use client'
import { Button } from '@/components/ui/button'
import { ArrowRight } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useScopedI18n } from '@/locales/client'

export default function HeroSection() {
    const t = useScopedI18n('shared.hero')

    return (
        <main>
            <section className="overflow-hidden">
                <div className="relative mx-auto max-w-5xl px-6 py-28 lg:py-20">
                    <div className="lg:flex lg:items-center lg:gap-12">
                        <div className="relative z-10 mx-auto max-w-xl text-center lg:ml-0 lg:w-1/2 lg:text-left">
                            <Link
                                href="/"
                                className="rounded-(--radius) mx-auto flex w-fit items-center gap-2 border p-1 pr-3 lg:ml-0">
                                <span className="bg-muted rounded-[calc(var(--radius)-0.25rem)] px-2 py-1 text-xs">New</span>
                                <span className="text-sm">{t('powering')}</span>
                                <span className="bg-(--color-border) block h-4 w-px"></span>

                                <ArrowRight className="size-4" />
                            </Link>

                            <h1 className="mt-10 text-balance text-4xl font-bold md:text-5xl xl:text-5xl">{t('title')}</h1>
                            <p className="mt-8">{t('subtitle')}</p>

                            <div>
                                <div className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start my-10 lg:my-12">
                                    <Button asChild size="lg">
                                        <Link href="/login">{t('getStarted')}</Link>
                                    </Button>
                                    <Button asChild size="lg" variant="outline">
                                        <Link href="#pricing">{t('viewPricing')}</Link>
                                    </Button>
                                </div>

                                <ul className="list-inside list-disc space-y-2 text-sm">
                                    <li>{t('faster')}</li>
                                    <li>{t('modern')}</li>
                                    <li>{t('customizable')}</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                    <div className="absolute inset-0 -mx-4 rounded-3xl p-3 lg:col-span-3">
                        <div className="relative">
                            <div className="bg-radial-[at_65%_25%] to-background z-1 -inset-17 absolute from-transparent to-40%"></div>
                            <Image
                                className="hidden dark:block"
                                src="/music.png"
                                alt="app illustration"
                                width={2796}
                                height={2008}
                            />
                            <Image
                                className="dark:hidden"
                                src="/music-light.png"
                                alt="app illustration"
                                width={2796}
                                height={2008}
                            />
                        </div>
                    </div>
                </div>
            </section>
        </main>
    )
}
