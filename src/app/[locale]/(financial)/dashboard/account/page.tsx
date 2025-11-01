import { getCurrentSession } from "@/lib/server/auth/session"
import { getScopedI18n } from "@/locales/server"
import { redirect } from "next/navigation"
import { ProfileForm } from "@/components/layout/account-forms"

export default async function AccountPage() {
  const { user } = await getCurrentSession()
  if (!user) redirect("/login")

  const t = await getScopedI18n("shared.userPages.account")

  return (
    <div className="container mx-auto px-4 md:px-6 py-6 max-w-3xl space-y-6">
      <div>
        <h1 className="text-3xl font-bold">{t("title")}</h1>
        <p className="text-muted-foreground">{t("description")}</p>
      </div>

      <ProfileForm
        defaultName={user.name || ""}
        defaultEmail={user.email || ""}
        translations={{
          profileTitle: t("profileTitle"),
          profileDescription: t("profileDescription"),
          name: t("name"),
          email: t("email"),
          save: t("save"),
          profileUpdated: t("profileUpdated"),
          profileUpdateError: t("profileUpdateError"),
        }}
      />
    </div>
  )
}
