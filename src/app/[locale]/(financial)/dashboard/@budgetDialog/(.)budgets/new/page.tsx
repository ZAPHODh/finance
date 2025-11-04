import { BudgetDialog } from "@/components/budgets/budget-dialog";
import { getCurrentSession } from "@/lib/server/auth/session";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/server/db";
import { getExpenseTypesData } from "../../../expense-types/actions";

export default async function NewBudgetModal() {
  const { user } = await getCurrentSession();
  if (!user) redirect("/");

  const expenseTypes = await prisma.expenseType.findMany({
    where: { userId: user.id },
    select: { id: true, name: true },
    orderBy: { name: "asc" },
  });

  return (
    <BudgetDialog
      mode="create"
      expenseTypes={expenseTypes}
    />
  );
}
