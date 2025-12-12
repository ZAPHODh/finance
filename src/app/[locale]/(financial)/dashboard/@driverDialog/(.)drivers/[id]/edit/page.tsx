import { DriverDialog } from "../../../../drivers/_components/driver-dialog";
import { prisma } from "@/lib/server/db";
import { notFound } from "next/navigation";

interface EditDriverModalProps {
  params: Promise<{ id: string }>;
}

export default async function EditDriverModal({ params }: EditDriverModalProps) {
  const { id } = await params;

  const driver = await prisma.driver.findUnique({
    where: { id },
  });

  if (!driver) {
    notFound();
  }

  return <DriverDialog mode="edit" driver={driver} />;
}
