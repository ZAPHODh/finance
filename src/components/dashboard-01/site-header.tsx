import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { ModeSwitcher } from "../shared/nav-components/theme-toggle"

interface SiteHeaderProps {
  title: string
  actions?: React.ReactNode
  mobileActions?: React.ReactNode
}

export function SiteHeader({ title, actions, mobileActions }: SiteHeaderProps) {
  return (
    <header className="flex h-16 shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mx-2 data-[orientation=vertical]:h-4"
        />
        <h1 className="text-base font-medium truncate">{title}</h1>
        <div className="ml-auto flex">
          <ModeSwitcher />
        </div>
        {mobileActions && (
          <div className="ml-auto flex md:hidden">{mobileActions}</div>
        )}
        {actions && (
          <div className="ml-auto hidden md:flex items-center gap-2">{actions}</div>
        )}
      </div>
    </header>
  )
}
