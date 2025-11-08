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

interface TipsAndTricksTemplateProps {
    userName: string;
}

const TipsAndTricksTemp: React.FC<Readonly<TipsAndTricksTemplateProps>> = async ({
    userName = "User",
}) => {
    const t = await getScopedI18n('emails.tipsAndTricks');

    return (
        <Html>
            <Head />
            <Preview>{t('preview')}</Preview>
            <Tailwind>
                <Body className="bg-gray-100">
                    <Container className="mx-auto my-10 bg-white">
                        <Section className="m-6">
                            <Text className="mx-10 text-2xl font-bold text-center text-green-600">
                                {t('title')}
                            </Text>
                            <Text className="mx-10 text-lg font-bold mt-4">
                                {t('greeting', { userName })}
                            </Text>
                            <Text className="mx-10 text-base">
                                {t('introMessage')}
                            </Text>

                            <Section className="mx-10 my-4">
                                <Text className="text-base font-bold text-gray-800 mb-2">
                                    1. {t('tip1.title')}
                                </Text>
                                <Text className="text-sm text-gray-700 ml-6">
                                    {t('tip1.description')}
                                </Text>
                            </Section>

                            <Section className="mx-10 my-4">
                                <Text className="text-base font-bold text-gray-800 mb-2">
                                    2. {t('tip2.title')}
                                </Text>
                                <Text className="text-sm text-gray-700 ml-6">
                                    {t('tip2.description')}
                                </Text>
                            </Section>

                            <Section className="mx-10 my-4">
                                <Text className="text-base font-bold text-gray-800 mb-2">
                                    3. {t('tip3.title')}
                                </Text>
                                <Text className="text-sm text-gray-700 ml-6">
                                    {t('tip3.description')}
                                </Text>
                            </Section>

                            <Section className="mx-10 my-4">
                                <Text className="text-base font-bold text-gray-800 mb-2">
                                    4. {t('tip4.title')}
                                </Text>
                                <Text className="text-sm text-gray-700 ml-6">
                                    {t('tip4.description')}
                                </Text>
                            </Section>

                            <Section className="mx-10 my-4 p-4 bg-yellow-50 border-l-4 border-yellow-500 rounded-lg">
                                <Text className="text-base font-bold text-gray-800">
                                    {t('proTip.title')}
                                </Text>
                                <Text className="text-sm text-gray-700 mt-2">
                                    {t('proTip.description')}
                                </Text>
                            </Section>

                            <Text className="mx-10 text-base mt-4">
                                {t('feedbackMessage')}
                            </Text>

                            <Section className="my-5 text-center">
                                <Button
                                    className="inline-block px-6 py-3 text-base text-white rounded-md bg-green-600"
                                    href={`${process.env.NEXT_PUBLIC_APP_URL}/dashboard`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    {t('button')}
                                </Button>
                            </Section>

                            <Text className="mx-10 text-base font-light">
                                {t('closing')}
                            </Text>
                            <Text className="mx-10 text-base font-bold">
                                {t('signature')}
                            </Text>

                            <Section className="mx-10 mt-6 pt-4 border-t border-gray-200">
                                <Text className="text-xs text-gray-500 text-center">
                                    {t('unsubscribeMessage')}
                                </Text>
                            </Section>
                        </Section>
                    </Container>
                </Body>
            </Tailwind>
        </Html>
    );
};

export default TipsAndTricksTemp;
