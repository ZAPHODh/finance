import { getI18n } from "@/locales/server";
import { getCurrentSession } from "@/lib/server/auth/session";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/server/db";
import { ExpenseTypesTable } from "@/components/configuration/expense-types/expense-types-table";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Plus } from "lucide-react";

export default async function ExpenseTypesPage() {
  const t = await getI18n();
  const { user } = await getCurrentSession();

  if (!user) {
    redirect("/");
  }

  const expenseTypes = await prisma.expenseType.findMany({
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
          <h1 className="text-3xl font-bold">{t('shared.configuration.expenseTypes.title')}</h1>
        </div>
        <Link href="/dashboard/expense-types/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            {t('shared.configuration.expenseTypes.new')}
          </Button>
        </Link>
      </div>
      <ExpenseTypesTable expenseTypes={expenseTypes} />
    </div>
  );
}
