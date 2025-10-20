import { getCurrentSession } from "@/lib/server/auth/session"
import { getScopedI18n } from "@/locales/server"
import { redirect } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"

export default async function BillingPage() {
  const { user } = await getCurrentSession()
  if (!user) redirect("/login")

  const t = await getScopedI18n("shared.userPages.billing")

  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h1 className="text-3xl font-bold">{t("title")}</h1>
        <p className="text-muted-foreground">{t("description")}</p>
      </div>

      <Separator />

      <div className="space-y-4">
        <div>
          <h2 className="text-lg font-semibold">{t("currentPlanTitle")}</h2>
          <p className="text-sm text-muted-foreground">{t("currentPlanDescription")}</p>
        </div>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-2xl font-bold">{t("freePlan")}</h3>
                <Badge variant="secondary">{t("current")}</Badge>
              </div>
              <p className="text-sm text-muted-foreground">{t("freePlanDescription")}</p>
            </div>
            <div className="text-right">
              <p className="text-3xl font-bold">R$0</p>
              <p className="text-sm text-muted-foreground">{t("perMonth")}</p>
            </div>
          </div>
          <div className="pt-4">
            <Button className="w-full">{t("upgradeToPro")}</Button>
          </div>
        </div>
      </div>

      <Separator />

      <div className="space-y-4">
        <div>
          <h2 className="text-lg font-semibold">{t("paymentMethodTitle")}</h2>
          <p className="text-sm text-muted-foreground">{t("paymentMethodDescription")}</p>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-16 items-center justify-center rounded-md border bg-muted">
              <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M2 8.5h20M2 15.5h20M6 12h.01M10 12h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <div>
              <p className="font-medium">{t("noPaymentMethod")}</p>
              <p className="text-sm text-muted-foreground">{t("addPaymentMethodDescription")}</p>
            </div>
          </div>
          <Button variant="outline">{t("addPaymentMethod")}</Button>
        </div>
      </div>

      <Separator />

      <div className="space-y-4">
        <div>
          <h2 className="text-lg font-semibold">{t("billingHistoryTitle")}</h2>
          <p className="text-sm text-muted-foreground">{t("billingHistoryDescription")}</p>
        </div>
        <div className="text-center py-8 text-muted-foreground">
          <p>{t("noBillingHistory")}</p>
        </div>
      </div>
    </div>
  )
}
