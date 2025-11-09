import { getCurrentSession } from "@/lib/server/auth/session"
import { getScopedI18n } from "@/locales/server"
import { redirect } from "next/navigation"
import { Separator } from "@/components/ui/separator"
import { PreferencesForm } from "@/components/layout/preferences-form"
import { DefaultsForm } from "@/components/layout/defaults-form"
import { getUserPreferences } from "./actions"

export default async function PreferencesPage() {
  const { user } = await getCurrentSession()
  if (!user) redirect("/login")

  const t = await getScopedI18n("ui.userPages.preferences")
  const initialData = await getUserPreferences()

  return (
    <div className="container mx-auto px-4 md:px-6 py-6 max-w-3xl space-y-6">
      <div>
        <h1 className="text-3xl font-bold">{t("title")}</h1>
        <p className="text-muted-foreground">{t("description")}</p>
      </div>

      <Separator />

      <PreferencesForm
        initialData={initialData}
        translations={{
          appearanceTitle: t("appearanceTitle"),
          appearanceDescription: t("appearanceDescription"),
          theme: t("theme"),
          light: t("light"),
          dark: t("dark"),
          system: t("system"),
          language: t("language"),
          english: t("english"),
          portuguese: t("portuguese"),
          regionalTitle: t("regionalTitle"),
          regionalDescription: t("regionalDescription"),
          currency: t("currency"),
          usDollar: t("usDollar"),
          brazilianReal: t("brazilianReal"),
          euro: t("euro"),
          timezone: t("timezone"),
          saoPaulo: t("saoPaulo"),
          newYork: t("newYork"),
          london: t("london"),
          timeFormat: t("timeFormat"),
          timeFormatDescription: t("timeFormatDescription"),
          saveChanges: t("saveChanges"),
          saving: t("saving"),
        }}
      />

      <Separator />

      <DefaultsForm
        initialData={{
          defaultDriverId: initialData.defaultDriverId,
          defaultVehicleId: initialData.defaultVehicleId,
        }}
        translations={{
          defaultsTitle: t("defaultsTitle"),
          defaultsDescription: t("defaultsDescription"),
          defaultDriver: t("defaultDriver"),
          defaultDriverDescription: t("defaultDriverDescription"),
          defaultVehicle: t("defaultVehicle"),
          defaultVehicleDescription: t("defaultVehicleDescription"),
          none: t("none"),
          saveChanges: t("saveChanges"),
          saving: t("saving"),
          successMessage: t("defaultsSuccessMessage"),
        }}
      />
    </div>
  )
}
