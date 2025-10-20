import { getCurrentSession } from "@/lib/server/auth/session"
import { getScopedI18n } from "@/locales/server"
import { redirect } from "next/navigation"
import { Separator } from "@/components/ui/separator"
import { ProfileForm, SecurityForm } from "./account-forms"

export default async function AccountPage() {
  const { user } = await getCurrentSession()
  if (!user) redirect("/login")

  const t = await getScopedI18n("shared.userPages.account")

  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h1 className="text-3xl font-bold">{t("title")}</h1>
        <p className="text-muted-foreground">{t("description")}</p>
      </div>

      <Separator />

      <ProfileForm
        defaultName={user.name || ""}
        defaultEmail={user.email || ""}
        translations={{
          profileTitle: t("profileTitle"),
          profileDescription: t("profileDescription"),
          name: t("name"),
          email: t("email"),
          save: t("save"),
        }}
      />

      <Separator />

      <SecurityForm
        translations={{
          securityTitle: t("securityTitle"),
          securityDescription: t("securityDescription"),
          currentPassword: t("currentPassword"),
          newPassword: t("newPassword"),
          confirmPassword: t("confirmPassword"),
          changePassword: t("changePassword"),
        }}
      />
    </div>
  )
}
