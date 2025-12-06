"use client"

import * as React from "react"
import Link from "next/link"
import {
  LayoutDashboard,
  Receipt,
  TrendingUp,
  Users,
  Car,
  Building2,
  CreditCard,
  Tag,
  Target,
  Wallet,
  Settings,
  HelpCircle,
  FileText,

  UserCircle,
  Sliders,
} from "lucide-react"

import { NavMain } from "./nav-main"
import { NavSecondary } from "./nav-secondary"
import { NavUser } from "./nav-user"
import { NavDocuments } from "./nav-documents"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarGroup,
  SidebarGroupContent,
} from "@/components/ui/sidebar"
import type { User } from "@prisma/client"
import { useCurrentLocale, useScopedI18n } from "@/locales/client"
import { useSiteConfig } from "@/config/site-client"

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  user: User | null
  searchComponent?: React.ReactNode
}

export function AppSidebar({ user, searchComponent, ...props }: AppSidebarProps) {
  const t = useScopedI18n('navigation.sidebar')
  const locale = useCurrentLocale()
  const logoName = useSiteConfig(locale).name
  const navMain = [
    {
      title: t('navigation.dashboard'),
      url: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      title: t('configuration.drivers'),
      url: "/dashboard/drivers",
      icon: Users,
    },
    {
      title: t('configuration.vehicles'),
      url: "/dashboard/vehicles",
      icon: Car,
    },
    {
      title: t('configuration.platforms'),
      url: "/dashboard/platforms",
      icon: Building2,
    },
  ]

  const navFinancial = [
    {
      title: t('financial.expenses'),
      url: "/dashboard/expenses",
      icon: Receipt,
    },
    {
      title: t('financial.revenues'),
      url: "/dashboard/revenues",
      icon: TrendingUp,
    },
    {
      title: t('configuration.expenseTypes'),
      url: "/dashboard/expense-types",
      icon: Tag,
    },
    {
      title: t('configuration.paymentMethods'),
      url: "/dashboard/payment-methods",
      icon: CreditCard,
    },
  ]

  const navPlanning = [
    {
      title: t('planning.goals'),
      url: "/dashboard/goals",
      icon: Target,
    },
    {
      title: t('planning.budgets'),
      url: "/dashboard/budgets",
      icon: Wallet,
    },
  ]

  const navSettings = [
    {
      title: t('settings.account'),
      url: "/dashboard/account",
      icon: UserCircle,
    },
    {
      title: t('settings.preferences'),
      url: "/dashboard/preferences",
      icon: Sliders,
    },
    {
      title: t('settings.settings'),
      url: "/dashboard/settings",
      icon: Settings,
    },
    {
      title: t('settings.billing'),
      url: "/dashboard/billing",
      icon: CreditCard,
    },
  ]

  const navSecondary = [
    {
      title: t('help'),
      url: "/dashboard/help",
      icon: HelpCircle,
    },
  ]

  const documents = [
    {
      name: t('documents.reports'),
      url: "/dashboard/reports",
      icon: FileText,
    },
  ]

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <Link href="/dashboard">
                <span className="text-base font-semibold">{logoName}</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        {searchComponent && (
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  {searchComponent}
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}
        <NavMain items={navMain} title={t('navigation.main')} />
        <NavMain items={navFinancial} title={t('financial.title')} />
        <NavMain items={navPlanning} title={t('planning.title')} />
        <NavMain items={navSettings} title={t('settings.title')} />
        <NavDocuments items={documents} />
        <NavSecondary items={navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
    </Sidebar>
  )
}
