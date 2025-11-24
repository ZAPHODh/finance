import { redirect } from "next/navigation";
import LoginModal from "@/components/layout/login-modal";
import { getCurrentSession } from "@/lib/server/auth/session";

interface LoginModalPageProps {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function Login({ searchParams }: LoginModalPageProps) {
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

    return <LoginModal plan={plan} interval={interval} />;
}