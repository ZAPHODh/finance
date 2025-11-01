"use server"

import { z } from "zod"
import { getCurrentSession } from "@/lib/server/auth/session"
import { prisma } from "@/lib/server/db"

export async function getUserPreferences() {
  const { user } = await getCurrentSession()
  if (!user) throw new Error("Unauthorized")

  let preferences = await prisma.userPreferences.findUnique({
    where: { userId: user.id },
  })

  if (!preferences) {
    preferences = await prisma.userPreferences.create({
      data: {
        userId: user.id,
        theme: "system",
        language: "en",
        currency: "brl",
        timezone: "America/Sao_Paulo",
        use24HourFormat: false,
        emailNotifications: true,
        pushNotifications: false,
        marketingEmails: false,
        analytics: true,
        profileVisibility: false,
      },
    })
  }

  return {
    theme: preferences.theme,
    language: preferences.language,
    currency: preferences.currency,
    timezone: preferences.timezone,
    use24HourFormat: preferences.use24HourFormat,
  }
}

const updatePreferencesSchema = z.object({
  theme: z.enum(["light", "dark", "system"]).optional(),
  language: z.string().optional(),
  timezone: z.string().optional(),
})

export async function updatePreferences(input: z.infer<typeof updatePreferencesSchema>) {
  const { user } = await getCurrentSession()
  if (!user) throw new Error("Unauthorized")

  const validatedInput = updatePreferencesSchema.parse(input)

  const updatedPreferences = await prisma.userPreferences.upsert({
    where: { userId: user.id },
    update: validatedInput,
    create: {
      userId: user.id,
      theme: validatedInput.theme || "system",
      language: validatedInput.language || "en",
      currency: "brl",
      timezone: validatedInput.timezone || "America/Sao_Paulo",
      use24HourFormat: false,
      emailNotifications: true,
      pushNotifications: false,
      marketingEmails: false,
      analytics: true,
      profileVisibility: false,
    },
    select: {
      theme: true,
      language: true,
      timezone: true,
    },
  })

  return { success: true, data: updatedPreferences }
}
