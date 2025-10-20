"use client"

import * as React from "react"
import {
  User as UserIcon,
  Settings,
  Sliders,
  CreditCard,
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

interface UserSidebarProps {
  user: User | null
  locale: string
}

export function UserSidebar({ user, locale }: UserSidebarProps) {
  const t = useScopedI18n("shared.userSidebar")
  const pathname = usePathname()

  const navigation = [
    {
      title: t("account"),
      icon: UserIcon,
      href: `/${locale}/account`,
    },
    {
      title: t("settings"),
      icon: Settings,
      href: `/${locale}/settings`,
    },
    {
      title: t("preferences"),
      icon: Sliders,
      href: `/${locale}/preferences`,
    },
    {
      title: t("billing"),
      icon: CreditCard,
      href: `/${locale}/billing`,
    },
  ]

  return (
    <Sidebar>
      <SidebarHeader className="border-b px-6 py-4">
        <Link href={`/${locale}/account`} className="flex items-center gap-2">
          <UserIcon className="h-6 w-6" />
          <span className="text-lg font-semibold">{t("brandName")}</span>
        </Link>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>{t("title")}</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigation.map((item) => (
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
