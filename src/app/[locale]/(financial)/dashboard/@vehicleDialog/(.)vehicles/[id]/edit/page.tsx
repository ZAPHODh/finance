import { VehicleDialog } from "../../../../vehicles/_components/vehicle-dialog";
import { prisma } from "@/lib/server/db";
import { notFound } from "next/navigation";

interface EditVehicleModalProps {
  params: Promise<{ id: string }>;
}

export default async function EditVehicleModal({ params }: EditVehicleModalProps) {
  const { id } = await params;

  const vehicle = await prisma.vehicle.findUnique({
    where: { id },
  });

  if (!vehicle) {
    notFound();
  }

  return <VehicleDialog mode="edit" vehicle={vehicle} />;
}
