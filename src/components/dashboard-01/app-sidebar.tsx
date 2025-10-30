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
  Settings,
  HelpCircle,
  Search,
  Database,
  FileText,
  FileSpreadsheet,
} from "lucide-react"

import { NavMain } from "./nav-main"
import { NavSecondary } from "./nav-secondary"
import { NavUser } from "./nav-user"
import { NavDocuments } from "./nav-documents"
import { SearchButton } from "./search-button"
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
import { useScopedI18n } from "@/locales/client"

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  user: User | null
}

export function AppSidebar({ user, ...props }: AppSidebarProps) {
  const t = useScopedI18n('shared.sidebar')

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
      url: "/dashboard/companies",
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
      title: t('financial.workLogs'),
      url: "/dashboard/work-logs",
      icon: Clock,
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
      url: "/goals",
      icon: Target,
    },
    {
      title: t('planning.budgets'),
      url: "/budgets",
      icon: Wallet,
    },
  ]

  const navSecondary = [
    {
      title: t('settings.title'),
      url: "/settings",
      icon: Settings,
    },
    {
      title: t('help'),
      url: "/help",
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
              <a href="/dashboard">
                <Database className="!size-5" />
                <span className="text-base font-semibold">{t('brandName')}</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SearchButton />
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <NavMain items={navMain} title={t('navigation.main')} />
        <NavMain items={navFinancial} title={t('financial.title')} />
        <NavMain items={navPlanning} title={t('planning.title')} />
        <NavDocuments items={documents} />
        <NavSecondary items={navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
    </Sidebar>
  )
}
