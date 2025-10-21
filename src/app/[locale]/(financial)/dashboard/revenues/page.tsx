import { getI18n } from "@/locales/server";
import { getCurrentSession } from "@/lib/server/auth/session";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/server/db";
import { RevenuesTable } from "@/components/financial/revenues/revenues-table";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Plus } from "lucide-react";

export default async function RevenuesPage() {
  const t = await getI18n();
  const { user } = await getCurrentSession();

  if (!user) {
    redirect("/");
  }

  const [revenues, revenueTypes, companies, drivers, vehicles] = await Promise.all([
    prisma.revenue.findMany({
      where: {
        OR: [
          {
            company: {
              userId: user.id,
            },
          },
          {
            driver: {
              userId: user.id,
            },
          },
        ],
      },
      include: {
        revenueType: {
          select: {
            id: true,
            name: true,
          },
        },
        company: {
          select: {
            id: true,
            name: true,
          },
        },
        paymentMethod: {
          select: {
            id: true,
            name: true,
          },
        },
        driver: {
          select: {
            id: true,
            name: true,
          },
        },
        vehicle: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: {
        date: "desc",
      },
    }),
    prisma.revenueType.findMany({
      where: {
        userId: user.id,
      },
      select: {
        id: true,
        name: true,
      },
      orderBy: {
        name: "asc",
      },
    }),
    prisma.company.findMany({
      where: {
        userId: user.id,
      },
      select: {
        id: true,
        name: true,
      },
      orderBy: {
        name: "asc",
      },
    }),
    prisma.driver.findMany({
      where: {
        userId: user.id,
      },
      select: {
        id: true,
        name: true,
      },
      orderBy: {
        name: "asc",
      },
    }),
    prisma.vehicle.findMany({
      where: {
        userId: user.id,
      },
      select: {
        id: true,
        name: true,
      },
      orderBy: {
        name: "asc",
      },
    }),
  ]);

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">{t('shared.financial.revenues.title')}</h1>
        </div>
        <Link href="/dashboard/revenues/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            {t('shared.financial.revenues.new')}
          </Button>
        </Link>
      </div>
      <RevenuesTable
        revenues={revenues}
        revenueTypes={revenueTypes}
        companies={companies}
        drivers={drivers}
        vehicles={vehicles}
      />
    </div>
  );
}
