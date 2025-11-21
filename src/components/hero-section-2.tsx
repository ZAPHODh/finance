'use client'
import Image from 'next/image'
import HeroImagePt from '@/../public/pt-hero.png'
import HeroImageEn from '@/../public/en-hero.png'
import { useCurrentLocale, useScopedI18n } from '@/locales/client'
import type { StaticImageData } from 'next/image'

const HERO_IMAGES: Record<string, StaticImageData> = {
    pt: HeroImagePt,
    en: HeroImageEn,
    // Future locales can be added here
} as const

export default function HeroSection2() {
    const t = useScopedI18n('marketing.hero2')
    const locale = useCurrentLocale()
    const heroImage = HERO_IMAGES[locale] || HERO_IMAGES.pt

    return (
        <>
            <main className="overflow-hidden">
                <section>
                    <div className="relative">
                        <div className="absolute inset-0 -z-10 size-full [background:radial-gradient(125%_125%_at_50%_100%,transparent_0%,var(--color-background)_75%)]"></div>
                        <div className="mx-auto max-w-6xl px-6">
                            <div className="sm:mx-auto lg:mr-auto lg:mt-0">
                                <h2
                                    className="mt-8 max-w-2xl text-balance text-5xl font-medium md:text-6xl lg:mt-16">
                                    {t('title')}
                                </h2>
                                <p
                                    className="mt-8 max-w-2xl text-pretty text-lg">
                                    {t('subtitle')}
                                </p>

                            </div>
                        </div>
                        <div className="mask-b-from-55% relative -mr-56 mt-8 overflow-hidden px-2 sm:mr-0 sm:mt-12 md:mt-20">
                            <div className="inset-shadow-2xs ring-background dark:inset-shadow-white/20 bg-background relative mx-auto max-w-5xl overflow-hidden rounded-2xl border p-4 shadow-lg shadow-zinc-950/15 ring-1">
                                <Image
                                    className="bg-background aspect-15/8 relative hidden rounded-2xl dark:block"
                                    src={heroImage}
                                    alt="app screen"
                                    width="2700"
                                    height="1440"
                                />
                                <Image
                                    className="z-2 border-border/25 aspect-15/8 relative rounded-2xl border dark:hidden"
                                    src={heroImage}
                                    alt="app screen"
                                    width="2700"
                                    height="1440"
                                />
                            </div>
                        </div>
                    </div>
                </section>
            </main>
        </>
    )
}
