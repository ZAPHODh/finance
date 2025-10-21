import { ExpenseDialog } from "@/components/financial/expenses/expense-dialog";
import { getCurrentSession } from "@/lib/server/auth/session";
import { redirect } from "next/navigation";
import { getExpenseFormData } from "../actions";

export default async function NewExpensePage() {
  const { user } = await getCurrentSession();
  if (!user) redirect("/");

  const { expenseTypes, paymentMethods, drivers, vehicles } = await getExpenseFormData();

  return (
    <ExpenseDialog
      mode="create"
      expenseTypes={expenseTypes}
      paymentMethods={paymentMethods}
      drivers={drivers}
      vehicles={vehicles}
    />
  );
}
