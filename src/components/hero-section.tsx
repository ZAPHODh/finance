'use client'
import { Button } from '@/components/ui/button'
import Image from 'next/image'
import Link from 'next/link'
import { useScopedI18n } from '@/locales/client'
import Car from "@/../public/car.jpg"
export default function HeroSection() {
    const t = useScopedI18n('marketing.hero')

    return (
        <main>
            <section className="overflow-hidden">
                <div className="relative mx-auto max-w-5xl px-6 py-28 lg:py-20">
                    <div className="lg:flex lg:items-center lg:gap-12">
                        <div className="relative z-10 mx-auto max-w-xl text-center lg:ml-0 lg:w-1/2 lg:text-left">
                            <h1 className="mt-10 text-balance text-4xl font-bold md:text-5xl xl:text-5xl">{t('title')}</h1>
                            <p className="mt-8">{t('subtitle')}</p>

                            <div>
                                <div className="my-10 lg:my-12">
                                    <Button asChild size="lg" variant="outline" className="w-full sm:w-auto">
                                        <Link href="/pricing">{t('viewPricing')}</Link>
                                    </Button>
                                </div>

                                <ul className="list-outside list-disc space-y-2 text-sm pl-5 text-left">
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
                                src={Car.src}
                                alt="app illustration"
                                fill
                                priority
                                sizes="(max-width: 1024px) 100vw, 1200px"
                                style={{ objectFit: 'cover' }}
                            />
                            <Image
                                className="dark:hidden"
                                src={Car.src}
                                alt="app illustration"
                                fill
                                priority
                                sizes="(max-width: 1024px) 100vw, 1200px"
                                style={{ objectFit: 'cover' }}
                            />
                        </div>
                    </div>
                </div>
            </section>
        </main>
    )
}
