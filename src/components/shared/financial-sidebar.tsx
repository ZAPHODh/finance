"use client"

import * as React from "react"
import {
  LayoutDashboard,
  Receipt,
  TrendingUp,
  Clock,
  Users,
  Car,
  Building2,
  CreditCard,
  Tag,
  Target,
  Wallet,
} from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
} from "@/components/ui/sidebar"
import { useScopedI18n } from "@/locales/client"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { User } from "@prisma/client"
import { NavUser } from "./nav-components/nav-user"

interface FinancialSidebarProps {
  user: User | null
  locale: string
}

export function FinancialSidebar({ user, locale }: FinancialSidebarProps) {
  const t = useScopedI18n("shared.sidebar")
  const pathname = usePathname()

  const navigation = {
    dashboard: [
      {
        title: t("navigation.dashboard"),
        icon: LayoutDashboard,
        href: `/${locale}/dashboard`,
      },
      {
        title: t("configuration.drivers"),
        icon: Users,
        href: `/${locale}/dashboard/drivers`,
      },
      {
        title: t("configuration.vehicles"),
        icon: Car,
        href: `/${locale}/dashboard/vehicles`,
      },
      {
        title: t("configuration.platforms"),
        icon: Building2,
        href: `/${locale}/dashboard/platforms`,
      },
      {
        title: t("configuration.expenseTypes"),
        icon: Tag,
        href: `/${locale}/dashboard/expense-types`,
      },
      {
        title: t("configuration.paymentMethods"),
        icon: CreditCard,
        href: `/${locale}/dashboard/payment-methods`,
      },
    ],
    financial: [
      {
        title: t("financial.expenses"),
        icon: Receipt,
        href: `/${locale}/dashboard/expenses`,
      },
      {
        title: t("financial.revenues"),
        icon: TrendingUp,
        href: `/${locale}/dashboard/revenues`,
      },
      {
        title: t("financial.workLogs"),
        icon: Clock,
        href: `/${locale}/dashboard/work-logs`,
      },
    ],
    planning: [
      {
        title: "Metas",
        icon: Target,
        href: `/${locale}/goals`,
      },
      {
        title: "Orçamentos",
        icon: Wallet,
        href: `/${locale}/budgets`,
      },
    ],
  }

  return (
    <Sidebar>
      <SidebarHeader className="border-b px-6 py-4">
        <Link href={`/${locale}/dashboard`} className="flex items-center gap-2">
          <LayoutDashboard className="h-6 w-6" />
          <span className="text-lg font-semibold">{t("brandName")}</span>
        </Link>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>{t("navigation.dashboard")}</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigation.dashboard.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton
                    asChild
                    isActive={pathname === item.href}
                  >
                    <Link href={item.href}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel>{t("financial.title")}</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigation.financial.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton
                    asChild
                    isActive={pathname === item.href}
                  >
                    <Link href={item.href}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel>Planejamento</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigation.planning.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton
                    asChild
                    isActive={pathname === item.href}
                  >
                    <Link href={item.href}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t p-4">
        <NavUser user={user} locale={locale} />
      </SidebarFooter>
    </Sidebar>
  )
}
