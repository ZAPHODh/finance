'use client';

import { Button } from "@/components/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { ModeSwitcher } from "./nav-components/theme-toggle"

import Link from "next/link"
import { useScopedI18n } from "@/locales/client";
import { siteConfig } from "@/config/site";
import { Menu } from "lucide-react";

export default function Nav() {
  const name = siteConfig().name
  const t = useScopedI18n("navigation.nav")

  const navigationLinks = [
    { href: "/", label: t("home") },
    { href: "/features", label: t("features") },
    { href: "/pricing", label: t("pricing") },
  ]

  return (
    <header className="px-4 md:px-6 container mx-auto max-w-6xl">
      <div className="flex py-2 items-center justify-between gap-4">
        <div className="flex flex-1 items-center gap-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                className="group size-8 md:hidden"
                variant="ghost"
                size="icon"
              >
                <Menu />
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
              {name}
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
          <Button asChild variant="ghost" size="sm" className="hidden sm:flex">
            <Link href="/login">{t("login")}</Link>
          </Button>
          <Button asChild size="sm">
            <Link href="/login">{t("getStarted")}</Link>
          </Button>
        </div>
      </div>
    </header>
  )
}
