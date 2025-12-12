import { getCurrentSession } from "@/lib/server/auth/session"
import { redirect } from "next/navigation"
import { AppSidebar } from "@/components/dashboard-01/app-sidebar"
import { SearchButton } from "@/components/dashboard-01/search-button"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { getScopedI18n } from "@/locales/server";
import { getUserSubscriptionPlan } from "@/lib/server/payment";
import { UpgradeBanner } from "./_components/upgrade-banner";
import { DashboardLayoutClient } from "@/components/dashboard-01/dashboard-layout-client";
import { getDailyEntryConfig } from "./daily-entry/queries";
import { shouldShowAds } from "@/lib/ads/should-show-ads";
import { PartnerAdBanner } from "@/components/ads/partner-ad-banner";

export default async function FinancialLayout({
  children,
  driverDialog,
  vehicleDialog,
  platformDialog,
  expenseTypeDialog,
  paymentMethodDialog,
  expenseDialog,
  revenueDialog,
  budgetDialog,
  goalDialog,
}: {
  children: React.ReactNode;
  driverDialog: React.ReactNode;
  vehicleDialog: React.ReactNode;
  platformDialog: React.ReactNode;
  expenseTypeDialog: React.ReactNode;
  paymentMethodDialog: React.ReactNode;
  expenseDialog: React.ReactNode;
  revenueDialog: React.ReactNode;
  budgetDialog: React.ReactNode;
  goalDialog: React.ReactNode;
}) {
  const { user } = await getCurrentSession()
  if (!user) redirect('/login')

  const subscriptionPlan = await getUserSubscriptionPlan(user.id)
  const config = await getDailyEntryConfig()
  const showAds = await shouldShowAds()

  const tDashboard = await getScopedI18n("dashboard")
  const tDaily = await getScopedI18n("financial.dailyEntry")
  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "16rem",
          "--header-height": "4rem",
        } as React.CSSProperties
      }
    >
      <AppSidebar user={user} searchComponent={<SearchButton />} variant="inset" />
      <SidebarInset>
        <DashboardLayoutClient
          config={config}
          labels={{
            newDailyEntry: tDaily("new"),
            repeatLast: tDaily("repeatLast"),
            noLastEntry: tDaily("noLastEntry"),
            loadingLastEntry: tDaily("loadingLastEntry"),
          }}
          dashboardTitle={tDashboard("title")}
          dialogs={
            <>
              {driverDialog}
              {vehicleDialog}
              {platformDialog}
              {expenseTypeDialog}
              {paymentMethodDialog}
              {expenseDialog}
              {revenueDialog}
              {budgetDialog}
              {goalDialog}
            </>
          }
        >
          {!subscriptionPlan.isPro && <UpgradeBanner />}
          {showAds && (
            <div className="px-4 lg:px-6 pb-4">
              <PartnerAdBanner category="PAYMENT" location="dashboard_layout_after_upgrade" />
            </div>
          )}
          {children}
        </DashboardLayoutClient>
      </SidebarInset>
    </SidebarProvider>
  );
}
