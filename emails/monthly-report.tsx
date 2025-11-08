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

interface MonthlyReportTemplateProps {
    userName: string;
    month: string;
    year: string;
    totalRevenue: number;
    totalExpenses: number;
    profit: number;
    topExpenseCategory: string;
    topExpenseAmount: number;
    daysWorked: number;
    currency: string;
}

const MonthlyReportTemp: React.FC<Readonly<MonthlyReportTemplateProps>> = async ({
    userName = "User",
    month = "Janeiro",
    year = "2025",
    totalRevenue = 15000,
    totalExpenses = 5500,
    profit = 9500,
    topExpenseCategory = "Combustível",
    topExpenseAmount = 2800,
    daysWorked = 22,
    currency = "R$",
}) => {
    const t = await getScopedI18n('emails.monthlyReport');
    const avgDailyRevenue = daysWorked > 0 ? (totalRevenue / daysWorked).toFixed(2) : 0;

    return (
        <Html>
            <Head />
            <Preview>{t('preview', { month, year })}</Preview>
            <Tailwind>
                <Body className="bg-gray-100">
                    <Container className="mx-auto my-10 bg-white">
                        <Section className="m-6">
                            <Text className="mx-10 text-xl font-bold text-center text-slate-900">
                                {t('title', { month, year })}
                            </Text>
                            <Text className="mx-10 text-lg font-bold mt-4">
                                {t('greeting', { userName })}
                            </Text>
                            <Text className="mx-10 text-base">
                                {t('introMessage', { month })}
                            </Text>

                            <Section className="mx-10 my-4">
                                <div className="grid grid-cols-2 gap-3">
                                    <Section className="p-4 bg-green-50 rounded-lg">
                                        <Text className="text-xs font-semibold text-gray-700 uppercase">
                                            {t('revenue')}
                                        </Text>
                                        <Text className="text-xl font-bold text-green-600">
                                            {currency} {totalRevenue.toFixed(2)}
                                        </Text>
                                    </Section>

                                    <Section className="p-4 bg-red-50 rounded-lg">
                                        <Text className="text-xs font-semibold text-gray-700 uppercase">
                                            {t('expenses')}
                                        </Text>
                                        <Text className="text-xl font-bold text-red-600">
                                            {currency} {totalExpenses.toFixed(2)}
                                        </Text>
                                    </Section>

                                    <Section className="p-4 bg-blue-50 rounded-lg">
                                        <Text className="text-xs font-semibold text-gray-700 uppercase">
                                            {t('profit')}
                                        </Text>
                                        <Text className="text-xl font-bold text-blue-600">
                                            {currency} {profit.toFixed(2)}
                                        </Text>
                                    </Section>

                                    <Section className="p-4 bg-purple-50 rounded-lg">
                                        <Text className="text-xs font-semibold text-gray-700 uppercase">
                                            {t('daysWorked')}
                                        </Text>
                                        <Text className="text-xl font-bold text-purple-600">
                                            {daysWorked} {t('days')}
                                        </Text>
                                    </Section>
                                </div>
                            </Section>

                            <Section className="mx-10 my-4 p-4 bg-gray-50 rounded-lg">
                                <Text className="text-sm font-semibold text-gray-800 mb-2">
                                    {t('insights')}
                                </Text>
                                <Text className="text-sm text-gray-700">
                                    {t('avgDailyRevenue')}: <span className="font-bold">{currency} {avgDailyRevenue}</span>
                                </Text>
                                <Text className="text-sm text-gray-700">
                                    {t('topExpense')}: <span className="font-bold">{topExpenseCategory}</span> ({currency} {topExpenseAmount.toFixed(2)})
                                </Text>
                            </Section>

                            <Text className="mx-10 text-base">
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

export default MonthlyReportTemp;
