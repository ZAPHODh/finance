import { getI18n } from "@/locales/server";
import { getCurrentSession } from "@/lib/server/auth/session";
import { redirect } from "next/navigation";
import { getExpensesData } from "./actions";
import { ExpensesTable } from "@/components/financial/expenses/expenses-table";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Plus } from "lucide-react";

export default async function ExpensesPage() {
  const t = await getI18n();
  const { user } = await getCurrentSession();

  if (!user) {
    redirect("/");
  }

  const { expenses, expenseTypes, drivers, vehicles } = await getExpensesData();

  return (
    <div className="container mx-auto px-4 md:px-0 py-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">{t('financial.expenses.title')}</h1>
        </div>
        <Link href="/dashboard/expenses/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            {t('financial.expenses.new')}
          </Button>
        </Link>
      </div>
      <ExpensesTable
        expenses={expenses}
        expenseTypes={expenseTypes}
        drivers={drivers}
        vehicles={vehicles}
      />
    </div>
  );
}
