import { RevenueTypeDialog } from "@/components/configuration/revenue-types/revenue-type-dialog";
import { prisma } from "@/lib/server/db";
import { notFound } from "next/navigation";

interface EditRevenueTypeModalProps {
  params: Promise<{ id: string }>;
}

export default async function EditRevenueTypeModal({ params }: EditRevenueTypeModalProps) {
  const { id } = await params;

  const revenueType = await prisma.revenueType.findUnique({
    where: { id },
  });

  if (!revenueType) {
    notFound();
  }

  return <RevenueTypeDialog mode="edit" revenueType={revenueType} />;
}
