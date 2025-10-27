import { getI18n } from "@/locales/server";
import { DriversTable } from "@/components/configuration/drivers/drivers-table";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Plus } from "lucide-react";
import { getDriversData } from "./actions";

export default async function DriversPage() {
  const t = await getI18n();
  const { drivers } = await getDriversData();

  return (
    <div className="container mx-auto px-4 md:px-0 py-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">{t('shared.configuration.drivers.title')}</h1>
        </div>
        <Link href="/dashboard/drivers/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            {t('shared.configuration.drivers.new')}
          </Button>
        </Link>
      </div>
      <DriversTable drivers={drivers} />
    </div>
  );
}
