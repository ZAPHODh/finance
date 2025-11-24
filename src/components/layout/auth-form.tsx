"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useForm } from "@tanstack/react-form";
import { Button, buttonVariants } from "@/components/ui/button";

import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { Field, FieldLabel, FieldError } from "@/components/ui/field";
import { toast } from "sonner";
import { LoaderCircle } from "lucide-react";
import Icons from "@/components/shared/icons";
import { useScopedI18n } from "@/locales/client";
import { useRouter } from "next/navigation";
import { setCheckoutCookies } from "@/lib/checkout-cookies";

interface AuthFormProps {
    plan?: string;
    interval?: string;
}

export default function AuthForm({ plan, interval }: AuthFormProps) {
    const t = useScopedI18n('auth')
    const { push } = useRouter()
    const [currentStep, setCurrentStep] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const [isGoogleLoading, setIsGoogleLoading] = useState(false);
    const [isFacebookLoading, setIsFacebookLoading] = useState(false);
    const [isVerifying, setIsVerifying] = useState(false);
    const [otp, setOTP] = useState("");
    const [countdown, setCountdown] = useState(30);

    const form = useForm({
        defaultValues: {
            email: "",
        },
        onSubmit: async ({ value }) => {
            await onEmailSubmit(value);
        },
    });

    useEffect(() => {
        let intervalId: NodeJS.Timeout | undefined;

        if (countdown > 0) {
            intervalId = setInterval(() => {
                setCountdown((prev) => prev - 1);
            }, 1000);

            return () => {
                if (intervalId) {
                    clearInterval(intervalId);
                }
            };
        }
    }, [countdown]);

    async function onEmailSubmit(data: { email: string }) {
        setIsLoading(true);

        try {
            const res = await fetch("/api/auth/login/send-otp", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });

            if (!res.ok) {
                throw new Error(await res.text());
            }
            setCurrentStep(2);
            toast.success(
                t('otpSent'), {
                description: t('otpSentDesc'),
            }
            );
            setCountdown(30);
        } catch (error) {
            const errorMessage =
                error instanceof Error ? error.message : t('otpFailed');
            toast.error(t('otpFailed'), {
                description: errorMessage,
            });
        } finally {
            setIsLoading(false);
        }
    }

    async function onOTPSubmit(data: { email: string }) {
        setIsVerifying(true);

        try {
            const res = await fetch("/api/auth/login/verify-otp", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email: data.email, code: otp }),
            });

            if (!res.ok) {
                throw new Error(await res.text());
            }
            setCountdown(0);
            form.reset();
            toast.success(
                t('verifiedSuccess')
            );

            if (plan && (plan === 'simple' || plan === 'pro')) {
                const queryParams = new URLSearchParams({ plan });
                if (interval) queryParams.append('interval', interval);
                push(`/dashboard/billing?${queryParams.toString()}`);
            } else {
                push('/dashboard');
            }
        } catch (error) {
            const errorMessage =
                error instanceof Error ? error.message : "Something went wrong";
            toast.error(
                t('verifyFailed'), {
                description: errorMessage,
            });
        } finally {
            setIsVerifying(false);
        }
    }

    async function handleResend() {
        const email = form.getFieldValue("email");
        if (!email) return;
        setCountdown(0);
        setOTP("");
        await onEmailSubmit({ email });
    }

    return (
        <div className={cn("mt-4 flex max-w-full flex-col gap-4")}>
            {currentStep === 1 && (
                <>
                    <form
                        onSubmit={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            form.handleSubmit();
                        }}
                    >
                        <div className="flex flex-col gap-2.5">
                            <form.Field
                                name="email"
                                validators={{
                                    onChange: ({ value }) => {
                                        if (!value) return t('emailRequired');
                                        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
                                            return t('emailInvalid');
                                        }
                                        return undefined;
                                    },
                                }}
                            >
                                {(field) => (
                                    <Field>
                                        <FieldLabel className="sr-only" htmlFor={field.name}>
                                            Email
                                        </FieldLabel>
                                        <Input
                                            id={field.name}
                                            placeholder={t("emailPlaceholder")}
                                            type="email"
                                            disabled={isLoading || isGoogleLoading || isFacebookLoading}
                                            value={field.state.value}
                                            onBlur={field.handleBlur}
                                            onChange={(e) => field.handleChange(e.target.value)}
                                        />
                                        <FieldError>
                                            {field.state.meta.errors?.[0] && (
                                                <p className="mt-2 text-xs text-destructive">
                                                    {field.state.meta.errors[0]}
                                                </p>
                                            )}
                                        </FieldError>
                                    </Field>
                                )}
                            </form.Field>
                            <button
                                type="submit"
                                className={cn(buttonVariants())}
                                disabled={isLoading || isFacebookLoading || isVerifying}
                            >
                                {isLoading && (
                                    <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                                )}
                                {t("sendOtp")}
                            </button>
                        </div>
                    </form>
                    <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-background px-2 text-muted-foreground">/</span>
                    </div>
                    {isGoogleLoading ? (
                        <Button className="w-full cursor-not-allowed" variant="outline">
                            <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                        </Button>
                    ) : (
                        <Link
                            href="/api/auth/login/google"
                            className={cn(buttonVariants({ variant: "outline" }))}
                            onClick={() => {
                                if (plan && interval) {
                                    setCheckoutCookies(plan, interval);
                                }
                                setIsGoogleLoading(true);
                            }}
                        >
                            {t("continueWith")} <Icons.google className="ml-2 h-4 w-4" />
                        </Link>
                    )}
                    {isFacebookLoading ? (
                        <Button className="w-full cursor-not-allowed" variant="outline">
                            <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                        </Button>
                    ) : (
                        <Link
                            href="/api/auth/login/facebook"
                            className={cn(buttonVariants({ variant: "outline" }))}
                            onClick={() => {
                                if (plan && interval) {
                                    setCheckoutCookies(plan, interval);
                                }
                                setIsFacebookLoading(true);
                            }}
                        >
                            {t("continueWith")} <Icons.facebook className="ml-2 h-4 w-4" />
                        </Link>
                    )}
                </>
            )}
            {currentStep === 2 && (
                <>
                    <p className="mb-4 text-center">
                        <span className="break-all">
                            {t("otpSentTo", { email: form.getFieldValue("email") })}
                        </span>{" "}
                        {t("verifyDesc")}
                    </p>
                    <form
                        onSubmit={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            onOTPSubmit({ email: form.getFieldValue("email") });
                        }}
                        className="flex flex-col gap-2.5"
                    >
                        <Field>
                            <FieldLabel className="sr-only" htmlFor="otp">
                                {t('enterOtp')}
                            </FieldLabel>
                            <div className="">
                                <InputOTP
                                    id="otp"
                                    autoFocus
                                    disabled={isLoading}
                                    value={otp}
                                    onChange={setOTP}
                                    maxLength={6}
                                    className="flex justify-between"
                                >
                                    <InputOTPGroup className="flex w-full items-center justify-between [&>div]:rounded-md [&>div]:border">
                                        <InputOTPSlot index={0} />
                                        <InputOTPSlot index={1} />
                                        <InputOTPSlot index={2} />
                                        <InputOTPSlot index={3} />
                                        <InputOTPSlot index={4} />
                                        <InputOTPSlot index={5} />
                                    </InputOTPGroup>
                                </InputOTP>
                            </div>
                        </Field>
                        <Button
                            type="submit"
                            disabled={isVerifying || otp.length !== 6}
                            className="mt-4"
                        >
                            {isVerifying && (
                                <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                            )}
                            {t("verifyOtp")}
                        </Button>
                    </form>
                    <div className="mt-4 flex items-center justify-between text-sm text-gray-600">
                        <span>{t("didNotReceive")}</span>
                        {countdown > 0 ? (
                            <span>{t("resendIn", { countdown })}</span>
                        ) : (
                            <Button
                                variant="link"
                                onClick={handleResend}
                                className="h-auto p-0"
                                disabled={isLoading}
                            >
                                {isLoading ? t("resending") : t("resend")}
                            </Button>
                        )}
                    </div>
                </>
            )}
        </div>
    );
}