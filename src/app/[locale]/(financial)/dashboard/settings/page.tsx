import { getCurrentSession } from "@/lib/server/auth/session"
import { getScopedI18n } from "@/locales/server"
import { redirect } from "next/navigation"
import { Separator } from "@/components/ui/separator"
import { getUserSettings } from "./actions"
import { SettingsForm } from "@/components/layout/settings-form"

export default async function SettingsPage() {
  const { user } = await getCurrentSession()
  if (!user) redirect("/login")

  const t = await getScopedI18n("ui.userPages.settings")
  const initialData = await getUserSettings()

  return (
    <div className="container mx-auto px-4 md:px-6 py-6 max-w-3xl space-y-6">
      <div>
        <h1 className="text-3xl font-bold">{t("title")}</h1>
        <p className="text-muted-foreground">{t("description")}</p>
      </div>

      <Separator />

      <SettingsForm
        initialData={initialData}
        translations={{
          notificationsTitle: t("notificationsTitle"),
          notificationsDescription: t("notificationsDescription"),
          emailNotifications: t("emailNotifications"),
          emailNotificationsDescription: t("emailNotificationsDescription"),
          pushNotifications: t("pushNotifications"),
          pushNotificationsDescription: t("pushNotificationsDescription"),
          marketing: t("marketing"),
          marketingDescription: t("marketingDescription"),
          privacyTitle: t("privacyTitle"),
          privacyDescription: t("privacyDescription"),
          analytics: t("analytics"),
          analyticsDescription: t("analyticsDescription"),
          profileVisibility: t("profileVisibility"),
          profileVisibilityDescription: t("profileVisibilityDescription"),
          saveChanges: t("saveChanges"),
          saving: t("saving"),
        }}
      />
    </div>
  )
}
