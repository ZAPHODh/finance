import { getI18n } from "@/locales/server";
import { PaymentMethodsTable } from "@/components/configuration/payment-methods/payment-methods-table";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Plus } from "lucide-react";
import { getPaymentMethodsData } from "./actions";

export default async function PaymentMethodsPage() {
  const t = await getI18n();
  const { paymentMethods } = await getPaymentMethodsData();

  return (
    <div className="container mx-auto px-4 md:px-0 py-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">{t('configuration.paymentMethods.title')}</h1>
        </div>
        <Link href="/dashboard/payment-methods/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            {t('configuration.paymentMethods.new')}
          </Button>
        </Link>
      </div>
      <PaymentMethodsTable paymentMethods={paymentMethods} />
    </div>
  );
}
