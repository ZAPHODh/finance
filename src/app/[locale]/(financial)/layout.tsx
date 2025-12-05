import { getCurrentSession } from "@/lib/server/auth/session";
import { redirect } from "next/navigation";

export default async function FinancialLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = await getCurrentSession();

  if (!user) redirect("/login");

  if (!user.hasCompletedOnboarding) redirect("/onboarding");

  return <>{children}</>;
}
