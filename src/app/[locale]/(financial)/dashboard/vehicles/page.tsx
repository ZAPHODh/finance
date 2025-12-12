import { getI18n } from "@/locales/server";
import { VehiclesTable } from "./_components/vehicles-table";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Plus } from "lucide-react";
import { getVehiclesData } from "./actions";

export default async function VehiclesPage() {
  const t = await getI18n();
  const { vehicles } = await getVehiclesData();

  return (
    <div className="container mx-auto px-4 md:px-0 py-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">{t('configuration.vehicles.title')}</h1>
        </div>
        <Link href="/dashboard/vehicles/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            {t('configuration.vehicles.new')}
          </Button>
        </Link>
      </div>
      <VehiclesTable vehicles={vehicles} />
    </div>
  );
}
