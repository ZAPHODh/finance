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
    defaultDriverId: preferences.defaultDriverId,
    defaultVehicleId: preferences.defaultVehicleId,
  }
}

export async function getDriversAndVehicles() {
  const { user } = await getCurrentSession()
  if (!user) throw new Error("Unauthorized")

  const [drivers, vehicles] = await Promise.all([
    prisma.driver.findMany({
      where: { userId: user.id },
      select: { id: true, name: true, isSelf: true },
      orderBy: { name: "asc" },
    }),
    prisma.vehicle.findMany({
      where: { userId: user.id },
      select: { id: true, name: true, isPrimary: true },
      orderBy: { name: "asc" },
    }),
  ])

  return { drivers, vehicles }
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

const updateDefaultsSchema = z.object({
  defaultDriverId: z.string().nullable().optional(),
  defaultVehicleId: z.string().nullable().optional(),
})

export async function updateDefaults(input: z.infer<typeof updateDefaultsSchema>) {
  const { user } = await getCurrentSession()
  if (!user) throw new Error("Unauthorized")

  const validatedInput = updateDefaultsSchema.parse(input)

  await prisma.userPreferences.update({
    where: { userId: user.id },
    data: {
      defaultDriverId: validatedInput.defaultDriverId,
      defaultVehicleId: validatedInput.defaultVehicleId,
    },
  })

  return { success: true }
}
