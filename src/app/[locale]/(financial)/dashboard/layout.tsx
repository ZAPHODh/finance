import { getCurrentSession } from "@/lib/server/auth/session"
import { redirect } from "next/navigation"
import { AppSidebar } from "@/components/dashboard-01/app-sidebar"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { SiteHeader } from "@/components/dashboard-01/site-header";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Plus } from "lucide-react";
import { getScopedI18n } from "@/locales/server";

export default async function FinancialLayout({
  children,
  driverDialog,
  vehicleDialog,
  companyDialog,
  expenseTypeDialog,
  paymentMethodDialog,
  revenueTypeDialog,
  expenseDialog,
  revenueDialog,
}: {
  children: React.ReactNode;
  driverDialog: React.ReactNode;
  vehicleDialog: React.ReactNode;
  companyDialog: React.ReactNode;
  expenseTypeDialog: React.ReactNode;
  paymentMethodDialog: React.ReactNode;
  revenueTypeDialog: React.ReactNode;
  expenseDialog: React.ReactNode;
  revenueDialog: React.ReactNode;
}) {
  const { user } = await getCurrentSession()
  if (!user) redirect('/login')
  const tDashboard = await getScopedI18n("shared.sidebar.dashboard")
  const tFinancial = await getScopedI18n("shared.financial")
  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "16rem",
          "--header-height": "4rem",
        } as React.CSSProperties
      }
    >
      <AppSidebar user={user} variant="inset" />
      <SidebarInset>
        <div className="flex flex-1 flex-col">
          <SiteHeader
            title={tDashboard("title")}
            actions={
              <div className="flex gap-2">
                <Button asChild size="sm">
                  <Link href="/dashboard/expenses/new">
                    <Plus className="mr-2 h-4 w-4" />
                    {tFinancial("expenses.new")}
                  </Link>
                </Button>
                <Button asChild size="sm">
                  <Link href="/dashboard/revenues/new">
                    <Plus className="mr-2 h-4 w-4" />
                    {tFinancial("revenues.new")}
                  </Link>
                </Button>
              </div>
            }
          />
          {children}
          {driverDialog}
          {vehicleDialog}
          {companyDialog}
          {expenseTypeDialog}
          {paymentMethodDialog}
          {revenueTypeDialog}
          {expenseDialog}
          {revenueDialog}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
