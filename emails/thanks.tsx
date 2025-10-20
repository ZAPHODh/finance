import { getScopedI18n } from "@/locales/server";
import {
    Body,
    Button,
    Container,
    Head,
    Html,
    Preview,
    Section,
    Tailwind,
    Text,
} from "@react-email/components";

interface ThanksTemplateProps {
    userName: string;
}

const ThanksTemp: React.FC<Readonly<ThanksTemplateProps>> = async ({ userName }) => {
    const t = await getScopedI18n('emails.thanks')
    return (
        <Html>
            <Head />
            < Preview > {t('preview')}</Preview>
            < Tailwind >
                <Body className="bg-gray-100" >
                    <Container className="mx-auto my-10 bg-white" >
                        <Section className="m-6" >
                            <Text className="mx-10 text-lg font-bold" >{t('greeting', { userName })} , </Text>
                            < Text className="mx-10 text-base" >
                                {t('message')}
                            </Text>
                            < Section className="my-5 text-center" >
                                <Button
                                    className="inline-block px-6 py-3 text-base text-white rounded-md bg-bg-white bg-slate-900"
                                    href={process.env.NEXT_PUBLIC_APP_URL}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    {t('button')}
                                </Button>
                            </Section>
                            < Text className="mx-10 text-base font-light" > {t('closing')} </Text>
                            < Text className="mx-10 text-base font-bold" > {t('signature')} </Text>
                        </Section>
                    </Container>
                </Body>
            </Tailwind>
        </Html>
    )
}

export default ThanksTemp;