import { getScopedI18n } from "@/locales/server";
import {
    Body,
    Container,
    Head,
    Html,
    Preview,
    Section,
    Tailwind,
    Text,
} from "@react-email/components";

interface SupportConfirmationTemplateProps {
    userName: string;
    subject: string;
}

const SupportConfirmationTemp: React.FC<Readonly<SupportConfirmationTemplateProps>> = async ({
    userName,
    subject,
}) => {
    const t = await getScopedI18n('emails.supportConfirmation');
    return (
        <Html>
            <Head />
            <Preview>{t('preview', { subject })}</Preview>
            <Tailwind>
                <Body className="bg-gray-100">
                    <Container className="mx-auto my-10 bg-white">
                        <Section className="m-6">
                            <Text className="mx-10 text-lg font-bold">
                                {t('greeting', { userName })}
                            </Text>
                            <Text className="mx-10 text-base">
                                {t('thankYouMessage')}
                            </Text>
                            <Section className="mx-10 my-4 p-4 bg-gray-50 border-l-4 border-blue-500">
                                <Text className="text-base font-semibold text-gray-800">
                                    {subject}
                                </Text>
                            </Section>
                            <Text className="mx-10 text-base">
                                {t('reviewMessage')}
                            </Text>
                            <Text className="mx-10 text-base">
                                {t('urgentMessage')}
                            </Text>
                            <Text className="mx-10 text-base font-light">
                                {t('closing')}
                            </Text>
                            <Text className="mx-10 text-base font-bold">
                                {t('signature')}
                            </Text>
                        </Section>
                    </Container>
                </Body>
            </Tailwind>
        </Html>
    );
};

export default SupportConfirmationTemp;