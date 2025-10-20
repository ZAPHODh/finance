import { redirect } from "next/navigation";
import LoginModal from "@/components/layout/login-modal";
import { getCurrentSession } from "@/lib/server/auth/session";

export default async function Login() {
    const { session } = await getCurrentSession();
    if (session) return redirect("/projects");
    return <LoginModal />;
}