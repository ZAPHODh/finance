"use server"

import { authActionClient } from "@/lib/client/safe-action"
import { prisma } from "@/lib/server/db"
import { getCurrentSession } from "@/lib/server/auth/session"
import { revalidatePath } from "next/cache"
import { z } from "zod"

const notificationSettingsSchema = z.object({
  emailNotifications: z.boolean(),
  pushNotifications: z.boolean(),
  marketingEmails: z.boolean(),
})

const privacySettingsSchema = z.object({
  analytics: z.boolean(),
  profileVisibility: z.boolean(),
})

export const updateNotificationSettings = authActionClient
  .metadata({ actionName: "updateNotificationSettings" })
  .schema(notificationSettingsSchema)
  .action(async ({ parsedInput, ctx }) => {
    await prisma.userPreferences.upsert({
      where: { userId: ctx.userId },
      create: {
        userId: ctx.userId,
        emailNotifications: parsedInput.emailNotifications,
        pushNotifications: parsedInput.pushNotifications,
        marketingEmails: parsedInput.marketingEmails,
      },
      update: {
        emailNotifications: parsedInput.emailNotifications,
        pushNotifications: parsedInput.pushNotifications,
        marketingEmails: parsedInput.marketingEmails,
      },
    })

    revalidatePath("/settings")
    return { success: true, message: "Notification settings updated" }
  })

export const updatePrivacySettings = authActionClient
  .metadata({ actionName: "updatePrivacySettings" })
  .schema(privacySettingsSchema)
  .action(async ({ parsedInput, ctx }) => {
    await prisma.userPreferences.upsert({
      where: { userId: ctx.userId },
      create: {
        userId: ctx.userId,
        analytics: parsedInput.analytics,
        profileVisibility: parsedInput.profileVisibility,
      },
      update: {
        analytics: parsedInput.analytics,
        profileVisibility: parsedInput.profileVisibility,
      },
    })

    revalidatePath("/settings")
    return { success: true, message: "Privacy settings updated" }
  })

export async function getUserSettings() {
  const { user } = await getCurrentSession()
  if (!user) throw new Error("Unauthorized")

  const preferences = await prisma.userPreferences.findUnique({
    where: { userId: user.id },
    select: {
      emailNotifications: true,
      pushNotifications: true,
      marketingEmails: true,
      analytics: true,
      profileVisibility: true,
    },
  })

  return preferences || {
    emailNotifications: true,
    pushNotifications: false,
    marketingEmails: false,
    analytics: true,
    profileVisibility: false,
  }
}
