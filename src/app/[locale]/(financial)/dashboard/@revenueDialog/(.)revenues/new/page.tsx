import { RevenueDialog } from "../../../revenues/_components/revenue-dialog";
import { getCurrentSession } from "@/lib/server/auth/session";
import { redirect } from "next/navigation";
import { getRevenueFormData } from "../../../revenues/actions";

export default async function NewRevenueModal() {
  const { user } = await getCurrentSession();
  if (!user) redirect("/");

  const { platforms, paymentMethods, drivers, vehicles } = await getRevenueFormData();

  return (
    <RevenueDialog
      mode="create"
      platforms={platforms}
      paymentMethods={paymentMethods}
      drivers={drivers}
      vehicles={vehicles}
    />
  );
}
