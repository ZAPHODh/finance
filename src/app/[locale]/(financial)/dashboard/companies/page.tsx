import { getI18n } from "@/locales/server";
import { CompaniesTable } from "@/components/configuration/companies/companies-table";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Plus } from "lucide-react";
import { getCompaniesData } from "./actions";

export default async function CompaniesPage() {
  const t = await getI18n();
  const { companies } = await getCompaniesData();

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">{t('shared.configuration.companies.title')}</h1>
        </div>
        <Link href="/dashboard/companies/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            {t('shared.configuration.companies.new')}
          </Button>
        </Link>
      </div>
      <CompaniesTable companies={companies} />
    </div>
  );
}
