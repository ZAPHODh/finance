"use server"

import { z } from "zod"
import { getCurrentSession } from "@/lib/server/auth/session"
import { prisma } from "@/lib/server/db"

export async function getUserSettings() {
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
    emailNotifications: preferences.emailNotifications,
    pushNotifications: preferences.pushNotifications,
    marketingEmails: preferences.marketingEmails,
    analytics: preferences.analytics,
    profileVisibility: preferences.profileVisibility,
  }
}

const updateNotificationSettingsSchema = z.object({
  emailNotifications: z.boolean(),
  pushNotifications: z.boolean(),
  marketingEmails: z.boolean(),
})

export async function updateNotificationSettings(input: z.infer<typeof updateNotificationSettingsSchema>) {
  const { user } = await getCurrentSession()
  if (!user) throw new Error("Unauthorized")

  const validatedInput = updateNotificationSettingsSchema.parse(input)

  const updatedSettings = await prisma.userPreferences.upsert({
    where: { userId: user.id },
    update: {
      emailNotifications: validatedInput.emailNotifications,
      pushNotifications: validatedInput.pushNotifications,
      marketingEmails: validatedInput.marketingEmails,
    },
    create: {
      userId: user.id,
      theme: "system",
      language: "en",
      currency: "brl",
      timezone: "America/Sao_Paulo",
      use24HourFormat: false,
      emailNotifications: validatedInput.emailNotifications,
      pushNotifications: validatedInput.pushNotifications,
      marketingEmails: validatedInput.marketingEmails,
      analytics: true,
      profileVisibility: false,
    },
    select: {
      emailNotifications: true,
      pushNotifications: true,
      marketingEmails: true,
    },
  })

  return { success: true, data: updatedSettings }
}

const updatePrivacySettingsSchema = z.object({
  profileVisibility: z.boolean(),
  analytics: z.boolean(),
})

export async function updatePrivacySettings(input: z.infer<typeof updatePrivacySettingsSchema>) {
  const { user } = await getCurrentSession()
  if (!user) throw new Error("Unauthorized")

  const validatedInput = updatePrivacySettingsSchema.parse(input)

  const updatedSettings = await prisma.userPreferences.upsert({
    where: { userId: user.id },
    update: {
      profileVisibility: validatedInput.profileVisibility,
      analytics: validatedInput.analytics,
    },
    create: {
      userId: user.id,
      theme: "system",
      language: "en",
      currency: "brl",
      timezone: "America/Sao_Paulo",
      use24HourFormat: false,
      emailNotifications: true,
      pushNotifications: false,
      marketingEmails: false,
      analytics: validatedInput.analytics,
      profileVisibility: validatedInput.profileVisibility,
    },
    select: {
      profileVisibility: true,
      analytics: true,
    },
  })

  return { success: true, data: updatedSettings }
}
