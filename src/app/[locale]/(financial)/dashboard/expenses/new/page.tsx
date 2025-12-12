import { ExpenseDialog } from "../_components/expense-dialog";
import { getCurrentSession } from "@/lib/server/auth/session";
import { redirect } from "next/navigation";
import { getExpenseFormData } from "../actions";

export default async function NewExpensePage() {
  const { user } = await getCurrentSession();
  if (!user) redirect("/");

  const { expenseTypes, drivers, vehicles } = await getExpenseFormData();

  return (
    <ExpenseDialog
      mode="create"
      expenseTypes={expenseTypes}
      drivers={drivers}
      vehicles={vehicles}
    />
  );
}
