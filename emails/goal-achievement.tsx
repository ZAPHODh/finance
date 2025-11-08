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

interface GoalAchievementTemplateProps {
    userName: string;
    goalName: string;
    targetValue: number;
    currentValue: number;
    currency: string;
}

const GoalAchievementTemp: React.FC<Readonly<GoalAchievementTemplateProps>> = async ({
    userName = "User",
    goalName = "Meta Mensal de Receita",
    targetValue = 5000,
    currentValue = 5200,
    currency = "R$",
}) => {
    const t = await getScopedI18n('emails.goalAchievement');

    return (
        <Html>
            <Head />
            <Preview>{t('preview', { goalName })}</Preview>
            <Tailwind>
                <Body className="bg-gray-100">
                    <Container className="mx-auto my-10 bg-white">
                        <Section className="m-6">
                            <Text className="mx-10 text-2xl font-bold text-center text-green-600">
                                {t('celebration')}
                            </Text>
                            <Text className="mx-10 text-lg font-bold mt-4">
                                {t('greeting', { userName })}
                            </Text>
                            <Text className="mx-10 text-base">
                                {t('congratsMessage', { goalName })}
                            </Text>
                            <Section className="mx-10 my-4 p-6 bg-green-50 border-l-4 border-green-500 rounded-lg">
                                <Text className="text-lg font-semibold text-gray-800 mb-2">
                                    {goalName}
                                </Text>
                                <Text className="text-sm text-gray-600">
                                    {t('target')}: <span className="font-bold">{currency} {targetValue.toFixed(2)}</span>
                                </Text>
                                <Text className="text-sm text-gray-600">
                                    {t('achieved')}: <span className="font-bold text-green-600">{currency} {currentValue.toFixed(2)}</span>
                                </Text>
                                <Text className="text-lg font-bold mt-2 text-green-600">
                                    {t('completed')}
                                </Text>
                            </Section>
                            <Text className="mx-10 text-base">
                                {t('keepGoingMessage')}
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
                        </Section>
                    </Container>
                </Body>
            </Tailwind>
        </Html>
    );
};

export default GoalAchievementTemp;
