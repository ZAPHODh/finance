import { redirect } from "next/navigation";
import AuthForm from "@/components/layout/auth-form";
import { Card } from "@/components/ui/card";
import { getCurrentSession } from "@/lib/server/auth/session";

interface LoginPageProps {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function Login({ searchParams }: LoginPageProps) {
    const { session } = await getCurrentSession();
    const params = await searchParams;

    const plan = typeof params.plan === 'string' ? params.plan : undefined;
    const interval = typeof params.interval === 'string' ? params.interval : undefined;

    if (session) {
        if (plan && (plan === 'simple' || plan === 'pro')) {
            const queryParams = new URLSearchParams({ plan });
            if (interval) queryParams.append('interval', interval);
            return redirect(`/dashboard/billing?${queryParams.toString()}`);
        }
        return redirect("/dashboard");
    }

    return (
        <section>
            <div className="container mx-auto">
                <div className="flex min-h-[calc(100vh-184px)] items-center justify-center md:min-h-[calc(100vh-160px)]">
                    <Card className="w-full max-w-[450px] p-6 shadow-md">
                        <h2 className="pb-2 text-center text-3xl font-semibold tracking-tight transition-colors">
                            Login
                        </h2>
                        <AuthForm plan={plan} interval={interval} />
                    </Card>
                </div>
            </div>
        </section>
    );
}