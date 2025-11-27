import { DailyEntryDialog } from "@/components/financial/daily-entry-dialog";
import { getCurrentSession } from "@/lib/server/auth/session";
import { redirect } from "next/navigation";
import { getDailyEntryConfig } from "../../../daily-entry/queries";

export default async function DailyEntryDialogPage() {
  const { user } = await getCurrentSession();
  if (!user) redirect("/");

  const config = await getDailyEntryConfig();

  return <DailyEntryDialog mode="create" config={config} />;
}
