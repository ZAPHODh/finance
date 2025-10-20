import { getI18n } from "@/locales/server";
import { getCurrentSession } from "@/lib/server/auth/session";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/server/db";
import { VehiclesTable } from "@/components/configuration/vehicles/vehicles-table";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Plus } from "lucide-react";

export default async function VehiclesPage() {
  const t = await getI18n();
  const { user } = await getCurrentSession();

  if (!user) {
    redirect("/");
  }

  const vehicles = await prisma.vehicle.findMany({
    where: {
      userId: user.id,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">{t('shared.configuration.vehicles.title')}</h1>
        </div>
        <Link href="/dashboard/vehicles/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            {t('shared.configuration.vehicles.new')}
          </Button>
        </Link>
      </div>
      <VehiclesTable vehicles={vehicles} />
    </div>
  );
}
