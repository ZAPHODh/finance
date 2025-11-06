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
    <div className="container mx-auto px-4 md:px-0 py-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">{t('configuration.platforms.title')}</h1>
        </div>
        <Link href="/dashboard/platforms/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            {t('configuration.platforms.new')}
          </Button>
        </Link>
      </div>
      <PlatformsTable platforms={platforms} />
    </div>
  );
}
