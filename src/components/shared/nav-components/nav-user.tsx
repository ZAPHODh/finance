"use client"

import { logout } from "@/app/[locale]/actions"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"
import { useScopedI18n } from "@/locales/client"
import { User } from "@prisma/client"
import {
  BadgeCheck,
  Bell,
  CreditCard,
  LogOut,
  Sparkles,
} from "lucide-react"
import Link from "next/link"

interface NavUserProps {
  user: User | null;
  locale: string;
  className?: string;
}
export function NavUser({
  user,
  locale,
  className
}: NavUserProps) {
  const t = useScopedI18n("ui.accountCommon");
  if (!user) {
    return (
      <Button asChild size={'sm'}>
        <Link
          href={`/${locale}/login`}
          className={cn(
            "inline-flex items-center ",
            className
          )}
          aria-label={t('login')}
        >
          {t('login')}
        </Link>
      </Button>
    );
  }
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="relative h-10 w-10 rounded-full"
        >
          <Avatar className="h-8 w-8">
            <AvatarImage src={user.picture as string | undefined} alt={user.name || t('profile')} />
            <AvatarFallback>{user.name?.charAt(0).toUpperCase() || 'U'}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-56"
        align="end"
        forceMount
      >
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{user.name}</p>
            <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem asChild>
            <Link href={`/${locale}/billing`}>
              <Sparkles className="mr-2 h-4 w-4" />
              <span>{t('upgradeToPro')}</span>
            </Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem asChild>
            <Link href={`/${locale}/account`}>
              <BadgeCheck className="mr-2 h-4 w-4" />
              <span>{t('account')}</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href={`/${locale}/billing`}>
              <CreditCard className="mr-2 h-4 w-4" />
              <span>{t('billing')}</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href={`/${locale}/settings`}>
              <Bell className="mr-2 h-4 w-4" />
              <span>{t('notifications')}</span>
            </Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => logout()}>
          <LogOut className="mr-2 h-4 w-4" />
          <span>{t('logout')}</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}