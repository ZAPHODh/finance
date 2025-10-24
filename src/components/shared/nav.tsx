'use server';

import Logo from "@/components/shared/nav-components/logo"
import { Button } from "@/components/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { ModeSwitcher } from "./nav-components/theme-toggle"
import { getCurrentSession } from "@/lib/server/auth/session"
import { getScopedI18n } from "@/locales/server"
import Link from "next/link"

export default async function Nav() {
  const { user } = await getCurrentSession()
  const t = await getScopedI18n("shared.nav")

  const navigationLinks = [
    { href: "/", label: t("home") },
    { href: "/features", label: t("features") },
    { href: "/pricing", label: t("pricing") },
  ]

  return (
    <header className="px-4 md:px-6 container mx-auto max-w-6xl">
      <div className="flex h-16 items-center justify-between gap-4">
        <div className="flex flex-1 items-center gap-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                className="group size-8 md:hidden"
                variant="ghost"
                size="icon"
              >
                <svg
                  className="pointer-events-none"
                  width={16}
                  height={16}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M4 12L20 12"
                    className="origin-center -translate-y-[7px] transition-all duration-300 ease-[cubic-bezier(.5,.85,.25,1.1)] group-aria-expanded:translate-x-0 group-aria-expanded:translate-y-0 group-aria-expanded:rotate-[315deg]"
                  />
                  <path
                    d="M4 12H20"
                    className="origin-center transition-all duration-300 ease-[cubic-bezier(.5,.85,.25,1.8)] group-aria-expanded:rotate-45"
                  />
                  <path
                    d="M4 12H20"
                    className="origin-center translate-y-[7px] transition-all duration-300 ease-[cubic-bezier(.5,.85,.25,1.1)] group-aria-expanded:translate-y-0 group-aria-expanded:rotate-[135deg]"
                  />
                </svg>
              </Button>
            </PopoverTrigger>
            <PopoverContent align="start" className="w-48 p-2 md:hidden">
              <nav className="flex flex-col gap-1">
                {navigationLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="px-3 py-2 text-sm rounded-md hover:bg-muted transition-colors"
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>
            </PopoverContent>
          </Popover>
          <div className="flex items-center gap-6">
            <Link href="/" className="text-primary hover:text-primary/90">
              <Logo />
            </Link>
            <nav className="hidden md:flex items-center gap-6">
              {navigationLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <ModeSwitcher />
          {user ? (
            <Button asChild size="sm">
              <Link href="/dashboard">{t("goToDashboard")}</Link>
            </Button>
          ) : (
            <>
              <Button asChild variant="ghost" size="sm" className="hidden sm:flex">
                <Link href="/login">{t("login")}</Link>
              </Button>
              <Button asChild size="sm">
                <Link href="/login">{t("getStarted")}</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  )
}
