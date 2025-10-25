import { GoalDialog } from "@/components/goals/goal-dialog";
import { getCurrentSession } from "@/lib/server/auth/session";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/server/db";

export default async function NewGoalModal() {
  const { user } = await getCurrentSession();
  if (!user) redirect("/");

  const [drivers, vehicles] = await Promise.all([
    prisma.driver.findMany({
      where: { userId: user.id },
      select: { id: true, name: true },
      orderBy: { name: "asc" },
    }),
    prisma.vehicle.findMany({
      where: { userId: user.id },
      select: { id: true, name: true },
      orderBy: { name: "asc" },
    }),
  ]);

  return (
    <GoalDialog
      mode="create"
      drivers={drivers}
      vehicles={vehicles}
    />
  );
}
