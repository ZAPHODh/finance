
import { Resend } from "resend";
import { ReactNode } from "react";
import { SendOTPProps, SendWelcomeEmailProps } from "@/types";
import VerificationTemp from "../../../emails/verification";
import ThanksTemp from "../../../emails/thanks";
import SupportConfirmationTemp from "../../../emails/support-confirmation";
import BudgetAlertTemp from "../../../emails/budget-alert";
import GoalAchievementTemp from "../../../emails/goal-achievement";
import WeeklySummaryTemp from "../../../emails/weekly-summary";
import MonthlyReportTemp from "../../../emails/monthly-report";
import NewFeaturesTemp from "../../../emails/new-features";
import TipsAndTricksTemp from "../../../emails/tips-and-tricks";
import { getScopedI18n } from "@/locales/server";
import { generateId } from "../utils";
export const resend = new Resend(process.env.RESEND_API_KEY);

export const sendWelcomeEmail = async ({
    toMail,
    userName,
}: SendWelcomeEmailProps) => {
    const scopedT = await getScopedI18n('emails.thanks')
    const temp = ThanksTemp({ userName }) as ReactNode

    await resend.emails.send({
        from: `Dive into Drive <no-reply@diveintodrive.com>`,
        to: toMail,
        subject: scopedT('subject'),
        headers: {
            "X-Entity-Ref-ID": generateId(),
        },
        react: temp,
        text: "",
    });
};

export const sendOTP = async ({ toMail, code, userName }: SendOTPProps) => {
    const scopedT = await getScopedI18n('emails.verification')
    const temp = VerificationTemp({ userName, code }) as ReactNode
    await resend.emails.send({
        from: `Dive into Drive <no-reply@diveintodrive.com>`,
        to: toMail,
        subject: scopedT('subject'),
        headers: {
            "X-Entity-Ref-ID": generateId(),
        },
        react: temp,
        text: "",
    });

};

interface SendSupportConfirmationProps {
    toMail: string;
    userName: string;
    subject: string;
}

export const sendSupportConfirmation = async ({
    toMail,
    userName,
    subject,
}: SendSupportConfirmationProps) => {
    const temp = SupportConfirmationTemp({ userName, subject }) as ReactNode;

    await resend.emails.send({
        from: `Dive into Drive Support <support@diveintodrive.com>`,
        to: toMail,
        subject: `We received your support request: ${subject}`,
        headers: {
            "X-Entity-Ref-ID": generateId(),
        },
        react: temp,
        text: "",
    });
};

interface SendBudgetAlertProps {
    toMail: string;
    userName: string;
    budgetName: string;
    currentAmount: number;
    limitAmount: number;
    percentage: number;
    currency: string;
}

export const sendBudgetAlert = async ({
    toMail,
    userName,
    budgetName,
    currentAmount,
    limitAmount,
    percentage,
    currency,
}: SendBudgetAlertProps) => {
    const t = await getScopedI18n('emails.budgetAlert');
    const temp = BudgetAlertTemp({
        userName,
        budgetName,
        currentAmount,
        limitAmount,
        percentage,
        currency,
    }) as ReactNode;

    await resend.emails.send({
        from: `Dive into Drive <no-reply@diveintodrive.com>`,
        to: toMail,
        subject: t('preview', { budgetName, percentage: percentage.toFixed(0) }),
        headers: {
            "X-Entity-Ref-ID": generateId(),
        },
        react: temp,
        text: "",
    });
};

interface SendGoalAchievementProps {
    toMail: string;
    userName: string;
    goalName: string;
    targetValue: number;
    currentValue: number;
    currency: string;
}

export const sendGoalAchievement = async ({
    toMail,
    userName,
    goalName,
    targetValue,
    currentValue,
    currency,
}: SendGoalAchievementProps) => {
    const t = await getScopedI18n('emails.goalAchievement');
    const temp = GoalAchievementTemp({
        userName,
        goalName,
        targetValue,
        currentValue,
        currency,
    }) as ReactNode;

    await resend.emails.send({
        from: `Dive into Drive <no-reply@diveintodrive.com>`,
        to: toMail,
        subject: t('preview', { goalName }),
        headers: {
            "X-Entity-Ref-ID": generateId(),
        },
        react: temp,
        text: "",
    });
};

interface SendWeeklySummaryProps {
    toMail: string;
    userName: string;
    weekStart: string;
    weekEnd: string;
    totalRevenue: number;
    totalExpenses: number;
    profit: number;
    currency: string;
}

export const sendWeeklySummary = async ({
    toMail,
    userName,
    weekStart,
    weekEnd,
    totalRevenue,
    totalExpenses,
    profit,
    currency,
}: SendWeeklySummaryProps) => {
    const t = await getScopedI18n('emails.weeklySummary');
    const temp = WeeklySummaryTemp({
        userName,
        weekStart,
        weekEnd,
        totalRevenue,
        totalExpenses,
        profit,
        currency,
    }) as ReactNode;

    await resend.emails.send({
        from: `Dive into Drive <no-reply@diveintodrive.com>`,
        to: toMail,
        subject: t('preview', { weekStart, weekEnd }),
        headers: {
            "X-Entity-Ref-ID": generateId(),
        },
        react: temp,
        text: "",
    });
};

interface SendMonthlyReportProps {
    toMail: string;
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

export const sendMonthlyReport = async ({
    toMail,
    userName,
    month,
    year,
    totalRevenue,
    totalExpenses,
    profit,
    topExpenseCategory,
    topExpenseAmount,
    daysWorked,
    currency,
}: SendMonthlyReportProps) => {
    const t = await getScopedI18n('emails.monthlyReport');
    const temp = MonthlyReportTemp({
        userName,
        month,
        year,
        totalRevenue,
        totalExpenses,
        profit,
        topExpenseCategory,
        topExpenseAmount,
        daysWorked,
        currency,
    }) as ReactNode;

    await resend.emails.send({
        from: `Dive into Drive <no-reply@diveintodrive.com>`,
        to: toMail,
        subject: t('preview', { month, year }),
        headers: {
            "X-Entity-Ref-ID": generateId(),
        },
        react: temp,
        text: "",
    });
};

interface SendNewFeaturesProps {
    toMail: string;
    userName: string;
}

export const sendNewFeatures = async ({
    toMail,
    userName,
}: SendNewFeaturesProps) => {
    const t = await getScopedI18n('emails.newFeatures');
    const temp = NewFeaturesTemp({ userName }) as ReactNode;

    await resend.emails.send({
        from: `Dive into Drive <no-reply@diveintodrive.com>`,
        to: toMail,
        subject: t('preview'),
        headers: {
            "X-Entity-Ref-ID": generateId(),
        },
        react: temp,
        text: "",
    });
};

interface SendTipsAndTricksProps {
    toMail: string;
    userName: string;
}

export const sendTipsAndTricks = async ({
    toMail,
    userName,
}: SendTipsAndTricksProps) => {
    const t = await getScopedI18n('emails.tipsAndTricks');
    const temp = TipsAndTricksTemp({ userName }) as ReactNode;

    await resend.emails.send({
        from: `Dive into Drive <no-reply@diveintodrive.com>`,
        to: toMail,
        subject: t('preview'),
        headers: {
            "X-Entity-Ref-ID": generateId(),
        },
        react: temp,
        text: "",
    });
};

