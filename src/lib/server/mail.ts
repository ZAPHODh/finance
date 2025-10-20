
import { Resend } from "resend";
import { generateId } from "../utils";
import { ReactNode } from "react";
import { SendOTPProps, SendWelcomeEmailProps } from "@/types";
import VerificationTemp from "../../../emails/verification";
import ThanksTemp from "../../../emails/thanks";
import SupportConfirmationTemp from "../../../emails/support-confirmation";
import { getScopedI18n } from "@/locales/server";
export const resend = new Resend(process.env.RESEND_API_KEY);

export const sendWelcomeEmail = async ({
    toMail,
    userName,
}: SendWelcomeEmailProps) => {
    const scopedT = await getScopedI18n('emails.thanks')
    const temp = ThanksTemp({ userName }) as ReactNode

    await resend.emails.send({
        from: `Loqano <no-reply@loqano.com>`,
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
        from: `Loqano <no-reply@loqano.com>`,
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
        from: `Loqano Support <no-reply@loqano.com>`,
        to: toMail,
        subject: `We received your support request: ${subject}`,
        headers: {
            "X-Entity-Ref-ID": generateId(),
        },
        react: temp,
        text: "",
    });
};

