"use server"

import { authActionClient } from "@/lib/client/safe-action"
import { prisma } from "@/lib/server/db"
import { getCurrentSession } from "@/lib/server/auth/session"
import { revalidatePath } from "next/cache"
import { z } from "zod"

const updatePreferencesSchema = z.object({
  theme: z.enum(["light", "dark", "system"]),
  language: z.enum(["en", "pt"]),
  currency: z.enum(["usd", "brl", "eur"]),
  timezone: z.string(),
  use24HourFormat: z.boolean(),
})

const appearanceSchema = z.object({
  theme: z.enum(["light", "dark", "system"]),
  language: z.enum(["en", "pt"]),
})

const regionalSettingsSchema = z.object({
  currency: z.enum(["usd", "brl", "eur"]),
  timezone: z.string(),
  use24HourFormat: z.boolean(),
})

export const updatePreferences = authActionClient
  .metadata({ actionName: "updatePreferences" })
  .schema(updatePreferencesSchema)
  .action(async ({ parsedInput, ctx }) => {
    await prisma.userPreferences.upsert({
      where: { userId: ctx.userId },
      create: {
        userId: ctx.userId,
        theme: parsedInput.theme,
        language: parsedInput.language,
        currency: parsedInput.currency,
        timezone: parsedInput.timezone,
        use24HourFormat: parsedInput.use24HourFormat,
      },
      update: {
        theme: parsedInput.theme,
        language: parsedInput.language,
        currency: parsedInput.currency,
        timezone: parsedInput.timezone,
        use24HourFormat: parsedInput.use24HourFormat,
      },
    })

    revalidatePath("/preferences")
    return { success: true, message: "Preferences updated successfully" }
  })

export const updateAppearance = authActionClient
  .metadata({ actionName: "updateAppearance" })
  .schema(appearanceSchema)
  .action(async ({ parsedInput, ctx }) => {
    await prisma.userPreferences.upsert({
      where: { userId: ctx.userId },
      create: {
        userId: ctx.userId,
        theme: parsedInput.theme,
        language: parsedInput.language,
      },
      update: {
        theme: parsedInput.theme,
        language: parsedInput.language,
      },
    })

    revalidatePath("/preferences")
    return { success: true, message: "Appearance updated successfully" }
  })

export const updateRegionalSettings = authActionClient
  .metadata({ actionName: "updateRegionalSettings" })
  .schema(regionalSettingsSchema)
  .action(async ({ parsedInput, ctx }) => {
    await prisma.userPreferences.upsert({
      where: { userId: ctx.userId },
      create: {
        userId: ctx.userId,
        currency: parsedInput.currency,
        timezone: parsedInput.timezone,
        use24HourFormat: parsedInput.use24HourFormat,
      },
      update: {
        currency: parsedInput.currency,
        timezone: parsedInput.timezone,
        use24HourFormat: parsedInput.use24HourFormat,
      },
    })

    revalidatePath("/preferences")
    return { success: true, message: "Regional settings updated successfully" }
  })

export async function getUserPreferences() {
  const { user } = await getCurrentSession()
  if (!user) throw new Error("Unauthorized")

  const preferences = await prisma.userPreferences.findUnique({
    where: { userId: user.id },
    select: {
      theme: true,
      language: true,
      currency: true,
      timezone: true,
      use24HourFormat: true,
    },
  })

  return preferences || {
    theme: "system" as const,
    language: "en" as const,
    currency: "brl" as const,
    timezone: "America/Sao_Paulo",
    use24HourFormat: false,
  }
}
