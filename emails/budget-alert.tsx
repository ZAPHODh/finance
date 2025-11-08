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

interface BudgetAlertTemplateProps {
    userName: string;
    budgetName: string;
    currentAmount: number;
    limitAmount: number;
    percentage: number;
    currency: string;
}

const BudgetAlertTemp: React.FC<Readonly<BudgetAlertTemplateProps>> = async ({
    userName = "User",
    budgetName = "Combustível",
    currentAmount = 800,
    limitAmount = 1000,
    percentage = 80,
    currency = "R$",
}) => {
    const t = await getScopedI18n('emails.budgetAlert');

    const isNearLimit = percentage >= 80 && percentage < 100;
    const isOverLimit = percentage >= 100;

    return (
        <Html>
            <Head />
            <Preview>{t('preview', { budgetName, percentage })}</Preview>
            <Tailwind>
                <Body className="bg-gray-100">
                    <Container className="mx-auto my-10 bg-white">
                        <Section className="m-6">
                            <Text className="mx-10 text-lg font-bold">
                                {t('greeting', { userName })}
                            </Text>
                            <Text className="mx-10 text-base">
                                {isOverLimit
                                    ? t('overLimitMessage', { budgetName })
                                    : t('nearLimitMessage', { budgetName })}
                            </Text>
                            <Section className={`mx-10 my-4 p-4 rounded-lg ${
                                isOverLimit
                                    ? 'bg-red-50 border-l-4 border-red-500'
                                    : 'bg-yellow-50 border-l-4 border-yellow-500'
                            }`}>
                                <Text className="text-base font-semibold text-gray-800 mb-2">
                                    {budgetName}
                                </Text>
                                <Text className="text-sm text-gray-600">
                                    {t('currentSpending')}: <span className="font-bold">{currency} {currentAmount.toFixed(2)}</span>
                                </Text>
                                <Text className="text-sm text-gray-600">
                                    {t('budgetLimit')}: <span className="font-bold">{currency} {limitAmount.toFixed(2)}</span>
                                </Text>
                                <Text className={`text-lg font-bold mt-2 ${
                                    isOverLimit ? 'text-red-600' : 'text-yellow-600'
                                }`}>
                                    {percentage.toFixed(0)}% {t('used')}
                                </Text>
                            </Section>
                            <Text className="mx-10 text-base">
                                {t('actionMessage')}
                            </Text>
                            <Section className="my-5 text-center">
                                <Button
                                    className="inline-block px-6 py-3 text-base text-white rounded-md bg-slate-900"
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

export default BudgetAlertTemp;
