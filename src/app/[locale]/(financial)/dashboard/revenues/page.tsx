import { getI18n } from "@/locales/server";
import { getCurrentSession } from "@/lib/server/auth/session";
import { redirect } from "next/navigation";
import { getRevenuesData } from "./actions";
import { RevenuesTable } from "@/components/financial/revenues/revenues-table";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Plus } from "lucide-react";

export default async function RevenuesPage() {
  const t = await getI18n();
  const { user } = await getCurrentSession();

  if (!user) {
    redirect("/");
  }

  const { revenues, platforms, drivers, vehicles } = await getRevenuesData();

  return (
    <div className="container mx-auto px-4 md:px-0 py-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">{t('shared.financial.revenues.title')}</h1>
        </div>
        <Link href="/dashboard/revenues/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            {t('shared.financial.revenues.new')}
          </Button>
        </Link>
      </div>
      <RevenuesTable
        revenues={revenues}
        platforms={platforms}
        drivers={drivers}
        vehicles={vehicles}
      />
    </div>
  );
}
