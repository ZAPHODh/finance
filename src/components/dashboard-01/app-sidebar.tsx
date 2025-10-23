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
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import type { User } from "@prisma/client"

const navMain = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Motoristas",
    url: "/dashboard/drivers",
    icon: Users,
  },
  {
    title: "Veículos",
    url: "/dashboard/vehicles",
    icon: Car,
  },
  {
    title: "Empresas",
    url: "/dashboard/companies",
    icon: Building2,
  },
]

const navFinancial = [
  {
    title: "Despesas",
    url: "/dashboard/expenses",
    icon: Receipt,
  },
  {
    title: "Receitas",
    url: "/dashboard/revenues",
    icon: TrendingUp,
  },
  {
    title: "Jornadas",
    url: "/dashboard/work-logs",
    icon: Clock,
  },
]

const navPlanning = [
  {
    title: "Metas",
    url: "/goals",
    icon: Target,
  },
  {
    title: "Orçamentos",
    url: "/budgets",
    icon: Wallet,
  },
]

const navSecondary = [
  {
    title: "Configurações",
    url: "/settings",
    icon: Settings,
  },
  {
    title: "Ajuda",
    url: "/help",
    icon: HelpCircle,
  },
  {
    title: "Buscar",
    url: "/search",
    icon: Search,
  },
]

const documents = [
  {
    name: "Tipos de Despesas",
    url: "/dashboard/expense-types",
    icon: Tag,
  },
  {
    name: "Formas de Pagamento",
    url: "/dashboard/payment-methods",
    icon: CreditCard,
  },
  {
    name: "Relatórios",
    url: "/reports",
    icon: FileText,
  },
]

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  user: User | null
}

export function AppSidebar({ user, ...props }: AppSidebarProps) {
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
                <span className="text-base font-semibold">Financial App</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={navMain} title="Principal" />
        <NavMain items={navFinancial} title="Financeiro" />
        <NavMain items={navPlanning} title="Planejamento" />
        <NavDocuments items={documents} />
        <NavSecondary items={navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
    </Sidebar>
  )
}
