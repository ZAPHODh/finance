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

interface WeeklySummaryTemplateProps {
    userName: string;
    weekStart: string;
    weekEnd: string;
    totalRevenue: number;
    totalExpenses: number;
    profit: number;
    currency: string;
}

const WeeklySummaryTemp: React.FC<Readonly<WeeklySummaryTemplateProps>> = async ({
    userName = "User",
    weekStart = "01/01/2025",
    weekEnd = "07/01/2025",
    totalRevenue = 3500,
    totalExpenses = 1200,
    profit = 2300,
    currency = "R$",
}) => {
    const t = await getScopedI18n('emails.weeklySummary');
    const profitPercentage = totalRevenue > 0 ? ((profit / totalRevenue) * 100).toFixed(1) : 0;

    return (
        <Html>
            <Head />
            <Preview>{t('preview', { weekStart, weekEnd })}</Preview>
            <Tailwind>
                <Body className="bg-gray-100">
                    <Container className="mx-auto my-10 bg-white">
                        <Section className="m-6">
                            <Text className="mx-10 text-lg font-bold">
                                {t('greeting', { userName })}
                            </Text>
                            <Text className="mx-10 text-base">
                                {t('introMessage', { weekStart, weekEnd })}
                            </Text>

                            {/* Revenue Card */}
                            <Section className="mx-10 my-3 p-4 bg-green-50 border-l-4 border-green-500 rounded-lg">
                                <Text className="text-sm font-semibold text-gray-700">
                                    {t('revenue')}
                                </Text>
                                <Text className="text-2xl font-bold text-green-600">
                                    {currency} {totalRevenue.toFixed(2)}
                                </Text>
                            </Section>

                            {/* Expenses Card */}
                            <Section className="mx-10 my-3 p-4 bg-red-50 border-l-4 border-red-500 rounded-lg">
                                <Text className="text-sm font-semibold text-gray-700">
                                    {t('expenses')}
                                </Text>
                                <Text className="text-2xl font-bold text-red-600">
                                    {currency} {totalExpenses.toFixed(2)}
                                </Text>
                            </Section>

                            {/* Profit Card */}
                            <Section className={`mx-10 my-3 p-4 rounded-lg border-l-4 ${
                                profit >= 0
                                    ? 'bg-blue-50 border-blue-500'
                                    : 'bg-orange-50 border-orange-500'
                            }`}>
                                <Text className="text-sm font-semibold text-gray-700">
                                    {t('profit')}
                                </Text>
                                <Text className={`text-2xl font-bold ${
                                    profit >= 0 ? 'text-blue-600' : 'text-orange-600'
                                }`}>
                                    {currency} {profit.toFixed(2)}
                                </Text>
                                <Text className="text-xs text-gray-600 mt-1">
                                    {profitPercentage}% {t('profitMargin')}
                                </Text>
                            </Section>

                            <Text className="mx-10 text-base mt-4">
                                {t('detailsMessage')}
                            </Text>

                            <Section className="my-5 text-center">
                                <Button
                                    className="inline-block px-6 py-3 text-base text-white rounded-md bg-slate-900"
                                    href={`${process.env.NEXT_PUBLIC_APP_URL}/dashboard/reports`}
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

export default WeeklySummaryTemp;
