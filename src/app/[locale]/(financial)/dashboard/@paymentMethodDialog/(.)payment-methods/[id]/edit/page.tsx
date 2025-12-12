import { PaymentMethodDialog } from "../../../../payment-methods/_components/payment-method-dialog";
import { prisma } from "@/lib/server/db";
import { notFound } from "next/navigation";

interface EditPaymentMethodModalProps {
  params: Promise<{ id: string }>;
}

export default async function EditPaymentMethodModal({ params }: EditPaymentMethodModalProps) {
  const { id } = await params;

  const paymentMethod = await prisma.paymentMethod.findUnique({
    where: { id },
  });

  if (!paymentMethod) {
    notFound();
  }

  return <PaymentMethodDialog mode="edit" paymentMethod={paymentMethod} />;
}
