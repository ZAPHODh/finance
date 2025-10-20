'use client'
import { useScopedI18n } from '@/locales/client'

export default function FAQs() {
    const t = useScopedI18n('shared.faqs')

    return (
        <section className="scroll-py-16 py-16 md:scroll-py-32 md:py-32">
            <div className="mx-auto max-w-5xl px-6">
                <div className="grid gap-y-12 px-2 lg:[grid-template-columns:1fr_auto]">
                    <div className="text-center lg:text-left">
                        <h2 className="mb-4 text-3xl font-semibold md:text-4xl">
                            {t('title.line1')} <br className="hidden lg:block" />
                            {t('title.line2')} <br className="hidden lg:block" />
                            {t('title.line3')}
                        </h2>
                        <p>{t('subtitle')}</p>
                    </div>

                    <div className="divide-y divide-dashed sm:mx-auto sm:max-w-lg lg:mx-0">
                        <div className="pb-6">
                            <h3 className="font-medium">{t('q1.question')}</h3>
                            <p className="text-muted-foreground mt-4">{t('q1.answer')}</p>
                        </div>
                        <div className="py-6">
                            <h3 className="font-medium">{t('q2.question')}</h3>
                            <p className="text-muted-foreground mt-4">{t('q2.answer')}</p>
                        </div>
                        <div className="py-6">
                            <h3 className="font-medium">{t('q3.question')}</h3>
                            <p className="text-muted-foreground mt-4">{t('q3.answer')}</p>
                        </div>
                        <div className="py-6">
                            <h3 className="font-medium">{t('q4.question')}</h3>
                            <p className="text-muted-foreground mt-4">{t('q4.answer')}</p>
                        </div>
                        <div className="py-6">
                            <h3 className="font-medium">{t('q5.question')}</h3>
                            <p className="text-muted-foreground mt-4">{t('q5.answer')}</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
