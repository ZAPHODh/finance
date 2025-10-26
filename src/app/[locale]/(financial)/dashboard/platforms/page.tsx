import { getI18n } from "@/locales/server";
import { PlatformsTable } from "@/components/configuration/platforms/platforms-table";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Plus } from "lucide-react";
import { getPlatformsData } from "./actions";

export default async function PlatformsPage() {
  const t = await getI18n();
  const { platforms } = await getPlatformsData();

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">{t('shared.configuration.platforms.title')}</h1>
        </div>
        <Link href="/dashboard/platforms/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            {t('shared.configuration.platforms.new')}
          </Button>
        </Link>
      </div>
      <PlatformsTable platforms={platforms} />
    </div>
  );
}
