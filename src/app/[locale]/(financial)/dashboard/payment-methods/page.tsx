import { getI18n } from "@/locales/server";
import { getCurrentSession } from "@/lib/server/auth/session";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/server/db";
import { PaymentMethodsTable } from "@/components/configuration/payment-methods/payment-methods-table";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Plus } from "lucide-react";

export default async function PaymentMethodsPage() {
  const t = await getI18n();
  const { user } = await getCurrentSession();

  if (!user) {
    redirect("/");
  }

  const paymentMethods = await prisma.paymentMethod.findMany({
    where: {
      userId: user.id,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">{t('shared.configuration.paymentMethods.title')}</h1>
        </div>
        <Link href="/dashboard/payment-methods/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            {t('shared.configuration.paymentMethods.new')}
          </Button>
        </Link>
      </div>
      <PaymentMethodsTable paymentMethods={paymentMethods} />
    </div>
  );
}
