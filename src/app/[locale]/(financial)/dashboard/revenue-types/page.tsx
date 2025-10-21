import { getI18n } from "@/locales/server";
import { RevenueTypesTable } from "@/components/configuration/revenue-types/revenue-types-table";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Plus } from "lucide-react";
import { getRevenueTypesData } from "./actions";

export default async function RevenueTypesPage() {
  const t = await getI18n();
  const { revenueTypes } = await getRevenueTypesData();

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">{t('shared.configuration.revenueTypes.title')}</h1>
        </div>
        <Link href="/dashboard/revenue-types/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            {t('shared.configuration.revenueTypes.new')}
          </Button>
        </Link>
      </div>
      <RevenueTypesTable revenueTypes={revenueTypes} />
    </div>
  );
}
