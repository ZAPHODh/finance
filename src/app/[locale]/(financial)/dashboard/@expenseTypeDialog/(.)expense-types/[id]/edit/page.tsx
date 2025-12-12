import { ExpenseTypeDialog } from "../../../../expense-types/_components/expense-type-dialog";
import { prisma } from "@/lib/server/db";
import { notFound } from "next/navigation";

interface EditExpenseTypeModalProps {
  params: Promise<{ id: string }>;
}

export default async function EditExpenseTypeModal({ params }: EditExpenseTypeModalProps) {
  const { id } = await params;

  const expenseType = await prisma.expenseType.findUnique({
    where: { id },
  });

  if (!expenseType) {
    notFound();
  }

  return <ExpenseTypeDialog mode="edit" expenseType={expenseType} />;
}
