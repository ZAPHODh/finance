import { getCurrentSession } from "@/lib/server/auth/session"
import { getCurrentLocale } from "@/locales/server"
import { FinancialSidebar } from "@/components/shared/financial-sidebar"
import { SidebarProvider, SidebarTrigger, SidebarInset } from "@/components/ui/sidebar"
import { DynamicBreadcrumb } from "@/components/shared/dynamic-breadcrumb"
import { redirect } from "next/navigation"

export default async function FinancialLayout({
  children,
  driverDialog,
  vehicleDialog,
  companyDialog,
  expenseTypeDialog,
  paymentMethodDialog,
  revenueTypeDialog,
}: {
  children: React.ReactNode;
  driverDialog: React.ReactNode;
  vehicleDialog: React.ReactNode;
  companyDialog: React.ReactNode;
  expenseTypeDialog: React.ReactNode;
  paymentMethodDialog: React.ReactNode;
  revenueTypeDialog: React.ReactNode;
}) {
  const { user } = await getCurrentSession()
  if (!user) redirect('/login')
  const locale = await getCurrentLocale()

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <FinancialSidebar user={user} locale={locale} />
        <SidebarInset className="flex-1">
          <div className="sticky top-0 z-10 flex h-14 items-center gap-4 bg-background px-4 lg:h-16 lg:px-6">
            <SidebarTrigger />
            <DynamicBreadcrumb locale={locale} />
          </div>
          <main className="flex-1 p-4 lg:p-6">
            {children}
            {driverDialog}
            {vehicleDialog}
            {companyDialog}
            {expenseTypeDialog}
            {paymentMethodDialog}
            {revenueTypeDialog}
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
