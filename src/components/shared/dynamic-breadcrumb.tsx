"use client"

import { usePathname } from "next/navigation"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { useScopedI18n } from "@/locales/client"
import Link from "next/link"

interface DynamicBreadcrumbProps {
  locale: string
}

export function DynamicBreadcrumb({ locale }: DynamicBreadcrumbProps) {
  const pathname = usePathname()
  const tSidebar = useScopedI18n("shared.sidebar")
  const tConfig = useScopedI18n("shared.configuration")
  const tFinancial = useScopedI18n("shared.financial")

  const pathWithoutLocale = pathname.replace(`/${locale}`, "")
  const segments = pathWithoutLocale.split("/").filter(Boolean)

  const getSegmentLabel = (segment: string): string => {
    if (segment === "drivers") return tConfig("drivers.title")
    if (segment === "vehicles") return tConfig("vehicles.title")
    if (segment === "platforms") return tConfig("platforms.title")
    if (segment === "expense-types") return tConfig("expenseTypes.title")
    if (segment === "payment-methods") return tConfig("paymentMethods.title")
    if (segment === "revenue-types") return tConfig("revenueTypes.title")

    if (segment === "expenses") return tFinancial("expenses.title")
    if (segment === "revenues") return tFinancial("revenues.title")
    if (segment === "work-logs") return tFinancial("workLogs.title")

    if (segment === "dashboard") return tSidebar("navigation.dashboard")
    if (segment === "financial") return tSidebar("financial.title")
    if (segment === "new") return tFinancial("expenses.new")
    if (segment === "edit") return tFinancial("expenses.edit")

    return segment.charAt(0).toUpperCase() + segment.slice(1)
  }

  const breadcrumbs = segments.map((segment, index) => {
    const path = `/${locale}/${segments.slice(0, index + 1).join("/")}`
    const label = getSegmentLabel(segment)
    const isLast = index === segments.length - 1

    return {
      path,
      label,
      isLast,
    }
  })

  if (segments.length === 0 || (segments.length === 1 && segments[0] === "dashboard")) {
    return null
  }

  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link href={`/${locale}/dashboard`}>
              {tSidebar("navigation.dashboard")}
            </Link>
          </BreadcrumbLink>
        </BreadcrumbItem>

        {breadcrumbs.map((breadcrumb) => {
          if (breadcrumb.label === tSidebar("navigation.dashboard")) {
            return null
          }

          return (
            <div key={breadcrumb.path} className="flex items-center gap-2">
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                {breadcrumb.isLast ? (
                  <BreadcrumbPage>{breadcrumb.label}</BreadcrumbPage>
                ) : (
                  <BreadcrumbLink asChild>
                    <Link href={breadcrumb.path}>{breadcrumb.label}</Link>
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
            </div>
          )
        })}
      </BreadcrumbList>
    </Breadcrumb>
  )
}
